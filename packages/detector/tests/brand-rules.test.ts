import { describe, expect, it } from "vitest";
import fixtureRules from "../fixtures/brand-rules.json" with { type: "json" };
import { defaultBrandRules, findClaimedBrand, validateBrandRules, type BrandRule } from "../src/brand-rules.js";
import { domainMatchesAny } from "../src/domain-match.js";

describe("brand rules", () => {
  it("detects protected brand claims from display text", () => {
    const brand = findClaimedBrand("YouTube Account Recovery");

    expect(brand?.brandName).toBe("YouTube");
  });

  it("allows benign organization modifiers around the brand", () => {
    expect(findClaimedBrand("Apple ID Support")?.brandName).toBe("Apple");
    expect(findClaimedBrand("Microsoft 365 Security Alerts")?.brandName).toBe("Microsoft");
    expect(findClaimedBrand("Amazon.com")?.brandName).toBe("Amazon");
  });

  it("does not treat organizations that merely contain a brand word as brand claims", () => {
    expect(findClaimedBrand("Apple Federal Credit Union")).toBeNull();
    expect(findClaimedBrand("Apple Pie Recipes Weekly")).toBeNull();
    expect(findClaimedBrand("Google Developer Group SF")).toBeNull();
    expect(findClaimedBrand("Maria Garcia via DocuSign")).toBeNull();
  });

  it("validates the default brand rules", () => {
    expect(validateBrandRules(defaultBrandRules)).toEqual([]);
  });

  it("matches exact domains and trusted subdomains", () => {
    expect(domainMatchesAny("accounts.google.com", ["google.com"])).toBe(true);
    expect(domainMatchesAny("youtube.com", ["youtube.com"])).toBe(true);
  });

  it("does not match lookalike suffix domains", () => {
    expect(domainMatchesAny("youtube.com.attacker.example", ["youtube.com"])).toBe(false);
  });

  it("validates fixture rule data", () => {
    expect(validateBrandRules(fixtureRules as BrandRule[])).toEqual([]);
  });

  it("rejects invalid rule entries before runtime", () => {
    const issues = validateBrandRules([
      { id: "bad", brandName: "Bad", displayNames: [], trustedDomains: ["bad..example"] }
    ]);

    expect(issues).toEqual([
      "rule_missing_display_names:bad",
      "invalid_domain:bad:bad..example"
    ]);
  });
});
