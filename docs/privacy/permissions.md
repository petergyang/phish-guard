# Permissions

## Chrome Extension MVP Permission

`https://mail.google.com/*`

This optional Chrome host permission lets Gmail Phish Guard place a warning inside Gmail and read the sender row of an opened message. The extension uses this permission locally. It does not read message bodies, links, or attachments by default, and it does not upload email data.

Chrome says "read and change" because the extension adds a warning banner to the Gmail page. Gmail Phish Guard does not edit, delete, send, or report emails.

The extension must not request `<all_urls>`, `cookies`, `webRequest`, Gmail API OAuth scopes, or background mailbox access for the MVP.

## Gmail Add-On Test Permission

`https://www.googleapis.com/auth/script.locale`

This scope lets the add-on run with the user's Workspace locale context.

`https://www.googleapis.com/auth/gmail.addons.execute`

This scope lets Gmail execute the add-on card functions.

`https://www.googleapis.com/auth/gmail.addons.current.message.metadata`

This scope is used so the Gmail add-on can inspect metadata for the currently opened message. The product uses it to read sender fields and build a local warning.

## Why These Scopes

The Chrome extension MVP needs Gmail site access because the warning must appear inline where the user is reading. The Gmail add-on test deployment needs current-message metadata access to render its side-panel card without scanning the mailbox. The locale and execute scopes are required by the Workspace add-on runtime and do not grant mailbox-wide access.

## Not Requested In The MVP

- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/gmail.metadata`
- Chrome `<all_urls>`
- background Gmail API history access

## Verification Requirement

Even the narrow add-on shape can trigger Google's unverified-app warning during development because it requests Gmail-related OAuth scopes. For normal users, the add-on path needs a verified OAuth consent screen and Google Workspace Marketplace listing before distribution. The Chrome extension path avoids that OAuth warning but still needs clear Gmail site-access consent.

## Permission Escalation Rule

Any new feature that needs broader Gmail API scopes, Chrome content-script access, backend scoring, body analysis, link analysis, attachment analysis, or telemetry requires a new design review and an update to this document before implementation.

## User-Facing Permission Copy

Gmail Phish Guard looks only at the sender row for the Gmail message you are viewing. It does not read message bodies, attachments, links, or your inbox history. It does not upload email data.
