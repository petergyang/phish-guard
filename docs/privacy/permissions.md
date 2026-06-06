# Permissions

## MVP Permission

`https://www.googleapis.com/auth/gmail.addons.current.message.metadata`

This scope is used so the Gmail add-on can inspect metadata for the currently opened message. The product uses it to read sender fields and build a local warning.

## Why This Scope

The MVP needs to warn at read time without scanning the mailbox. Current-message metadata access is the narrowest Gmail add-on shape that fits that goal.

## Not Requested In The MVP

- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/gmail.metadata`
- Chrome host permissions for `https://mail.google.com/*`
- Chrome `<all_urls>`
- background Gmail API history access

## Permission Escalation Rule

Any new feature that needs broader Gmail API scopes, Chrome content-script access, backend scoring, body analysis, link analysis, attachment analysis, or telemetry requires a new design review and an update to this document before implementation.

## User-Facing Permission Copy

Sender Check looks only at sender metadata for the Gmail message you are viewing. It does not read message bodies, attachments, links, or your inbox history.
