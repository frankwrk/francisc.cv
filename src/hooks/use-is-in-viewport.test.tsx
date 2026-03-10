/**
 * @vitest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useIsInViewport } from "./use-is-in-viewport";

describe("useIsInViewport", () => {
  it("returns ref and isInView", () => {
    const { result } = renderHook(() => useIsInViewport());
    expect(result.current.ref).toBeDefined();
    expect(result.current.isInView).toBeDefined();
  });

  it("initializes isInView to true when IntersectionObserver is unavailable", () => {
    const { result } = renderHook(() => useIsInViewport());
    expect(result.current.isInView).toBe(true);
  });
});
