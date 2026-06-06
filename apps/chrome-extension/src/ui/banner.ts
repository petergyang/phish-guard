import type { DetectionResult } from "@anti-phishing/detector";

export const warningBannerId = "gmail-phish-guard-warning";

export interface InlineWarningModel {
  title: string;
  bullets: string[];
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
    title: `Warning: this might not be ${brand}`,
    bullets: [
      `It says ${brand}, but the sender is ${sender}.`,
      "Do not click links yet.",
      "Use Gmail's Report spam or delete it if it feels off."
    ]
  };
}

export function renderInlineWarning(anchor: Element, result: DetectionResult): void {
  const model = buildInlineWarningModel(result);
  const host = anchor.parentElement ?? anchor;
  removeInlineWarning(host);

  if (!model) return;

  const doc = anchor.ownerDocument;
  const banner = doc.createElement("section");
  banner.id = warningBannerId;
  banner.className = "gmail-phish-guard-banner";
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

  const list = doc.createElement("ul");
  for (const bullet of model.bullets) {
    const item = doc.createElement("li");
    item.textContent = bullet;
    list.appendChild(item);
  }
  content.appendChild(list);
  banner.appendChild(content);

  host.insertBefore(banner, anchor);
}

export function removeInlineWarning(root: ParentNode): void {
  root.querySelector?.(`#${warningBannerId}`)?.remove();
}
