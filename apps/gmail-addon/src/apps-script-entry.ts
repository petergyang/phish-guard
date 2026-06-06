import { onGmailMessage as runOnGmailMessage, onHomepage as runOnHomepage } from "./index.js";

export function onGmailMessage(event: unknown): unknown {
  return runOnGmailMessage(event as never);
}

export function onHomepage(): unknown {
  return runOnHomepage();
}
