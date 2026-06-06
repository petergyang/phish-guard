import type { DetectionResult, EvidenceItem } from "@anti-phishing/detector";

export type CardState = "safe" | "suspicious" | "limited_evidence" | "error";

export interface WarningCardModel {
  state: CardState;
  title: string;
  summary: string;
  evidence: Array<Pick<EvidenceItem, "kind" | "severity" | "message">>;
  privacyNote: string;
}

export function buildWarningCard(result: DetectionResult): WarningCardModel {
  if (result.riskLevel === "suspicious") {
    return {
      state: "suspicious",
      title: "Check this sender",
      summary: result.evidence.find((item) => item.kind === "brand_domain_mismatch")?.message
        ?? "This sender does not match the brand it appears to represent.",
      evidence: result.evidence,
      privacyNote: metadataOnlyPrivacyNote()
    };
  }

  if (result.riskLevel === "limited_evidence") {
    return {
      state: "limited_evidence",
      title: "Limited sender evidence",
      summary: "There is not enough sender metadata to verify this message.",
      evidence: result.evidence,
      privacyNote: metadataOnlyPrivacyNote()
    };
  }

  return {
    state: "safe",
    title: "No sender mismatch found",
    summary: result.claimedBrand
      ? `The sender matches known ${result.claimedBrand} domains.`
      : "No protected brand impersonation signal was found.",
    evidence: result.evidence,
    privacyNote: metadataOnlyPrivacyNote()
  };
}

export function buildErrorCard(): WarningCardModel {
  return {
    state: "error",
    title: "Sender check unavailable",
    summary: "Open a Gmail message and run the add-on again.",
    evidence: [],
    privacyNote: metadataOnlyPrivacyNote()
  };
}

function metadataOnlyPrivacyNote(): string {
  return "This check uses sender metadata only. It does not inspect the message body, attachments, or links.";
}
