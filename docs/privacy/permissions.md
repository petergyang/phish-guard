# Permissions

## MVP Permission

`https://www.googleapis.com/auth/script.locale`

This scope lets the add-on run with the user's Workspace locale context.

`https://www.googleapis.com/auth/gmail.addons.execute`

This scope lets Gmail execute the add-on card functions.

`https://www.googleapis.com/auth/gmail.addons.current.message.metadata`

This scope is used so the Gmail add-on can inspect metadata for the currently opened message. The product uses it to read sender fields and build a local warning.

## Why This Scope

The MVP needs to warn at read time without scanning the mailbox. Current-message metadata access is the narrowest Gmail message-data shape that fits that goal. The locale and execute scopes are required by the Workspace add-on runtime and do not grant mailbox-wide access.

## Not Requested In The MVP

- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/gmail.metadata`
- Chrome host permissions for `https://mail.google.com/*`
- Chrome `<all_urls>`
- background Gmail API history access

## Verification Requirement

Even this narrow add-on shape can trigger Google's unverified-app warning during development because it requests Gmail-related OAuth scopes. For normal users, Gmail Phish Guard needs a verified OAuth consent screen and Google Workspace Marketplace listing before distribution.

## Permission Escalation Rule

Any new feature that needs broader Gmail API scopes, Chrome content-script access, backend scoring, body analysis, link analysis, attachment analysis, or telemetry requires a new design review and an update to this document before implementation.

## User-Facing Permission Copy

Gmail Phish Guard looks only at sender metadata for the Gmail message you are viewing. It does not read message bodies, attachments, links, or your inbox history.
