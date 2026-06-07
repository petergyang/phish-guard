# Phish Guard

Privacy-first browser warnings for phishing attempts, starting with Gmail sender impersonation.

Phish Guard is a Chrome extension prototype that helps normal people notice suspicious sender mismatches before they click. If an email says it is from Costco but the actual sender is a random Hotmail address, Phish Guard shows a clear warning above the email:

> Phish Guard warning: This is likely not from Costco.
> Sender email: random@hotmail.com. Avoid links. Use Gmail's Report spam button or delete the email.

The current version focuses on Gmail. The broader goal is a lightweight browser safety layer for phishing attempts in email, DMs, fake login pages, and suspicious links.

## Why This Is GitHub-First

This is not in the Chrome Web Store yet.

Google's Chrome Web Store policies require narrow permissions, accurate privacy disclosures, and the least access needed for the feature. Phish Guard is designed around those rules, but a security extension that injects warnings into Gmail still needs more polish, review, and trust-building before it should be handed to everyday users through a store listing.

For now, this repo is the distribution and transparency path:

- The code is readable.
- The extension runs locally in the browser.
- Gmail access is optional and scoped to `https://mail.google.com/*`.
- The detector checks the sender row only.
- No email content is uploaded.

That also means installation is less convenient than a store install. Treat this as an alpha for technical testers and curious friends, not a finished consumer product.

## What It Does Today

- Shows an inline warning inside Gmail when an opened message appears to impersonate a brand or organization.
- Compares the visible sender name with the actual sender email address.
- Flags generic organization-style sender names, such as `"Costco Rewards Connection" <random@hotmail.com>`.
- Keeps curated rules for high-confidence brands like Google, YouTube, PayPal, Apple, and Microsoft.
- Avoids warning when a friend merely mentions a brand in the subject or message.

## What It Does Not Do

- It does not decide whether every email is safe.
- It does not scan your inbox in the background.
- It does not click, block, delete, report, or modify email.
- It does not inspect message bodies, attachments, or links in the current prototype.
- It does not send your email data to a server.

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

## Install For Testing

### Option A: If Someone Gives You A Built Folder

This is the easiest path for non-technical testers.

1. Download and unzip the provided `phish-guard-chrome-extension.zip` file.
2. Open Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode** in the top-right.
4. Click **Load unpacked**.
5. Select the unzipped extension folder.
6. Open Gmail.
7. Click the Phish Guard extension icon.
8. Click **Turn on Gmail warnings**.
9. Chrome will ask for Gmail access. This is required so Phish Guard can add a warning inside Gmail.

If Chrome says the extension can "read and change" Gmail, that means it can read the sender row and add the warning banner. It does not edit, delete, send, or report emails.

### Option B: Build It Yourself

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

To create a ZIP for another tester:

```bash
npm run package:chrome-extension
```

That creates:

```text
dist/phish-guard-chrome-extension.zip
```

## How To Test It

Use a test Gmail account if possible.

1. Open a suspicious email where the sender name claims a brand, but the email address is unrelated.
2. Example: `"Costco Rewards Connection" <random@hotmail.com>`.
3. Confirm a Phish Guard warning appears above the sender row.
4. Open a normal email from a friend.
5. Confirm no warning appears just because the subject or body mentions a brand.

If the extension behaves weirdly:

- Go to `chrome://extensions`.
- Click **Errors** on Phish Guard.
- Click **Clear all**.
- Reload the extension.
- Refresh Gmail.
- If a new error appears after clearing, file an issue with the exact error text and screenshot.

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

The next big product job is trust. A phishing-protection tool has to feel obviously safer than the thing it is warning about. That means clearer onboarding, a cleaner install path, screenshots, a privacy policy, and more real-world Gmail layout testing.

## Future Directions

- Better Gmail sender extraction across more layouts.
- Link risk checks without uploading page content.
- Warnings for suspicious DMs in web apps.
- Safer onboarding and clearer permission education.
- Prebuilt GitHub releases for testers who should not need Node.js.
- A formal privacy policy and Chrome Web Store submission if the UX and review posture are strong enough.
