# Apps Script Deployment

## What Gets Deployed

`npm run build:gmail-addon` creates:

- `dist/gmail-addon/Code.js`
- `dist/gmail-addon/appsscript.json`
- `dist/gmail-addon/README.md`

`Code.js` is a bundled Apps Script-compatible file. It exposes a global `onGmailMessage(e)` function, which is the contextual trigger configured in `appsscript.json`.

## First-Time Setup

```bash
npm run clasp:login
npm run build:gmail-addon
npm run clasp:create:gmail-addon
```

The create command links the local repo to a new Apps Script project through `.clasp.json`.

## Push Updates

```bash
npm run deploy:gmail-addon
```

## Gmail Test Deployment

In Apps Script:

1. Open the linked project.
2. Confirm `Code.js` and `appsscript.json` are present.
3. Create a test deployment for the Gmail add-on.
4. Install it in a test Gmail account.
5. Open a synthetic test email and run Gmail Phish Guard from the add-on panel.

Test deployments can show Google's "unverified app" warning because the app has not completed OAuth verification. That is expected during development, but it is not an acceptable consumer install experience.

## Production Distribution

Before asking normal users to install the add-on:

- Configure the OAuth consent screen with the app name, logo, support email, homepage, privacy policy, and exact scopes.
- Publish through Google Workspace Marketplace.
- Complete Google's OAuth verification for the Gmail add-on scopes.
- Re-test the install flow from a fresh Google account.

Do not send consumers through the Apps Script test deployment flow.

## Privacy Check

The deployed manifest requests only:

```text
https://www.googleapis.com/auth/script.locale
https://www.googleapis.com/auth/gmail.addons.execute
https://www.googleapis.com/auth/gmail.addons.current.message.metadata
```

Do not add broader Gmail API scopes during test deployment.

The add-on uses Google's public blue shield-with-exclamation icon:

```text
https://www.gstatic.com/images/icons/material/system/2x/gpp_maybe_googblue_48dp.png
```

Keep the icon high-contrast so it remains visible in Gmail dark mode.
