export type EvidenceSeverity = "info" | "warning" | "error";

export interface EvidenceItem {
  kind:
    | "brand_claim"
    | "trusted_domain"
    | "brand_domain_mismatch"
    | "display_name_address_mismatch"
    | "display_name_matches_address"
    | "public_mailbox_sender"
    | "reply_to_mismatch"
    | "parse_issue"
    | "limited_headers";
  severity: EvidenceSeverity;
  message: string;
  data?: Record<string, string>;
}

export function evidence(
  kind: EvidenceItem["kind"],
  severity: EvidenceSeverity,
  message: string,
  data?: Record<string, string>
): EvidenceItem {
  return data ? { kind, severity, message, data } : { kind, severity, message };
}
