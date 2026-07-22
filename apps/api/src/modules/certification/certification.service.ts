import { createHash, randomBytes } from "node:crypto";

import { DomainError, Result, type ResultType } from "@tec-platform/core";
import type { CertificateView } from "@tec-platform/contracts";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";
import {
  DEFAULT_CURRICULUM_VERSION,
  listRegularMissionsForCurriculum,
  type CurriculumVersion,
} from "@tec-platform/mission-catalog";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface GoldEligibilityInput {
  readonly completedMissionKeys: ReadonlySet<string>;
  readonly goldAssessmentPassed: boolean;
  readonly capstoneSubmitted: boolean;
  readonly capstoneProfessorApproved: boolean;
  readonly professorApproveFlag: boolean;
  readonly curriculumVersion?: CurriculumVersion;
}

export function evaluateGoldEligibility(input: GoldEligibilityInput): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const version = input.curriculumVersion ?? DEFAULT_CURRICULUM_VERSION;
  const requiredMissions = listRegularMissionsForCurriculum(version).map(
    (mission) => mission.missionKey,
  );
  const missing = requiredMissions.filter((key) => !input.completedMissionKeys.has(key));
  if (missing.length > 0) {
    reasons.push(`Missions incomplètes: ${missing.length}`);
  }
  if (!input.goldAssessmentPassed) {
    reasons.push("Évaluation GOLD_M7_M10 non réussie");
  }
  if (!input.capstoneSubmitted) {
    reasons.push("Dossier Capstone non soumis");
  }
  if (!input.capstoneProfessorApproved) {
    reasons.push("Approbation professeur Capstone manquante");
  }
  if (!input.professorApproveFlag) {
    reasons.push("Validation professeur Or requise");
  }
  return { eligible: reasons.length === 0, reasons };
}

export function createCertificationService(client = getPrismaClient()) {
  async function loadEligibility(studentId: string, professorApproveFlag: boolean) {
    const { resolvePedagogicalRunForEmployee } = await import(
      "../pedagogical-run/pedagogical-run.resolution.js"
    );
    const run = await resolvePedagogicalRunForEmployee({
      employeeId: studentId,
      forWrite: false,
    });
    const runFilter = run ? { pedagogicalCourseRunId: run.id } : { pedagogicalCourseRunId: "__none__" };

    const attempts = await client.missionAttempt.findMany({
      where: { employeeId: studentId, status: "completed", ...runFilter },
      include: { missionDefinition: true },
    });
    const completedMissionKeys = new Set(attempts.map((row) => row.missionDefinition.missionKey));

    const goldAttempt = await client.assessmentAttempt.findFirst({
      where: {
        employeeId: studentId,
        assessment: { code: "GOLD_M7_M10" },
        status: "passed",
        ...runFilter,
      },
    });

    const capstone = run
      ? await client.capstoneSubmission.findUnique({
          where: {
            employeeId_pedagogicalCourseRunId: {
              employeeId: studentId,
              pedagogicalCourseRunId: run.id,
            },
          },
        })
      : null;

    return evaluateGoldEligibility({
      completedMissionKeys,
      goldAssessmentPassed: goldAttempt !== null,
      capstoneSubmitted: capstone?.status === "submitted" || capstone?.status === "approved",
      capstoneProfessorApproved: capstone?.professorApproved === true,
      professorApproveFlag,
      curriculumVersion: run?.curriculumVersion ?? DEFAULT_CURRICULUM_VERSION,
    });
  }

  return {
    async getGoldEligibility(employeeId: string) {
      const eligibility = await loadEligibility(employeeId, false);
      return {
        eligibleForProfessorIssue: false,
        studentReadyChecklist: {
          missionsComplete: !eligibility.reasons.some((reason) => reason.startsWith("Missions")),
          goldAssessmentPassed: !eligibility.reasons.some((reason) => reason.includes("GOLD_M7_M10")),
          capstoneSubmitted: !eligibility.reasons.some((reason) => reason.includes("non soumis")),
          capstoneProfessorApproved: !eligibility.reasons.some((reason) =>
            reason.includes("Approbation professeur"),
          ),
        },
        reasons: eligibility.reasons.filter(
          (reason) => !reason.includes("Validation professeur Or"),
        ),
        nextStepHint: eligibility.reasons.some((reason) => reason.includes("Approbation professeur"))
          ? "Votre dossier Capstone est en attente de revue professeur. Le certificat Or n'est émis qu'après approbation et validation professeur."
          : eligibility.reasons.some((reason) => reason.includes("non soumis"))
            ? "Soumettez votre dossier Capstone lorsque les 30 missions et l'évaluation Or sont réussies."
            : "Lorsque le Capstone est approuvé, votre professeur peut émettre le certificat Or.",
      };
    },

    async listMyCertificates(employeeId: string): Promise<CertificateView[]> {
      const rows = await client.certificate.findMany({
        where: { employeeId },
        orderBy: { issuedAt: "desc" },
        include: { employee: true, cohort: true },
      });
      return rows.map((row) => ({
        certificateNumber: row.certificateNumber,
        certificateType: row.certificateType,
        studentName: row.employee.displayName,
        cohortName: row.cohort?.name ?? null,
        issuedAt: row.issuedAt.toISOString(),
        revokedAt: row.revokedAt?.toISOString() ?? null,
        status: row.status === "revoked" ? "revoked" : "issued",
        verificationStatus: row.verificationStatus === "revoked" ? "revoked" : "valid",
        competencySummary: row.competencySummaryJson as Record<string, unknown>,
      }));
    },

    async issueGold(
      professorId: string,
      studentId: string,
      reason: string,
    ): Promise<ResultType<CertificateView>> {
      const professor = await client.employee.findUnique({ where: { id: professorId } });
      if (!professor || professor.role !== "PROFESSOR") {
        return Result.fail(DomainError.forbidden("Seul un professeur peut emettre un certificat Gold."));
      }

      const eligibility = await loadEligibility(studentId, true);
      if (!eligibility.eligible) {
        return Result.fail(
          DomainError.conflict(`Eligibilite Gold refusee: ${eligibility.reasons.join("; ")}`),
        );
      }

      const existing = await client.certificate.findFirst({
        where: { employeeId: studentId, certificateType: "gold", status: "issued" },
      });
      if (existing) {
        return Result.fail(DomainError.conflict("Certificat Gold deja emis."));
      }

      const student = await client.employee.findUnique({ where: { id: studentId } });
      if (!student) {
        return Result.fail(DomainError.notFound("Etudiant introuvable."));
      }

      const membership = await client.cohortMembership.findFirst({
        where: { employeeId: studentId },
        include: { cohort: true },
      });

      const certificateNumber = `GOLD-${student.employeeNumber.replace("#", "")}-${Date.now()}`;
      const { resolvePedagogicalRunForEmployee } = await import(
        "../pedagogical-run/pedagogical-run.resolution.js"
      );
      const sourceRun = await resolvePedagogicalRunForEmployee({
        employeeId: studentId,
        forWrite: false,
      });
      const issued = await client.certificate.create({
        data: {
          employeeId: studentId,
          cohortId: membership?.cohortId,
          sourceRunId: sourceRun?.id ?? null,
          achievementType: "gold",
          certificateType: "gold",
          certificateNumber,
          issuedAt: new Date(),
          status: "issued",
          verificationStatus: "valid",
          competencySummaryJson: {
            modules: ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10"],
            assessment: "GOLD_M7_M10",
            capstone: true,
            sourceRunId: sourceRun?.id ?? null,
          },
        },
      });

      const rawToken = randomBytes(24).toString("hex");
      await client.publicVerificationToken.create({
        data: {
          tokenHash: hashToken(rawToken),
          certificateId: issued.id,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      });

      await client.certificateAudit.create({
        data: {
          certificateId: issued.id,
          actorEmployeeId: professorId,
          action: "issue",
          reason,
        },
      });
      await client.auditEvent.create({
        data: {
          companyId: student.companyId,
          actorEmployeeId: professorId,
          action: "certificate.issue.gold",
          resourceType: "certificate",
          resourceKey: certificateNumber,
          reason,
        },
      });

      return Result.ok({
        certificateNumber: issued.certificateNumber,
        certificateType: issued.certificateType,
        studentName: student.displayName,
        cohortName: membership?.cohort.name ?? null,
        issuedAt: issued.issuedAt.toISOString(),
        revokedAt: null,
        status: "issued",
        verificationStatus: "valid",
        competencySummary: issued.competencySummaryJson as Record<string, unknown>,
      });
    },

    async verifyPublic(tokenOrNumber: string) {
      const byNumber = await client.certificate.findUnique({
        where: { certificateNumber: tokenOrNumber },
        include: { employee: true },
      });
      if (byNumber) {
        if (byNumber.verificationStatus === "revoked" || byNumber.status === "revoked") {
          return {
            found: true,
            status: "revoked" as const,
            certificateNumber: byNumber.certificateNumber,
            certificateType: byNumber.certificateType,
            studentName: byNumber.employee.displayName,
            issuedAt: byNumber.issuedAt.toISOString(),
            revokedAt: byNumber.revokedAt?.toISOString() ?? null,
            message: "Certificat revoque.",
          };
        }
        return {
          found: true,
          status: "valid" as const,
          certificateNumber: byNumber.certificateNumber,
          certificateType: byNumber.certificateType,
          studentName: byNumber.employee.displayName,
          issuedAt: byNumber.issuedAt.toISOString(),
          revokedAt: null,
          message: "Certificat valide.",
        };
      }

      const tokenHash = hashToken(tokenOrNumber);
      const token = await client.publicVerificationToken.findUnique({
        where: { tokenHash },
        include: { certificate: { include: { employee: true } } },
      });
      if (!token) {
        return { found: false, message: "Certificat introuvable." };
      }
      if (token.expiresAt.getTime() < Date.now()) {
        return {
          found: true,
          status: "expired" as const,
          certificateNumber: token.certificate.certificateNumber,
          certificateType: token.certificate.certificateType,
          studentName: token.certificate.employee.displayName,
          issuedAt: token.certificate.issuedAt.toISOString(),
          message: "Jeton de verification expire.",
        };
      }
      if (token.certificate.verificationStatus === "revoked") {
        return {
          found: true,
          status: "revoked" as const,
          certificateNumber: token.certificate.certificateNumber,
          certificateType: token.certificate.certificateType,
          studentName: token.certificate.employee.displayName,
          issuedAt: token.certificate.issuedAt.toISOString(),
          revokedAt: token.certificate.revokedAt?.toISOString() ?? null,
          message: "Certificat revoque.",
        };
      }
      return {
        found: true,
        status: "valid" as const,
        certificateNumber: token.certificate.certificateNumber,
        certificateType: token.certificate.certificateType,
        studentName: token.certificate.employee.displayName,
        issuedAt: token.certificate.issuedAt.toISOString(),
        revokedAt: null,
        message: "Certificat valide.",
      };
    },

    async revokeGold(professorId: string, certificateNumber: string, reason: string) {
      const professor = await client.employee.findUnique({ where: { id: professorId } });
      if (!professor || professor.role !== "PROFESSOR") {
        return Result.fail(DomainError.forbidden("Seul un professeur peut revoquer un certificat."));
      }
      const certificate = await client.certificate.findUnique({
        where: { certificateNumber },
        include: { employee: true },
      });
      if (!certificate || certificate.certificateType !== "gold") {
        return Result.fail(DomainError.notFound("Certificat Gold introuvable."));
      }
      if (certificate.status === "revoked") {
        return Result.fail(DomainError.conflict("Certificat deja revoque."));
      }
      await client.certificate.update({
        where: { id: certificate.id },
        data: {
          status: "revoked",
          verificationStatus: "revoked",
          revokedAt: new Date(),
          revokeReason: reason,
        },
      });
      await client.certificateAudit.create({
        data: {
          certificateId: certificate.id,
          actorEmployeeId: professorId,
          action: "revoke",
          reason,
        },
      });
      await client.auditEvent.create({
        data: {
          companyId: certificate.employee.companyId,
          actorEmployeeId: professorId,
          action: "certificate.revoke.gold",
          resourceType: "certificate",
          resourceKey: certificateNumber,
          reason,
          payloadJson: toInputJson({ certificateType: "gold" }),
        },
      });
      return Result.ok({ ok: true as const });
    },

    evaluateGoldEligibility,
    loadEligibility,
  };
}

export type CertificationService = ReturnType<typeof createCertificationService>;
