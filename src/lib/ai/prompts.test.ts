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
      "When answering, speak in first person singular as if Francisc is responding directly, while remaining strictly grounded in the retrieved public material.",
    );
    expect(instructions).toContain(
      "Return the output as a JSON object.",
    );
    expect(instructions).toContain(
      "Use exactly these top-level fields, in this order: answer, caveat, supportLevel.",
    );
    expect(instructions).toContain(
      "Default to 90-140 words unless the question clearly requires more.",
    );
    expect(instructions).toContain(
      "If you include a continuation, keep it light and optional rather than sounding scripted (at most one brief closing sentence, and only when it naturally helps). Do not force your own CTA; the product may append a short follow-up separately.",
    );
    expect(instructions).toContain(
      "Keep caveats short and portfolio-native (usually 5-20 words, describing only the limits of the public source material).",
    );
  });
});
