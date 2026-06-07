import type { DetectionResult } from "@anti-phishing/detector";

export const warningBannerId = "gmail-phish-guard-warning";

export interface InlineWarningModel {
  title: string;
  subtitle: string;
  state: "warning";
}

export function buildInlineWarningModel(result: DetectionResult): InlineWarningModel | null {
  if (result.riskLevel !== "suspicious") {
    return null;
  }

  const brand = result.claimedBrand ?? "a trusted brand";
  const sender = result.senderAddress || result.senderDomain || "an unknown sender";

  return {
    state: "warning",
    title: `Phish Guard warning: This is likely not from ${brand}.`,
    subtitle: `Sender email: ${sender}. Avoid links. Use Gmail's Report spam button or delete the email.`
  };
}

export function renderInlineWarning(anchor: Element, result: DetectionResult): void {
  const model = buildInlineWarningModel(result);
  const host = anchor.parentElement ?? anchor;
  const existing = findExistingWarning(anchor.ownerDocument);

  if (!model) {
    existing?.remove();
    return;
  }

  const doc = anchor.ownerDocument;
  const signature = warningSignature(model);
  if (
    existing?.parentElement === host
    && existing.nextElementSibling === anchor
    && existing.dataset.signature === signature
  ) {
    return;
  }

  const banner = existing ?? doc.createElement("section");
  banner.replaceChildren();
  banner.id = warningBannerId;
  banner.className = "gmail-phish-guard-banner";
  banner.dataset.signature = signature;
  banner.setAttribute("role", "alert");
  banner.setAttribute("aria-live", "polite");

  const icon = doc.createElement("div");
  icon.className = "gmail-phish-guard-banner__icon";
  icon.textContent = "!";
  banner.appendChild(icon);

  const content = doc.createElement("div");
  content.className = "gmail-phish-guard-banner__content";

  const title = doc.createElement("div");
  title.className = "gmail-phish-guard-banner__title";
  title.textContent = model.title;
  content.appendChild(title);

  const subtitle = doc.createElement("div");
  subtitle.className = "gmail-phish-guard-banner__subtitle";
  subtitle.textContent = model.subtitle;
  content.appendChild(subtitle);
  banner.appendChild(content);

  host.insertBefore(banner, anchor);
}

export function removeInlineWarning(root: ParentNode): void {
  root.querySelector?.(`#${warningBannerId}`)?.remove();
}

function findExistingWarning(doc: Document): HTMLElement | null {
  return doc.getElementById(warningBannerId);
}

function warningSignature(model: InlineWarningModel): string {
  return JSON.stringify([model.title, model.subtitle]);
}
