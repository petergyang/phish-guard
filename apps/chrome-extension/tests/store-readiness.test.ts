import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const requiredDocs = [
  "README.md",
  "PRIVACY.md",
  "SECURITY.md",
  "docs/privacy/chrome-extension-store-listing.md",
  "docs/privacy/manual-verification.md",
  "docs/privacy/test-cases.md",
  "docs/store/chrome-web-store-submission.md",
  "docs/store/release-checklist.md",
  "docs/store/dashboard-answers.md",
  "docs/store/review-notes.md"
];

const requiredAssets = [
  "apps/chrome-extension/assets/icon-16.png",
  "apps/chrome-extension/assets/icon-32.png",
  "apps/chrome-extension/assets/icon-48.png",
  "apps/chrome-extension/assets/icon-128.png",
  "docs/assets/store/gmail-warning.png",
  "docs/assets/store/popup-before-permission.png",
  "docs/assets/store/gmail-normal-message.png"
];

function readLowercase(path: string): string {
  return readFileSync(path, "utf8").toLowerCase();
}

describe("Chrome extension store readiness", () => {
  it("documents the local-only Gmail sender warning promise", () => {
    const combinedDocs = requiredDocs.map(readLowercase).join("\n");

    expect(combinedDocs).toContain("local");
    expect(combinedDocs).toContain("mail.google.com");
    expect(combinedDocs).toContain("sender row");
    expect(combinedDocs).toContain("does not read message bodies");
    expect(combinedDocs).toContain("does not upload email");
    expect(combinedDocs).not.toContain("no email access");
  });

  it("keeps public trust and store-readiness documents in place", () => {
    for (const path of requiredDocs) {
      expect(existsSync(path), `${path} should exist`).toBe(true);
    }

    const privacyPolicy = readLowercase("PRIVACY.md");
    const storePacket = readLowercase("docs/store/chrome-web-store-submission.md");
    const securityPolicy = readLowercase("SECURITY.md");

    expect(privacyPolicy).toContain("limited use");
    expect(privacyPolicy).toContain("does not sell data");
    expect(privacyPolicy).toContain("why chrome says");
    expect(storePacket).toContain("least privilege");
    expect(storePacket).toContain("privacy policy");
    expect(storePacket).toContain("package zip");
    expect(storePacket).toContain("dashboard-answers.md");
    expect(storePacket).toContain("review-notes.md");
    expect(securityPolicy).toContain("do not post private email");
  });

  it("keeps the README product screenshot available", () => {
    const readme = readFileSync("README.md", "utf8");
    const screenshotPath = "docs/assets/phish-guard-gmail-warning.svg";

    expect(readme).toContain(screenshotPath);
    expect(readme.indexOf(screenshotPath)).toBeLessThan(readme.indexOf("Phish Guard is a Chrome extension"));
    expect(existsSync(screenshotPath), `${screenshotPath} should exist`).toBe(true);
  });

  it("keeps public README free of developer-install friction", () => {
    const readme = readFileSync("README.md", "utf8");

    expect(readme).not.toContain("Install The Alpha");
    expect(readme).not.toContain("Developer mode");
    expect(readme).not.toContain("Load unpacked");
    expect(readme).toContain("Chrome Web Store");
    expect(readme).toContain("docs/development/local-install.md");
  });

  it("keeps store and extension image assets available", () => {
    for (const path of requiredAssets) {
      expect(existsSync(path), `${path} should exist`).toBe(true);
    }
  });

  it("keeps popup privacy copy aligned with the README", () => {
    const popupHtml = readLowercase("apps/chrome-extension/src/popup/popup.html");

    expect(popupHtml).toContain("sender row");
    expect(popupHtml).toContain("no message bodies");
    expect(popupHtml).toContain("email upload");
    expect(popupHtml).toContain("does not edit, delete, send, or report emails");
  });

  it("keeps tester issue templates privacy-safe", () => {
    const bugTemplate = readLowercase(".github/ISSUE_TEMPLATE/bug_report.yml");
    const falsePositiveTemplate = readLowercase(".github/ISSUE_TEMPLATE/false_positive.yml");

    expect(bugTemplate).toContain("do not paste full email bodies");
    expect(falsePositiveTemplate).toContain("do not paste full email bodies");
    expect(falsePositiveTemplate).toContain("sender email domain");
  });

  it("keeps CI packaging the extension for testers", () => {
    const workflow = readFileSync(".github/workflows/ci.yml", "utf8");
    const rootPackage = readFileSync("package.json", "utf8");

    expect(rootPackage).toContain("\"package:chrome-extension\"");
    expect(workflow).toContain("npm test");
    expect(workflow).toContain("npm run build");
    expect(workflow).toContain("npm audit --audit-level=moderate");
    expect(workflow).toContain("npm run package:chrome-extension");
    expect(workflow).toContain("npm run inspect:chrome-extension-package");
    expect(workflow).toContain("dist/phish-guard-chrome-extension.zip");
  });
});
