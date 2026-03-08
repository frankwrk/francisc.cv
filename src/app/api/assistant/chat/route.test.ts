import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/ai/ask-portfolio-assistant", () => ({
  askPortfolioAssistant: vi.fn(),
}));

vi.mock("@/lib/telemetry/logger", () => ({
  logAssistantInfo: vi.fn(),
  logAssistantError: vi.fn(),
}));

import { POST } from "@/app/api/assistant/chat/route";
import { askPortfolioAssistant } from "@/lib/ai/ask-portfolio-assistant";

describe("POST /api/assistant/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a structured assistant payload", async () => {
    vi.mocked(askPortfolioAssistant).mockResolvedValue({
      payload: {
        requestId: "resp_123",
        answer: "Direct answer",
        supportPoints: ["Point one"],
        caveat: null,
        suggestedQuestions: ["Follow-up"],
        citations: [
          {
            title: "Profile summary",
            canonicalUrl: "/profile.json",
            sourceType: "profile",
          },
        ],
        supportLevel: "grounded",
      },
      diagnostics: {
        context: {
          pathname: "/resume",
          routeType: "resume",
          title: "Resume",
        },
        resultCount: 2,
        citationCount: 1,
        topScore: 0.88,
        responseStatus: "completed",
        incompleteReason: null,
        parsedSuccessfully: true,
      },
    });

    const response = await POST(
      new Request("http://localhost/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "What roles fit best?" }],
          context: {
            pathname: "/resume",
            title: "Resume",
          },
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      requestId: "resp_123",
      answer: "Direct answer",
      supportLevel: "grounded",
    });
    expect(askPortfolioAssistant).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid payloads with a client error", async () => {
    const response = await POST(
      new Request("http://localhost/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [],
          context: { pathname: "/resume" },
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "assistant_unavailable",
    });
    expect(askPortfolioAssistant).not.toHaveBeenCalled();
  });
});
