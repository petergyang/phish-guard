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
      title: "Warning: this might not be YouTube",
      bullets: [
        "It says YouTube, but the sender is random@gmail.com.",
        "Do not click links yet.",
        "Use Gmail's Report spam or delete it if it feels off."
      ]
    });
  });

  it("does not build a warning for safe senders", () => {
    const result = analyzeMessage({
      from: "\"YouTube\" <updates@youtube.com>"
    });

    expect(buildInlineWarningModel(result)).toBeNull();
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
    expect(document.querySelector(`#${warningBannerId}`)?.textContent).toContain("Use Gmail's Report spam");
  });
});
