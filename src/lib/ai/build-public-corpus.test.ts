import { describe, expect, it } from "vitest";
import { buildPublicCorpus } from "@/lib/ai/build-public-corpus";

describe("buildPublicCorpus", () => {
  it("normalizes public sources into stable assistant documents", async () => {
    const corpus = await buildPublicCorpus();
    const aboutPage = corpus.documents.find((document) => document.id === "page:about");
    const faqDoc = corpus.documents.find(
      (document) => document.id === "faq:faq",
    );

    expect(corpus.documents.length).toBeGreaterThan(8);
    expect(aboutPage?.canonicalUrl).toBe("/about");
    expect(aboutPage?.content.includes("<ContactForm")).toBe(false);
    expect(faqDoc?.canonicalUrl).toBe("/about");
  });
});
