import { DomainError, Result, type ResultType } from "@tec-platform/core";
import type { ProfessorOverrideRequest } from "@tec-platform/contracts";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";
import {
  DEFAULT_CURRICULUM_VERSION,
  isKnownCatalogMissionKey,
  listModulesForCurriculum,
  parseCurriculumVersion,
  type CurriculumVersion,
} from "@tec-platform/mission-catalog";

import { createAssessmentService } from "../assessment/assessment.service.js";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

/** Z1-009: always project M1–M10 for the student's curriculum version (empty = locked). */
function normalizeModuleProgress(
  progress: ReadonlyArray<{
    readonly moduleCode: string;
    readonly status: string;
    readonly percentComplete: number;
  }>,
  curriculumVersion: CurriculumVersion = DEFAULT_CURRICULUM_VERSION,
): Array<{
  moduleCode: string;
  moduleTitle: string;
  status: string;
  percentComplete: number;
  curriculumVersion: CurriculumVersion;
}> {
  const byCode = new Map(progress.map((item) => [item.moduleCode, item]));
  return listModulesForCurriculum(curriculumVersion).map((moduleEntry) => {
    const stored = byCode.get(moduleEntry.moduleCode);
    return {
      moduleCode: moduleEntry.moduleCode,
      moduleTitle: moduleEntry.title,
      status: stored?.status ?? "locked",
      percentComplete: stored?.percentComplete ?? 0,
      curriculumVersion,
    };
  });
}

export function createProfessorService(client = getPrismaClient()) {
  const assessments = createAssessmentService(client);

  async function assertProfessorCohortAccess(professorId: string, studentId: string) {
    const professorMemberships = await client.cohortMembership.findMany({
      where: { employeeId: professorId, roleInCohort: "professor" },
    });
    const cohortIds = professorMemberships.map((membership) => membership.cohortId);
    if (cohortIds.length === 0) {
      return false;
    }
    const studentMembership = await client.cohortMembership.findFirst({
      where: { employeeId: studentId, cohortId: { in: cohortIds } },
    });
    return studentMembership != null;
  }

  return {
    async listCohorts(professorId: string) {
      const memberships = await client.cohortMembership.findMany({
        where: { employeeId: professorId, roleInCohort: "professor" },
        include: {
          cohort: {
            include: {
              memberships: { where: { roleInCohort: "student" } },
            },
          },
        },
      });
      return memberships.map((membership) => ({
        code: membership.cohort.code,
        name: membership.cohort.name,
        studentCount: membership.cohort.memberships.length,
      }));
    },

    async listStudents(professorId: string) {
      const { resolveOfficialRunIdForEmployee } = await import("../analytics/official-run-policy.js");
      const memberships = await client.cohortMembership.findMany({
        where: { employeeId: professorId, roleInCohort: "professor" },
      });
      const cohortIds = memberships.map((membership) => membership.cohortId);
      const students = await client.cohortMembership.findMany({
        where: { cohortId: { in: cohortIds }, roleInCohort: "student" },
        include: { employee: true },
      });

      const uniqueByEmployee = new Map<string, (typeof students)[number]>();
      for (const student of students) {
        if (!uniqueByEmployee.has(student.employeeId)) {
          uniqueByEmployee.set(student.employeeId, student);
        }
      }

      const result = [];
      for (const student of uniqueByEmployee.values()) {
        const officialRunId = await resolveOfficialRunIdForEmployee(student.employeeId);
        const officialRun = officialRunId
          ? await client.pedagogicalCourseRun.findUnique({ where: { id: officialRunId } })
          : null;
        const curriculumVersion = parseCurriculumVersion(officialRun?.curriculumVersion);
        const progress = await client.employeeModuleProgress.findMany({
          where: {
            employeeId: student.employeeId,
            ...(officialRunId ? { pedagogicalCourseRunId: officialRunId } : {}),
          },
          include: { module: true },
        });
        const completedMissions = await client.missionAttempt.count({
          where: {
            employeeId: student.employeeId,
            status: "completed",
            ...(officialRunId ? { pedagogicalCourseRunId: officialRunId } : { pedagogicalCourseRunId: "__none__" }),
          },
        });
        const certificate = await client.certificate.findFirst({
          where: { employeeId: student.employeeId, certificateType: "silver" },
          orderBy: { issuedAt: "desc" },
        });
        let silverStatus: "not_eligible" | "eligible" | "issued" | "revoked" = "not_eligible";
        if (certificate?.status === "issued") {
          silverStatus = "issued";
        } else if (certificate?.status === "revoked") {
          silverStatus = "revoked";
        } else {
          const summaries = await assessments.listForEmployee(student.employeeId);
          const silver = summaries.find((item) => item.code === "SILVER_M1_M2");
          if (silver?.status === "passed") {
            silverStatus = "eligible";
          }
        }
        const capstone = await client.capstoneSubmission.findFirst({
          where: {
            employeeId: student.employeeId,
            ...(officialRunId ? { pedagogicalCourseRunId: officialRunId } : {}),
          },
          orderBy: { updatedAt: "desc" },
        });
        let capstoneStatus: "none" | "draft" | "submitted" | "approved" | "needs_revision" = "none";
        if (capstone) {
          if (capstone.professorApproved) {
            capstoneStatus = "approved";
          } else if (capstone.reviewStatus === "needs_revision") {
            capstoneStatus = "needs_revision";
          } else if (capstone.status === "submitted") {
            capstoneStatus = "submitted";
          } else {
            capstoneStatus = "draft";
          }
        }
        result.push({
          employeeId: student.employeeId,
          employeeNumber: student.employee.employeeNumber,
          displayName: student.employee.displayName,
          email: student.employee.email,
          completedMissions,
          curriculumVersion,
          moduleProgress: normalizeModuleProgress(
            progress.map((item) => ({
              moduleCode: item.module.moduleCode,
              status: item.status,
              percentComplete: item.percentComplete,
            })),
            curriculumVersion,
          ),
          silverStatus,
          capstoneStatus,
        });
      }
      return result;
    },

    async applyOverride(
      professorId: string,
      studentId: string,
      body: ProfessorOverrideRequest,
    ): Promise<ResultType<{ ok: true }>> {
      const allowed = await assertProfessorCohortAccess(professorId, studentId);
      if (!allowed) {
        return Result.fail(DomainError.forbidden("Etudiant hors cohorte assignee."));
      }
      const professor = await client.employee.findUnique({ where: { id: professorId } });
      const student = await client.employee.findUnique({ where: { id: studentId } });
      if (!professor || !student) {
        return Result.fail(DomainError.notFound("Identite introuvable."));
      }

      if (body.action === "release_mission" && body.missionKey) {
        if (!isKnownCatalogMissionKey(body.missionKey)) {
          return Result.fail(DomainError.notFound("Mission inconnue."));
        }
        const activeRun = await client.pedagogicalCourseRun.findFirst({
          where: { employeeId: studentId, status: "ACTIVE" },
          orderBy: { updatedAt: "desc" },
        });
        if (!activeRun) {
          return Result.fail(
            DomainError.conflict(
              "Aucun parcours ACTIVE. Impossible de liberer une mission hors parcours actif.",
            ),
          );
        }
        await client.unlockState.upsert({
          where: {
            employeeId_resourceType_resourceKey_pedagogicalCourseRunId: {
              employeeId: studentId,
              resourceType: "mission",
              resourceKey: body.missionKey,
              pedagogicalCourseRunId: activeRun.id,
            },
          },
          update: { unlockedAt: new Date() },
          create: {
            employeeId: studentId,
            resourceType: "mission",
            resourceKey: body.missionKey,
            pedagogicalCourseRunId: activeRun.id,
            unlockedAt: new Date(),
          },
        });
      }

      if (body.action === "reset_attempt" && body.missionKey) {
        const definition = await client.missionDefinition.findUnique({
          where: { missionKey: body.missionKey },
        });
        const activeRun = await client.pedagogicalCourseRun.findFirst({
          where: { employeeId: studentId, status: "ACTIVE" },
          orderBy: { updatedAt: "desc" },
        });
        if (definition && activeRun) {
          await client.missionAttempt.deleteMany({
            where: {
              employeeId: studentId,
              missionDefinitionId: definition.id,
              pedagogicalCourseRunId: activeRun.id,
              status: { in: ["in_progress", "failed"] },
            },
          });
        }
      }

      if (body.action === "validate_completion") {
        await assessments.issueSilverIfEligible(studentId, professorId);
      }

      if (body.action === "review_analytical") {
        if (!body.missionKey || !body.reviewDecision) {
          return Result.fail(
            DomainError.validation("Revue analytique: missionKey et reviewDecision requis."),
          );
        }
        const definition = await client.missionDefinition.findUnique({
          where: { missionKey: body.missionKey },
        });
        if (!definition) {
          return Result.fail(DomainError.notFound("Mission inconnue."));
        }
        const attempt = await client.missionAttempt.findFirst({
          where: {
            employeeId: studentId,
            missionDefinitionId: definition.id,
            status: { in: ["completed", "needs_review"] },
          },
          orderBy: { attemptNumber: "desc" },
        });
        if (!attempt) {
          return Result.fail(DomainError.notFound("Tentative a reviser introuvable."));
        }
        await client.missionAttempt.update({
          where: { id: attempt.id },
          data: {
            feedbackJson: {
              ...(typeof attempt.feedbackJson === "object" && attempt.feedbackJson !== null
                ? (attempt.feedbackJson as Record<string, unknown>)
                : {}),
              professorReview: {
                decision: body.reviewDecision,
                reason: body.reason,
                reviewedBy: professorId,
                reviewedAt: new Date().toISOString(),
              },
            },
          },
        });
      }

      if (body.action === "override_score" && body.missionKey && body.scorePercent != null) {
        const definition = await client.missionDefinition.findUnique({
          where: { missionKey: body.missionKey },
        });
        if (definition) {
          const attempt = await client.missionAttempt.findFirst({
            where: { employeeId: studentId, missionDefinitionId: definition.id },
            orderBy: { attemptNumber: "desc" },
          });
          if (attempt) {
            await client.missionAttempt.update({
              where: { id: attempt.id },
              data: {
                scorePercent: body.scorePercent,
                status: body.scorePercent >= definition.passThresholdPercent ? "completed" : "failed",
                feedbackJson: {
                  ...(typeof attempt.feedbackJson === "object" && attempt.feedbackJson !== null
                    ? (attempt.feedbackJson as Record<string, unknown>)
                    : {}),
                  professorOverride: {
                    scorePercent: body.scorePercent,
                    reason: body.reason,
                    overriddenBy: professorId,
                    overriddenAt: new Date().toISOString(),
                  },
                },
              },
            });
          }
        }
      }

      await client.auditEvent.create({
        data: {
          companyId: professor.companyId,
          actorEmployeeId: professorId,
          action: `professor.${body.action}`,
          resourceType: "employee",
          resourceKey: studentId,
          reason: body.reason,
          payloadJson: toInputJson(body),
        },
      });

      return Result.ok({ ok: true });
    },

    async exportCsv(professorId: string): Promise<string> {
      const students = await this.listStudents(professorId);
      const moduleCodes = listModulesForCurriculum(DEFAULT_CURRICULUM_VERSION).map(
        (moduleEntry) => moduleEntry.moduleCode,
      );
      const header = [
        "employeeNumber",
        "displayName",
        "email",
        "completedMissions",
        "silverStatus",
        "capstoneStatus",
        ...moduleCodes.map((code) => `${code}_percent`),
        ...moduleCodes.map((code) => `${code}_status`),
      ].join(",");
      const rows = students.map((student) => {
        const byCode = new Map(
          student.moduleProgress.map((item) => [item.moduleCode, item] as const),
        );
        const percents = moduleCodes.map((code) => String(byCode.get(code)?.percentComplete ?? 0));
        const statuses = moduleCodes.map((code) => byCode.get(code)?.status ?? "locked");
        return [
          student.employeeNumber,
          student.displayName,
          student.email,
          String(student.completedMissions),
          student.silverStatus,
          student.capstoneStatus,
          ...percents,
          ...statuses,
        ].join(",");
      });
      return [header, ...rows].join("\n");
    },

    async getStudentDetail(professorId: string, studentId: string) {
      const allowed = await assertProfessorCohortAccess(professorId, studentId);
      if (!allowed) {
        return Result.fail(DomainError.forbidden("Etudiant hors cohorte assignee."));
      }
      const employee = await client.employee.findUnique({ where: { id: studentId } });
      if (!employee) {
        return Result.fail(DomainError.notFound("Etudiant introuvable."));
      }
      const moduleProgress = await client.employeeModuleProgress.findMany({
        where: { employeeId: studentId },
        include: { module: true },
      });
      const missionAttempts = await client.missionAttempt.findMany({
        where: { employeeId: studentId },
        include: { missionDefinition: true },
        orderBy: { updatedAt: "desc" },
      });
      const assessmentAttempts = await client.assessmentAttempt.findMany({
        where: { employeeId: studentId },
        include: { assessment: true },
        orderBy: { startedAt: "desc" },
      });
      const certificates = await client.certificate.findMany({
        where: { employeeId: studentId },
        orderBy: { issuedAt: "desc" },
        include: { audits: { include: { actor: true }, orderBy: { createdAt: "desc" } } },
      });
      const capstone = await client.capstoneSubmission.findFirst({
        where: { employeeId: studentId },
        orderBy: { updatedAt: "desc" },
      });
      const pendingReviews = missionAttempts.filter(
        (attempt) => attempt.status === "needs_review",
      );
      const competencyCodes = [
        ...new Set(
          missionAttempts
            .filter((attempt) => attempt.status === "completed")
            .flatMap((attempt) => {
              const definition = attempt.missionDefinition.definitionJson as {
                competencyCodes?: string[];
              };
              return definition.competencyCodes ?? [];
            }),
        ),
      ];

      return Result.ok({
        employeeId: employee.id,
        employeeNumber: employee.employeeNumber,
        displayName: employee.displayName,
        email: employee.email,
        moduleProgress: normalizeModuleProgress(
          moduleProgress.map((item) => ({
            moduleCode: item.module.moduleCode,
            status: item.status,
            percentComplete: item.percentComplete,
          })),
          parseCurriculumVersion(
            (
              await client.pedagogicalCourseRun.findFirst({
                where: { employeeId: studentId, status: { in: ["ACTIVE", "COMPLETED"] } },
                orderBy: [{ status: "asc" }, { runSequence: "desc" }],
              })
            )?.curriculumVersion,
          ),
        ),
        capstone: capstone
          ? {
              status: capstone.status,
              reviewStatus: capstone.reviewStatus,
              professorApproved: capstone.professorApproved,
              submittedAt: capstone.submittedAt?.toISOString() ?? null,
              lifecycleStatus: capstone.lifecycleStatus,
            }
          : null,
        missions: missionAttempts.map((attempt) => ({
          missionKey: attempt.missionDefinition.missionKey,
          missionCode: attempt.missionDefinition.missionCode,
          title: attempt.missionDefinition.title,
          status: attempt.status,
          scorePercent: attempt.scorePercent,
          attemptNumber: attempt.attemptNumber,
          needsReview: attempt.status === "needs_review",
        })),
        assessments: assessmentAttempts.map((attempt) => {
          const feedback = attempt.feedbackJson as {
            feedbackDetails?: {
              missionBreakdown?: Array<{
                mission: string;
                earned: number;
                max: number;
                percent: number;
              }>;
              revisionAreas?: string[];
              strengths?: string[];
            };
          } | null;
          return {
            code: attempt.assessment.code,
            title: attempt.assessment.title,
            status: attempt.status,
            scorePercent: attempt.scorePercent,
            attemptNumber: attempt.attemptNumber,
            startedAt: attempt.startedAt.toISOString(),
            submittedAt: attempt.submittedAt?.toISOString() ?? null,
            pedagogicalCourseRunId: attempt.pedagogicalCourseRunId,
            curriculumVersion: attempt.assessment.definitionJson
              ? ((attempt.assessment.definitionJson as { curriculumVersion?: string })
                  .curriculumVersion ?? null)
              : null,
            missionBreakdown: feedback?.feedbackDetails?.missionBreakdown ?? null,
            strengths: feedback?.feedbackDetails?.strengths ?? null,
            revisionAreas: feedback?.feedbackDetails?.revisionAreas ?? null,
          };
        }),
        pendingManualReviews: pendingReviews
          .filter((attempt) => attempt.status === "needs_review")
          .map((attempt) => ({
            missionKey: attempt.missionDefinition.missionKey,
            attemptNumber: attempt.attemptNumber,
          })),
        certificates: certificates.map((certificate) => ({
          certificateNumber: certificate.certificateNumber,
          certificateType: certificate.certificateType,
          status: certificate.status,
          verificationStatus: certificate.verificationStatus,
          issuedAt: certificate.issuedAt.toISOString(),
          revokedAt: certificate.revokedAt?.toISOString() ?? null,
          revokeReason: certificate.revokeReason,
        })),
        competencySummary: competencyCodes,
      });
    },

    async listCertificates(professorId: string) {
      const students = await this.listStudents(professorId);
      const studentIds = students.map((student) => student.employeeId);
      const certificates = await client.certificate.findMany({
        where: { employeeId: { in: studentIds } },
        include: { employee: true },
        orderBy: { issuedAt: "desc" },
      });
      return certificates.map((certificate) => ({
        certificateNumber: certificate.certificateNumber,
        certificateType: certificate.certificateType,
        studentName: certificate.employee.displayName,
        employeeId: certificate.employeeId,
        status: certificate.status,
        verificationStatus: certificate.verificationStatus,
        issuedAt: certificate.issuedAt.toISOString(),
        revokedAt: certificate.revokedAt?.toISOString() ?? null,
        revokeReason: certificate.revokeReason,
      }));
    },

    async listAuditEvents(professorId: string) {
      const professor = await client.employee.findUnique({ where: { id: professorId } });
      if (!professor) {
        return [];
      }
      const events = await client.auditEvent.findMany({
        where: {
          companyId: professor.companyId,
          OR: [
            { actorEmployeeId: professorId },
            { action: { startsWith: "professor." } },
            { action: { startsWith: "certificate." } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { actor: true },
      });
      return events.map((event) => ({
        id: event.id,
        action: event.action,
        resourceType: event.resourceType,
        resourceKey: event.resourceKey,
        reason: event.reason,
        actorName: event.actor.displayName,
        createdAt: event.createdAt.toISOString(),
      }));
    },

    async revokeCertificate(
      professorId: string,
      certificateNumber: string,
      reason: string,
    ): Promise<ResultType<{ ok: true }>> {
      const certificate = await client.certificate.findUnique({
        where: { certificateNumber },
      });
      if (!certificate) {
        return Result.fail(DomainError.notFound("Certificat introuvable."));
      }
      const allowed = await assertProfessorCohortAccess(professorId, certificate.employeeId);
      if (!allowed) {
        return Result.fail(DomainError.forbidden("Certificat hors cohorte assignee."));
      }
      return assessments.revokeCertificate(professorId, certificateNumber, reason);
    },
  };
}

export type ProfessorService = ReturnType<typeof createProfessorService>;
