import { defaultBrandRules, findClaimedBrand, isTrustedSenderDomain, publicMailboxDomains, type BrandRule } from "./brand-rules.js";
import { evidence, type EvidenceItem } from "./evidence.js";
import { parseEmailAddress } from "./email-address.js";

export type RiskLevel = "safe" | "suspicious" | "limited_evidence";

export interface MessageMetadata {
  from: string;
  replyTo?: string;
  subject?: string;
  headers?: Record<string, string | undefined>;
  provider?: string;
}

export interface DetectionResult {
  riskLevel: RiskLevel;
  claimedBrand: string | null;
  senderDisplayName: string;
  senderAddress: string;
  senderDomain: string | null;
  evidence: EvidenceItem[];
}

export function analyzeMessage(
  message: MessageMetadata,
  rules: BrandRule[] = defaultBrandRules
): DetectionResult {
  const parsedFrom = parseEmailAddress(message.from);
  const parsedReplyTo = message.replyTo ? parseEmailAddress(message.replyTo) : null;
  const evidenceItems: EvidenceItem[] = [];

  if (parsedFrom.issues.length > 0) {
    evidenceItems.push(evidence(
      "parse_issue",
      "warning",
      "The sender address could not be parsed cleanly.",
      { issues: parsedFrom.issues.join(",") }
    ));
  }

  const brandSearchText = parsedFrom.displayName.trim();
  const claimedBrand = findClaimedBrand(brandSearchText, rules);

  if (!claimedBrand) {
    const genericClaim = inferDisplayNameClaim(parsedFrom.displayName, parsedFrom.address, parsedFrom.domain);
    if (genericClaim) {
      evidenceItems.push(evidence(
        "brand_claim",
        "info",
        `The sender name presents itself as ${genericClaim.claimName}.`,
        { brand: genericClaim.claimName, source: "display_name" }
      ));

      if (!parsedFrom.domain) {
        return {
          riskLevel: "limited_evidence",
          claimedBrand: genericClaim.claimName,
          senderDisplayName: parsedFrom.displayName,
          senderAddress: parsedFrom.address,
          senderDomain: parsedFrom.domain,
          evidence: [
            ...evidenceItems,
            evidence("limited_headers", "warning", "The sender domain is unavailable, so the sender name cannot be verified.")
          ]
        };
      }

      if (genericClaim.claimAppearsInAddress) {
        return {
          riskLevel: "safe",
          claimedBrand: genericClaim.claimName,
          senderDisplayName: parsedFrom.displayName,
          senderAddress: parsedFrom.address,
          senderDomain: parsedFrom.domain,
          evidence: [
            ...evidenceItems,
            evidence(
              "display_name_matches_address",
              "info",
              `The sender address includes ${genericClaim.claimName}.`,
              { brand: genericClaim.claimName, senderAddress: parsedFrom.address, senderDomain: parsedFrom.domain }
            )
          ]
        };
      }

      return {
        riskLevel: "suspicious",
        claimedBrand: genericClaim.claimName,
        senderDisplayName: parsedFrom.displayName,
        senderAddress: parsedFrom.address,
        senderDomain: parsedFrom.domain,
        evidence: [
          ...evidenceItems,
          evidence(
            "display_name_address_mismatch",
            "error",
            `The sender name says ${genericClaim.claimName}, but the actual email is ${parsedFrom.address}.`,
            { brand: genericClaim.claimName, senderAddress: parsedFrom.address, senderDomain: parsedFrom.domain }
          )
        ]
      };
    }

    return {
      riskLevel: parsedFrom.domain ? "safe" : "limited_evidence",
      claimedBrand: null,
      senderDisplayName: parsedFrom.displayName,
      senderAddress: parsedFrom.address,
      senderDomain: parsedFrom.domain,
      evidence: parsedFrom.domain ? evidenceItems : [
        ...evidenceItems,
        evidence("limited_headers", "warning", "There is not enough sender metadata to evaluate this message.")
      ]
    };
  }

  evidenceItems.push(evidence(
    "brand_claim",
    "info",
    `The message presents itself as ${claimedBrand.brandName}.`,
    { brand: claimedBrand.brandName }
  ));

  if (!parsedFrom.domain) {
    return {
      riskLevel: "limited_evidence",
      claimedBrand: claimedBrand.brandName,
      senderDisplayName: parsedFrom.displayName,
      senderAddress: parsedFrom.address,
      senderDomain: parsedFrom.domain,
      evidence: [
        ...evidenceItems,
        evidence("limited_headers", "warning", "The sender domain is unavailable, so the brand claim cannot be verified.")
      ]
    };
  }

  const trusted = isTrustedSenderDomain(parsedFrom.domain, claimedBrand);
  if (trusted) {
    evidenceItems.push(evidence(
      "trusted_domain",
      "info",
      `The sender domain matches a trusted ${claimedBrand.brandName} domain.`,
      { senderDomain: parsedFrom.domain }
    ));
  } else {
    evidenceItems.push(evidence(
      "brand_domain_mismatch",
      "error",
      `The sender name claims ${claimedBrand.brandName}, but the actual email is ${parsedFrom.address}.`,
      { brand: claimedBrand.brandName, senderAddress: parsedFrom.address, senderDomain: parsedFrom.domain }
    ));

    if (publicMailboxDomains.has(parsedFrom.domain)) {
      evidenceItems.push(evidence(
        "public_mailbox_sender",
        "warning",
        `${claimedBrand.brandName} messages should not come from a personal mailbox domain.`,
        { senderDomain: parsedFrom.domain }
      ));
    }
  }

  if (parsedReplyTo?.domain && parsedReplyTo.domain !== parsedFrom.domain) {
    evidenceItems.push(evidence(
      "reply_to_mismatch",
      trusted ? "warning" : "error",
      `Replies go to ${parsedReplyTo.domain}, which differs from the sender domain.`,
      { senderDomain: parsedFrom.domain, replyToDomain: parsedReplyTo.domain }
    ));
  }

  return {
    riskLevel: trusted ? "safe" : "suspicious",
    claimedBrand: claimedBrand.brandName,
    senderDisplayName: parsedFrom.displayName,
    senderAddress: parsedFrom.address,
    senderDomain: parsedFrom.domain,
    evidence: evidenceItems
  };
}

interface DisplayNameClaim {
  claimName: string;
  claimAppearsInAddress: boolean;
}

const organizationSignalWords = new Set([
  "account",
  "accounts",
  "alerts",
  "billing",
  "claim",
  "connection",
  "customer",
  "delivery",
  "deal",
  "deals",
  "gift",
  "invoice",
  "member",
  "membership",
  "notice",
  "official",
  "offer",
  "offers",
  "order",
  "orders",
  "prize",
  "promo",
  "promotion",
  "recovery",
  "reward",
  "rewards",
  "security",
  "service",
  "services",
  "support",
  "team",
  "verification",
  "verify",
  "winner",
  "wholesale"
]);

const nonIdentityWords = new Set([
  "account",
  "accounts",
  "alert",
  "alerts",
  "billing",
  "claim",
  "connection",
  "customer",
  "delivery",
  "deal",
  "deals",
  "email",
  "gift",
  "hello",
  "invoice",
  "mail",
  "member",
  "membership",
  "notice",
  "notification",
  "notifications",
  "official",
  "offer",
  "offers",
  "order",
  "orders",
  "prize",
  "promo",
  "promotion",
  "recovery",
  "reward",
  "rewards",
  "security",
  "service",
  "services",
  "support",
  "team",
  "verification",
  "verify",
  "winner",
  "wholesale"
]);

function inferDisplayNameClaim(displayName: string, address: string, domain: string | null): DisplayNameClaim | null {
  const words = displayName.match(/[a-z0-9]+/gi) ?? [];
  const normalizedWords = words.map((word) => word.toLowerCase());
  const hasOrganizationSignal = normalizedWords.some((word) => organizationSignalWords.has(word));

  if (!hasOrganizationSignal) {
    return null;
  }

  const claimIndex = normalizedWords.findIndex((word) => {
    return word.length >= 3 && !nonIdentityWords.has(word);
  });
  if (claimIndex < 0) {
    return null;
  }

  const claimToken = normalizedWords[claimIndex]!;
  const claimName = words[claimIndex]!;
  const addressText = normalizeForIdentityMatch(`${address} ${domain ?? ""}`);

  return {
    claimName,
    claimAppearsInAddress: addressText.includes(claimToken)
  };
}

function normalizeForIdentityMatch(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
