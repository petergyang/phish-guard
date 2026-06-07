# Phish Guard

Phish Guard is a Chrome extension that warns you when a Gmail message looks like brand impersonation.

If an email says it is from Costco, YouTube, PayPal, or another recognizable organization, but the sender address is unrelated, Phish Guard shows a warning inside the message before you click.

![Phish Guard warning inside Gmail](docs/assets/phish-guard-gmail-warning.svg)

## How It Works

1. You open a message in Gmail.
2. Phish Guard reads the visible sender row, such as `Costco Rewards <random@hotmail.com>`.
3. If the sender name claims a brand that does not match the email address, Phish Guard shows a warning above the message header.

Phish Guard runs locally in your browser. It does not upload email data.

## What It Checks

- Sender display name
- Sender email address and domain
- Obvious brand mismatch signals
- Known high-confidence brands like Google, YouTube, PayPal, Apple, Microsoft, and Costco
- Generic organization-style names, such as `Costco Rewards Connection`

It does not warn because a friend mentions a brand in the subject or body. The check is based on who the email claims to be from.

## What The Warning Says

```text
Phish Guard warning: This is likely not from Costco.
Sender email: random@hotmail.com. Avoid links. Use Gmail's Report spam button or delete the email.
```

The warning is intentionally plain. It tells you what looks wrong and what to do next.

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

## Install The Alpha

Phish Guard is not in the Chrome Web Store yet. For now, install it from a GitHub release.

1. Download `phish-guard-chrome-extension.zip` from the [latest release](https://github.com/petergyang/phish-guard/releases).
2. Unzip the file.
3. Open Chrome and go to `chrome://extensions`.
4. Turn on **Developer mode**.
5. Click **Load unpacked**.
6. Select the unzipped extension folder.
7. Open Gmail.
8. Click the Phish Guard extension icon.
9. Click **Turn on Gmail warnings**.

Chrome will ask for Gmail access so Phish Guard can read the sender row and add the warning inside Gmail.

## Build From Source

```bash
npm install
npm test
npm run build:chrome-extension
```

Then load `dist/chrome-extension` from `chrome://extensions`.

To create a ZIP:

```bash
npm run package:chrome-extension
```

The ZIP is created at:

```text
dist/phish-guard-chrome-extension.zip
```

## Test It

Use a test Gmail account if possible.

1. Open a suspicious email where the sender name claims a brand, but the email address is unrelated.
2. Example: `Costco Rewards Connection <random@hotmail.com>`.
3. Confirm a Phish Guard warning appears above the sender row.
4. Open a normal email from a person.
5. Confirm no warning appears just because the message mentions a brand.

If Chrome shows extension errors, open `chrome://extensions`, click **Errors** on Phish Guard, clear stale errors, reload the extension, and refresh Gmail.

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
- `docs/privacy`: Privacy and permission notes
- `docs/store`: Chrome Web Store and release-readiness notes

## Status

Phish Guard is an alpha focused on Gmail sender impersonation. The next step is a Chrome Web Store submission with a public privacy-policy URL, screenshots, icons, and review disclosures.

Future versions may add link checks, DM warnings, and suspicious-login-page warnings while keeping the same privacy rule: Do as much as possible locally, and ask clearly before any broader access.

## Reporting Issues

Use GitHub issues for bugs and false positives. Do not post full email bodies, attachments, private links, or screenshots that reveal personal messages. Sender display names and sender domains are usually enough.

Security and privacy reports should follow [SECURITY.md](SECURITY.md).
