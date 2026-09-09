import { describe, expect, it } from "vitest";
import { recommendArchitecture } from "../client/src/lib/architectureDecision";

describe("architecture decision guide", () => {
  it("recommends IdentityIQ when enterprise-governance choices lead", () => {
    const result = recommendArchitecture({
      "delivery-context": "iiq",
      "control-priority": "iiq",
      "modernization-path": "iiq",
    });

    expect(result.path).toBe("iiq");
    expect(result.catalogCategory).toBe("Advanced");
    expect(result.scores).toEqual({ iiq: 3, isc: 0, hybrid: 0 });
  });

  it("recommends Identity Security Cloud when cloud-service choices lead", () => {
    const result = recommendArchitecture({
      "delivery-context": "isc",
      "control-priority": "isc",
      "modernization-path": "isc",
    });

    expect(result.path).toBe("isc");
    expect(result.catalogCategory).toBe("Infrastructure");
  });

  it("uses a hybrid recommendation for mixed or tied evidence", () => {
    const result = recommendArchitecture({
      "delivery-context": "iiq",
      "control-priority": "isc",
      "modernization-path": "hybrid",
    });

    expect(result.path).toBe("hybrid");
    expect(result.catalogCategory).toBe("Governance");
    expect(result.scores).toEqual({ iiq: 1, isc: 1, hybrid: 1 });
  });
});
