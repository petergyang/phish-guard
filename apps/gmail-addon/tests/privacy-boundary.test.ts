import { describe, expect, it } from "vitest";
import { extractApprovedMetadata } from "../src/gmail/current-message.js";

describe("privacy boundary", () => {
  it("fails if body-like fields enter the detector metadata handoff", () => {
    const result = extractApprovedMetadata({
      from: "\"PayPal\" <notice@gmail.com>",
      subject: "Security notice",
      body: "private plain text",
      plainTextBody: "private plain text",
      htmlBody: "<p>private</p>",
      snippet: "private snippet"
    });

    expect(Object.keys(result.metadata)).not.toContain("body");
    expect(Object.keys(result.metadata)).not.toContain("plainTextBody");
    expect(Object.keys(result.metadata)).not.toContain("htmlBody");
    expect(Object.keys(result.metadata)).not.toContain("snippet");
    expect(result.ignoredFields).toEqual(["body", "plainTextBody", "htmlBody", "snippet"]);
  });
});
