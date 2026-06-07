import type { MessageMetadata } from "@anti-phishing/detector";

export interface GmailDomExtraction {
  metadata: MessageMetadata | null;
  anchor: Element | null;
}

const senderSelectors = [
  ".gD[email]",
  "[email][name]",
  "[data-hovercard-id][email]",
  "span[email]"
];

const messageHeaderSelectors = [
  ".adn.ads",
  "[data-message-id]",
  "[data-legacy-message-id]",
  ".gs"
];

export function extractVisibleGmailMetadata(root: ParentNode = document): GmailDomExtraction {
  const senderElement = findFirst(root, senderSelectors);
  if (!senderElement) {
    return { metadata: null, anchor: null };
  }

  const senderAddress = readAttribute(senderElement, "email") ?? readAttribute(senderElement, "data-hovercard-id") ?? "";
  const senderDisplayName = readAttribute(senderElement, "name") ?? senderElement.textContent?.trim() ?? "";
  const header = senderElement.closest(messageHeaderSelectors.join(","));
  const messageContent = header?.matches(".gs") ? header : header?.querySelector(".gs");
  const topOfMessageContent = messageContent?.firstElementChild;

  return {
    metadata: {
      from: formatFrom(senderDisplayName, senderAddress),
      provider: "gmail-chrome-extension"
    },
    anchor: topOfMessageContent ?? header ?? senderElement
  };
}

function findFirst(root: ParentNode, selectors: string[]): Element | null {
  for (const selector of selectors) {
    const match = root.querySelector(selector);
    if (match) return match;
  }
  return null;
}

function readAttribute(element: Element, name: string): string | null {
  const value = element.getAttribute(name)?.trim();
  return value || null;
}

function formatFrom(displayName: string, address: string): string {
  if (!address) return displayName;
  const cleanName = displayName.replace(/"/g, "").trim();
  return cleanName ? `"${cleanName}" <${address}>` : address;
}
