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

    expect(prompts).toHaveLength(3);
    expect(prompts[0]).toContain("TPM role");
  });
});
