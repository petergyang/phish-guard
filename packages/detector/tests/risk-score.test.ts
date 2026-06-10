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

  it("flags a brand-like sender name with an acronym from a public mailbox", () => {
    const result = analyzeMessage({
      from: "\"Costco WMU\" <sanceslaman948@hotmail.com>"
    });

    expect(result.riskLevel).toBe("suspicious");
    expect(result.claimedBrand).toBe("Costco");
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

  it("flags a branded subscription warning in the body from an unrelated sender", () => {
    const result = analyzeMessage({
      from: "\"H.B.O\" <niverbertina9473@outlook.com>",
      subject: "Re: Your subscription could not be renewed",
      bodyText: "HBOmax Hurry! This offer will expire soon. Your membership has expired!"
    });

    expect(result.riskLevel).toBe("suspicious");
    expect(result.claimedBrand).toBe("HBO");
    expect(result.evidence.map((item) => item.kind)).toContain("display_name_address_mismatch");
  });

  it("flags body brand claims with scam context even when the sender name is vague", () => {
    const result = analyzeMessage({
      from: "\"Subscription Center\" <niverbertina9473@outlook.com>",
      subject: "Re: Your subscription could not be renewed",
      bodyText: "HBOmax Hurry! This offer will expire soon. Your membership has expired!",
      links: [{ href: "https://hbo-renewal.example/login", text: "Renew now" }]
    });

    expect(result.riskLevel).toBe("suspicious");
    expect(result.claimedBrand).toBe("HBO Max");
    expect(result.evidence.map((item) => item.kind)).toContain("body_brand_suspicious_context");
    expect(result.evidence.map((item) => item.kind)).toContain("brand_domain_mismatch");
    expect(result.evidence.map((item) => item.kind)).toContain("link_domain_mismatch");
  });

  it("flags a suspicious link even when the sender domain matches the brand", () => {
    const result = analyzeMessage({
      from: "\"PayPal\" <security@paypal.com>",
      bodyText: "PayPal security alert. Verify your account.",
      links: [{ href: "https://paypal-security.example/login", text: "Verify account" }]
    });

    expect(result.riskLevel).toBe("suspicious");
    expect(result.claimedBrand).toBe("PayPal");
    expect(result.evidence.map((item) => item.kind)).toContain("trusted_domain");
    expect(result.evidence.map((item) => item.kind)).toContain("link_domain_mismatch");
  });

  it("does not flag trusted brand links", () => {
    const result = analyzeMessage({
      from: "\"HBO Max\" <hello@max.com>",
      bodyText: "HBO Max membership renewal reminder.",
      links: [{ href: "https://help.max.com/billing", text: "Manage account" }]
    });

    expect(result.riskLevel).toBe("safe");
    expect(result.claimedBrand).toBe("HBO Max");
    expect(result.evidence.map((item) => item.kind)).not.toContain("link_domain_mismatch");
  });

  it("flags shortened links in brand-like messages", () => {
    const result = analyzeMessage({
      from: "\"Netflix Account Support\" <alerts@example.net>",
      links: [{ href: "https://bit.ly/example", text: "Renew" }]
    });

    expect(result.riskLevel).toBe("suspicious");
    expect(result.evidence.map((item) => item.kind)).toContain("link_shortener");
  });

  it("unwraps visible redirect URLs before comparing domains", () => {
    const result = analyzeMessage({
      from: "\"PayPal\" <service@paypal.com>",
      bodyText: "PayPal security alert. Verify your account.",
      links: [{ href: "https://www.google.com/url?q=https%3A%2F%2Fpaypal-login.example%2Fverify", text: "Verify" }]
    });

    expect(result.riskLevel).toBe("suspicious");
    expect(result.evidence.map((item) => item.kind)).toContain("link_domain_mismatch");
    expect(result.evidence.find((item) => item.kind === "link_domain_mismatch")?.data?.linkDomain).toBe("paypal-login.example");
  });

  it("does not warn when body text casually mentions a brand without scam context", () => {
    const result = analyzeMessage({
      from: "\"A friend\" <friend@example.com>",
      subject: "your YouTube is really great",
      bodyText: "I liked your YouTube video."
    });

    expect(result.riskLevel).toBe("safe");
    expect(result.claimedBrand).toBeNull();
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
