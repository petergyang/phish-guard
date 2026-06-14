# Phish Guard

<video src="docs/assets/readme/phish-guard-launch-v5.mp4" controls muted playsinline width="100%"></video>

Phish Guard is a free Chrome extension that warns you inside Gmail when an email may be pretending to be a company you trust.

It runs locally on your computer, does not upload your email, and does not require an account.

## Enough with the phishing emails

![Phish Guard warning for an HBO impersonation email](docs/assets/readme/phish-guard-example.png)

Spam emails often copy the names and logos of companies you know. They say a payment failed, a package is stuck, or your subscription needs attention. The goal is to make you click before you think.

Phish Guard gives you a second pair of eyes. If the sender does not match the company the email claims to be from, it shows a plain warning above the message. It stays quiet for normal email.

## How to install

Currently, Phish Guard uses Chrome's manual extension install flow. It is a little clunky, but it takes about two minutes.

![Chrome extension setup screen](docs/assets/readme/chrome-extension-setup.svg)

1. [Download `phish-guard-chrome-extension.zip`](https://github.com/petergyang/phish-guard/releases/download/v0.2.5-alpha/phish-guard-chrome-extension.zip).
2. Unzip the file.
3. Open Chrome and go to `chrome://extensions`.
4. Turn on **Developer mode**.
5. Click **Load unpacked**.
6. Select the unzipped folder that contains `manifest.json`.
7. Open Gmail, click the Phish Guard toolbar icon, and choose **Turn on Gmail warnings**.

Chrome asks for `mail.google.com` access so Phish Guard can check the open message and add the warning banner. A Chrome Web Store version is planned if the alpha goes well.

If Chrome shows extension errors later, go back to `chrome://extensions`, click **Reload** on Phish Guard, and refresh Gmail.

## How Phish Guard works

When you turn on Gmail warnings, Chrome gives Phish Guard permission to run on `mail.google.com`. The extension watches the Gmail message view and reads only the message you have open.

Phish Guard checks the sender name, sender email address, subject, visible message text, and links. It compares what the email claims to be with where it actually came from.

If the evidence looks suspicious, Phish Guard adds a warning banner inside Gmail. Everything runs locally in your browser; there is no server, account, analytics, or email upload.

## Private and local first

Phish Guard checks only the Gmail message you have open. It looks at the sender, subject, visible words, and links in that message.

It does **not**:

- Upload your email.
- Scan your inbox history.
- Read attachments.
- Access your contacts, cookies, or passwords.
- Visit links for you.
- Edit, delete, send, archive, label, or report emails.

Read the full policy in [PRIVACY.md](PRIVACY.md).

## How to contribute

Eventually I want this extension to work across other phishing attempts. Contributions are welcome.

Open an issue or pull request if you spot a bug, a false positive, or a way to make Phish Guard better.

Please do not post full email bodies, attachments, private links, or private inbox screenshots. Sender names and domains are usually enough.
