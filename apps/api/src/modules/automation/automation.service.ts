import { DomainError, Result, type ResultType } from "@tec-platform/core";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";

import {
  buildAutomationResult,
  isPredefinedAutomationRule,
  PREDEFINED_AUTOMATION_RULES,
} from "./automation.rules.js";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export function createAutomationService(client = getPrismaClient()) {
  return {
    listPredefinedRules() {
      return PREDEFINED_AUTOMATION_RULES.map((key) => ({ key }));
    },

    async execute(
      actorEmployeeId: string,
      ruleKey: string,
      context?: { companyId?: string; employeeId?: string },
    ): Promise<ResultType<Record<string, unknown>>> {
      if (!isPredefinedAutomationRule(ruleKey)) {
        return Result.fail(
          DomainError.validation("Seules les regles predefinies sont autorisees."),
        );
      }

      const rule = await client.automationRule.findUnique({ where: { key: ruleKey } });
      if (!rule || !rule.enabled) {
        return Result.fail(DomainError.conflict("Regle d automatisation indisponible."));
      }

      const result = buildAutomationResult(ruleKey);
      const execution = await client.automationExecution.create({
        data: {
          ruleId: rule.id,
          companyId: context?.companyId ?? null,
          employeeId: context?.employeeId ?? actorEmployeeId,
          status: "completed",
          resultJson: toInputJson(result),
        },
      });

      return Result.ok({
        executionId: execution.id,
        ruleKey,
        status: execution.status,
        result,
      });
    },

    async listExecutions(ruleKey?: string) {
      const rule = ruleKey
        ? await client.automationRule.findUnique({ where: { key: ruleKey } })
        : null;
      const executions = await client.automationExecution.findMany({
        where: rule ? { ruleId: rule.id } : undefined,
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { rule: true },
      });
      return executions.map((execution) => ({
        id: execution.id,
        ruleKey: execution.rule.key,
        status: execution.status,
        createdAt: execution.createdAt.toISOString(),
        result: execution.resultJson,
      }));
    },
  };
}

export type AutomationService = ReturnType<typeof createAutomationService>;
