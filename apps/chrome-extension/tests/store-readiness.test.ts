import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const requiredDocs = [
  "docs/privacy/chrome-extension-store-listing.md",
  "docs/privacy/manual-verification.md",
  "docs/privacy/test-cases.md"
];

describe("Chrome extension store readiness", () => {
  it("documents the local-only Gmail sender warning promise", () => {
    const combinedDocs = requiredDocs.map((path) => readFileSync(path, "utf8")).join("\n");

    expect(combinedDocs).toContain("local");
    expect(combinedDocs).toContain("mail.google.com");
    expect(combinedDocs).toContain("sender row");
    expect(combinedDocs).toContain("does not read message bodies");
    expect(combinedDocs).toContain("does not upload email");
    expect(combinedDocs).not.toContain("no email access");
  });
});
