/**
 * @vitest-environment jsdom
 */
import { render, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTabObserver } from "./use-tab-observer";

// jsdom does not provide ResizeObserver
beforeEach(() => {
  if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class ResizeObserver {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
    };
  }
});
afterEach(() => {
  vi.restoreAllMocks();
});

function TabListWithHook({
  onActiveTabChange,
}: {
  onActiveTabChange?: (index: number, element: HTMLElement) => void;
}) {
  const { listRef } = useTabObserver({ onActiveTabChange });
  return (
    <div ref={listRef}>
      <div role="tab" data-state="inactive">
        A
      </div>
      <div role="tab" data-state="active">
        B
      </div>
    </div>
  );
}

describe("useTabObserver", () => {
  it("returns listRef", () => {
    const { result } = renderHook(() => useTabObserver());
    expect(result.current.listRef).toBeDefined();
    expect(result.current.listRef.current).toBe(null);
  });

  it("invokes onActiveTabChange when list has active tab", async () => {
    const onActiveTabChange = vi.fn();
    render(<TabListWithHook onActiveTabChange={onActiveTabChange} />);
    await waitFor(() => {
      expect(onActiveTabChange).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ getAttribute: expect.any(Function) }),
      );
    });
    const [index, el] = onActiveTabChange.mock.calls[0];
    expect(index).toBe(1);
    expect((el as HTMLElement).getAttribute("data-state")).toBe("active");
  });
});
