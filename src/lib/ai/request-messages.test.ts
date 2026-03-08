import { describe, expect, it } from "vitest";
import {
  buildAssistantRequestMessages,
  type AssistantInteractionSource,
} from "@/lib/ai/request-messages";

function buildMessages() {
  return [
    { role: "user" as const, content: "What kind of roles is Francisc aiming for?" },
    {
      role: "assistant" as const,
      response: { answer: "He is strongest in TPM-style systems roles." },
    },
    { role: "user" as const, content: "How does his engineering background help?" },
    {
      role: "assistant" as const,
      response: { answer: "It helps him translate ambiguity into delivery artifacts." },
    },
    { role: "user" as const, content: "Which parts of that are most relevant to TPM?" },
  ];
}

function buildContinuationMessages() {
  return [
    { role: "user" as const, content: "Why am I a fit for platform-heavy roles?" },
    {
      role: "assistant" as const,
      response: {
        answer:
          "I fit platform-heavy roles because I combine systems-first thinking with delivery discipline.\n\nDo you want me to point to the projects or writing that support that?",
      },
    },
    { role: "user" as const, content: "Yes" },
  ];
}

function buildRequestMessages(source: AssistantInteractionSource) {
  return buildAssistantRequestMessages(buildMessages(), source);
}

describe("buildAssistantRequestMessages", () => {
  it("keeps prompt chip requests stateless", () => {
    expect(buildRequestMessages("prompt")).toEqual([
      {
        role: "user",
        content: "Which parts of that are most relevant to TPM?",
      },
    ]);
  });

  it("caps typed follow-ups to the most recent exchange", () => {
    expect(buildRequestMessages("typed")).toEqual([
      {
        role: "user",
        content: "How does his engineering background help?",
      },
      {
        role: "assistant",
        content: "It helps him translate ambiguity into delivery artifacts.",
      },
      {
        role: "user",
        content: "Which parts of that are most relevant to TPM?",
      },
    ]);
  });

  it("rewrites short affirmative follow-ups into explicit continuation requests", () => {
    expect(
      buildAssistantRequestMessages(buildContinuationMessages(), "typed"),
    ).toEqual([
      {
        role: "user",
        content: "Why am I a fit for platform-heavy roles?",
      },
      {
        role: "assistant",
        content:
          "I fit platform-heavy roles because I combine systems-first thinking with delivery discipline.\n\nDo you want me to point to the projects or writing that support that?",
      },
      {
        role: "user",
        content:
          'Yes. Continue with the follow-up I agreed to. The previous assistant follow-up question was: "Do you want me to point to the projects or writing that support that?"',
      },
    ]);
  });
});
