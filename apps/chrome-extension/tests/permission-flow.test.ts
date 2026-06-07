import { describe, expect, it, vi } from "vitest";
import { syncGmailProtection } from "../src/background/service-worker.js";
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
      query: vi.fn(async (queryInfo) => {
        if ("url" in queryInfo) {
          return [
            { id: 123, url: "https://mail.google.com/mail/u/0/#inbox" },
            { id: 456, url: "https://example.com/" }
          ];
        }
        return [{ id: 123, url: "https://mail.google.com/mail/u/0/#inbox" }];
      })
    }
  };
}

describe("permission-first onboarding", () => {
  it("keeps the pre-permission state calm and explicit", () => {
    expect(popupViewForState("needs-permission")).toMatchObject({
      buttonLabel: "Turn on Gmail warnings",
      buttonDisabled: false,
      statusText: "Gmail warnings are off until you allow Gmail access."
    });
  });

  it("registers always-on Gmail protection only after permission is granted", async () => {
    const api = fakeChrome(true);

    await expect(enableGmailProtection(api)).resolves.toBe("ready");
    expect(api.permissions.request).toHaveBeenCalledTimes(1);
    expect(api.scripting.registerContentScripts).toHaveBeenCalledTimes(1);
    expect(api.scripting.executeScript).toHaveBeenCalledTimes(1);
  });

  it("injects into already-open Gmail tabs when permission was previously granted", async () => {
    const api = fakeChrome(true);

    await expect(syncGmailProtection(api)).resolves.toBe(true);

    expect(api.scripting.registerContentScripts).toHaveBeenCalledTimes(1);
    expect(api.tabs?.query).toHaveBeenCalledWith({ url: gmailHostPermission });
    expect(api.scripting.executeScript).toHaveBeenCalledTimes(1);
    expect(api.scripting.insertCSS).toHaveBeenCalledTimes(1);
  });

  it("keeps protection off when the user denies permission", async () => {
    const api = fakeChrome(false);

    await expect(enableGmailProtection(api)).resolves.toBe("denied");
    expect(api.scripting.registerContentScripts).not.toHaveBeenCalled();
  });
});
