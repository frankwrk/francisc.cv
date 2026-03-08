import { AssistantChatRequestSchema } from "@/lib/ai/schema";
import { askPortfolioAssistant } from "@/lib/ai/ask-portfolio-assistant";
import { logAssistantError, logAssistantInfo } from "@/lib/telemetry/logger";
import { createId } from "@/utils/create-id";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const json = await request.json();
    const payload = AssistantChatRequestSchema.parse(json);
    const result = await askPortfolioAssistant(payload);

    logAssistantInfo("assistant_answered", {
      requestId: result.payload.requestId,
      pathname: payload.context.pathname,
      latencyMs: Date.now() - startedAt,
      tool: "file_search",
      citationCount: result.diagnostics.citationCount,
      resultCount: result.diagnostics.resultCount,
      supportLevel: result.payload.supportLevel,
      model: process.env.OPENAI_RESPONSES_MODEL ?? "gpt-5-mini",
      responseStatus: result.diagnostics.responseStatus,
      incompleteReason: result.diagnostics.incompleteReason,
      parsedSuccessfully: result.diagnostics.parsedSuccessfully,
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
