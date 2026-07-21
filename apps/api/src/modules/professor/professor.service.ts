import { DomainError, Result, type ResultType } from "@tec-platform/core";
import type { ProfessorOverrideRequest } from "@tec-platform/contracts";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";
import { listAllMissions } from "@tec-platform/mission-catalog";

import { createAssessmentService } from "../assessment/assessment.service.js";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
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
      const memberships = await client.cohortMembership.findMany({
        where: { employeeId: professorId, roleInCohort: "professor" },
      });
      const cohortIds = memberships.map((membership) => membership.cohortId);
      const students = await client.cohortMembership.findMany({
        where: { cohortId: { in: cohortIds }, roleInCohort: "student" },
        include: { employee: true },
      });

      const result = [];
      for (const student of students) {
        const progress = await client.employeeModuleProgress.findMany({
          where: { employeeId: student.employeeId },
          include: { module: true },
        });
        const completedMissions = await client.missionAttempt.count({
          where: { employeeId: student.employeeId, status: "completed" },
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
        result.push({
          employeeId: student.employeeId,
          employeeNumber: student.employee.employeeNumber,
          displayName: student.employee.displayName,
          email: student.employee.email,
          completedMissions,
          moduleProgress: progress.map((item) => ({
            moduleCode: item.module.moduleCode,
            status: item.status,
            percentComplete: item.percentComplete,
          })),
          silverStatus,
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
        const known = listAllMissions().some((mission) => mission.missionKey === body.missionKey);
        if (!known) {
          return Result.fail(DomainError.notFound("Mission inconnue."));
        }
        await client.unlockState.upsert({
          where: {
            employeeId_resourceType_resourceKey: {
              employeeId: studentId,
              resourceType: "mission",
              resourceKey: body.missionKey,
            },
          },
          update: { unlockedAt: new Date() },
          create: {
            employeeId: studentId,
            resourceType: "mission",
            resourceKey: body.missionKey,
            unlockedAt: new Date(),
          },
        });
      }

      if (body.action === "reset_attempt" && body.missionKey) {
        const definition = await client.missionDefinition.findUnique({
          where: { missionKey: body.missionKey },
        });
        if (definition) {
          await client.missionAttempt.deleteMany({
            where: {
              employeeId: studentId,
              missionDefinitionId: definition.id,
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
      const header = "employeeNumber,displayName,email,completedMissions,silverStatus";
      const rows = students.map(
        (student) =>
          `${student.employeeNumber},${student.displayName},${student.email},${student.completedMissions},${student.silverStatus}`,
      );
      return [header, ...rows].join("\n");
    },
  };
}

export type ProfessorService = ReturnType<typeof createProfessorService>;
