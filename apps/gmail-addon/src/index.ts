import { analyzeMessage } from "@anti-phishing/detector";
import { renderCardServiceCard, type CardServiceLike } from "./cards/card-service-renderer.js";
import { buildErrorCard, buildWarningCard, type WarningCardModel } from "./cards/warning-card.js";
import {
  createAppsScriptGmailSource,
  readCurrentMessageMetadata,
  type AppsScriptGmailApp,
  type GmailMessageEvent,
  type GmailMetadataSource
} from "./gmail/current-message.js";

export function handleGmailMessage(
  event: GmailMessageEvent,
  source: GmailMetadataSource
): WarningCardModel {
  const currentMessage = readCurrentMessageMetadata(event, source);

  if (!currentMessage.ok) {
    return buildErrorCard();
  }

  return buildWarningCard(analyzeMessage(currentMessage.value.metadata));
}

export interface AppsScriptGlobals {
  GmailApp?: AppsScriptGmailApp;
  CardService?: CardServiceLike;
}

export function onGmailMessage(
  event: GmailMessageEvent,
  globals: AppsScriptGlobals = globalThis as unknown as AppsScriptGlobals
): unknown {
  if (!globals.GmailApp || !globals.CardService) {
    return buildErrorCard();
  }

  const model = handleGmailMessage(event, createAppsScriptGmailSource(globals.GmailApp));
  return renderCardServiceCard(model, globals.CardService);
}
