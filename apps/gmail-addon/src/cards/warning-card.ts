import type { DetectionResult, EvidenceItem } from "@anti-phishing/detector";

export type CardState = "safe" | "suspicious" | "limited_evidence" | "error";

export interface WarningCardModel {
  state: CardState;
  title: string;
  summary: string;
  details: Array<{ label: string; value: string }>;
  evidence: Array<Pick<EvidenceItem, "kind" | "severity" | "message">>;
  privacyNote: string;
}

export function buildWarningCard(result: DetectionResult): WarningCardModel {
  if (result.riskLevel === "suspicious") {
    const brand = result.claimedBrand ?? "this sender";
    return {
      state: "suspicious",
      title: `⚠️ Heads up: this might not be ${brand}`,
      summary: "Something looks off with who sent this.",
      details: [
        { label: "It calls itself", value: result.senderDisplayName || brand },
        { label: "But it's from", value: result.senderAddress || "unknown sender" },
        { label: "Best move", value: "Don't click anything yet. Mark as spam or delete it if it feels off." }
      ],
      evidence: result.evidence,
      privacyNote: metadataOnlyPrivacyNote()
    };
  }

  if (result.riskLevel === "limited_evidence") {
    return {
      state: "limited_evidence",
      title: "Limited sender evidence",
      summary: "There is not enough sender metadata to verify this message.",
      details: [
        { label: "Actual sender", value: result.senderAddress || "unknown sender" },
        { label: "Best move", value: "Use caution if the message asks you to click, pay, or sign in." }
      ],
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
    details: [
      { label: "Actual sender", value: result.senderAddress || "unknown sender" }
    ],
    evidence: result.evidence,
    privacyNote: metadataOnlyPrivacyNote()
  };
}

export function buildErrorCard(): WarningCardModel {
  return {
    state: "error",
    title: "Sender check unavailable",
    summary: "Open a Gmail message and run the add-on again.",
    details: [],
    evidence: [],
    privacyNote: metadataOnlyPrivacyNote()
  };
}

function metadataOnlyPrivacyNote(): string {
  return "This check uses sender metadata only. It does not inspect the message body, attachments, or links.";
}
