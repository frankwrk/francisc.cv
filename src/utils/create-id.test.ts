import { describe, expect, it, vi } from "vitest";
import { createId } from "@/utils/create-id";

describe("createId", () => {
  it("returns a usable id when randomUUID is unavailable", () => {
    const originalCrypto = globalThis.crypto;

    Object.defineProperty(globalThis, "crypto", {
      value: {
        getRandomValues(buffer: Uint32Array) {
          buffer.set([1, 2, 3, 4]);
          return buffer;
        },
      },
      writable: true,
    });

    const id = createId();

    expect(id).toContain("-");
    expect(id.length).toBeGreaterThan(10);

    Object.defineProperty(globalThis, "crypto", {
      value: originalCrypto,
      writable: true,
    });
  });
});
