import { activateOpenGmailTabs, gmailPermissionRequest, hasGmailPermission, registerGmailProtection, type ExtensionChromeApi } from "./permissions.js";

declare const chrome: ExtensionChromeApi;

if (typeof chrome !== "undefined") {
  chrome.permissions.contains(gmailPermissionRequest()).then(async (granted) => {
    if (granted) {
      await registerGmailProtection(chrome.scripting);
      await activateOpenGmailTabs(chrome);
    }
  }).catch(() => undefined);
}

export async function syncGmailProtection(api: ExtensionChromeApi): Promise<boolean> {
  const granted = await hasGmailPermission(api.permissions);
  if (granted) {
    await registerGmailProtection(api.scripting);
    await activateOpenGmailTabs(api);
  }
  return granted;
}
