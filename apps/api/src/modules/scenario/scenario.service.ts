import { DomainError, Result, type ResultType } from "@tec-platform/core";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";
import { getMissionByKey, MissionDefinitionDocumentSchema } from "@tec-platform/mission-catalog";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export function validateMissionDraftJson(missionKey: string, draftJson: unknown): DomainError | null {
  const catalog = getMissionByKey(missionKey);
  if (!catalog) {
    return DomainError.validation("Mission inconnue dans le catalogue.");
  }
  const merged = {
    ...catalog,
    ...(typeof draftJson === "object" && draftJson !== null ? draftJson : {}),
  };
  const parsed = MissionDefinitionDocumentSchema.safeParse(merged);
  if (!parsed.success) {
    return DomainError.validation("Brouillon incompatible avec le schema mission catalog.");
  }
  return null;
}

export function createScenarioService(client = getPrismaClient()) {
  return {
    async listDrafts() {
      const drafts = await client.missionDraft.findMany({
        orderBy: { updatedAt: "desc" },
        include: { author: true },
      });
      return drafts.map((draft) => ({
        id: draft.id,
        missionKey: draft.missionKey,
        status: draft.status,
        authorName: draft.author.displayName,
        updatedAt: draft.updatedAt.toISOString(),
      }));
    },

    async createDraft(
      authorEmployeeId: string,
      missionKey: string,
      draftJson: Record<string, unknown>,
    ): Promise<ResultType<{ id: string }>> {
      const validationError = validateMissionDraftJson(missionKey, draftJson);
      if (validationError) {
        return Result.fail(validationError);
      }
      const draft = await client.missionDraft.create({
        data: {
          missionKey,
          authorEmployeeId,
          draftJson: toInputJson(draftJson),
        },
      });
      return Result.ok({ id: draft.id });
    },

    async updateDraft(
      draftId: string,
      draftJson: Record<string, unknown>,
    ): Promise<ResultType<{ id: string }>> {
      const existing = await client.missionDraft.findUnique({ where: { id: draftId } });
      if (!existing) {
        return Result.fail(DomainError.notFound("Brouillon introuvable."));
      }
      if (existing.status !== "draft") {
        return Result.fail(DomainError.conflict("Seuls les brouillons modifiables peuvent etre mis a jour."));
      }
      const validationError = validateMissionDraftJson(existing.missionKey, draftJson);
      if (validationError) {
        return Result.fail(validationError);
      }
      const updated = await client.missionDraft.update({
        where: { id: draftId },
        data: { draftJson: toInputJson(draftJson) },
      });
      return Result.ok({ id: updated.id });
    },

    async publish(
      actorEmployeeId: string,
      draftId: string,
    ): Promise<ResultType<{ versionId: string; versionNumber: number }>> {
      const draft = await client.missionDraft.findUnique({ where: { id: draftId } });
      if (!draft) {
        return Result.fail(DomainError.notFound("Brouillon introuvable."));
      }
      const validationError = validateMissionDraftJson(draft.missionKey, draft.draftJson);
      if (validationError) {
        return Result.fail(validationError);
      }

      const latest = await client.missionVersion.findFirst({
        where: { missionKey: draft.missionKey },
        orderBy: { versionNumber: "desc" },
      });
      const versionNumber = (latest?.versionNumber ?? 0) + 1;
      const now = new Date();

      const version = await client.missionVersion.create({
        data: {
          draftId: draft.id,
          missionKey: draft.missionKey,
          versionNumber,
          definitionJson: draft.draftJson as Prisma.InputJsonValue,
          publishedAt: now,
          publishedByEmployeeId: actorEmployeeId,
          status: "published",
        },
      });

      await client.scenarioPublication.create({
        data: {
          missionVersionId: version.id,
          action: "publish",
          actorEmployeeId,
          reason: "Publication admin",
        },
      });

      await client.missionDraft.update({
        where: { id: draft.id },
        data: { status: "published" },
      });

      return Result.ok({ versionId: version.id, versionNumber });
    },

    async rollback(actorEmployeeId: string, missionKey: string, versionNumber: number) {
      const version = await client.missionVersion.findUnique({
        where: { missionKey_versionNumber: { missionKey, versionNumber } },
      });
      if (!version) {
        return Result.fail(DomainError.notFound("Version introuvable."));
      }
      await client.missionVersion.update({
        where: { id: version.id },
        data: { status: "published" },
      });
      await client.scenarioPublication.create({
        data: {
          missionVersionId: version.id,
          action: "rollback",
          actorEmployeeId,
          reason: `Rollback vers v${versionNumber}`,
        },
      });
      return Result.ok({ ok: true as const });
    },

    async archive(actorEmployeeId: string, versionId: string) {
      const version = await client.missionVersion.findUnique({ where: { id: versionId } });
      if (!version) {
        return Result.fail(DomainError.notFound("Version introuvable."));
      }
      await client.missionVersion.update({
        where: { id: versionId },
        data: { status: "archived" },
      });
      await client.scenarioPublication.create({
        data: {
          missionVersionId: versionId,
          action: "archive",
          actorEmployeeId,
        },
      });
      return Result.ok({ ok: true as const });
    },

    async preview(draftId: string) {
      const draft = await client.missionDraft.findUnique({ where: { id: draftId } });
      if (!draft) {
        return Result.fail(DomainError.notFound("Brouillon introuvable."));
      }
      const catalog = getMissionByKey(draft.missionKey);
      return Result.ok({
        missionKey: draft.missionKey,
        catalogTitle: catalog?.title ?? draft.missionKey,
        draftJson: draft.draftJson,
      });
    },

    isVersionImmutable(version: { status: string }): boolean {
      return version.status === "published" || version.status === "archived";
    },
  };
}

export type ScenarioService = ReturnType<typeof createScenarioService>;
