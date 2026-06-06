import { onGmailMessage as runOnGmailMessage } from "./index.js";

export function onGmailMessage(event: unknown): unknown {
  return runOnGmailMessage(event as never);
}
