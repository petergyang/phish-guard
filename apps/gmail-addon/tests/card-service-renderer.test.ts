import { describe, expect, it } from "vitest";
import { onGmailMessage, onHomepage } from "../src/index.js";
import type {
  CardServiceCardBuilder,
  CardServiceCardHeader,
  CardServiceLike,
  CardServiceSection,
  CardServiceTextParagraph
} from "../src/cards/card-service-renderer.js";

describe("Apps Script entrypoint", () => {
  it("renders a CardService card for the current Gmail message", () => {
    const rendered = onGmailMessage({
      messageMetadata: { messageId: "msg-1", accessToken: "token-1" }
    }, {
      GmailApp: {
        setCurrentMessageAccessToken: () => undefined,
        getMessageById: () => ({
          getFrom: () => "\"YouTube Account Recovery\" <random@gmail.com>",
          getReplyTo: () => "random@gmail.com",
          getSubject: () => "Recover your account"
        })
      },
      CardService: createFakeCardService()
    });

    expect(rendered).toMatchObject({
      header: {
        title: "⚠️ Heads up: this might not be YouTube",
        subtitle: "suspicious"
      }
    });
    expect(JSON.stringify(rendered)).toContain("random@gmail.com");
    expect(JSON.stringify(rendered)).toContain("does not inspect the message body");
  });

  it("renders a homepage card for test deployment installability", () => {
    const rendered = onHomepage({ CardService: createFakeCardService() });

    expect(rendered).toMatchObject({
      header: {
        title: "Gmail Phish Guard",
        subtitle: "Open an email to check the sender"
      }
    });
    expect(JSON.stringify(rendered)).toContain("sender metadata only");
  });
});

function createFakeCardService(): CardServiceLike {
  return {
    newCardHeader: () => {
      const header = {
        title: "",
        subtitle: "",
        setTitle(title: string) {
          this.title = title;
          return this;
        },
        setSubtitle(subtitle: string) {
          this.subtitle = subtitle;
          return this;
        },
        get value() {
          return { title: this.title, subtitle: this.subtitle };
        }
      };
      return header as CardServiceCardHeader & { value: { title: string; subtitle: string } };
    },
    newTextParagraph: () => {
      const paragraph = {
        text: "",
        setText(text: string) {
          this.text = text;
          return this;
        }
      };
      return paragraph as CardServiceTextParagraph;
    },
    newDecoratedText: () => {
      const decorated = {
        topLabel: "",
        text: "",
        setTopLabel(label: string) {
          this.topLabel = label;
          return this;
        },
        setText(text: string) {
          this.text = text;
          return this;
        }
      };
      return decorated;
    },
    newCardSection: () => {
      const section = {
        widgets: [] as unknown[],
        addWidget(widget: unknown) {
          this.widgets.push(widget);
          return this;
        },
      };
      return section as CardServiceSection & { widgets: unknown[] };
    },
    newCardBuilder: () => {
      const builder = {
        card: { header: undefined as unknown, sections: [] as unknown[] },
        setHeader(header: unknown) {
          this.card.header = "value" in Object(header) ? (header as { value: unknown }).value : header;
          return this;
        },
        addSection(section: CardServiceSection) {
          this.card.sections.push(section);
          return this;
        },
        build() {
          return this.card;
        }
      };
      return builder as CardServiceCardBuilder;
    }
  };
}
