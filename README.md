# Phish Guard

![Phish Guard warning inside Gmail](docs/assets/phish-guard-gmail-warning.svg)

Phish Guard is a Chrome extension that warns you when an open Gmail message looks like brand impersonation.

If an email says it is from Costco, YouTube, PayPal, or another recognizable organization, but the sender address, message text, or links do not line up, Phish Guard shows a warning inside the message before you click.

## How It Works

1. You open a message in Gmail.
2. Phish Guard checks the visible sender row, subject, body text, and links for that open email.
3. If the evidence points to brand impersonation, Phish Guard shows a warning above the message header.

Phish Guard runs locally in your browser and does not upload email data.

## What It Checks

- Sender display name
- Sender email address and domain
- Subject and visible body text in the open message
- Link URLs and visible link text in the open message
- Obvious brand mismatch signals
- Link domains that do not match the claimed brand
- URL shorteners in brand-like messages
- Subscription, payment, account, and urgency language
- Known high-confidence brands like Google, YouTube, PayPal, Apple, Microsoft, and HBO Max
- Generic organization-style names, such as `Costco Rewards Connection`

## What It Tries Not To Flag

Phish Guard should not warn just because:

- A friend casually mentions a brand.
- A newsletter discusses Apple, Google, Microsoft, or another company.
- A legitimate email has YouTube, Instagram, Facebook, or `t.co` social-footer links.
- A trusted sender uses common email-service tracking links.
- A reply includes quoted text from an older suspicious email.
- A platform email explicitly says it was sent through a known service, such as `via Luma`.

Body checks look for brand claims near scam-like context, such as subscription, payment, verification, renewal, or urgency language. That keeps normal brand mentions from turning into warnings.

## Warning Copy

```text
Phish Guard warning: This is likely not from Costco.
Sender email: random@hotmail.com. Avoid links. Use Gmail's Report spam button or delete the email.
```

The warning is intentionally plain. It tells you what looks wrong and what to do next.

## Install

Chrome Web Store link coming soon.

For private testing:

1. Download `phish-guard-chrome-extension.zip` from the latest GitHub release.
2. Unzip it.
3. Open `chrome://extensions`.
4. Turn on **Developer mode**.
5. Click **Load unpacked**.
6. Select the unzipped `chrome-extension` folder.
7. Open Gmail, click the Phish Guard toolbar icon, and turn on Gmail warnings.

For local development, see [docs/development/local-install.md](docs/development/local-install.md).

## Privacy

Phish Guard reads the visible sender row, subject, body text, and link URLs for the open Gmail message. It uses that data locally to decide whether to show a warning.

It does not read:

- Attachments
- Inbox history
- Contacts
- Cookies
- Passwords

It does not visit links or upload link URLs.

Chrome may say Phish Guard can "read and change" data on Gmail. The "read" part is for inspecting the open message locally. The "change" part is for adding the warning banner. Phish Guard does not edit, delete, send, archive, label, or report emails.

Read the full policy in [PRIVACY.md](PRIVACY.md).

## Development

```bash
npm test
npm run eval:detector
npm run build
npm audit --audit-level=moderate
npm run package:chrome-extension
```

Project layout:

- `apps/chrome-extension`: Consumer-facing Chrome extension
- `packages/detector`: Local sender-risk detector
- `packages/detector/fixtures/corpus`: Synthetic detector evaluation corpus
- `apps/gmail-addon`: Earlier Gmail add-on experiment
- `docs/development`: Local development and private testing notes
- `docs/privacy`: Privacy and permission notes
- `docs/store`: Chrome Web Store and release-readiness notes

## Detector Evaluation

`npm run eval:detector` runs a synthetic corpus of phishing and safe messages. The current corpus includes sender spoofing, body-brand claims, suspicious links, social footers, tracking links, quoted replies, newsletters, and platform delegation.

This is a regression gate, not a real-world accuracy claim. Add a safe fixture whenever Phish Guard flags a legitimate email, and add a phishing fixture whenever it misses a real attempt.

## Reporting Issues

Use GitHub issues for bugs and false positives. Do not post full email bodies, attachments, private links, or screenshots that reveal personal messages. Sender display names and sender domains are usually enough.

Security and privacy reports should follow [SECURITY.md](SECURITY.md).
