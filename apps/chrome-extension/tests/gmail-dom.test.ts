// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { analyzeMessage } from "@anti-phishing/detector";
import { extractVisibleGmailMetadata } from "../src/content/gmail-dom.js";

describe("Gmail DOM metadata adapter", () => {
  it("extracts sender metadata from a Gmail-like message header", () => {
    document.body.innerHTML = `
      <h2 class="hP">Account recovery</h2>
      <div class="adn ads">
        <span class="gD" email="random@gmail.com" name="YouTube Account Recovery">YouTube Account Recovery</span>
        <div class="a3s">Body text should not matter.</div>
      </div>
    `;

    const result = extractVisibleGmailMetadata(document);

    expect(result.metadata).toEqual({
      from: "\"YouTube Account Recovery\" <random@gmail.com>",
      provider: "gmail-chrome-extension"
    });
    expect(result.anchor?.className).toContain("adn");
  });

  it("does not use message body text as brand evidence", () => {
    document.body.innerHTML = `
      <h2 class="hP">your YouTube is really great</h2>
      <div class="adn ads">
        <span class="gD" email="friend@example.com" name="A friend">A friend</span>
        <div class="a3s">
          YouTube Account Recovery
          <a href="https://evil.example">click me</a>
          invoice.pdf
        </div>
      </div>
    `;

    const extraction = extractVisibleGmailMetadata(document);
    const detection = analyzeMessage(extraction.metadata!);

    expect(detection.riskLevel).toBe("safe");
    expect(detection.claimedBrand).toBeNull();
  });

  it("returns empty metadata when the sender row is missing", () => {
    document.body.innerHTML = `
      <div class="adn ads">
        <div class="a3s">A partially rendered message.</div>
      </div>
    `;

    expect(extractVisibleGmailMetadata(document)).toEqual({ metadata: null, anchor: null });
  });
});
