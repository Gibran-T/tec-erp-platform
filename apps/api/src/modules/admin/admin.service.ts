import { DomainError, Result, type ResultType } from "@tec-platform/core";
import { getPrismaClient } from "@tec-platform/database-erp";

export function createAdminService(client = getPrismaClient()) {
  async function audit(actorEmployeeId: string, action: string, resourceKey: string, reason?: string) {
    const actor = await client.employee.findUnique({ where: { id: actorEmployeeId } });
    if (!actor) {
      return;
    }
    await client.auditEvent.create({
      data: {
        companyId: actor.companyId,
        actorEmployeeId,
        action,
        resourceType: "admin",
        resourceKey,
        reason,
      },
    });
  }

  return {
    async listCompanies() {
      const companies = await client.company.findMany({ orderBy: { name: "asc" } });
      return companies.map((company) => ({
        id: company.id,
        code: company.code,
        name: company.name,
      }));
    },

    async createCompany(actorId: string, input: { code: string; name: string }) {
      const created = await client.company.create({
        data: { code: input.code, name: input.name },
      });
      await client.companyConfiguration.create({
        data: { companyId: created.id, aiEnabled: true, settingsJson: {} },
      });
      await client.aiPolicy.create({
        data: { companyId: created.id, aiEnabled: true, policyJson: {} },
      });
      await audit(actorId, "admin.company.create", created.id);
      return created;
    },

    async listCohorts(companyId?: string) {
      const cohorts = await client.cohort.findMany({
        where: companyId ? { companyId } : undefined,
        orderBy: { name: "asc" },
        include: { _count: { select: { memberships: true } } },
      });
      return cohorts.map((cohort) => ({
        id: cohort.id,
        code: cohort.code,
        name: cohort.name,
        companyId: cohort.companyId,
        memberCount: cohort._count.memberships,
      }));
    },

    async enrollStudent(
      actorId: string,
      cohortId: string,
      employeeId: string,
    ): Promise<ResultType<{ ok: true }>> {
      const cohort = await client.cohort.findUnique({ where: { id: cohortId } });
      const employee = await client.employee.findUnique({ where: { id: employeeId } });
      if (!cohort || !employee) {
        return Result.fail(DomainError.notFound("Cohorte ou employe introuvable."));
      }
      if (cohort.companyId !== employee.companyId) {
        return Result.fail(DomainError.conflict("Employe et cohorte doivent appartenir a la meme entreprise."));
      }
      await client.cohortMembership.upsert({
        where: { cohortId_employeeId: { cohortId, employeeId } },
        create: { cohortId, employeeId, roleInCohort: "student" },
        update: {},
      });
      await audit(actorId, "admin.cohort.enroll", `${cohortId}:${employeeId}`);
      return Result.ok({ ok: true });
    },

    async getConfiguration(actorId: string) {
      const actor = await client.employee.findUnique({ where: { id: actorId } });
      if (!actor) {
        throw DomainError.notFound("Administrateur introuvable.");
      }
      const config = await client.companyConfiguration.findUnique({ where: { companyId: actor.companyId } });
      const policy = await client.aiPolicy.findUnique({ where: { companyId: actor.companyId } });
      return {
        aiEnabled: policy?.aiEnabled ?? config?.aiEnabled ?? true,
        settings: (config?.settingsJson as Record<string, unknown>) ?? {},
      };
    },

    async updateAiEnabled(actorId: string, aiEnabled: boolean) {
      const actor = await client.employee.findUnique({ where: { id: actorId } });
      if (!actor) {
        throw DomainError.notFound("Administrateur introuvable.");
      }
      await client.companyConfiguration.upsert({
        where: { companyId: actor.companyId },
        create: { companyId: actor.companyId, aiEnabled, settingsJson: {} },
        update: { aiEnabled },
      });
      await client.aiPolicy.upsert({
        where: { companyId: actor.companyId },
        create: { companyId: actor.companyId, aiEnabled, policyJson: {} },
        update: { aiEnabled },
      });
      await audit(actorId, "admin.ai.toggle", actor.companyId, String(aiEnabled));
      return { aiEnabled };
    },

    async listFeatureFlags(companyId?: string) {
      const flags = await client.featureFlag.findMany({
        where: companyId ? { OR: [{ companyId }, { companyId: null }] } : undefined,
        orderBy: { key: "asc" },
      });
      return flags.map((flag) => ({
        id: flag.id,
        key: flag.key,
        companyId: flag.companyId,
        enabled: flag.enabled,
      }));
    },

    async updateFeatureFlag(actorId: string, key: string, enabled: boolean, companyId?: string) {
      const scopedCompanyId = companyId ?? null;
      const existing = await client.featureFlag.findFirst({
        where: { key, companyId: scopedCompanyId },
      });
      const flag = existing
        ? await client.featureFlag.update({
            where: { id: existing.id },
            data: { enabled },
          })
        : await client.featureFlag.create({
            data: { key, companyId: scopedCompanyId, enabled },
          });
      await audit(actorId, "admin.feature_flag.update", key, String(enabled));
      return { key: flag.key, enabled: flag.enabled };
    },

    async systemStatus() {
      const [companies, employees, attempts, certificates] = await Promise.all([
        client.company.count(),
        client.employee.count(),
        client.missionAttempt.count(),
        client.certificate.count(),
      ]);
      return {
        status: "operational",
        counts: { companies, employees, attempts, certificates },
        checkedAt: new Date().toISOString(),
      };
    },

    async exportCsv(actorId: string) {
      const actor = await client.employee.findUnique({ where: { id: actorId } });
      if (!actor) {
        throw DomainError.notFound("Administrateur introuvable.");
      }
      const students = await client.employee.findMany({
        where: { companyId: actor.companyId, role: "JR_BUSINESS_ANALYST" },
        include: {
          v1MissionAttempts: { include: { missionDefinition: true } },
          certificates: true,
        },
      });
      const header = "employeeNumber,displayName,completedMissions,certificates";
      const lines = students.map((student) => {
        const completed = student.v1MissionAttempts.filter((attempt) => attempt.status === "completed").length;
        const certCount = student.certificates.length;
        return `${student.employeeNumber},"${student.displayName}",${completed},${certCount}`;
      });
      await audit(actorId, "admin.export.csv", actor.companyId);
      return [header, ...lines].join("\n");
    },
  };
}

export type AdminService = ReturnType<typeof createAdminService>;
