# Gmail Phish Guard

Privacy-safe Gmail sender warnings for brand impersonation.

The first MVP checks only current-message sender metadata. It does not scan the inbox, inspect message bodies, upload email content, or analyze attachments and links.

## Current Shape

- `packages/detector` contains the pure sender-risk detector.
- `apps/gmail-addon` contains a testable Gmail add-on adapter and warning-card model.
- `docs/privacy` documents the privacy boundary, permissions, options, and manual verification flow.

## Commands

```bash
npm install
npm test
npm run build
```

## Gmail Test Deployment

The Gmail add-on runs in Apps Script, so the TypeScript source is bundled into `dist/gmail-addon/Code.js`.

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

## Privacy Boundary

Allowed MVP inputs:

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
