# Gmail Phish Guard

Privacy-safe Gmail sender warnings for brand impersonation.

The consumer MVP is a Chrome extension that shows an inline warning inside Gmail when a sender looks like it may be impersonating a trusted brand. It checks the sender row locally. It does not scan the inbox, read message bodies, upload email content, or analyze attachments and links.

## Current Shape

- `packages/detector` contains the pure sender-risk detector.
- `apps/chrome-extension` contains the consumer-facing inline Gmail warning surface.
- `apps/gmail-addon` contains a testable Gmail add-on adapter and warning-card model.
- `docs/privacy` documents the privacy boundary, permissions, options, and manual verification flow.

## Commands

```bash
npm install
npm test
npm run build
```

## Chrome Extension MVP

The Chrome extension is the current consumer MVP because the warning appears where a normal Gmail user will see it: inside the opened email.

```bash
npm run build:chrome-extension
```

Then load `dist/chrome-extension` in Chrome with Extensions > Developer mode > Load unpacked.

The extension installs without Google OAuth. The user turns on Gmail protection from the extension popup, which asks Chrome for access only to:

```text
https://mail.google.com/*
```

That access is needed to place the warning inside Gmail. The extension uses the sender row only and does not upload email data.

## Gmail Test Deployment

The Gmail add-on runs in Apps Script, so the TypeScript source is bundled into `dist/gmail-addon/Code.js`.

Test deployments are for development only. A normal user should install Gmail Phish Guard from a verified Google Workspace Marketplace listing; otherwise Google can show a scary "unverified app" OAuth warning before the add-on opens.

1. Log in to clasp:

   ```bash
   npm run clasp:login
   ```

2. Build the Apps Script files:

   ```bash
   npm run build:gmail-addon
   ```

3. Create a linked Apps Script project:

   ```bash
   npm run clasp:create:gmail-addon
   ```

   This creates a local `.clasp.json` pointing at the Apps Script project. The file is ignored because it is local deployment state.

4. Push updates after any source change:

   ```bash
   npm run deploy:gmail-addon
   ```

5. In the Apps Script project, create a test deployment for the Gmail add-on and install it in a test Gmail account.

Use only synthetic emails or a test mailbox while validating the warning UI.

## Consumer Distribution

The shippable consumer path is:

- Publish a Google Workspace Marketplace listing.
- Complete Google OAuth app verification for the requested Gmail add-on scopes.
- Keep the scope list narrow so the consent screen matches the privacy promise.

Until that verification is complete, the add-on path is suitable for private testing, not normie installation.

## Privacy Boundary

Allowed Chrome extension MVP inputs:

- visible Gmail sender row text and attributes

Allowed Gmail add-on test inputs:

- `From`
- `Reply-To`
- `Subject`
- selected authentication headers when the Gmail surface exposes them

Out of scope for the MVP:

- message body
- snippets
- attachments
- links
- inbox-wide scans
- backend upload
