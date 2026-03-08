import { describe, expect, it } from "vitest";
import { parseAssistantModelAnswer } from "@/lib/ai/ask-portfolio-assistant";

describe("parseAssistantModelAnswer", () => {
  it("parses valid structured JSON output", () => {
    const parsed = parseAssistantModelAnswer(
      JSON.stringify({
        answer: "Grounded answer",
        supportPoints: ["Point one"],
        caveat: null,
        suggestedQuestions: ["Follow-up question"],
        supportLevel: "grounded",
      }),
    );

    expect(parsed).toMatchObject({
      answer: "Grounded answer",
      supportLevel: "grounded",
    });
  });

  it("returns null for truncated JSON output", () => {
    const parsed = parseAssistantModelAnswer(
      '{"answer":"Cut off answer","supportPoints":["One"],',
    );

    expect(parsed).toBeNull();
  });
});
