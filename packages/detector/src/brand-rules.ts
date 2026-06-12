import { domainMatchesAny } from "./domain-match.js";

export interface BrandRule {
  id: string;
  brandName: string;
  displayNames: string[];
  trustedDomains: string[];
  /**
   * Brands commonly used in fake-invoice call-back scams. For these, a body
   * mention near receipt language from a personal mailbox sender is enough to
   * warn, even without urgency wording.
   */
  invoiceScamTarget?: boolean;
}

export const publicMailboxDomains = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "yahoo.co.uk",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "aol.com",
  "gmx.com",
  "gmx.net",
  "web.de",
  "t-online.de",
  "mail.com",
  "mail.ru",
  "yandex.com",
  "yandex.ru",
  "zoho.com",
  "fastmail.com",
  "hey.com",
  "qq.com",
  "163.com",
  "126.com",
  "naver.com",
  "comcast.net",
  "att.net",
  "verizon.net",
  "sbcglobal.net",
  "cox.net",
  "charter.net",
  "earthlink.net",
  "btinternet.com",
  "sky.com",
  "orange.fr",
  "free.fr",
  "shaw.ca",
  "rogers.com",
  "bigpond.com"
]);

export const organizationSignalWords = new Set([
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
  "payment",
  "payments",
  "payroll",
  "prize",
  "promo",
  "promotion",
  "recovery",
  "refund",
  "refunds",
  "reward",
  "rewards",
  "security",
  "service",
  "services",
  "store",
  "subscription",
  "subscriptions",
  "support",
  "team",
  "verification",
  "verify",
  "winner",
  "wholesale"
]);

export const nonIdentityWords = new Set([
  "account",
  "accounts",
  "alert",
  "alerts",
  "bank",
  "banking",
  "billing",
  "center",
  "centre",
  "claim",
  "com",
  "connection",
  "corp",
  "customer",
  "department",
  "dept",
  "desk",
  "help",
  "info",
  "noreply",
  "online",
  "tracking",
  "update",
  "updates",
  "delivery",
  "deal",
  "deals",
  "email",
  "gift",
  "hello",
  "inc",
  "invoice",
  "llc",
  "ltd",
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
  "payment",
  "payments",
  "payroll",
  "prize",
  "promo",
  "promotion",
  "recovery",
  "refund",
  "refunds",
  "reward",
  "rewards",
  "security",
  "service",
  "services",
  "store",
  "subscription",
  "subscriptions",
  "support",
  "team",
  "the",
  "verification",
  "verify",
  "winner",
  "wholesale",
  "www"
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
    trustedDomains: ["paypal.com", "paypal.ca", "paypal.co.uk", "paypal.de", "paypal.fr", "paypal.com.au"]
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
    trustedDomains: ["microsoft.com", "account.microsoft.com", "microsoftonline.com", "office.com", "microsoft365.com"]
  },
  {
    id: "hbo-max",
    brandName: "HBO Max",
    displayNames: ["hbo", "hbo max", "hbomax"],
    trustedDomains: ["hbo.com", "max.com", "hbomax.com"]
  },
  {
    id: "amazon",
    brandName: "Amazon",
    displayNames: ["amazon", "amazon prime", "prime video"],
    trustedDomains: [
      "amazon.com",
      "amazon.ca",
      "amazon.co.uk",
      "amazon.de",
      "amazon.fr",
      "amazon.it",
      "amazon.es",
      "amazon.nl",
      "amazon.co.jp",
      "amazon.com.au",
      "amazon.com.br",
      "amazon.com.mx",
      "amazon.in",
      "primevideo.com"
    ]
  },
  {
    id: "netflix",
    brandName: "Netflix",
    displayNames: ["netflix"],
    trustedDomains: ["netflix.com"]
  },
  {
    id: "costco",
    brandName: "Costco",
    displayNames: ["costco", "costco wholesale"],
    trustedDomains: ["costco.com", "costco.ca", "costcotravel.com"]
  },
  {
    id: "walmart",
    brandName: "Walmart",
    displayNames: ["walmart"],
    trustedDomains: ["walmart.com"]
  },
  {
    id: "usps",
    brandName: "USPS",
    displayNames: ["usps", "us postal service", "united states postal service"],
    trustedDomains: ["usps.com", "usps.gov"]
  },
  {
    id: "ups",
    brandName: "UPS",
    displayNames: ["ups"],
    trustedDomains: ["ups.com", "theupsstore.com"]
  },
  {
    id: "fedex",
    brandName: "FedEx",
    displayNames: ["fedex"],
    trustedDomains: ["fedex.com"]
  },
  {
    id: "dhl",
    brandName: "DHL",
    displayNames: ["dhl"],
    trustedDomains: ["dhl.com", "dhl.de"]
  },
  {
    id: "irs",
    brandName: "IRS",
    displayNames: ["irs", "internal revenue service"],
    trustedDomains: ["irs.gov"]
  },
  {
    id: "facebook",
    brandName: "Facebook",
    displayNames: ["facebook"],
    trustedDomains: ["facebook.com", "facebookmail.com", "fb.com", "meta.com"]
  },
  {
    id: "instagram",
    brandName: "Instagram",
    displayNames: ["instagram"],
    trustedDomains: ["instagram.com", "facebookmail.com"]
  },
  {
    id: "linkedin",
    brandName: "LinkedIn",
    displayNames: ["linkedin"],
    trustedDomains: ["linkedin.com"]
  },
  {
    id: "spotify",
    brandName: "Spotify",
    displayNames: ["spotify"],
    trustedDomains: ["spotify.com", "spotifymail.com"]
  },
  {
    id: "docusign",
    brandName: "DocuSign",
    displayNames: ["docusign"],
    trustedDomains: ["docusign.com", "docusign.net"]
  },
  {
    id: "coinbase",
    brandName: "Coinbase",
    displayNames: ["coinbase"],
    trustedDomains: ["coinbase.com"]
  },
  {
    id: "venmo",
    brandName: "Venmo",
    displayNames: ["venmo"],
    trustedDomains: ["venmo.com"]
  },
  {
    id: "wells-fargo",
    brandName: "Wells Fargo",
    displayNames: ["wells fargo", "wellsfargo"],
    trustedDomains: ["wellsfargo.com"]
  },
  {
    id: "bank-of-america",
    brandName: "Bank of America",
    displayNames: ["bank of america", "bankofamerica"],
    trustedDomains: ["bankofamerica.com"]
  },
  {
    id: "geek-squad",
    brandName: "Geek Squad",
    displayNames: ["geek squad", "geeksquad"],
    trustedDomains: ["geeksquad.com", "bestbuy.com"],
    invoiceScamTarget: true
  },
  {
    id: "norton",
    brandName: "Norton",
    displayNames: ["norton", "norton lifelock", "nortonlifelock"],
    trustedDomains: ["norton.com", "nortonlifelock.com"],
    invoiceScamTarget: true
  },
  {
    id: "mcafee",
    brandName: "McAfee",
    displayNames: ["mcafee"],
    trustedDomains: ["mcafee.com"],
    invoiceScamTarget: true
  },
  {
    id: "webroot",
    brandName: "Webroot",
    displayNames: ["webroot"],
    trustedDomains: ["webroot.com", "opentext.com"],
    invoiceScamTarget: true
  },
  {
    id: "avast",
    brandName: "Avast",
    displayNames: ["avast"],
    trustedDomains: ["avast.com"],
    invoiceScamTarget: true
  }
];

export function findClaimedBrand(text: string, rules: BrandRule[] = defaultBrandRules): BrandRule | null {
  const tokens = tokenizeBrandWords(text);
  if (tokens.length === 0) {
    return null;
  }

  for (const rule of rules) {
    for (const displayName of rule.displayNames) {
      const brandTokens = tokenizeBrandWords(displayName);
      if (brandTokens.length === 0) continue;

      const matchIndex = findTokenSequence(tokens, brandTokens);
      if (matchIndex < 0) continue;

      // "Apple Support" claims to be Apple; "Apple Federal Credit Union" is a
      // different organization that merely contains the brand word.
      const leftover = tokens.filter((_, index) => index < matchIndex || index >= matchIndex + brandTokens.length);
      if (leftover.every(isBenignBrandModifier)) {
        return rule;
      }
    }
  }

  return null;
}

function tokenizeBrandWords(value: string): string[] {
  return (value.match(/[a-z0-9]+/gi) ?? []).map((word) => word.toLowerCase());
}

function findTokenSequence(tokens: string[], expected: string[]): number {
  for (let index = 0; index <= tokens.length - expected.length; index += 1) {
    if (expected.every((word, offset) => tokens[index + offset] === word)) {
      return index;
    }
  }
  return -1;
}

function isBenignBrandModifier(token: string): boolean {
  return token.length <= 2
    || /^\d+$/.test(token)
    || nonIdentityWords.has(token)
    || organizationSignalWords.has(token);
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

