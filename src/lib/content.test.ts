import { describe, expect, it } from "vitest";
import { getArtAssignmentKey } from "./content";

describe("getArtAssignmentKey", () => {
  it("returns work:slug for type work", () => {
    expect(getArtAssignmentKey("work", "my-project")).toBe("work:my-project");
    expect(getArtAssignmentKey("work", "x")).toBe("work:x");
  });

  it("returns thinking:slug for type thinking", () => {
    expect(getArtAssignmentKey("thinking", "my-article")).toBe(
      "thinking:my-article",
    );
    expect(getArtAssignmentKey("thinking", "y")).toBe("thinking:y");
  });

  it("preserves slug exactly", () => {
    expect(getArtAssignmentKey("work", "slug-with-dashes")).toBe(
      "work:slug-with-dashes",
    );
    expect(getArtAssignmentKey("thinking", "2024-01-post")).toBe(
      "thinking:2024-01-post",
    );
  });
});
