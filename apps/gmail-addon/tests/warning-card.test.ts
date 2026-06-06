import { describe, expect, it } from "vitest";
import { handleGmailMessage } from "../src/index.js";

describe("warning card", () => {
  it("renders a suspicious sender warning from current-message metadata", async () => {
    const card = handleGmailMessage(
      { gmail: { messageId: "msg-1", accessToken: "token-1" } },
      {
        getMetadata: () => ({
          from: "\"YouTube Account Recovery\" <random-person@gmail.com>",
          subject: "Recover your YouTube account"
        })
      }
    );

    expect(card.state).toBe("suspicious");
    expect(card.title).toBe("⚠️ Heads up: this might not be YouTube");
    expect(card.details).toEqual([
      { label: "It calls itself", value: "YouTube Account Recovery" },
      { label: "But it's from", value: "random-person@gmail.com" },
      { label: "Best move", value: "Don't click anything yet. Mark as spam or delete it if it feels off." }
    ]);
    expect(card.privacyNote).toContain("does not inspect the message body");
  });

  it("renders a quiet state for a trusted sender domain", async () => {
    const card = handleGmailMessage(
      { gmail: { messageId: "msg-1", accessToken: "token-1" } },
      {
        getMetadata: () => ({
          from: "\"YouTube\" <alerts@youtube.com>",
          subject: "Your YouTube account"
        })
      }
    );

    expect(card.state).toBe("safe");
    expect(card.summary).toContain("YouTube");
  });

  it("renders an error card without current message context", async () => {
    const card = handleGmailMessage({}, {
      getMetadata: () => ({ from: "\"YouTube\" <alerts@youtube.com>" })
    });

    expect(card.state).toBe("error");
    expect(card.summary).toContain("Open a Gmail message");
  });
});
