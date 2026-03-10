import { describe, expect, it } from "vitest";
import {
  AssistantChatRequestSchema,
  AssistantModelAnswerSchema,
  AssistantSupportLevelSchema,
} from "./schema";

describe("AssistantChatRequestSchema", () => {
  it("parses valid request with messages and context", () => {
    const valid = {
      messages: [{ role: "user", content: "Hello" }],
      context: { pathname: "/work" },
    };
    expect(AssistantChatRequestSchema.parse(valid)).toEqual(valid);
  });

  it("rejects empty messages", () => {
    expect(() =>
      AssistantChatRequestSchema.parse({
        messages: [],
        context: { pathname: "/work" },
      }),
    ).toThrow();
  });

  it("rejects invalid pathname", () => {
    expect(() =>
      AssistantChatRequestSchema.parse({
        messages: [{ role: "user", content: "Hi" }],
        context: { pathname: "" },
      }),
    ).toThrow();
  });
});

describe("AssistantModelAnswerSchema", () => {
  it("parses valid answer with supportLevel", () => {
    const valid = {
      answer: "Here is the answer.",
      caveat: null,
      supportLevel: "grounded" as const,
    };
    expect(AssistantModelAnswerSchema.parse(valid)).toEqual(valid);
  });

  it("accepts partial and insufficient support levels", () => {
    expect(
      AssistantModelAnswerSchema.parse({
        answer: "A",
        caveat: null,
        supportLevel: "partial",
      }).supportLevel,
    ).toBe("partial");
    expect(
      AssistantModelAnswerSchema.parse({
        answer: "A",
        caveat: null,
        supportLevel: "insufficient",
      }).supportLevel,
    ).toBe("insufficient");
  });

  it("rejects invalid supportLevel", () => {
    expect(() =>
      AssistantModelAnswerSchema.parse({
        answer: "A",
        caveat: null,
        supportLevel: "invalid",
      }),
    ).toThrow();
  });
});

describe("AssistantSupportLevelSchema", () => {
  it("accepts grounded, partial, insufficient", () => {
    expect(AssistantSupportLevelSchema.parse("grounded")).toBe("grounded");
    expect(AssistantSupportLevelSchema.parse("partial")).toBe("partial");
    expect(AssistantSupportLevelSchema.parse("insufficient")).toBe(
      "insufficient",
    );
  });

  it("rejects other strings", () => {
    expect(() => AssistantSupportLevelSchema.parse("other")).toThrow();
  });
});
