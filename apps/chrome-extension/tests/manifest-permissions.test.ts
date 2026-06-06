import { describe, expect, it } from "vitest";
import manifest from "../manifest.json" with { type: "json" };

describe("Chrome extension manifest permissions", () => {
  it("uses a narrow optional Gmail host permission", () => {
    expect(manifest.optional_host_permissions).toEqual(["https://mail.google.com/*"]);
    expect(manifest.permissions).toEqual(expect.arrayContaining(["activeTab", "scripting", "storage"]));
  });

  it("does not request scary broad or unrelated permissions", () => {
    const manifestText = JSON.stringify(manifest);

    expect(manifestText).not.toContain("<all_urls>");
    expect(manifestText).not.toContain("cookies");
    expect(manifestText).not.toContain("webRequest");
    expect(manifestText).not.toContain("gmail.readonly");
    expect(manifest).not.toHaveProperty("content_scripts");
  });
});
