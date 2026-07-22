import { DomainError, Password, Result, type ResultType } from "@tec-platform/core";
import type { EmployeeRole } from "@tec-platform/contracts";
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

  async function requireActor(actorId: string) {
    const actor = await client.employee.findUnique({ where: { id: actorId } });
    if (!actor) {
      throw DomainError.notFound("Administrateur introuvable.");
    }
    return actor;
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
        include: {
          _count: { select: { memberships: true } },
          memberships: {
            where: { roleInCohort: "professor" },
            include: { employee: true },
          },
        },
      });
      return cohorts.map((cohort) => ({
        id: cohort.id,
        code: cohort.code,
        name: cohort.name,
        companyId: cohort.companyId,
        memberCount: cohort._count.memberships,
        professors: cohort.memberships.map((membership) => ({
          id: membership.employee.id,
          employeeNumber: membership.employee.employeeNumber,
          displayName: membership.employee.displayName,
          email: membership.employee.email,
        })),
      }));
    },

    async listCompanyEmployees(actorId: string) {
      const actor = await requireActor(actorId);
      const employees = await client.employee.findMany({
        where: { companyId: actor.companyId },
        orderBy: { displayName: "asc" },
      });
      return employees.map((employee) => ({
        id: employee.id,
        employeeNumber: employee.employeeNumber,
        email: employee.email,
        displayName: employee.displayName,
        role: employee.role,
      }));
    },

    async createEmployee(
      actorId: string,
      input: {
        employeeNumber: string;
        email: string;
        displayName: string;
        role: EmployeeRole;
        password: string;
      },
    ): Promise<
      ResultType<{
        id: string;
        employeeNumber: string;
        email: string;
        displayName: string;
        role: EmployeeRole;
        companyId: string;
      }>
    > {
      const actor = await requireActor(actorId);
      try {
        const created = await client.employee.create({
          data: {
            employeeNumber: input.employeeNumber.trim(),
            email: input.email.trim().toLowerCase(),
            displayName: input.displayName.trim(),
            role: input.role,
            passwordHash: Password.hash(input.password),
            companyId: actor.companyId,
          },
        });
        await audit(actorId, "admin.employee.create", created.id, input.role);
        return Result.ok({
          id: created.id,
          employeeNumber: created.employeeNumber,
          email: created.email,
          displayName: created.displayName,
          role: created.role,
          companyId: created.companyId,
        });
      } catch {
        return Result.fail(
          DomainError.conflict("Impossible de créer l'employé — numéro ou courriel déjà utilisé."),
        );
      }
    },

    async updateEmployeeRole(
      actorId: string,
      employeeId: string,
      role: EmployeeRole,
    ): Promise<ResultType<{ id: string; role: EmployeeRole }>> {
      const actor = await requireActor(actorId);
      const employee = await client.employee.findUnique({ where: { id: employeeId } });
      if (!employee || employee.companyId !== actor.companyId) {
        return Result.fail(DomainError.notFound("Employé introuvable dans votre entreprise."));
      }
      const updated = await client.employee.update({
        where: { id: employeeId },
        data: { role },
      });
      await audit(actorId, "admin.employee.role_change", employeeId, role);
      return Result.ok({ id: updated.id, role: updated.role });
    },

    async createCohort(
      actorId: string,
      input: { code: string; name: string },
    ): Promise<ResultType<{ id: string; code: string; name: string; companyId: string }>> {
      const actor = await requireActor(actorId);
      try {
        const created = await client.cohort.create({
          data: {
            code: input.code.trim(),
            name: input.name.trim(),
            companyId: actor.companyId,
          },
        });
        await audit(actorId, "admin.cohort.create", created.id);
        return Result.ok({
          id: created.id,
          code: created.code,
          name: created.name,
          companyId: created.companyId,
        });
      } catch {
        return Result.fail(DomainError.conflict("Code de cohorte déjà utilisé."));
      }
    },

    async assignProfessor(
      actorId: string,
      cohortId: string,
      employeeId: string,
    ): Promise<ResultType<{ ok: true }>> {
      const actor = await requireActor(actorId);
      const cohort = await client.cohort.findUnique({ where: { id: cohortId } });
      const employee = await client.employee.findUnique({ where: { id: employeeId } });
      if (!cohort || !employee) {
        return Result.fail(DomainError.notFound("Cohorte ou employé introuvable."));
      }
      if (cohort.companyId !== actor.companyId || employee.companyId !== actor.companyId) {
        return Result.fail(DomainError.forbidden("Affectation limitée à votre entreprise."));
      }
      if (employee.role !== "PROFESSOR") {
        return Result.fail(
          DomainError.validation("L'employé doit avoir le rôle PROFESSEUR avant l'affectation."),
        );
      }
      await client.cohortMembership.upsert({
        where: { cohortId_employeeId: { cohortId, employeeId } },
        create: { cohortId, employeeId, roleInCohort: "professor" },
        update: { roleInCohort: "professor" },
      });
      await audit(actorId, "admin.cohort.assign_professor", `${cohortId}:${employeeId}`);
      return Result.ok({ ok: true });
    },

    async removeProfessor(
      actorId: string,
      cohortId: string,
      employeeId: string,
    ): Promise<ResultType<{ ok: true }>> {
      const actor = await requireActor(actorId);
      const cohort = await client.cohort.findUnique({ where: { id: cohortId } });
      if (!cohort || cohort.companyId !== actor.companyId) {
        return Result.fail(DomainError.notFound("Cohorte introuvable."));
      }
      const membership = await client.cohortMembership.findUnique({
        where: { cohortId_employeeId: { cohortId, employeeId } },
      });
      if (!membership || membership.roleInCohort !== "professor") {
        return Result.fail(DomainError.notFound("Affectation professeur introuvable."));
      }
      await client.cohortMembership.delete({
        where: { cohortId_employeeId: { cohortId, employeeId } },
      });
      await audit(actorId, "admin.cohort.remove_professor", `${cohortId}:${employeeId}`);
      return Result.ok({ ok: true });
    },

    async enrollStudent(
      actorId: string,
      cohortId: string,
      employeeId: string,
    ): Promise<ResultType<{ ok: true }>> {
      const cohort = await client.cohort.findUnique({ where: { id: cohortId } });
      const employee = await client.employee.findUnique({ where: { id: employeeId } });
      if (!cohort || !employee) {
        return Result.fail(DomainError.notFound("Cohorte ou employé introuvable."));
      }
      if (cohort.companyId !== employee.companyId) {
        return Result.fail(
          DomainError.conflict("Employé et cohorte doivent appartenir à la même entreprise."),
        );
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

    async listAssessmentBanks(actorId: string) {
      const actor = await client.employee.findUnique({ where: { id: actorId } });
      if (!actor || actor.role !== "ADMIN") {
        throw DomainError.forbidden("Acces administrateur requis.");
      }
      const definitions = await client.assessmentDefinition.findMany({
        orderBy: { code: "asc" },
        include: { _count: { select: { questions: true, attempts: true } } },
      });
      return definitions.map((definition) => {
        const meta = definition.definitionJson as {
          curriculumVersion?: string;
          kind?: string;
          modules?: string[];
        };
        return {
          code: definition.code,
          title: definition.title,
          moduleScope: definition.moduleScope,
          passThresholdPercent: definition.passThresholdPercent,
          maxAttempts: definition.maxAttempts,
          timeLimitSeconds: definition.timeLimitSeconds,
          curriculumVersion: meta.curriculumVersion ?? null,
          kind: meta.kind ?? null,
          modules: meta.modules ?? [],
          questionCount: definition._count.questions,
          attemptCount: definition._count.attempts,
          releaseStatus: "seeded",
        };
      });
    },

    async getAssessmentBank(actorId: string, code: string, options?: { includeAnswerKey?: boolean }) {
      const actor = await client.employee.findUnique({ where: { id: actorId } });
      if (!actor || actor.role !== "ADMIN") {
        throw DomainError.forbidden("Acces administrateur requis.");
      }
      const definition = await client.assessmentDefinition.findUnique({
        where: { code },
        include: { questions: { orderBy: { sequence: "asc" } } },
      });
      if (!definition) {
        throw DomainError.notFound("Banque d'evaluation introuvable.");
      }
      const includeAnswerKey = options?.includeAnswerKey === true;
      const companyAttemptCount = await client.assessmentAttempt.count({
        where: {
          assessmentId: definition.id,
          employee: { companyId: actor.companyId },
        },
      });
      return {
        code: definition.code,
        title: definition.title,
        moduleScope: definition.moduleScope,
        passThresholdPercent: definition.passThresholdPercent,
        maxAttempts: definition.maxAttempts,
        timeLimitSeconds: definition.timeLimitSeconds,
        definitionJson: definition.definitionJson,
        companyAttemptCount,
        questions: definition.questions.map((question) => {
          const scoring = question.scoringJson as {
            maxPoints?: number;
            correctKeys?: string[];
            mission?: string;
            competency?: string;
            questionKind?: string;
            difficulty?: string;
            tags?: string[];
            explanation?: string;
          };
          return {
            questionKey: question.questionKey,
            sequence: question.sequence,
            type: question.type,
            prompt: question.prompt,
            options: question.optionsJson,
            maxPoints: scoring.maxPoints ?? null,
            mission: scoring.mission ?? null,
            competency: scoring.competency ?? null,
            questionKind: scoring.questionKind ?? null,
            difficulty: scoring.difficulty ?? null,
            tags: scoring.tags ?? [],
            ...(includeAnswerKey
              ? {
                  correctKeys: scoring.correctKeys ?? [],
                  explanation: scoring.explanation ?? null,
                }
              : {}),
          };
        }),
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
