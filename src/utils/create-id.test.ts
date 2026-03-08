import { describe, expect, it, vi } from "vitest";
import { createId } from "@/utils/create-id";

describe("createId", () => {
  it("returns a usable id when randomUUID is unavailable", () => {
    const originalCrypto = globalThis.crypto;

    vi.stubGlobal("crypto", {
      getRandomValues(buffer: Uint32Array) {
        buffer.set([1, 2, 3, 4]);
        return buffer;
      },
    });

    const id = createId();

    expect(id).toContain("-");
    expect(id.length).toBeGreaterThan(10);

    vi.stubGlobal("crypto", originalCrypto);
  });
});
