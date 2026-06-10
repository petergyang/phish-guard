# Permissions

## Chrome Extension MVP Permission

`https://mail.google.com/*`

This optional Chrome host permission lets Phish Guard place a warning inside Gmail and read the opened message locally. The extension checks visible sender details, subject, body text, and link URLs for phishing signals. It does not read attachments, scan inbox history, visit links, or upload email data.

Chrome says "read and change" because the extension adds a warning banner to the Gmail page. Phish Guard does not edit, delete, send, or report emails.

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

Any new feature that needs broader Gmail API scopes, broader Chrome host access, backend scoring, attachment analysis, mailbox-wide scans, or telemetry requires a new design review and an update to this document before implementation.

## User-Facing Permission Copy

Phish Guard checks the open Gmail message locally. It reads visible sender details, subject, body text, and link URLs so it can show a warning when something looks suspicious. It does not read attachments, scan inbox history, visit links, or upload email data.
