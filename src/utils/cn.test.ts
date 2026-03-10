import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("merges class names from multiple inputs", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(cn("a", false, "b", null, undefined, 0, "c")).toBe("a b c");
  });

  it("merges tailwind classes and resolves conflicts (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles conditional objects", () => {
    expect(cn({ "font-bold": true, "opacity-0": false })).toBe("font-bold");
  });

  it("handles arrays and mixed inputs", () => {
    expect(cn(["a", "b"], "c", { d: true })).toBe("a b c d");
  });

  it("returns empty string for no valid input", () => {
    expect(cn()).toBe("");
    expect(cn("", false, null)).toBe("");
  });
});
