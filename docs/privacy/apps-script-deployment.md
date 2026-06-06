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

## Privacy Check

The deployed manifest requests only:

```text
https://www.googleapis.com/auth/gmail.addons.current.message.metadata
```

Do not add broader Gmail API scopes during test deployment.
