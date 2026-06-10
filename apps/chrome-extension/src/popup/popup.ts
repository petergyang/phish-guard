import {
  activateOpenGmailTabs,
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
      buttonLabel: "Gmail warnings are on",
      buttonDisabled: true,
      statusText: "Ready. Suspicious sender rows will show a warning inside Gmail.",
      statusState: "ready"
    };
  }

  if (state === "busy") {
    return {
      buttonLabel: "Turning on...",
      buttonDisabled: true,
      statusText: "Opening Chrome's Gmail access prompt.",
      statusState: "needs-permission"
    };
  }

  if (state === "denied") {
    return {
      buttonLabel: "Try again",
      buttonDisabled: false,
      statusText: "Gmail warnings are off. Nothing changes until you allow Gmail access.",
      statusState: "denied"
    };
  }

  return {
    buttonLabel: "Turn on Gmail warnings",
    buttonDisabled: false,
    statusText: "Gmail warnings are off until you allow Gmail access.",
    statusState: "needs-permission"
  };
}

export async function enableGmailProtection(api: ExtensionChromeApi): Promise<PopupState> {
  const granted = await requestGmailPermission(api.permissions);
  if (!granted) {
    return "denied";
  }

  await registerGmailProtection(api.scripting);
  await activateOpenGmailTabs(api);
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
  const hasPermission = await hasGmailPermission(chrome.permissions);
  if (hasPermission) {
    await registerGmailProtection(chrome.scripting);
    await activateOpenGmailTabs(chrome);
  }
  const initialState: PopupState = hasPermission ? "ready" : "needs-permission";
  render(popupViewForState(initialState));

  document.querySelector<HTMLButtonElement>("#enable-gmail")?.addEventListener("click", async () => {
    render(popupViewForState("busy"));
    render(popupViewForState(await enableGmailProtection(chrome)));
  });
}

if (typeof document !== "undefined") {
  init().catch(() => render(popupViewForState("denied")));
}
