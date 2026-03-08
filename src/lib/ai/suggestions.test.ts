import { describe, expect, it } from "vitest";
import {
  getSuggestedQuestions,
  resolveAssistantRouteContext,
} from "@/lib/ai/suggestions";

describe("assistant route context", () => {
  it("maps work detail routes with slug context", () => {
    expect(resolveAssistantRouteContext("/work/docs-as-product-playbook")).toEqual({
      pathname: "/work/docs-as-product-playbook",
      routeType: "work-detail",
      slug: "docs-as-product-playbook",
      title: undefined,
    });
  });

  it("returns route-specific suggested questions", () => {
    const prompts = getSuggestedQuestions(
      resolveAssistantRouteContext("/resume", "Resume"),
    );

    expect(prompts).toHaveLength(5);
    expect(prompts).toEqual([
      "How do I approach my work?",
      "What evidence supports my positioning?",
      "Why am I a fit for platform-heavy roles?",
      "What kind of roles am I aiming for?",
      "Which projects best reflect how I think?",
    ]);
  });
});
