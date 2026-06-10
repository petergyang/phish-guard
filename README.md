# Phish Guard

![Phish Guard warning for a Costco impersonation email](docs/assets/readme/costco-warning.png)

Phish Guard is a Chrome extension that warns you inside Gmail when an email is pretending to be a company you trust.

## Why Use It

Scam emails look real now. They copy the names and logos of companies you know — Amazon, Netflix, PayPal, Costco, your bank — and say a payment failed, a package is stuck, or you won a reward. The goal is to rush you into clicking a link before you think.

Some of these land in your inbox even with Gmail's spam filter. Phish Guard is a second pair of eyes for exactly that moment:

- When the sender does not match the company the email claims to be, a plain warning appears right above the message.
- The warning tells you what is wrong in normal language: who the email pretends to be, and what the real sender address is.
- It stays quiet for normal email. A friend mentioning YouTube, a newsletter talking about Apple, or a small business emailing from its own Gmail address will not set it off.

It is free, runs entirely on your computer, and needs no account or signup.

![Phish Guard warning for an HBO impersonation email](docs/assets/readme/hbo-warning.png)

## What It Checks

Phish Guard checks only the email you have open. It looks at:

- Who the email says it is from.
- The actual sender email address.
- The visible words and links in that open email.
- Whether a brand name and sender address look like they belong together.

It recognizes more than 25 commonly impersonated brands, including Amazon, Netflix, PayPal, Apple, Microsoft, Google, USPS, FedEx, and major banks, and it also catches impersonation of companies it has never heard of by comparing the sender name to the sender address.

## Privacy

Phish Guard runs locally in your browser.

It does **not**:

- Upload your email.
- Scan your inbox history.
- Read attachments.
- Access your contacts, cookies, or passwords.
- Visit links for you.
- Edit, delete, send, archive, label, or report emails.

Chrome may say the extension can "read and change" data on Gmail. That sounds scary, but here it means:

- **Read:** check the open message locally.
- **Change:** add the warning banner inside Gmail.

Read the full policy in [PRIVACY.md](PRIVACY.md).

## Install

Chrome Web Store link coming soon.

For now, install it manually from GitHub. It takes about two minutes. Turning on "Developer mode" is just how Chrome lets you install extensions outside the store — it does not change anything else about your browser:

![Chrome extension setup screen](docs/assets/readme/chrome-extension-setup.svg)

1. Go to [Phish Guard releases](https://github.com/petergyang/phish-guard/releases) and open the newest release.
2. Download `phish-guard-chrome-extension.zip`.
3. Unzip the file.
4. Open Chrome and go to `chrome://extensions`.
5. Turn on **Developer mode**, then click **Load unpacked**.
6. Select the unzipped folder that contains `manifest.json`.
7. Open Gmail, click the Phish Guard toolbar icon, and turn on Gmail warnings.

If Chrome shows extension errors later, go back to `chrome://extensions`, click **Reload** on Phish Guard, and refresh Gmail.

## Technical Notes

```bash
npm test
npm run eval:detector
npm run build
npm run package:chrome-extension
```

`npm run eval:detector` runs a synthetic phishing/safe-message test set. It is a regression check, not a real-world accuracy claim.

For a local source build, run `npm install`, `npm test`, and `npm run build:chrome-extension`, then load `dist/chrome-extension` from `chrome://extensions`.

Report bugs and false positives with GitHub issues, but do not post full email bodies, attachments, private links, or private inbox screenshots. Sender display names and domains are usually enough.
