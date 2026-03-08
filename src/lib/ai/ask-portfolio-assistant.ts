import { zodTextFormat } from "openai/helpers/zod";
import type {
  ComparisonFilter,
  CompoundFilter,
} from "openai/resources/shared";
import { getAssistantVectorStoreId, getOpenAIClient, getResponsesModel } from "@/lib/ai/client";
import {
  AssistantChatResponseSchema,
  AssistantModelAnswerSchema,
  type AssistantChatRequest,
} from "@/lib/ai/schema";
import { extractCitationState } from "@/lib/ai/citations";
import { buildPortfolioInstructions } from "@/lib/ai/prompts";
import { readAssistantVectorStoreManifest } from "@/lib/ai/sources";
import {
  resolveAssistantRouteContext,
} from "@/lib/ai/suggestions";

function coerceSupportLevel(
  supportLevel: "grounded" | "partial" | "insufficient",
  citationCount: number,
  topScore: number,
) {
  if (citationCount === 0 || topScore < 0.25) {
    return "insufficient" as const;
  }

  if (citationCount === 1 || topScore < 0.5) {
    return supportLevel === "grounded" ? "partial" : supportLevel;
  }

  return supportLevel;
}

function buildFallbackCaveat(
  supportLevel: "grounded" | "partial" | "insufficient",
  currentCaveat: string | null,
) {
  if (currentCaveat) {
    return currentCaveat;
  }

  if (supportLevel === "partial") {
    return "This answer is supported by the current material, but some of it is synthesis rather than direct statement.";
  }

  if (supportLevel === "insufficient") {
    return "The current public material does not fully establish more than this.";
  }

  return null;
}

function buildFileSearchFilters(
  context: ReturnType<typeof resolveAssistantRouteContext>,
): ComparisonFilter | CompoundFilter | null {
  switch (context.routeType) {
    case "about":
      return {
        type: "or",
        filters: [
          { type: "eq", key: "slug", value: "about" },
          { type: "eq", key: "sourceType", value: "profile" },
          { type: "eq", key: "sourceType", value: "positioning" },
        ],
      };
    case "now":
      return {
        type: "or",
        filters: [
          { type: "eq", key: "slug", value: "now" },
          { type: "eq", key: "sourceType", value: "profile" },
          { type: "eq", key: "sourceType", value: "positioning" },
        ],
      };
    case "resume":
      return {
        type: "or",
        filters: [
          { type: "eq", key: "sourceType", value: "resume" },
          { type: "eq", key: "sourceType", value: "profile" },
          { type: "eq", key: "sourceType", value: "positioning" },
        ],
      };
    case "work-detail":
      if (!context.slug) {
        return null;
      }

      return {
        type: "or",
        filters: [
          { type: "eq", key: "slug", value: context.slug },
          { type: "eq", key: "sourceType", value: "profile" },
          { type: "eq", key: "sourceType", value: "positioning" },
        ],
      };
    case "thinking-detail":
      if (!context.slug) {
        return null;
      }

      return {
        type: "or",
        filters: [
          { type: "eq", key: "slug", value: context.slug },
          { type: "eq", key: "sourceType", value: "profile" },
          { type: "eq", key: "sourceType", value: "positioning" },
        ],
      };
    default:
      return null;
  }
}

export function parseAssistantModelAnswer(rawText: string) {
  try {
    return AssistantModelAnswerSchema.parse(JSON.parse(rawText));
  } catch {
    return null;
  }
}

export function getResponsesReasoning(model: string) {
  if (model.startsWith("gpt-5")) {
    return { effort: "low" as const };
  }

  return undefined;
}

export async function askPortfolioAssistant(
  request: AssistantChatRequest,
) {
  const context = resolveAssistantRouteContext(
    request.context.pathname,
    request.context.title,
  );
  const vectorStoreId = getAssistantVectorStoreId();

  if (!vectorStoreId) {
    throw new Error(
      "OPENAI_VECTOR_STORE_ID is not configured and no assistant manifest was found.",
    );
  }

  const client = getOpenAIClient();
  const model = getResponsesModel();
  const response = await client.responses.create({
    model,
    reasoning: getResponsesReasoning(model),
    instructions: buildPortfolioInstructions(context),
    input: request.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    include: ["file_search_call.results"],
    max_output_tokens: 800,
    store: false,
    tools: [
      {
        type: "file_search",
        vector_store_ids: [vectorStoreId],
        filters: buildFileSearchFilters(context),
        max_num_results: 4,
        ranking_options: {
          score_threshold: 0.22,
        },
      },
    ],
    text: {
      format: zodTextFormat(AssistantModelAnswerSchema, "portfolio_answer"),
      verbosity: "low",
    },
  });

  const manifest = readAssistantVectorStoreManifest();
  const citationState = extractCitationState(response, manifest);
  const parsed =
    response.status === "completed" && response.output_text
      ? parseAssistantModelAnswer(response.output_text)
      : null;
  const fallbackReason =
    response.status === "incomplete"
      ? response.incomplete_details?.reason === "max_output_tokens"
        ? "The assistant found relevant material, but the structured answer was cut off before it finished."
        : "The assistant found relevant material, but the response did not complete cleanly."
      : response.output_text
        ? "The model output did not match the expected response contract."
        : "The assistant could not produce a valid answer from the current material.";
  const normalized = parsed ?? {
    answer:
      citationState.citations.length > 0
        ? "I found relevant material, but I could not assemble a complete grounded answer from it."
        : "The assistant could not produce a valid answer from the current material.",
    caveat: fallbackReason,
    supportLevel: "insufficient" as const,
  };
  const supportLevel = coerceSupportLevel(
    normalized.supportLevel,
    citationState.citations.length,
    citationState.topScore,
  );

  const payload = AssistantChatResponseSchema.parse({
    requestId: response.id,
    answer: normalized.answer,
    caveat: buildFallbackCaveat(supportLevel, normalized.caveat),
    citations: citationState.citations,
    supportLevel,
  });

  return {
    payload,
    diagnostics: {
      context,
      resultCount: citationState.resultCount,
      citationCount: citationState.citations.length,
      topScore: citationState.topScore,
      responseStatus: response.status,
      incompleteReason: response.incomplete_details?.reason ?? null,
      parsedSuccessfully: parsed !== null,
      usage: response.usage
        ? {
            inputTokens: response.usage.input_tokens,
            cachedInputTokens: response.usage.input_tokens_details.cached_tokens,
            outputTokens: response.usage.output_tokens,
            reasoningTokens: response.usage.output_tokens_details.reasoning_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : null,
    },
  };
}
