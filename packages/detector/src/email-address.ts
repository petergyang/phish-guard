export interface ParsedEmailAddress {
  raw: string;
  displayName: string;
  address: string;
  domain: string | null;
  issues: string[];
}

export function parseEmailAddress(rawValue: string | undefined | null): ParsedEmailAddress {
  const raw = (rawValue ?? "").trim();
  const issues: string[] = [];

  if (!raw) {
    return { raw, displayName: "", address: "", domain: null, issues: ["missing_from"] };
  }

  const bracketMatch = raw.match(/^(.*?)<([^<>]+)>$/);
  const displayName = bracketMatch ? cleanDisplayName(bracketMatch[1] ?? "") : "";
  const address = (bracketMatch ? bracketMatch[2] ?? "" : raw).trim().toLowerCase();

  if (!isPlausibleMailbox(address)) {
    issues.push("malformed_address");
  }

  const domain = extractDomain(address);
  if (!domain) {
    issues.push("missing_domain");
  }

  return {
    raw,
    displayName,
    address,
    domain,
    issues
  };
}

export function extractDomain(address: string): string | null {
  const atIndex = address.lastIndexOf("@");
  if (atIndex < 1 || atIndex === address.length - 1) {
    return null;
  }

  const domain = address.slice(atIndex + 1).replace(/[>\s]+$/g, "").toLowerCase();
  if (!domain.includes(".") || domain.includes("..")) {
    return null;
  }

  return domain;
}

function cleanDisplayName(value: string): string {
  return value
    .trim()
    .replace(/^"+|"+$/g, "")
    .replace(/\\"/g, "\"")
    .trim();
}

function isPlausibleMailbox(address: string): boolean {
  return /^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$/.test(address);
}
