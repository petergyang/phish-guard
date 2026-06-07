// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { checkOpenGmailMessage } from "../src/content/gmail-content.js";
import { warningBannerId } from "../src/ui/banner.js";

describe("Gmail content integration", () => {
  it("shows a warning for suspicious senders and clears it for safe senders", () => {
    document.body.innerHTML = `
      <h2 class="hP">Security alert</h2>
      <div class="adn ads">
        <span class="gD" email="random@gmail.com" name="YouTube Account Recovery">YouTube Account Recovery</span>
      </div>
    `;

    checkOpenGmailMessage(document);
    expect(document.querySelector(`#${warningBannerId}`)?.textContent).toContain("Warning: this might not be YouTube");

    document.body.innerHTML = `
      <h2 class="hP">Channel update</h2>
      <div class="adn ads">
        <span class="gD" email="updates@youtube.com" name="YouTube">YouTube</span>
      </div>
    `;

    checkOpenGmailMessage(document);
    expect(document.querySelector(`#${warningBannerId}`)).toBeNull();
  });

  it("does not warn when only the subject mentions a brand", () => {
    document.body.innerHTML = `
      <h2 class="hP">your YouTube is really great</h2>
      <div class="adn ads">
        <span class="gD" email="friend@example.com" name="A friend">A friend</span>
      </div>
    `;

    checkOpenGmailMessage(document);
    expect(document.querySelector(`#${warningBannerId}`)).toBeNull();
  });

  it("warns for a Costco rewards sender in Gmail spam", () => {
    document.body.innerHTML = `
      <h2 class="hP">TODAY'S WINNER!</h2>
      <div class="adn ads">
        <div class="aju"></div>
        <div class="gs">
          <div class="gE iv gt">
            <span class="gD" email="heidmaureen@example.net" name="Costco Rewards Connection">Costco Rewards Connection</span>
          </div>
          <div class="a3s">Congratulations reward body text should not be inspected.</div>
        </div>
      </div>
    `;

    checkOpenGmailMessage(document);

    const banner = document.querySelector(`#${warningBannerId}`)!;
    const warning = document.querySelector(`#${warningBannerId}`)?.textContent ?? "";
    expect(warning).toContain("Warning: this might not be Costco");
    expect(warning).toContain("heidmaureen@example.net");
    expect(warning).not.toContain("Congratulations reward body text");
    expect(banner.parentElement?.className).toBe("gs");
    expect(banner.nextElementSibling?.className).toContain("gE");
  });
});
