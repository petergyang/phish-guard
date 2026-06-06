import { describe, expect, it } from "vitest";
import { createAppsScriptGmailSource, extractApprovedMetadata, readCurrentMessageMetadata, type GmailMetadataSource } from "../src/gmail/current-message.js";

describe("current message metadata adapter", () => {
  it("extracts only approved metadata fields", () => {
    const result = extractApprovedMetadata({
      from: "\"YouTube\" <random@gmail.com>",
      subject: "Recovery",
      body: "private body",
      htmlBody: "<p>private</p>",
      attachments: [{ name: "invoice.pdf" }],
      links: ["https://example.com"]
    });

    expect(result.metadata).toEqual({
      from: "\"YouTube\" <random@gmail.com>",
      subject: "Recovery",
      replyTo: undefined,
      headers: undefined,
      provider: "gmail-addon"
    });
    expect(result.ignoredFields).toEqual(["body", "htmlBody", "attachments", "links"]);
  });

  it("returns an error state when Gmail message context is unavailable", () => {
    const source: GmailMetadataSource = {
      getMetadata: () => ({ from: "sender@example.com" })
    };

    expect(readCurrentMessageMetadata({}, source)).toEqual({
      ok: false,
      error: "missing_message_context"
    });
  });

  it("reads metadata from the current Gmail message token", () => {
    const source: GmailMetadataSource = {
      getMetadata: (messageId, accessToken) => ({
        from: "\"YouTube\" <random@gmail.com>",
        subject: `${messageId}:${accessToken}`
      })
    };

    const result = readCurrentMessageMetadata({
      gmail: { messageId: "msg-1", accessToken: "token-1" }
    }, source);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.metadata.subject).toBe("msg-1:token-1");
    }
  });

  it("supports Apps Script messageMetadata events", () => {
    const result = readCurrentMessageMetadata({
      messageMetadata: { messageId: "msg-2", accessToken: "token-2" }
    }, {
      getMetadata: (messageId, accessToken) => ({
        from: "\"YouTube\" <alerts@youtube.com>",
        subject: `${messageId}:${accessToken}`
      })
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.metadata.subject).toBe("msg-2:token-2");
    }
  });

  it("creates an Apps Script Gmail source without reading body content", () => {
    const calls: string[] = [];
    const source = createAppsScriptGmailSource({
      setCurrentMessageAccessToken: (accessToken) => calls.push(`token:${accessToken}`),
      getMessageById: (messageId) => {
        calls.push(`message:${messageId}`);
        return {
          getFrom: () => "\"YouTube\" <alerts@youtube.com>",
          getReplyTo: () => "alerts@youtube.com",
          getSubject: () => "Account notice"
        };
      }
    });

    expect(source.getMetadata("msg-1", "token-1")).toEqual({
      from: "\"YouTube\" <alerts@youtube.com>",
      replyTo: "alerts@youtube.com",
      subject: "Account notice",
      provider: "gmail-addon"
    });
    expect(calls).toEqual(["token:token-1", "message:msg-1"]);
  });
});
