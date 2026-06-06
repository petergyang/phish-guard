# Anti-Phishing Sender Check

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
