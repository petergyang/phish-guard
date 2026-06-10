// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { analyzeMessage } from "@anti-phishing/detector";
import { buildInlineWarningModel, renderInlineWarning, warningBannerId } from "../src/ui/banner.js";

describe("inline warning banner", () => {
  it("builds concise normie-facing warning copy for suspicious senders", () => {
    const result = analyzeMessage({
      from: "\"YouTube Account Recovery\" <random@gmail.com>"
    });

    expect(buildInlineWarningModel(result)).toEqual({
      state: "warning",
      title: "Phish Guard warning: This is likely not from YouTube.",
      subtitle: "Sender email: random@gmail.com. Avoid links. Use Gmail's Report spam button or delete the email."
    });
  });

  it("does not build a warning for safe senders", () => {
    const result = analyzeMessage({
      from: "\"YouTube\" <updates@youtube.com>"
    });

    expect(buildInlineWarningModel(result)).toBeNull();
  });

  it("includes suspicious link domains in the warning copy", () => {
    const result = analyzeMessage({
      from: "\"PayPal\" <security@paypal.com>",
      bodyText: "PayPal security alert. Verify your account.",
      links: [{ href: "https://paypal-security.example/login", text: "Verify" }]
    });

    expect(buildInlineWarningModel(result)?.subtitle).toBe(
      "Sender email: security@paypal.com. Suspicious link: paypal-security.example. Avoid links. Use Gmail's Report spam button or delete the email."
    );
  });

  it("renders one banner and updates without duplicates", () => {
    document.body.innerHTML = `
      <div id="host">
        <div id="header"></div>
      </div>
    `;

    const header = document.querySelector("#header")!;
    const suspicious = analyzeMessage({
      from: "\"YouTube Account Recovery\" <random@gmail.com>"
    });

    renderInlineWarning(header, suspicious);
    renderInlineWarning(header, suspicious);

    expect(document.querySelectorAll(`#${warningBannerId}`)).toHaveLength(1);
    expect(document.querySelector(`#${warningBannerId}`)?.textContent).toContain("Use Gmail's Report spam button or delete the email");
    expect(document.querySelector(`#${warningBannerId} ul`)).toBeNull();
  });

  it("does not rebuild the banner when the same warning is already in place", () => {
    document.body.innerHTML = `
      <div id="host">
        <div id="header"></div>
      </div>
    `;

    const header = document.querySelector("#header")!;
    const suspicious = analyzeMessage({
      from: "\"Costco Rewards Connection\" <heidmaureen9558@hotmail.com>"
    });

    renderInlineWarning(header, suspicious);
    const firstBanner = document.querySelector(`#${warningBannerId}`);
    renderInlineWarning(header, suspicious);

    expect(document.querySelector(`#${warningBannerId}`)).toBe(firstBanner);
    expect(document.querySelectorAll(`#${warningBannerId}`)).toHaveLength(1);
  });
});
