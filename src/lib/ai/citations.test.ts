import { describe, expect, it } from "vitest";
import type { ParsedResponse } from "openai/resources/responses/responses";
import { extractCitationState } from "@/lib/ai/citations";
import type { AssistantVectorStoreManifest } from "@/lib/ai/types";

describe("extractCitationState", () => {
  it("maps file search and annotation citations back to public sources", () => {
    const manifest: AssistantVectorStoreManifest = {
      generatedAt: "2026-03-08T00:00:00.000Z",
      vectorStoreId: "vs_test",
      files: [
        {
          id: "project:docs-as-product-playbook",
          title: "Docs as product playbook",
          sourceType: "project",
          canonicalUrl: "/work/docs-as-product-playbook",
          filename: "project.md",
          fileId: "file_project",
          attributes: {},
        },
        {
          id: "profile:summary",
          title: "Profile summary",
          sourceType: "profile",
          canonicalUrl: "/profile.json",
          filename: "profile.md",
          fileId: "file_profile",
          attributes: {},
        },
      ],
    };

    const response = {
      output: [
        {
          type: "file_search_call",
          results: [
            {
              file_id: "file_profile",
              filename: "profile.md",
              score: 0.81,
            },
            {
              file_id: "file_profile",
              filename: "profile.md",
              score: 0.7,
            },
          ],
        },
        {
          type: "message",
          content: [
            {
              type: "output_text",
              annotations: [
                {
                  type: "file_citation",
                  file_id: "file_project",
                  filename: "project.md",
                },
              ],
            },
          ],
        },
      ],
    } as ParsedResponse<unknown>;

    const citationState = extractCitationState(response, manifest);

    expect(citationState.resultCount).toBe(2);
    expect(citationState.topScore).toBe(0.81);
    expect(citationState.citations).toEqual([
      {
        title: "Profile summary",
        canonicalUrl: "/profile.json",
        sourceType: "profile",
      },
      {
        title: "Docs as product playbook",
        canonicalUrl: "/work/docs-as-product-playbook",
        sourceType: "project",
      },
    ]);
  });
});
