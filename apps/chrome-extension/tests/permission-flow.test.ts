import { describe, expect, it, vi } from "vitest";
import {
  enableGmailProtection,
  popupViewForState
} from "../src/popup/popup.js";
import { gmailContentScriptId, gmailHostPermission, type ExtensionChromeApi } from "../src/background/permissions.js";

function fakeChrome(granted: boolean): ExtensionChromeApi {
  return {
    permissions: {
      contains: vi.fn(async () => granted),
      request: vi.fn(async (request) => {
        expect(request.origins).toEqual([gmailHostPermission]);
        return granted;
      })
    },
    scripting: {
      registerContentScripts: vi.fn(async (scripts) => {
        expect(scripts[0]?.id).toBe(gmailContentScriptId);
        expect(scripts[0]?.matches).toEqual([gmailHostPermission]);
      }),
      unregisterContentScripts: vi.fn(async () => undefined),
      executeScript: vi.fn(async () => undefined),
      insertCSS: vi.fn(async () => undefined)
    },
    tabs: {
      query: vi.fn(async () => [{ id: 123, url: "https://mail.google.com/mail/u/0/#inbox" }])
    }
  };
}

describe("permission-first onboarding", () => {
  it("explains the disabled state without sounding broken", () => {
    expect(popupViewForState("needs-permission")).toMatchObject({
      buttonLabel: "Protect Gmail",
      buttonDisabled: false,
      statusText: "Gmail access is off. Turn it on to show warnings inside opened emails."
    });
  });

  it("registers Gmail protection only after permission is granted", async () => {
    const api = fakeChrome(true);

    await expect(enableGmailProtection(api)).resolves.toBe("ready");
    expect(api.scripting.registerContentScripts).toHaveBeenCalledTimes(1);
    expect(api.scripting.executeScript).toHaveBeenCalledTimes(1);
  });

  it("keeps protection off when the user denies permission", async () => {
    const api = fakeChrome(false);

    await expect(enableGmailProtection(api)).resolves.toBe("denied");
    expect(api.scripting.registerContentScripts).not.toHaveBeenCalled();
  });
});
