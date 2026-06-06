import { describe, expect, it } from "vitest";
import delegatedLimitedEvidence from "../fixtures/delegated-sender-limited-evidence.json" with { type: "json" };
import legitYouTube from "../fixtures/google-legit-subdomain.json" with { type: "json" };
import youtubeGmail from "../fixtures/youtube-gmail-impersonation.json" with { type: "json" };
import { analyzeMessage, type MessageMetadata } from "../src/risk-score.js";

describe("analyzeMessage", () => {
  it("flags a YouTube display name sent from a personal Gmail account", () => {
    const result = analyzeMessage(youtubeGmail);

    expect(result.riskLevel).toBe("suspicious");
    expect(result.claimedBrand).toBe("YouTube");
    expect(result.senderDomain).toBe("gmail.com");
    expect(result.evidence.map((item) => item.kind)).toContain("brand_domain_mismatch");
    expect(result.evidence.map((item) => item.kind)).toContain("public_mailbox_sender");
  });

  it("does not warn when a protected brand uses a trusted domain", () => {
    const result = analyzeMessage(legitYouTube);

    expect(result.riskLevel).toBe("safe");
    expect(result.evidence.map((item) => item.kind)).toContain("trusted_domain");
  });

  it("returns safe when no protected brand is claimed", () => {
    const result = analyzeMessage({
      from: "\"A friend\" <friend@example.com>",
      subject: "Lunch?"
    });

    expect(result.riskLevel).toBe("safe");
    expect(result.claimedBrand).toBeNull();
  });

  it("does not warn when a friend only mentions a brand in the subject", () => {
    const result = analyzeMessage({
      from: "\"A friend\" <friend@example.com>",
      subject: "your YouTube is really great"
    });

    expect(result.riskLevel).toBe("safe");
    expect(result.claimedBrand).toBeNull();
  });

  it("returns limited evidence when the sender cannot be parsed", () => {
    const result = analyzeMessage({
      from: "not a mailbox",
      subject: "YouTube recovery"
    });

    expect(result.riskLevel).toBe("limited_evidence");
    expect(result.evidence.map((item) => item.kind)).toContain("parse_issue");
  });

  it("adds reply-to mismatch evidence when replies go elsewhere", () => {
    const result = analyzeMessage({
      ...delegatedLimitedEvidence,
      replyTo: "attacker@example.net"
    } satisfies MessageMetadata);

    expect(result.riskLevel).toBe("suspicious");
    expect(result.evidence.map((item) => item.kind)).toContain("reply_to_mismatch");
  });
});
