import type { AssistantChatResponse } from "@/lib/ai/schema";

type AssistantErrorPayload = {
  message?: string;
};

function isJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("application/json");
}

function buildNonJsonResponseError(response: Response, rawText: string) {
  const body = rawText.trim();

  if (
    response.status === 504 ||
    body.includes("FUNCTION_INVOCATION_TIMEOUT")
  ) {
    return new Error(
      "The assistant timed out before the answer completed. Please try again.",
    );
  }

  if (!response.ok) {
    return new Error(
      body && body.length < 240
        ? body
        : "The assistant could not answer right now.",
    );
  }

  return new Error("The assistant returned an invalid response.");
}

export async function parseAssistantResponse(response: Response) {
  const rawText = await response.text();

  if (!rawText) {
    throw new Error(
      response.ok
        ? "The assistant returned an empty response."
        : "The assistant could not answer right now.",
    );
  }

  if (!isJsonResponse(response)) {
    throw buildNonJsonResponseError(response, rawText);
  }

  try {
    return JSON.parse(rawText) as AssistantChatResponse | AssistantErrorPayload;
  } catch {
    throw new Error("The assistant returned an invalid response.");
  }
}
