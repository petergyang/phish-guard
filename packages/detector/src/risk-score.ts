import { defaultBrandRules, findClaimedBrand, isTrustedSenderDomain, publicMailboxDomains, type BrandRule } from "./brand-rules.js";
import { domainMatchesAny, normalizeDomain } from "./domain-match.js";
import { evidence, type EvidenceItem } from "./evidence.js";
import { parseEmailAddress } from "./email-address.js";

export type RiskLevel = "safe" | "suspicious" | "limited_evidence";

export interface MessageMetadata {
  from: string;
  replyTo?: string;
  subject?: string;
  bodyText?: string;
  links?: MessageLinkMetadata[];
  headers?: Record<string, string | undefined>;
  provider?: string;
}

export interface MessageLinkMetadata {
  href: string;
  text?: string;
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
        const linkAssessment = assessLinks(message.links, parsedFrom.domain);
        return {
          riskLevel: linkAssessment.suspicious ? "suspicious" : "safe",
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
            ),
            ...linkAssessment.evidence
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
          ),
          ...assessLinks(message.links, parsedFrom.domain).evidence
        ]
      };
    }

    const bodyClaim = inferBodyBrandClaim(message, rules);
    if (bodyClaim) {
      evidenceItems.push(evidence(
        "brand_claim",
        "info",
        `The message body presents itself as ${bodyClaim.brandName}.`,
        { brand: bodyClaim.brandName, source: bodyClaim.source }
      ));
      evidenceItems.push(evidence(
        "body_brand_suspicious_context",
        "warning",
        `The message mentions ${bodyClaim.brandName} with subscription, payment, urgency, or account language.`,
        { brand: bodyClaim.brandName }
      ));

      if (!parsedFrom.domain) {
        return {
          riskLevel: "limited_evidence",
          claimedBrand: bodyClaim.brandName,
          senderDisplayName: parsedFrom.displayName,
          senderAddress: parsedFrom.address,
          senderDomain: parsedFrom.domain,
          evidence: [
            ...evidenceItems,
            evidence("limited_headers", "warning", "The sender domain is unavailable, so the body claim cannot be verified.")
          ]
        };
      }

      const trusted = isTrustedSenderDomain(parsedFrom.domain, bodyClaim);
      const linkAssessment = assessLinks(message.links, parsedFrom.domain, bodyClaim);
      const senderEvidence = trusted
        ? evidence(
          "trusted_domain",
          "info",
          `The sender domain matches a trusted ${bodyClaim.brandName} domain.`,
          { senderDomain: parsedFrom.domain }
        )
        : evidence(
          "brand_domain_mismatch",
          "error",
          `The message body claims ${bodyClaim.brandName}, but the actual email is ${parsedFrom.address}.`,
          { brand: bodyClaim.brandName, senderAddress: parsedFrom.address, senderDomain: parsedFrom.domain }
        );

      if (trusted && !linkAssessment.suspicious) {
        return {
          riskLevel: "safe",
          claimedBrand: bodyClaim.brandName,
          senderDisplayName: parsedFrom.displayName,
          senderAddress: parsedFrom.address,
          senderDomain: parsedFrom.domain,
          evidence: [
            ...evidenceItems,
            senderEvidence,
            ...linkAssessment.evidence
          ]
        };
      }

      return {
        riskLevel: "suspicious",
        claimedBrand: bodyClaim.brandName,
        senderDisplayName: parsedFrom.displayName,
        senderAddress: parsedFrom.address,
        senderDomain: parsedFrom.domain,
        evidence: [
          ...evidenceItems,
          senderEvidence,
          ...linkAssessment.evidence
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
  const linkAssessment = assessLinks(message.links, parsedFrom.domain, claimedBrand);
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
    riskLevel: trusted && !linkAssessment.suspicious ? "safe" : "suspicious",
    claimedBrand: claimedBrand.brandName,
    senderDisplayName: parsedFrom.displayName,
    senderAddress: parsedFrom.address,
    senderDomain: parsedFrom.domain,
    evidence: [...evidenceItems, ...linkAssessment.evidence]
  };
}

interface DisplayNameClaim {
  claimName: string;
  claimAppearsInAddress: boolean;
}

interface BodyBrandClaim extends BrandRule {
  source: "subject" | "body";
}

const suspiciousBodyContextWords = new Set([
  "billing",
  "cancel",
  "canceled",
  "cancelled",
  "expire",
  "expired",
  "expires",
  "hurry",
  "membership",
  "offer",
  "payment",
  "renew",
  "renewed",
  "security",
  "subscription",
  "suspended",
  "urgent",
  "verify"
]);

const urlShortenerDomains = new Set([
  "bit.ly",
  "buff.ly",
  "cutt.ly",
  "goo.gl",
  "is.gd",
  "lnkd.in",
  "ow.ly",
  "rebrand.ly",
  "s.id",
  "t.co",
  "tiny.cc",
  "tinyurl.com",
  "trib.al"
]);

const socialFooterDomains = [
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "t.co",
  "tiktok.com",
  "twitter.com",
  "x.com",
  "youtube.com"
];

const socialFooterWords = new Set([
  "facebook",
  "instagram",
  "linkedin",
  "tiktok",
  "twitter",
  "x",
  "youtube"
]);

const emailTrackingDomains = [
  "braze.com",
  "customer.io",
  "e.customeriomail.com",
  "exacttarget.com",
  "hubspotemail.net",
  "iterable.com",
  "list-manage.com",
  "mailchimp.com",
  "mailchi.mp",
  "mandrillapp.com",
  "sendgrid.net",
  "sfmc-content.com"
];

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

const delegatedPlatformDomains = [
  "eventbrite.com",
  "lu.ma",
  "luma.com",
  "substack.com"
];

function inferDisplayNameClaim(displayName: string, address: string, domain: string | null): DisplayNameClaim | null {
  if (isExplicitPlatformDelegation(displayName, domain)) {
    return null;
  }

  const acronymClaim = inferDottedAcronymClaim(displayName, address, domain);
  if (acronymClaim) {
    return acronymClaim;
  }

  const words = displayName.match(/[a-z0-9]+/gi) ?? [];
  const normalizedWords = words.map((word) => word.toLowerCase());
  const hasOrganizationSignal = normalizedWords.some((word) => organizationSignalWords.has(word))
    || words.some((word, index) => index > 0 && isAcronymSignal(word));

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

function isExplicitPlatformDelegation(displayName: string, domain: string | null): boolean {
  if (!domain || publicMailboxDomains.has(domain) || !domainMatchesAny(domain, delegatedPlatformDomains)) {
    return false;
  }

  const words = tokenizeWords(displayName);
  const delegationIndex = words.findIndex((word) => word === "via");
  if (delegationIndex < 0 || delegationIndex === words.length - 1) {
    return false;
  }

  const delegatedPlatformName = normalizeForIdentityMatch(words.slice(delegationIndex + 1).join(""));
  const senderDomainName = normalizeForIdentityMatch(domain);
  return delegatedPlatformName.length >= 3 && senderDomainName.includes(delegatedPlatformName);
}

function inferDottedAcronymClaim(displayName: string, address: string, domain: string | null): DisplayNameClaim | null {
  const match = displayName.match(/\b(?:[A-Z]\.){2,}[A-Z]?\b/);
  if (!match) {
    return null;
  }

  const claimName = match[0]!.replace(/\./g, "");
  if (!isAcronymSignal(claimName)) {
    return null;
  }

  const addressText = normalizeForIdentityMatch(`${address} ${domain ?? ""}`);
  const claimToken = normalizeForIdentityMatch(claimName);

  return {
    claimName,
    claimAppearsInAddress: addressText.includes(claimToken)
  };
}

function inferBodyBrandClaim(message: MessageMetadata, rules: BrandRule[]): BodyBrandClaim | null {
  const subject = message.subject?.trim() ?? "";
  const bodyText = message.bodyText?.trim() ?? "";
  const combinedText = `${subject} ${bodyText}`.trim();
  if (!combinedText) {
    return null;
  }

  const bodyBrand = findBrandWithSuspiciousContext(bodyText, rules);
  if (bodyBrand) {
    return { ...bodyBrand, source: "body" };
  }

  const subjectBrand = findBrandWithSuspiciousContext(combinedText, rules);
  return subjectBrand ? { ...subjectBrand, source: "subject" } : null;
}

function findBrandWithSuspiciousContext(value: string, rules: BrandRule[]): BrandRule | null {
  const words = tokenizeWords(value);
  if (words.length === 0) {
    return null;
  }

  for (const rule of rules) {
    for (const displayName of rule.displayNames) {
      const brandWords = tokenizeWords(displayName);
      if (brandWords.length === 0) continue;

      for (let index = 0; index <= words.length - brandWords.length; index += 1) {
        if (!matchesAt(words, brandWords, index)) continue;

        const contextStart = Math.max(0, index - 6);
        const contextEnd = Math.min(words.length, index + brandWords.length + 6);
        const context = words.slice(contextStart, contextEnd);
        if (hasSuspiciousBodyContext(context)) {
          return rule;
        }
      }
    }
  }

  return null;
}

function tokenizeWords(value: string): string[] {
  return (value.match(/[a-z0-9]+/gi) ?? []).map((word) => word.toLowerCase());
}

function matchesAt(words: string[], expected: string[], index: number): boolean {
  return expected.every((word, offset) => words[index + offset] === word);
}

function hasSuspiciousBodyContext(words: string[]): boolean {
  return words.some((word) => suspiciousBodyContextWords.has(word));
}

interface LinkAssessment {
  suspicious: boolean;
  evidence: EvidenceItem[];
}

function assessLinks(
  links: MessageLinkMetadata[] | undefined,
  senderDomain: string | null,
  brand?: BrandRule
): LinkAssessment {
  const evidenceItems: EvidenceItem[] = [];
  const seen = new Set<string>();
  const trustedSenderForBrand = brand ? isTrustedSenderDomain(senderDomain, brand) : false;

  for (const link of links ?? []) {
    const linkDomain = parseLinkDomain(link.href);
    if (!linkDomain || seen.has(linkDomain)) continue;
    seen.add(linkDomain);

    if (isSocialFooterLink(linkDomain, link.text)) {
      continue;
    }

    if (trustedSenderForBrand && isEmailTrackingLink(linkDomain)) {
      continue;
    }

    if (urlShortenerDomains.has(linkDomain)) {
      evidenceItems.push(evidence(
        "link_shortener",
        "warning",
        `The message uses a shortened link at ${linkDomain}.`,
        { linkDomain }
      ));
      continue;
    }

    if (!brand) continue;

    const trustedForBrand = isTrustedSenderDomain(linkDomain, brand);
    const matchesSender = senderDomain ? domainMatchesAny(linkDomain, [senderDomain]) : false;
    if (!trustedForBrand && !matchesSender) {
      evidenceItems.push(evidence(
        "link_domain_mismatch",
        "error",
        `A link goes to ${linkDomain}, which does not match ${brand.brandName}.`,
        { brand: brand.brandName, linkDomain }
      ));
    }
  }

  return {
    suspicious: evidenceItems.some((item) => item.severity !== "info"),
    evidence: evidenceItems.slice(0, 3)
  };
}

function isSocialFooterLink(linkDomain: string, text: string | undefined): boolean {
  if (!domainMatchesAny(linkDomain, socialFooterDomains)) {
    return false;
  }

  const words = tokenizeWords(text ?? "");
  return words.some((word) => socialFooterWords.has(word));
}

function isEmailTrackingLink(linkDomain: string): boolean {
  return domainMatchesAny(linkDomain, emailTrackingDomains);
}

function parseLinkDomain(href: string): string | null {
  const destination = unwrapVisibleRedirect(href);
  try {
    const url = new URL(destination);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return normalizeDomain(url.hostname).replace(/^www\./, "") || null;
  } catch {
    return null;
  }
}

function unwrapVisibleRedirect(href: string): string {
  try {
    const url = new URL(href);
    const domain = normalizeDomain(url.hostname).replace(/^www\./, "");
    if (domain === "google.com" && url.pathname === "/url") {
      return url.searchParams.get("q") ?? href;
    }
    if (domain.endsWith("safelinks.protection.outlook.com")) {
      return url.searchParams.get("url") ?? href;
    }
    return href;
  } catch {
    return href;
  }
}

function normalizeForIdentityMatch(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function isAcronymSignal(value: string): boolean {
  return /^[A-Z0-9]{3,}$/.test(value);
}
