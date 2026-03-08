import { describe, expect, it } from "vitest";
import { parseAssistantResponse } from "@/lib/ai/assistant-http";

describe("parseAssistantResponse", () => {
  it("parses valid JSON assistant responses", async () => {
    const response = new Response(
      JSON.stringify({
        requestId: "req_123",
        answer: "Grounded answer",
        supportPoints: [],
        caveat: null,
        suggestedQuestions: ["What else should I ask?"],
        citations: [],
        supportLevel: "grounded",
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      },
    );

    await expect(parseAssistantResponse(response)).resolves.toMatchObject({
      requestId: "req_123",
      supportLevel: "grounded",
    });
  });

  it("maps plain-text Vercel timeouts to a useful user message", async () => {
    const response = new Response(
      "An error occurred with your deployment\n\nFUNCTION_INVOCATION_TIMEOUT",
      {
        status: 504,
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      },
    );

    await expect(parseAssistantResponse(response)).rejects.toThrow(
      "The assistant timed out before the answer completed. Please try again.",
    );
  });
});
