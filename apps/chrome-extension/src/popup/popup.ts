import {
  activateCurrentGmailTab,
  hasGmailPermission,
  registerGmailProtection,
  requestGmailPermission,
  type ExtensionChromeApi
} from "../background/permissions.js";

declare const chrome: ExtensionChromeApi;

export type PopupState = "ready" | "needs-permission" | "denied" | "busy";

export interface PopupView {
  buttonLabel: string;
  buttonDisabled: boolean;
  statusText: string;
  statusState: Exclude<PopupState, "busy">;
}

export function popupViewForState(state: PopupState): PopupView {
  if (state === "ready") {
    return {
      buttonLabel: "Gmail protection is on",
      buttonDisabled: true,
      statusText: "Ready. Open a Gmail message and suspicious senders will show an inline warning.",
      statusState: "ready"
    };
  }

  if (state === "busy") {
    return {
      buttonLabel: "Checking...",
      buttonDisabled: true,
      statusText: "Checking Gmail access.",
      statusState: "needs-permission"
    };
  }

  if (state === "denied") {
    return {
      buttonLabel: "Try again",
      buttonDisabled: false,
      statusText: "Gmail protection is still off. You can turn it on whenever you want.",
      statusState: "denied"
    };
  }

  return {
    buttonLabel: "Protect Gmail",
    buttonDisabled: false,
    statusText: "Gmail access is off. Turn it on to show warnings inside opened emails.",
    statusState: "needs-permission"
  };
}

export async function enableGmailProtection(api: ExtensionChromeApi): Promise<PopupState> {
  const granted = await requestGmailPermission(api.permissions);
  if (!granted) {
    return "denied";
  }

  await registerGmailProtection(api.scripting);
  await activateCurrentGmailTab(api);
  return "ready";
}

function render(view: PopupView): void {
  const button = document.querySelector<HTMLButtonElement>("#enable-gmail");
  const status = document.querySelector<HTMLElement>("#status");
  if (!button || !status) return;

  button.textContent = view.buttonLabel;
  button.disabled = view.buttonDisabled;
  status.textContent = view.statusText;
  status.dataset.state = view.statusState;
}

async function init(): Promise<void> {
  render(popupViewForState("busy"));
  const initialState: PopupState = await hasGmailPermission(chrome.permissions) ? "ready" : "needs-permission";
  render(popupViewForState(initialState));

  document.querySelector<HTMLButtonElement>("#enable-gmail")?.addEventListener("click", async () => {
    render(popupViewForState("busy"));
    render(popupViewForState(await enableGmailProtection(chrome)));
  });
}

if (typeof document !== "undefined") {
  init().catch(() => render(popupViewForState("denied")));
}
