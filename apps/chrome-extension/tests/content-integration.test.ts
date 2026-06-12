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
    expect(document.querySelector(`#${warningBannerId}`)?.textContent).toContain("Phish Guard warning: This might not be from YouTube.");

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

  it("removes an old warning when Gmail navigates to a safe message", () => {
    document.body.innerHTML = `
      <main id="message-root">
        <h2 class="hP">Security alert</h2>
        <div class="adn ads">
          <span class="gD" email="random@gmail.com" name="YouTube Account Recovery">YouTube Account Recovery</span>
        </div>
      </main>
    `;

    checkOpenGmailMessage(document);
    expect(document.querySelector(`#${warningBannerId}`)).not.toBeNull();

    document.querySelector("#message-root")!.innerHTML = `
      <h2 class="hP">Your YouTube edit looks great</h2>
      <div class="adn ads">
        <span class="gD" email="alex@example.com" name="Alex Chen">Alex Chen</span>
      </div>
    `;

    checkOpenGmailMessage(document);
    expect(document.querySelector(`#${warningBannerId}`)).toBeNull();
  });

  it("removes an old warning when Gmail navigates back to the inbox list", () => {
    document.body.innerHTML = `
      <main id="gmail-root">
        <h2 class="hP">Security alert</h2>
        <div class="adn ads">
          <span class="gD" email="random@gmail.com" name="YouTube Account Recovery">YouTube Account Recovery</span>
        </div>
      </main>
    `;

    checkOpenGmailMessage(document);
    expect(document.querySelector(`#${warningBannerId}`)).not.toBeNull();

    document.querySelector("#gmail-root")!.innerHTML = `
      <div role="main">
        <table>
          <tbody>
            <tr>
              <td>
                <span class="gD" email="niverbertina9473@outlook.com" name="H.B.O">H.B.O</span>
                <span>Re: Your subscription could not be renewed</span>
              </td>
            </tr>
          </tbody>
        </table>
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
    expect(warning).toContain("Phish Guard warning: This might not be from Costco.");
    expect(warning).toContain("heidmaureen@example.net");
    expect(warning).toContain("Be careful with this email and consider marking it as spam.");
    expect(warning).not.toContain("Congratulations reward body text");
    expect(banner.querySelector("ul")).toBeNull();
    expect(banner.parentElement?.className).toBe("gs");
    expect(banner.nextElementSibling?.className).toContain("gE");
  });

  it("warns when the visible Gmail sender header contains the sender email", () => {
    document.body.innerHTML = `
      <h2 class="hP">Tell us your view Tell us your view | 08 June 2026 FCZ</h2>
      <div class="adn ads">
        <div class="gs">
          <div class="gE iv gt">
            <h3>Costco WMU &lt;sanceslaman948@hotmail.com&gt;</h3>
            <span>to me</span>
          </div>
          <div class="a3s">Hello [email_name], Congratulations!</div>
        </div>
      </div>
    `;

    checkOpenGmailMessage(document);

    const warning = document.querySelector(`#${warningBannerId}`)?.textContent ?? "";
    expect(warning).toContain("Phish Guard warning: This might not be from Costco.");
    expect(warning).toContain("sanceslaman948@hotmail.com");
    expect(warning).toContain("Be careful with this email");
    expect(warning).not.toContain("Congratulations");
  });

  it("warns when a suspicious body claims a brand from an unrelated sender", () => {
    document.body.innerHTML = `
      <h2 class="hP">Re: Your subscription could not be renewed</h2>
      <div class="adn ads">
        <div class="gs">
          <div class="gE iv gt">
            <span class="gD" email="niverbertina9473@outlook.com" name="Subscription Center">Subscription Center</span>
          </div>
          <div class="a3s">
            <img alt="HBOmax">
            Hurry! This offer will expire soon.
            Your membership has expired!
            <a href="https://hbo-renewal.example/login">Renew membership</a>
          </div>
        </div>
      </div>
    `;

    checkOpenGmailMessage(document);

    const warning = document.querySelector(`#${warningBannerId}`)?.textContent ?? "";
    expect(warning).toContain("Phish Guard warning: This might not be from HBO Max.");
    expect(warning).toContain("niverbertina9473@outlook.com");
    expect(warning).toContain("hbo-renewal.example");
    expect(warning).not.toContain("membership has expired");
  });
});
