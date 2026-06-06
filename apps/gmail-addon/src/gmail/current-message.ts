import type { MessageMetadata } from "@anti-phishing/detector";

export interface GmailMessageEvent {
  gmail?: {
    messageId?: string;
    accessToken?: string;
  };
  messageMetadata?: {
    messageId?: string;
    accessToken?: string;
  };
}

export interface RawGmailMessageMetadata {
  from?: string;
  replyTo?: string;
  subject?: string;
  headers?: Record<string, string | undefined>;
  provider?: string;
  body?: unknown;
  htmlBody?: unknown;
  plainTextBody?: unknown;
  snippet?: unknown;
  attachments?: unknown;
  links?: unknown;
}

export interface GmailMetadataSource {
  getMetadata(messageId: string, accessToken: string): RawGmailMessageMetadata;
}

export interface ApprovedMetadataResult {
  metadata: MessageMetadata;
  ignoredFields: string[];
}

export type CurrentMessageResult =
  | { ok: true; value: ApprovedMetadataResult }
  | { ok: false; error: "missing_message_context" };

const approvedTopLevelFields = new Set(["from", "replyTo", "subject", "headers", "provider"]);

export function readCurrentMessageMetadata(
  event: GmailMessageEvent,
  source: GmailMetadataSource
): CurrentMessageResult {
  const messageId = event.gmail?.messageId ?? event.messageMetadata?.messageId;
  const accessToken = event.gmail?.accessToken ?? event.messageMetadata?.accessToken;

  if (!messageId || !accessToken) {
    return { ok: false, error: "missing_message_context" };
  }

  const raw = source.getMetadata(messageId, accessToken);
  return { ok: true, value: extractApprovedMetadata(raw) };
}

export function extractApprovedMetadata(raw: RawGmailMessageMetadata): ApprovedMetadataResult {
  const ignoredFields = Object.keys(raw).filter((field) => !approvedTopLevelFields.has(field));

  return {
    metadata: {
      from: raw.from ?? "",
      replyTo: raw.replyTo,
      subject: raw.subject,
      headers: raw.headers,
      provider: raw.provider ?? "gmail-addon"
    },
    ignoredFields
  };
}

export interface AppsScriptGmailMessage {
  getFrom(): string;
  getReplyTo(): string;
  getSubject(): string;
}

export interface AppsScriptGmailApp {
  setCurrentMessageAccessToken(accessToken: string): void;
  getMessageById(messageId: string): AppsScriptGmailMessage;
}

export function createAppsScriptGmailSource(gmailApp: AppsScriptGmailApp): GmailMetadataSource {
  return {
    getMetadata(messageId, accessToken) {
      gmailApp.setCurrentMessageAccessToken(accessToken);
      const message = gmailApp.getMessageById(messageId);

      return {
        from: message.getFrom(),
        replyTo: message.getReplyTo(),
        subject: message.getSubject(),
        provider: "gmail-addon"
      };
    }
  };
}
