export interface DomainMatchRule {
  domain: string;
  includeSubdomains?: boolean;
}

export function normalizeDomain(value: string | undefined | null): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\.$/, "");
}

export function domainMatchesRule(candidate: string | null, rule: string | DomainMatchRule): boolean {
  if (!candidate) {
    return false;
  }

  const candidateDomain = normalizeDomain(candidate);
  const domainRule = typeof rule === "string" ? { domain: rule, includeSubdomains: true } : rule;
  const allowedDomain = normalizeDomain(domainRule.domain);

  if (!candidateDomain || !allowedDomain) {
    return false;
  }

  if (candidateDomain === allowedDomain) {
    return true;
  }

  return domainRule.includeSubdomains !== false && candidateDomain.endsWith(`.${allowedDomain}`);
}

export function domainMatchesAny(candidate: string | null, rules: Array<string | DomainMatchRule>): boolean {
  return rules.some((rule) => domainMatchesRule(candidate, rule));
}
