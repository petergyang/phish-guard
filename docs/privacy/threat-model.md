# Threat Model

## Privacy Promise

The MVP checks the currently opened Gmail message locally. It inspects the visible sender row, subject, body text, image labels, and link URLs for phishing signals. It does not read attachments, scan the rest of the inbox, visit links, or upload email data.

## Protected Data

- Real private email exports, screenshots, and snippets outside synthetic testing
- Attachments and filenames
- Link destinations outside the open message
- Inbox history and mailbox-wide metadata
- Sender metadata from messages the user has not opened

## Allowed MVP Data

- `From`
- `Reply-To`
- `Subject`
- visible Gmail sender row text and attributes
- visible body text and image labels for the open message
- link URLs for the open message
- selected authentication headers when the Gmail add-on surface exposes them
- derived values such as sender domain, claimed brand, risk level, and explanation text

## Primary Risks

- **Overcollection:** An adapter accidentally forwards content outside the open message into the detector.
- **DOM overreach:** The Chrome extension can technically see more Gmail page content than the product needs.
- **Permission drift:** A future feature asks for broader Gmail or Chrome access without a new consent review.
- **Server exfiltration:** A future backend receives sender metadata or email content by default.
- **False certainty:** The UI says a message is phishing when the evidence only supports "suspicious."
- **Rule staleness:** Trusted-domain rules fall behind real brand sending patterns.

## Mitigations

- Keep the detector pure and local.
- Test that private attachments, inbox history, and unopened messages stay outside detector inputs.
- Test that the Chrome extension DOM adapter extracts only the open message fields needed by the detector.
- Document every requested permission before public testing.
- Use evidence-based warning copy.
- Keep brand rules data-first and covered by domain-matching tests.

## Non-Goals

- Replacing Gmail's native phishing classifier
- Reading private email content for AI analysis
- Scanning the inbox in the background
- Making a final malicious/not-malicious judgment
