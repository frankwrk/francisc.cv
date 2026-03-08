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
});
