import { AssistantChatRequestSchema } from "@/lib/ai/schema";
import { askPortfolioAssistant } from "@/lib/ai/ask-portfolio-assistant";
import { getAssistantContentLoggingEnabled } from "@/lib/ai/client";
import {
  buildLogPreview,
  logAssistantError,
  logAssistantInfo,
} from "@/lib/telemetry/logger";
import { createId } from "@/utils/create-id";

export const runtime = "nodejs";
export const maxDuration = 60;

type RateLimitEntry = {
  timestamps: number[];
};

const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor !== null && forwardedFor.trim().length > 0) {
    const firstIp = forwardedFor.split(",")[0];
    if (typeof firstIp === "string" && firstIp.trim().length > 0) {
      return firstIp.trim();
    }
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp !== null && cfConnectingIp.trim().length > 0) {
    return cfConnectingIp.trim();
  }

  return "anonymous";
}

function isRateLimited(identifier: string, now: number): boolean {
  const existing = rateLimitStore.get(identifier);
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  if (existing === undefined) {
    rateLimitStore.set(identifier, { timestamps: [now] });
    return false;
  }

  const recentTimestamps = existing.timestamps.filter(
    (timestamp) => timestamp >= windowStart,
  );

  if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    existing.timestamps = recentTimestamps;
    rateLimitStore.set(identifier, existing);
    return true;
  }

  recentTimestamps.push(now);
  existing.timestamps = recentTimestamps;
  rateLimitStore.set(identifier, existing);

  return false;
}

export async function POST(request: Request) {
  const startedAt = Date.now();

  const clientIdentifier = getClientIdentifier(request);
  if (isRateLimited(clientIdentifier, startedAt)) {
    const requestId = createId();

    logAssistantError("assistant_rate_limited", {
      requestId,
      latencyMs: 0,
      tool: "file_search",
      failureStage: "rate_limit",
      message: "Rate limit exceeded for assistant chat endpoint.",
      status: 429,
      clientIdentifier,
    });

    return Response.json(
      {
        requestId,
        error: "rate_limited",
        message:
          "You have sent too many requests to the assistant. Please wait a moment and try again.",
      },
      { status: 429 },
    );
  }

  try {
    const json = await request.json();
    const payload = AssistantChatRequestSchema.parse(json);
    const result = await askPortfolioAssistant(payload);
    const includeContentLogs = getAssistantContentLoggingEnabled();

    logAssistantInfo("assistant_answered", {
      requestId: result.payload.requestId,
      pathname: payload.context.pathname,
      latencyMs: Date.now() - startedAt,
      tool: "file_search",
      citationCount: result.diagnostics.citationCount,
      resultCount: result.diagnostics.resultCount,
      supportLevel: result.payload.supportLevel,
      model: process.env.OPENAI_RESPONSES_MODEL ?? "gpt-5-mini",
      interactionSource: payload.context.interactionSource ?? "typed",
      requestMessageCount: payload.messages.length,
      responseStatus: result.diagnostics.responseStatus,
      incompleteReason: result.diagnostics.incompleteReason,
      parsedSuccessfully: result.diagnostics.parsedSuccessfully,
      inputTokens: result.diagnostics.usage?.inputTokens ?? null,
      cachedInputTokens: result.diagnostics.usage?.cachedInputTokens ?? null,
      outputTokens: result.diagnostics.usage?.outputTokens ?? null,
      reasoningTokens: result.diagnostics.usage?.reasoningTokens ?? null,
      totalTokens: result.diagnostics.usage?.totalTokens ?? null,
      storedInOpenAI: result.diagnostics.storedInOpenAI,
      userQuestionPreview: includeContentLogs
        ? buildLogPreview(result.diagnostics.latestUserMessage, 220)
        : null,
      answerPreview: includeContentLogs
        ? buildLogPreview(result.payload.answer, 280)
        : null,
      caveatPreview: includeContentLogs
        ? buildLogPreview(result.payload.caveat, 180)
        : null,
      citationTitles: includeContentLogs
        ? result.payload.citations.map((citation) => citation.title)
        : null,
    });

    return Response.json(result.payload);
  } catch (error) {
    const requestId = createId();
    const message =
      error instanceof Error ? error.message : "The assistant request failed.";
    const failureStage =
      error instanceof Error && error.name === "ZodError" ? "validation" : "execution";
    const status =
      message.includes("OPENAI_") || message.includes("vector store")
        ? 503
        : 400;

    logAssistantError("assistant_failed", {
      requestId,
      latencyMs: Date.now() - startedAt,
      tool: "file_search",
      failureStage,
      message,
      status,
    });

    return Response.json(
      {
        requestId,
        error: "assistant_unavailable",
        message,
      },
      { status },
    );
  }
}
