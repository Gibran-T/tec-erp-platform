import { DomainError, Result, type ResultType } from "@tec-platform/core";
import type { AssessmentSubmitRequest, AssessmentSummary, CertificateView } from "@tec-platform/contracts";
import { getPrismaClient } from "@tec-platform/database-erp";
import { listMissionsForModule } from "@tec-platform/mission-catalog";

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = copy[index]!;
    copy[index] = copy[swap]!;
    copy[swap] = current;
  }
  return copy;
}

interface AssessmentQuestionScoring {
  readonly questionKey: string;
  readonly scoringJson: {
    readonly maxPoints?: number;
    readonly correctKeys?: string[];
    readonly minimumSelections?: number;
  };
}

export function scoreAssessmentResponses(
  questions: readonly AssessmentQuestionScoring[],
  responses: AssessmentSubmitRequest["responses"],
): { readonly earned: number; readonly max: number; readonly scorePercent: number } {
  let earned = 0;
  let max = 0;

  for (const question of questions) {
    const scoring = question.scoringJson;
    const maxPoints = scoring.maxPoints ?? 0;
    max += maxPoints;
    const response = responses.find((item) => item.questionKey === question.questionKey);
    if (!response) {
      continue;
    }
    const correct = new Set(scoring.correctKeys ?? []);
    if (typeof response.value === "string") {
      if (correct.has(response.value)) {
        earned += maxPoints;
      }
    } else {
      const selected = new Set(response.value);
      const matched = [...correct].filter((key) => selected.has(key)).length;
      const minimum = scoring.minimumSelections ?? correct.size;
      if (matched >= minimum && selected.size === correct.size) {
        earned += maxPoints;
      }
    }
  }

  const scorePercent = max === 0 ? 0 : Math.round((earned / max) * 10000) / 100;
  return { earned, max, scorePercent };
}

export function createAssessmentService(client = getPrismaClient()) {
  return {
    async listForEmployee(employeeId: string): Promise<AssessmentSummary[]> {
      const definitions = await client.assessmentDefinition.findMany({ orderBy: { code: "asc" } });
      const attempts = await client.assessmentAttempt.findMany({ where: { employeeId } });
      const missionAttempts = await client.missionAttempt.findMany({
        where: { employeeId, status: "completed" },
        include: { missionDefinition: true },
      });
      const completedKeys = new Set(
        missionAttempts.map((attempt) => attempt.missionDefinition.missionKey),
      );

      return definitions.map((definition) => {
        const relatedAttempts = attempts.filter((attempt) => attempt.assessmentId === definition.id);
        const best = relatedAttempts.reduce<number | null>((acc, attempt) => {
          if (attempt.scorePercent == null) {
            return acc;
          }
          return acc == null ? attempt.scorePercent : Math.max(acc, attempt.scorePercent);
        }, null);
        const passed = best != null && best >= definition.passThresholdPercent;
        const inProgress = relatedAttempts.some((attempt) => attempt.status === "in_progress");

        const requiredModules =
          definition.code === "SILVER_M1_M2"
            ? ["M1", "M2"]
            : definition.code === "INTEGRATED_M3_M6"
              ? ["M3", "M4", "M5", "M6"]
              : [];
        const modulesComplete = requiredModules.every((moduleCode) =>
          listMissionsForModule(moduleCode).every((mission) => completedKeys.has(mission.missionKey)),
        );

        let status: AssessmentSummary["status"] = "locked";
        if (passed) {
          status = "passed";
        } else if (inProgress) {
          status = "in_progress";
        } else if (modulesComplete) {
          status = "available";
        } else if (relatedAttempts.some((attempt) => attempt.status === "failed")) {
          status = "failed";
        }

        return {
          code: definition.code,
          title: definition.title,
          moduleScope: definition.moduleScope,
          passThresholdPercent: definition.passThresholdPercent,
          maxAttempts: definition.maxAttempts,
          timeLimitSeconds: definition.timeLimitSeconds,
          status,
          bestScorePercent: best,
          attemptsUsed: relatedAttempts.length,
        };
      });
    },

    async start(
      employeeId: string,
      assessmentCode: string,
    ): Promise<ResultType<{ attemptId: string; questions: unknown[] }>> {
      const definition = await client.assessmentDefinition.findUnique({
        where: { code: assessmentCode },
        include: { questions: { orderBy: { sequence: "asc" } } },
      });
      if (!definition) {
        return Result.fail(DomainError.notFound("Evaluation introuvable."));
      }
      const used = await client.assessmentAttempt.count({
        where: { employeeId, assessmentId: definition.id },
      });
      if (used >= definition.maxAttempts) {
        return Result.fail(DomainError.conflict("Nombre maximal de tentatives atteint."));
      }
      const attempt = await client.assessmentAttempt.create({
        data: {
          employeeId,
          assessmentId: definition.id,
          attemptNumber: used + 1,
          status: "in_progress",
          startedAt: new Date(),
        },
      });
      const questions = definition.questions.map((question) => {
        const options = Array.isArray(question.optionsJson)
          ? shuffle(question.optionsJson as unknown[])
          : question.optionsJson;
        return {
          questionKey: question.questionKey,
          type: question.type,
          prompt: question.prompt,
          options,
        };
      });
      return Result.ok({ attemptId: attempt.id, questions });
    },

    async submit(
      employeeId: string,
      assessmentCode: string,
      body: AssessmentSubmitRequest,
    ): Promise<ResultType<{ scorePercent: number; passed: boolean }>> {
      const definition = await client.assessmentDefinition.findUnique({
        where: { code: assessmentCode },
        include: { questions: true },
      });
      if (!definition) {
        return Result.fail(DomainError.notFound("Evaluation introuvable."));
      }
      const attempt = await client.assessmentAttempt.findFirst({
        where: { employeeId, assessmentId: definition.id, status: "in_progress" },
        orderBy: { attemptNumber: "desc" },
      });
      if (!attempt) {
        return Result.fail(DomainError.conflict("Demarrez l'evaluation avant de soumettre."));
      }

      const scored = scoreAssessmentResponses(
        definition.questions.map((question) => ({
          questionKey: question.questionKey,
          scoringJson: question.scoringJson as AssessmentQuestionScoring["scoringJson"],
        })),
        body.responses,
      );
      const scorePercent = scored.scorePercent;      const passed = scorePercent >= definition.passThresholdPercent;
      await client.assessmentAttempt.update({
        where: { id: attempt.id },
        data: {
          status: passed ? "passed" : "failed",
          submittedAt: new Date(),
          scorePercent,
          responsesJson: body.responses,
          feedbackJson: {
            feedback: passed
              ? "Evaluation reussie."
              : "Seuil non atteint. Vous pouvez retenter si des tentatives restent.",
          },
        },
      });
      return Result.ok({ scorePercent, passed });
    },

    async issueSilverIfEligible(
      employeeId: string,
      actorEmployeeId: string,
    ): Promise<ResultType<CertificateView>> {
      const summaries = await this.listForEmployee(employeeId);
      const silver = summaries.find((item) => item.code === "SILVER_M1_M2");
      if (!silver || silver.status !== "passed") {
        return Result.fail(
          DomainError.conflict("Evaluation Silver non reussie — certification impossible."),
        );
      }

      const m1 = listMissionsForModule("M1");
      const m2 = listMissionsForModule("M2");
      const completed = await client.missionAttempt.findMany({
        where: { employeeId, status: "completed" },
        include: { missionDefinition: true },
      });
      const keys = new Set(completed.map((attempt) => attempt.missionDefinition.missionKey));
      const modulesDone = [...m1, ...m2].every((mission) => keys.has(mission.missionKey));
      if (!modulesDone) {
        return Result.fail(DomainError.conflict("Modules 1 et 2 incomplets."));
      }

      const existing = await client.certificate.findFirst({
        where: { employeeId, certificateType: "silver", status: "issued" },
      });
      if (existing) {
        return Result.fail(DomainError.conflict("Certificat Silver deja emis."));
      }

      const employee = await client.employee.findUnique({ where: { id: employeeId } });
      if (!employee) {
        return Result.fail(DomainError.notFound("Employe introuvable."));
      }
      const membership = await client.cohortMembership.findFirst({
        where: { employeeId },
        include: { cohort: true },
      });
      const certificateNumber = `SILVER-${employee.employeeNumber.replace("#", "")}-${Date.now()}`;
      const issued = await client.certificate.create({
        data: {
          employeeId,
          cohortId: membership?.cohortId,
          certificateType: "silver",
          certificateNumber,
          issuedAt: new Date(),
          status: "issued",
          verificationStatus: "valid",
          competencySummaryJson: {
            modules: ["M1", "M2"],
            assessment: "SILVER_M1_M2",
            scorePercent: silver.bestScorePercent,
          },
        },
      });
      await client.certificateAudit.create({
        data: {
          certificateId: issued.id,
          actorEmployeeId,
          action: "issue",
          reason: "Eligibilite Silver validee automatiquement",
        },
      });
      await client.auditEvent.create({
        data: {
          companyId: employee.companyId,
          actorEmployeeId,
          action: "certificate.issue",
          resourceType: "certificate",
          resourceKey: certificateNumber,
          reason: "Silver issued",
        },
      });

      return Result.ok({
        certificateNumber: issued.certificateNumber,
        certificateType: issued.certificateType,
        studentName: employee.displayName,
        cohortName: membership?.cohort.name ?? null,
        issuedAt: issued.issuedAt.toISOString(),
        status: "issued",
        verificationStatus: "valid",
        competencySummary: issued.competencySummaryJson as Record<string, unknown>,
      });
    },

    async listCertificates(employeeId: string): Promise<CertificateView[]> {
      const rows = await client.certificate.findMany({
        where: { employeeId },
        orderBy: { issuedAt: "desc" },
        include: {
          employee: true,
          cohort: true,
        },
      });
      return rows.map((row) => ({
        certificateNumber: row.certificateNumber,
        certificateType: row.certificateType,
        studentName: row.employee.displayName,
        cohortName: row.cohort?.name ?? null,
        issuedAt: row.issuedAt.toISOString(),
        status: row.status === "revoked" ? "revoked" : "issued",
        verificationStatus: row.verificationStatus === "revoked" ? "revoked" : "valid",
        competencySummary: row.competencySummaryJson as Record<string, unknown>,
      }));
    },

    async revokeCertificate(
      actorEmployeeId: string,
      certificateNumber: string,
      reason: string,
    ): Promise<ResultType<{ ok: true }>> {
      const certificate = await client.certificate.findUnique({
        where: { certificateNumber },
        include: { employee: true },
      });
      if (!certificate) {
        return Result.fail(DomainError.notFound("Certificat introuvable."));
      }
      if (certificate.status === "revoked") {
        return Result.fail(DomainError.conflict("Certificat deja revoque."));
      }
      await client.certificate.update({
        where: { id: certificate.id },
        data: { status: "revoked", verificationStatus: "revoked", revokedAt: new Date() },
      });
      await client.certificateAudit.create({
        data: {
          certificateId: certificate.id,
          actorEmployeeId,
          action: "revoke",
          reason,
        },
      });
      await client.auditEvent.create({
        data: {
          companyId: certificate.employee.companyId,
          actorEmployeeId,
          action: "certificate.revoke",
          resourceType: "certificate",
          resourceKey: certificateNumber,
          reason,
        },
      });
      return Result.ok({ ok: true });
    },
  };
}

export type AssessmentService = ReturnType<typeof createAssessmentService>;
