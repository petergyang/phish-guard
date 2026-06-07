import { domainMatchesAny } from "./domain-match.js";

export interface BrandRule {
  id: string;
  brandName: string;
  displayNames: string[];
  trustedDomains: string[];
}

export const publicMailboxDomains = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "aol.com"
]);

export const defaultBrandRules: BrandRule[] = [
  {
    id: "youtube",
    brandName: "YouTube",
    displayNames: ["youtube", "youtube account", "youtube recovery", "youtube support"],
    trustedDomains: ["youtube.com", "google.com", "accounts.google.com"]
  },
  {
    id: "google",
    brandName: "Google",
    displayNames: ["google", "google account", "google support"],
    trustedDomains: ["google.com", "accounts.google.com"]
  },
  {
    id: "paypal",
    brandName: "PayPal",
    displayNames: ["paypal", "paypal support", "paypal security"],
    trustedDomains: ["paypal.com"]
  },
  {
    id: "apple",
    brandName: "Apple",
    displayNames: ["apple", "apple id", "apple support"],
    trustedDomains: ["apple.com"]
  },
  {
    id: "microsoft",
    brandName: "Microsoft",
    displayNames: ["microsoft", "microsoft account", "microsoft security"],
    trustedDomains: ["microsoft.com", "account.microsoft.com"]
  },
  {
    id: "costco",
    brandName: "Costco",
    displayNames: ["costco", "costco wholesale", "costco rewards", "costco rewards connection"],
    trustedDomains: ["costco.com", "costco.ca"]
  }
];

export function findClaimedBrand(text: string, rules: BrandRule[] = defaultBrandRules): BrandRule | null {
  const normalizedText = normalizeForBrandMatch(text);
  if (!normalizedText) {
    return null;
  }

  return rules.find((rule) => {
    return rule.displayNames.some((displayName) => {
      const normalizedName = normalizeForBrandMatch(displayName);
      return new RegExp(`(^|\\b)${escapeRegExp(normalizedName)}(\\b|$)`, "i").test(normalizedText);
    });
  }) ?? null;
}

export function isTrustedSenderDomain(domain: string | null, brand: BrandRule): boolean {
  return domainMatchesAny(domain, brand.trustedDomains);
}

export function validateBrandRules(rules: BrandRule[]): string[] {
  const issues: string[] = [];
  const ids = new Set<string>();

  for (const rule of rules) {
    if (!rule.id.trim()) issues.push("rule_missing_id");
    if (ids.has(rule.id)) issues.push(`duplicate_rule_id:${rule.id}`);
    ids.add(rule.id);
    if (!rule.brandName.trim()) issues.push(`rule_missing_brand_name:${rule.id}`);
    if (rule.displayNames.length === 0) issues.push(`rule_missing_display_names:${rule.id}`);
    if (rule.trustedDomains.length === 0) issues.push(`rule_missing_trusted_domains:${rule.id}`);

    for (const domain of rule.trustedDomains) {
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain) || domain.includes("..")) {
        issues.push(`invalid_domain:${rule.id}:${domain}`);
      }
    }
  }

  return issues;
}

function normalizeForBrandMatch(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
