import type { WarningCardModel } from "./warning-card.js";

export interface CardServiceTextParagraph {
  setText(text: string): CardServiceTextParagraph;
}

export interface CardServiceSection {
  addWidget(widget: unknown): CardServiceSection;
}

export interface CardServiceCardBuilder {
  setHeader(header: unknown): CardServiceCardBuilder;
  addSection(section: CardServiceSection): CardServiceCardBuilder;
  build(): unknown;
}

export interface CardServiceCardHeader {
  setTitle(title: string): CardServiceCardHeader;
  setSubtitle(subtitle: string): CardServiceCardHeader;
}

export interface CardServiceLike {
  newCardBuilder(): CardServiceCardBuilder;
  newCardHeader(): CardServiceCardHeader;
  newCardSection(): CardServiceSection;
  newTextParagraph(): CardServiceTextParagraph;
}

export function renderCardServiceCard(model: WarningCardModel, cardService: CardServiceLike): unknown {
  const header = cardService
    .newCardHeader()
    .setTitle(model.title)
    .setSubtitle(model.state.replace("_", " "));

  const section = cardService
    .newCardSection()
    .addWidget(cardService.newTextParagraph().setText(model.summary));

  for (const item of model.evidence) {
    section.addWidget(cardService.newTextParagraph().setText(item.message));
  }

  section.addWidget(cardService.newTextParagraph().setText(model.privacyNote));

  return cardService
    .newCardBuilder()
    .setHeader(header)
    .addSection(section)
    .build();
}
