// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { extractVisibleGmailMetadata } from "../src/content/gmail-dom.js";

describe("Chrome extension privacy boundary", () => {
  it("does not place body, links, or attachment text in detector metadata", () => {
    document.body.innerHTML = `
      <h2 class="hP">Security alert</h2>
      <div class="adn ads">
        <span class="gD" email="random@gmail.com" name="Google Support">Google Support</span>
        <div class="a3s">
          private body text
          <a href="https://phish.example/login">reset link</a>
          <span class="aZo">tax-document.pdf</span>
        </div>
      </div>
    `;

    const metadata = extractVisibleGmailMetadata(document).metadata;
    const serialized = JSON.stringify(metadata);

    expect(serialized).toContain("Google Support");
    expect(serialized).toContain("random@gmail.com");
    expect(serialized).not.toContain("private body text");
    expect(serialized).not.toContain("phish.example");
    expect(serialized).not.toContain("tax-document.pdf");
  });
});
