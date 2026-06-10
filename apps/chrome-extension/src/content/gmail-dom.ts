import type { MessageLinkMetadata, MessageMetadata } from "@anti-phishing/detector";

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

const visibleSenderHeaderSelectors = [
  ".gE.iv.gt",
  ".adn.ads",
  ".gs",
  "[data-message-id]",
  "[data-legacy-message-id]"
];

const angleBracketSenderPattern = /(.+?)\s*<([^<>\s@]+@[^<>\s@]+\.[^<>\s@]+)>/;
const ignoredBodyContentSelectors = [
  "blockquote",
  ".gmail_attr",
  ".gmail_extra",
  ".gmail_quote",
  ".gmail_signature",
  "[class*='gmail_quote']"
];

export function extractVisibleGmailMetadata(root: ParentNode = document): GmailDomExtraction {
  const subject = readSubject(root);
  if (!subject) {
    return { metadata: null, anchor: null };
  }

  const senderElement = findFirstOpenMessageSender(root);
  if (senderElement) {
    const senderAddress = readAttribute(senderElement, "email") ?? readAttribute(senderElement, "data-hovercard-id") ?? "";
    const senderDisplayName = readAttribute(senderElement, "name") ?? senderElement.textContent?.trim() ?? "";
    return extractionFromSender(senderElement, senderDisplayName, senderAddress, subject);
  }

  const visibleHeaderSender = findVisibleHeaderSender(root);
  if (visibleHeaderSender) {
    return extractionFromSender(visibleHeaderSender.element, visibleHeaderSender.displayName, visibleHeaderSender.address, subject);
  }

  return { metadata: null, anchor: null };
}

function extractionFromSender(
  senderElement: Element,
  senderDisplayName: string,
  senderAddress: string,
  subject: string
): GmailDomExtraction {
  const header = senderElement.closest(messageHeaderSelectors.join(","));
  const messageContent = header?.matches(".gs") ? header : header?.querySelector(".gs");
  const topOfMessageContent = messageContent?.firstElementChild;
  const bodyText = readBodyText(messageContent ?? header);
  const links = readBodyLinks(messageContent ?? header);

  return {
    metadata: {
      from: formatFrom(senderDisplayName, senderAddress),
      ...(subject ? { subject } : {}),
      ...(bodyText ? { bodyText } : {}),
      ...(links.length > 0 ? { links } : {}),
      provider: "gmail-chrome-extension"
    },
    anchor: topOfMessageContent ?? header ?? senderElement
  };
}

function findFirstOpenMessageSender(root: ParentNode): Element | null {
  for (const selector of senderSelectors) {
    const matches = Array.from(root.querySelectorAll(selector));
    for (const match of matches) {
      if (!isProbablyVisible(match)) continue;
      if (match.closest(messageHeaderSelectors.join(","))) return match;
    }
  }

  return null;
}

function findVisibleHeaderSender(root: ParentNode): { element: Element; displayName: string; address: string } | null {
  for (const headerSelector of visibleSenderHeaderSelectors) {
    const headers = Array.from(root.querySelectorAll(headerSelector));
    for (const header of headers) {
      if (!isProbablyVisible(header)) continue;

      const match = normalizeHeaderText(header.textContent ?? "").match(angleBracketSenderPattern);
      if (!match) continue;

      const displayName = cleanDisplayName(match[1] ?? "");
      const address = (match[2] ?? "").trim();
      if (!displayName || !address) continue;

      return { element: header, displayName, address };
    }
  }

  return null;
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

function readSubject(root: ParentNode): string | null {
  const subject = root.querySelector(".hP")?.textContent?.trim();
  return subject || null;
}

function readBodyText(root: Element | null | undefined): string | null {
  const body = root?.querySelector(".a3s");
  if (!body) return null;

  const bodyTextSource = body.cloneNode(true) as Element;
  for (const element of Array.from(bodyTextSource.querySelectorAll([
    "a",
    "[href]",
    ".aZo",
    ".aQH",
    ".aV3",
    ...ignoredBodyContentSelectors
  ].join(",")))) {
    element.remove();
  }

  const textParts = [bodyTextSource.textContent ?? ""];
  for (const image of Array.from(body.querySelectorAll("img"))) {
    if (isInsideIgnoredBodyContent(image)) continue;

    textParts.push(
      image.getAttribute("alt") ?? "",
      image.getAttribute("title") ?? "",
      image.getAttribute("aria-label") ?? ""
    );
  }

  const bodyText = normalizeHeaderText(textParts.join(" "));
  return bodyText || null;
}

function readBodyLinks(root: Element | null | undefined): MessageLinkMetadata[] {
  const body = root?.querySelector(".a3s");
  if (!body) return [];

  return Array.from(body.querySelectorAll<HTMLAnchorElement>("a[href]"))
    .filter((link) => !isInsideIgnoredBodyContent(link))
    .map((link) => {
      return {
        href: link.href || link.getAttribute("href") || "",
        text: normalizeHeaderText(link.textContent ?? "")
      };
    })
    .filter((link) => /^https?:\/\//i.test(link.href))
    .slice(0, 20);
}

function isInsideIgnoredBodyContent(element: Element): boolean {
  return ignoredBodyContentSelectors.some((selector) => element.closest(selector));
}

function formatFrom(displayName: string, address: string): string {
  if (!address) return displayName;
  const cleanName = displayName.replace(/"/g, "").trim();
  return cleanName ? `"${cleanName}" <${address}>` : address;
}

function cleanDisplayName(value: string): string {
  return value
    .replace(/\b(to|cc|bcc)\b.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeHeaderText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function isProbablyVisible(element: Element): boolean {
  const htmlElement = element as HTMLElement;
  if (htmlElement.hidden || htmlElement.getAttribute("aria-hidden") === "true") return false;
  return true;
}
