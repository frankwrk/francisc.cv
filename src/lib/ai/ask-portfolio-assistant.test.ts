import { describe, expect, it } from "vitest";
import {
  appendFollowUpQuestion,
  buildFallbackAnswer,
  buildFallbackCaveat,
  buildFollowUpQuestion,
  extractFallbackSubject,
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

describe("buildFallbackCaveat", () => {
  it("uses app-controlled wording for partial support", () => {
    expect(
      buildFallbackCaveat(
        "partial",
        "If you can upload a file, I can summarize it.",
      ),
    ).toBe(
      "Some of this answer is cautious synthesis from the public material rather than a direct statement.",
    );
  });

  it("uses app-controlled wording for insufficient support", () => {
    expect(
      buildFallbackCaveat(
        "insufficient",
        "Point me to the specific link and I can extract details.",
      ),
    ).toBe(
      "I could not find enough support for that in the public material on this site.",
    );
  });

  it("omits caveats for grounded answers", () => {
    expect(
      buildFallbackCaveat("grounded", "This should not be preserved."),
    ).toBeNull();
  });
});

describe("extractFallbackSubject", () => {
  it("extracts a quoted subject from the latest user message", () => {
    expect(
      extractFallbackSubject('Tell me about "Stargate" and what Francisc did on it.'),
    ).toBe('"Stargate"');
  });

  it("extracts a called subject when no quoted label is present", () => {
    expect(
      extractFallbackSubject("Do you know a project called Stargate Alpha?"),
    ).toBe('"Stargate Alpha"');
  });

  it("returns null when there is no reliable subject hint", () => {
    expect(
      extractFallbackSubject("What projects is Francisc working on right now?"),
    ).toBeNull();
  });
});

describe("buildFallbackAnswer", () => {
  it("uses subject-aware wording for insufficient support when possible", () => {
    expect(
      buildFallbackAnswer(
        "insufficient",
        'Tell me about "Stargate" and what Francisc did on it.',
      ),
    ).toBe(
      `I couldn't find "Stargate" in the public material on this site.`,
    );
  });

  it("uses generic wording when there is no reliable subject hint", () => {
    expect(
      buildFallbackAnswer(
        "insufficient",
        "What projects is Francisc working on right now?",
      ),
    ).toBe(
      "I couldn't find enough support for that in the public material on this site.",
    );
  });

  it("uses narrower wording for partial support", () => {
    expect(
      buildFallbackAnswer(
        "partial",
        'Can you summarize "Stargate" from the site?',
      ),
    ).toBe(
      'I found related material, but not enough to answer "Stargate" directly from the public material on this site.',
    );
  });
});

describe("buildFollowUpQuestion", () => {
  it("returns a role-fit follow-up for resume context", () => {
    expect(
      buildFollowUpQuestion(
        { pathname: "/resume", routeType: "resume", title: "Resume" },
        "grounded",
      ),
    ).toBe("Do you want me to connect that more directly to role fit?");
  });

  it("returns no follow-up when support is insufficient", () => {
    expect(
      buildFollowUpQuestion(
        { pathname: "/about", routeType: "about", title: "About" },
        "insufficient",
      ),
    ).toBeNull();
  });
});

describe("appendFollowUpQuestion", () => {
  it("appends a short follow-up question for grounded answers", () => {
    expect(
      appendFollowUpQuestion(
        "I focus on systems-heavy product and delivery work.",
        { pathname: "/about", routeType: "about", title: "About" },
        "grounded",
      ),
    ).toBe(
      "I focus on systems-heavy product and delivery work.\n\nDo you want me to point to the projects or writing that support that?",
    );
  });

  it("does not append a follow-up for insufficient answers", () => {
    expect(
      appendFollowUpQuestion(
        "I couldn't find enough support for that in the public material on this site.",
        { pathname: "/about", routeType: "about", title: "About" },
        "insufficient",
      ),
    ).toBe(
      "I couldn't find enough support for that in the public material on this site.",
    );
  });
});
