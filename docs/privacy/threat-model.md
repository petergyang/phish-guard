# Threat Model

## Privacy Promise

The MVP checks sender metadata for the currently opened Gmail message. It does not inspect message bodies, attachments, links, images, or the rest of the inbox.

## Protected Data

- Private email body content
- Attachments and filenames
- Link destinations in the message body
- Inbox history and mailbox-wide metadata
- Sender metadata from messages the user has not opened

## Allowed MVP Data

- `From`
- `Reply-To`
- `Subject`
- selected authentication headers when the Gmail add-on surface exposes them
- derived values such as sender domain, claimed brand, risk level, and explanation text

## Primary Risks

- **Overcollection:** The add-on accidentally forwards body-like fields into the detector.
- **Permission drift:** A future feature asks for broader Gmail or Chrome access without a new consent review.
- **Server exfiltration:** A future backend receives sender metadata or email content by default.
- **False certainty:** The UI says a message is phishing when the evidence only supports "suspicious."
- **Rule staleness:** Trusted-domain rules fall behind real brand sending patterns.

## Mitigations

- Keep the detector pure and local.
- Test that body-like fields are ignored at the Gmail adapter boundary.
- Document every requested permission before public testing.
- Use evidence-based warning copy.
- Keep brand rules data-first and covered by domain-matching tests.

## Non-Goals

- Replacing Gmail's native phishing classifier
- Reading private email content for AI analysis
- Scanning the inbox in the background
- Making a final malicious/not-malicious judgment
