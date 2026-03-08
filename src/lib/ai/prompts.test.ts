import { describe, expect, it } from "vitest";
import { buildPortfolioInstructions } from "@/lib/ai/prompts";

describe("buildPortfolioInstructions", () => {
  it("instructs the assistant to answer in first person", () => {
    const instructions = buildPortfolioInstructions({
      pathname: "/about",
      routeType: "about",
      title: "About",
    });

    expect(instructions).toContain(
      "Answer in first person singular, as if Francisc is responding directly.",
    );
    expect(instructions).toContain(
      "Do not refer to Francisc in the third person unless you are naming a page title, project title, or quoted source text.",
    );
    expect(instructions).toContain(
      "You are not free-styling a persona. Even in first person, stay strictly grounded in the retrieved public material.",
    );
    expect(instructions).toContain(
      "Write like a thoughtful professional answering directly in conversation, not like a branded assistant or formal summary generator.",
    );
    expect(instructions).toContain(
      "Default to 90-140 words unless the question clearly requires more.",
    );
    expect(instructions).toContain(
      "If you include a continuation, keep it light and optional rather than sounding scripted. Do not force your own CTA; the product may append a short follow-up separately.",
    );
  });
});
