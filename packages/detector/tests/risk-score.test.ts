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

  it("flags a Costco rewards display name sent from an unrelated address", () => {
    const result = analyzeMessage({
      from: "\"Costco Rewards Connection\" <heidmaureen@example.net>"
    });

    expect(result.riskLevel).toBe("suspicious");
    expect(result.claimedBrand).toBe("Costco");
    expect(result.senderDomain).toBe("example.net");
    expect(result.evidence.map((item) => item.kind)).toContain("display_name_address_mismatch");
  });

  it("does not require a hardcoded brand rule to flag organization-name mismatch", () => {
    const result = analyzeMessage({
      from: "\"Acme Rewards Team\" <heidmaureen@example.net>"
    });

    expect(result.riskLevel).toBe("suspicious");
    expect(result.claimedBrand).toBe("Acme");
    expect(result.evidence.map((item) => item.kind)).toContain("display_name_address_mismatch");
  });

  it("flags a generic brand claim with organization wording", () => {
    const result = analyzeMessage({
      from: "\"Netflix Account Support\" <alerts@example.net>"
    });

    expect(result.riskLevel).toBe("suspicious");
    expect(result.claimedBrand).toBe("Netflix");
    expect(result.evidence.map((item) => item.kind)).toContain("display_name_address_mismatch");
  });

  it("does not warn when an organization-like display name appears in the sender address", () => {
    const result = analyzeMessage({
      from: "\"Acme Rewards Team\" <rewards@acme.example>"
    });

    expect(result.riskLevel).toBe("safe");
    expect(result.claimedBrand).toBe("Acme");
    expect(result.evidence.map((item) => item.kind)).toContain("display_name_matches_address");
  });

  it("does not treat normal personal display names as brand claims", () => {
    const result = analyzeMessage({
      from: "\"Rosalyn Yang\" <no-reply@strava.com>",
      subject: "Rosalyn commented on Morning Run"
    });

    expect(result.riskLevel).toBe("safe");
    expect(result.claimedBrand).toBeNull();
  });

  it("does not treat a three-word personal display name as a brand claim", () => {
    const result = analyzeMessage({
      from: "\"Rosalyn Yang Photography\" <hello@example.com>"
    });

    expect(result.riskLevel).toBe("safe");
    expect(result.claimedBrand).toBeNull();
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
