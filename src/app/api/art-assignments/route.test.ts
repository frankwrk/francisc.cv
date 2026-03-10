import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/art-assignments/route";

describe("GET /api/art-assignments", () => {
  it("returns 404 with JSON body", async () => {
    const response = await GET();
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body).toMatchObject({
      error: "not_implemented",
      message: expect.stringContaining("not exposed"),
    });
  });
});
