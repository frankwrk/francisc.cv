import { describe, expect, it } from "vitest";
import { GET } from "@/app/profile.json/route";

describe("GET /profile.json", () => {
  it("returns 200 with JSON profile summary", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      name: expect.any(String),
      role: expect.any(String),
      focus: expect.any(Array),
      projects: expect.any(Array),
      location: expect.any(String),
    });
    expect(body.name).toBe("Francisc Furdui");
    expect(Array.isArray(body.focus)).toBe(true);
  });

  it("sets Cache-Control header", () => {
    const response = GET();
    const cacheControl = response.headers.get("Cache-Control");
    expect(cacheControl).toBe("public, max-age=0, s-maxage=3600");
  });
});
