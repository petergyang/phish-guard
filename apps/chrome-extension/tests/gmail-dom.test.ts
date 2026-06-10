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

    expect(result.metadata).toMatchObject({
      from: "\"YouTube Account Recovery\" <random@gmail.com>",
      subject: "Account recovery",
      bodyText: "Body text should not matter.",
      provider: "gmail-chrome-extension"
    });
    expect(result.anchor?.className).toContain("adn");
  });

  it("does not warn when body text casually mentions a brand", () => {
    document.body.innerHTML = `
      <h2 class="hP">your YouTube is really great</h2>
      <div class="adn ads">
        <span class="gD" email="friend@example.com" name="A friend">A friend</span>
        <div class="a3s">
          Your YouTube video was fun.
          <a href="https://youtube.com/watch?v=test">watch</a>
        </div>
      </div>
    `;

    const extraction = extractVisibleGmailMetadata(document);
    const detection = analyzeMessage(extraction.metadata!);

    expect(extraction.metadata?.bodyText).toBe("Your YouTube video was fun.");
    expect(extraction.metadata?.links).toEqual([{ href: "https://youtube.com/watch?v=test", text: "watch" }]);
    expect(detection.riskLevel).toBe("safe");
    expect(detection.claimedBrand).toBeNull();
  });

  it("extracts visible sender text when Gmail does not expose sender attributes", () => {
    document.body.innerHTML = `
      <h2 class="hP">Tell us your view Tell us your view | 08 June 2026 FCZ</h2>
      <div class="adn ads">
        <div class="gs">
          <div class="gE iv gt">
            <h3>
              <span>Costco WMU &lt;sanceslaman948@hotmail.com&gt;</span>
            </h3>
            <span>to me</span>
          </div>
          <div class="a3s">
            <img alt="Costco Wholesale">
            Congratulations reward body text should not be inspected.
            <a href="https://costco-rewards.example/claim">Claim reward</a>
          </div>
        </div>
      </div>
    `;

    const extraction = extractVisibleGmailMetadata(document);
    const detection = analyzeMessage(extraction.metadata!);

    expect(extraction.metadata).toMatchObject({
      from: "\"Costco WMU\" <sanceslaman948@hotmail.com>",
      subject: "Tell us your view Tell us your view | 08 June 2026 FCZ",
      bodyText: "Congratulations reward body text should not be inspected. Costco Wholesale",
      links: [{ href: "https://costco-rewards.example/claim", text: "Claim reward" }],
      provider: "gmail-chrome-extension"
    });
    expect(detection.riskLevel).toBe("suspicious");
    expect(detection.claimedBrand).toBe("Costco");
    expect(extraction.anchor?.className).toContain("gE");
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
