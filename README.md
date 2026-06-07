# Phish Guard

![Phish Guard warning inside Gmail](docs/assets/phish-guard-gmail-warning.svg)

Phish Guard is a Chrome extension that warns you when a Gmail message looks like brand impersonation.

If an email says it is from Costco, YouTube, PayPal, or another recognizable organization, but the sender address is unrelated, Phish Guard shows a warning inside the message before you click.

## How It Works

1. You open a message in Gmail.
2. Phish Guard reads the visible sender row, such as `Costco Rewards <random@hotmail.com>`.
3. If the sender name claims a brand that does not match the email address, Phish Guard shows a warning above the message header.

Phish Guard runs locally in your browser and does not upload email data.

## What It Checks

- Sender display name
- Sender email address and domain
- Obvious brand mismatch signals
- Known high-confidence brands like Google, YouTube, PayPal, Apple, Microsoft, and Costco
- Generic organization-style names, such as `Costco Rewards Connection`

It does not warn because a friend mentions a brand in the subject or body. The check is based on who the email claims to be from.

## Warning Copy

```text
Phish Guard warning: This is likely not from Costco.
Sender email: random@hotmail.com. Avoid links. Use Gmail's Report spam button or delete the email.
```

The warning is intentionally plain. It tells you what looks wrong and what to do next.

## Install

Phish Guard is being prepared for Chrome Web Store review. The public install link will live here after the unlisted listing is approved.

For local development and private testing, see [docs/development/local-install.md](docs/development/local-install.md).

## Privacy

Phish Guard currently reads only the visible sender row in the open Gmail message.

It does not read:

- Message bodies
- Attachments
- Links inside the message
- Inbox history
- Contacts
- Cookies
- Passwords

Chrome may say Phish Guard can "read and change" data on Gmail. The "read" part is for the sender row. The "change" part is for adding the warning banner. Phish Guard does not edit, delete, send, archive, label, or report emails.

Read the full policy in [PRIVACY.md](PRIVACY.md).

## Development

```bash
npm test
npm run build
npm audit --audit-level=moderate
npm run package:chrome-extension
```

Project layout:

- `apps/chrome-extension`: Consumer-facing Chrome extension
- `packages/detector`: Local sender-risk detector
- `apps/gmail-addon`: Earlier Gmail add-on experiment
- `docs/development`: Local development and private testing notes
- `docs/privacy`: Privacy and permission notes
- `docs/store`: Chrome Web Store and release-readiness notes

## Reporting Issues

Use GitHub issues for bugs and false positives. Do not post full email bodies, attachments, private links, or screenshots that reveal personal messages. Sender display names and sender domains are usually enough.

Security and privacy reports should follow [SECURITY.md](SECURITY.md).
