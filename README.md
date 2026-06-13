# Phish Guard

![Phish Guard warning for a Costco impersonation email](docs/assets/readme/costco-warning.png)

Phish Guard is a Chrome extension that warns you inside Gmail when an email is pretending to be a company you trust. You can install the current alpha from GitHub. A Chrome Web Store version is planned if this goes well.

## Why Use It

Most spam emails copy the names and logos of companies you know. They say a payment failed, a package is stuck, or you won a reward. The goal is to rush you into clicking a link before you think.

Some of these land in your inbox even with Gmail's spam filter. Phish Guard is a second pair of eyes.

1. When the sender does not match the company the email claims to be, a plain warning appears right above the message.
2. The warning tells you what is wrong in normal language: who the email pretends to be, and what the real sender address is.
3. It stays quiet for normal email. A friend mentioning YouTube, a newsletter talking about Apple, or a small business emailing from its own Gmail address should not set it off.

It's 100% free, runs entirely locally on your computer, and doesn't require an account or sign up.

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

- **Read:** Check the open message locally.
- **Change:** Add the warning banner inside Gmail.

Read the full policy in [PRIVACY.md](PRIVACY.md).

## Install

The current alpha uses Chrome's manual extension install flow:

![Chrome extension setup screen](docs/assets/readme/chrome-extension-setup.svg)

1. Go to [Phish Guard releases](https://github.com/petergyang/phish-guard/releases).
2. Open the newest release and download `phish-guard-chrome-extension.zip`.
3. Unzip the file.
4. Open Chrome and go to `chrome://extensions`.
5. Turn on **Developer mode**.
6. Click **Load unpacked**.
7. Select the unzipped folder that contains `manifest.json`.
8. Open Gmail, click the Phish Guard toolbar icon, and choose **Turn on Gmail warnings**.

Chrome asks for `mail.google.com` access so Phish Guard can check the open message and add the warning banner.

If Chrome shows extension errors later, go back to `chrome://extensions`, click **Reload** on Phish Guard, and refresh Gmail.

Contributions are welcome. Open an issue or pull request if you spot a bug, a false positive, or a way to make Phish Guard better.

## Technical Notes

```bash
npm test
npm run eval:detector
npm run build
npm run package:chrome-extension
```

`npm run eval:detector` runs a synthetic phishing/safe-message test set. It is a regression check, not a real-world accuracy claim.

For source builds and tester ZIP installs, see [docs/development/local-install.md](docs/development/local-install.md).
