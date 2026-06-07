export const gmailHostPermission = "https://mail.google.com/*";

export interface ExtensionPermissionsApi {
  contains(request: { origins: string[] }): Promise<boolean>;
  request(request: { origins: string[] }): Promise<boolean>;
}

export interface ExtensionScriptingApi {
  registerContentScripts(scripts: Array<{
    id: string;
    matches: string[];
    js: string[];
    css?: string[];
    runAt?: "document_idle";
    persistAcrossSessions?: boolean;
  }>): Promise<void>;
  unregisterContentScripts(filter: { ids: string[] }): Promise<void>;
  executeScript(injection: { target: { tabId: number }; files: string[] }): Promise<unknown>;
  insertCSS(injection: { target: { tabId: number }; files: string[] }): Promise<void>;
}

export interface ExtensionTabsApi {
  query(queryInfo: { active?: boolean; currentWindow?: boolean; url?: string | string[] }): Promise<Array<{ id?: number; url?: string }>>;
}

export interface ExtensionChromeApi {
  permissions: ExtensionPermissionsApi;
  scripting: ExtensionScriptingApi;
  tabs?: ExtensionTabsApi;
}

export const gmailContentScriptId = "gmail-phish-guard-content";

export function gmailPermissionRequest(): { origins: string[] } {
  return { origins: [gmailHostPermission] };
}

export async function hasGmailPermission(api: ExtensionPermissionsApi): Promise<boolean> {
  return api.contains(gmailPermissionRequest());
}

export async function requestGmailPermission(api: ExtensionPermissionsApi): Promise<boolean> {
  return api.request(gmailPermissionRequest());
}

export async function registerGmailProtection(api: ExtensionScriptingApi): Promise<void> {
  await api.unregisterContentScripts({ ids: [gmailContentScriptId] }).catch(() => undefined);
  await api.registerContentScripts([
    {
      id: gmailContentScriptId,
      matches: [gmailHostPermission],
      js: ["content/gmail-content.js"],
      css: ["ui/banner.css"],
      runAt: "document_idle",
      persistAcrossSessions: true
    }
  ]);
}

export async function activateGmailTab(api: Pick<ExtensionChromeApi, "scripting">, tab: { id?: number; url?: string }): Promise<boolean> {
  if (!tab.id || !tab.url?.startsWith("https://mail.google.com/")) {
    return false;
  }

  await api.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ["ui/banner.css"]
  });
  await api.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content/gmail-content.js"]
  });
  return true;
}

export async function activateCurrentGmailTab(api: Pick<ExtensionChromeApi, "scripting" | "tabs">): Promise<boolean> {
  const [tab] = await api.tabs?.query({ active: true, currentWindow: true }) ?? [];
  return tab ? activateGmailTab(api, tab) : false;
}

export async function activateOpenGmailTabs(api: Pick<ExtensionChromeApi, "scripting" | "tabs">): Promise<number> {
  const tabs = await api.tabs?.query({ url: gmailHostPermission }) ?? [];
  const results = await Promise.all(tabs.map((tab) => activateGmailTab(api, tab).catch(() => false)));
  return results.filter(Boolean).length;
}
