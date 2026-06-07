# Local Install For Development

Use this flow for private testing before the Chrome Web Store listing is approved.

## Build

```bash
npm install
npm test
npm run build:chrome-extension
```

## Load In Chrome

1. Open Chrome and go to `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select `dist/chrome-extension`.
5. Open Gmail.
6. Click the Phish Guard extension icon.
7. Click **Turn on Gmail warnings**.

Chrome asks for Gmail access so Phish Guard can read the sender row and add the warning inside Gmail.

## Package A Private Test Build

```bash
npm run package:chrome-extension
```

The ZIP is created at:

```text
dist/phish-guard-chrome-extension.zip
```

## Smoke Test

Use a test Gmail account when possible.

1. Open a suspicious email where the sender name claims a brand, but the email address is unrelated.
2. Example: `Costco Rewards Connection <random@hotmail.com>`.
3. Confirm a Phish Guard warning appears above the sender row.
4. Open a normal email from a person.
5. Confirm no warning appears just because the message mentions a brand.

If Chrome shows extension errors, open `chrome://extensions`, click **Errors** on Phish Guard, clear stale errors, reload the extension, and refresh Gmail.
