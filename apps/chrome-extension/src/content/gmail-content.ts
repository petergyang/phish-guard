import { analyzeMessage } from "@anti-phishing/detector";
import { extractVisibleGmailMetadata } from "./gmail-dom.js";
import { observeGmailMessages } from "./message-observer.js";
import { removeInlineWarning, renderInlineWarning } from "../ui/banner.js";

declare global {
  interface Window {
    __gmailPhishGuardStarted?: boolean;
  }
}

export function checkOpenGmailMessage(root: ParentNode = document): void {
  const extraction = extractVisibleGmailMetadata(root);
  if (!extraction.metadata || !extraction.anchor) {
    removeInlineWarning(root);
    return;
  }

  const result = analyzeMessage(extraction.metadata);
  renderInlineWarning(extraction.anchor, result);
}

if (typeof document !== "undefined" && !window.__gmailPhishGuardStarted) {
  window.__gmailPhishGuardStarted = true;
  observeGmailMessages(() => checkOpenGmailMessage(document));
}
