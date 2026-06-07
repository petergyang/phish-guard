# Phish Guard

Privacy-first phishing warnings for Gmail, built as a local Chrome extension.

Phish Guard is an early prototype that warns when a Gmail sender looks like it may be pretending to be a brand or organization. For example, if an email says it is from Costco but the actual sender is a random Hotmail address, Phish Guard shows a warning above the message before you click.

The current version focuses on Gmail sender impersonation. The project name is intentionally broader because the same Chrome extension could later help with phishing attempts in DMs, malicious links, fake login pages, or other browser surfaces.

## Why GitHub First

I do not expect Chrome Web Store approval to be the fastest path right now.

Google's Chrome Web Store policies require narrow permissions, accurate privacy disclosures, and the least access needed for the feature. Phish Guard is designed around those rules, but a security extension that injects warnings into Gmail still needs careful review, polish, and trust-building before a normal user should install it from a store listing.

For now, this repo is the distribution and transparency path:

- The code is readable.
- The extension runs locally in the browser.
- Gmail access is optional and scoped to `https://mail.google.com/*`.
- The detector checks the sender row only.
- No email content is uploaded.

## What It Does Today

- Shows an inline warning inside Gmail when an opened message appears to impersonate a brand or organization.
- Compares the visible sender name with the actual sender email address.
- Flags generic organization-style sender names, such as `"Costco Rewards Connection" <random@hotmail.com>`.
- Keeps curated rules for high-confidence brands like Google, YouTube, PayPal, Apple, and Microsoft.
- Avoids warning when a friend merely mentions a brand in the subject or message.

## Privacy Boundary

Allowed Chrome extension inputs:

- visible Gmail sender row text and attributes

Out of scope for the current prototype:

- message body
- snippets
- attachments
- links
- inbox-wide scans
- background Gmail API access
- backend upload
- analytics or telemetry

Chrome may say the extension can "read and change" data on Gmail. The "change" part is needed only to add the warning banner to the Gmail page. Phish Guard does not edit, delete, send, or report emails.

## Install Locally

```bash
npm install
npm test
npm run build:chrome-extension
```

Then:

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select `dist/chrome-extension`.
5. Open Gmail.
6. Open the Phish Guard popup.
7. Click **Turn on Gmail warnings**.

After changing code, run `npm run build:chrome-extension`, reload the extension in `chrome://extensions`, and refresh Gmail.

## Development

```bash
npm test
npm run build
npm audit --audit-level=moderate
```

Project layout:

- `apps/chrome-extension` contains the consumer-facing Chrome extension.
- `packages/detector` contains the local sender-risk detector.
- `apps/gmail-addon` contains an older Gmail add-on experiment.
- `docs/privacy` documents permissions, privacy boundaries, and verification notes.

## Current Status

This is a prototype, not a polished consumer product.

The Gmail extension path is the current focus because it can show warnings where users actually need them: inside the opened email. The Gmail add-on path is kept for reference, but it produced scary Google OAuth warnings during testing and required users to open a side panel.

## Future Directions

- Better Gmail sender extraction across more layouts.
- Link risk checks without uploading page content.
- Warnings for suspicious DMs in web apps.
- Safer onboarding and clearer permission education.
- A formal privacy policy and Chrome Web Store submission if the UX and review posture are strong enough.
