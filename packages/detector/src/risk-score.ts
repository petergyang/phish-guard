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
