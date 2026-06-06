import { gmailPermissionRequest, hasGmailPermission, registerGmailProtection, type ExtensionChromeApi } from "./permissions.js";

declare const chrome: ExtensionChromeApi;

chrome.permissions.contains(gmailPermissionRequest()).then(async (granted) => {
  if (granted) {
    await registerGmailProtection(chrome.scripting);
  }
}).catch(() => undefined);

export async function syncGmailProtection(api: ExtensionChromeApi): Promise<boolean> {
  const granted = await hasGmailPermission(api.permissions);
  if (granted) {
    await registerGmailProtection(api.scripting);
  }
  return granted;
}
