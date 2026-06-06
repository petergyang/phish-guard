import { describe, expect, it } from "vitest";
import { parseEmailAddress } from "../src/email-address.js";

describe("parseEmailAddress", () => {
  it("parses quoted display names and mailbox domains", () => {
    const parsed = parseEmailAddress("\"YouTube Account Recovery\" <random-person@gmail.com>");

    expect(parsed.displayName).toBe("YouTube Account Recovery");
    expect(parsed.address).toBe("random-person@gmail.com");
    expect(parsed.domain).toBe("gmail.com");
    expect(parsed.issues).toEqual([]);
  });

  it("handles direct mailbox values without a display name", () => {
    const parsed = parseEmailAddress("alerts@accounts.google.com");

    expect(parsed.displayName).toBe("");
    expect(parsed.address).toBe("alerts@accounts.google.com");
    expect(parsed.domain).toBe("accounts.google.com");
  });

  it("marks malformed senders as limited evidence inputs", () => {
    const parsed = parseEmailAddress("not a mailbox");

    expect(parsed.domain).toBeNull();
    expect(parsed.issues).toContain("malformed_address");
    expect(parsed.issues).toContain("missing_domain");
  });
});
