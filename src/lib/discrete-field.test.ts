import { describe, expect, it } from "vitest";
import { getFieldConfig } from "./discrete-field";

describe("getFieldConfig", () => {
  it("returns config for known slug", () => {
    const config = getFieldConfig("geoformations-redesign");
    expect(config).not.toBeNull();
    expect(config?.slug).toBe("geoformations-redesign");
    expect(config?.hue).toBe(215);
    expect(config?.bias).toBe("none");
  });

  it("returns config with bias for slug that has bias", () => {
    const config = getFieldConfig("platform-onboarding-accelerator");
    expect(config).not.toBeNull();
    expect(config?.bias).toBe("drift-ltr");
  });

  it("returns null for unknown slug", () => {
    expect(getFieldConfig("unknown-slug")).toBeNull();
    expect(getFieldConfig("")).toBeNull();
  });
});
