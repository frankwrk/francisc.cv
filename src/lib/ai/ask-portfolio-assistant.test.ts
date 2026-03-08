import { describe, expect, it } from "vitest";
import {
  getResponsesReasoning,
  parseAssistantModelAnswer,
} from "@/lib/ai/ask-portfolio-assistant";

describe("parseAssistantModelAnswer", () => {
  it("parses valid structured JSON output", () => {
    const parsed = parseAssistantModelAnswer(
      JSON.stringify({
        answer: "Grounded answer",
        caveat: null,
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
      '{"answer":"Cut off answer","caveat":null,',
    );

    expect(parsed).toBeNull();
  });
});

describe("getResponsesReasoning", () => {
  it("uses low reasoning for gpt-5 models", () => {
    expect(getResponsesReasoning("gpt-5-mini")).toEqual({
      effort: "low",
    });
  });

  it("leaves reasoning unset for non-gpt-5 models", () => {
    expect(getResponsesReasoning("gpt-4.1-mini")).toBeUndefined();
  });
});
