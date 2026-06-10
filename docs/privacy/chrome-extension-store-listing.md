# Chrome Extension Store Listing Draft

## Single Purpose

Phish Guard shows sender warnings inside Gmail when an opened message appears to be impersonating a trusted brand.

## Permission Explanation

Phish Guard asks for access to `https://mail.google.com/*` so it can read the open Gmail message locally and place a warning beside that message.

Chrome may describe this as permission to "read and change" data on Gmail. The extension needs the "change" part only to add the warning banner. It does not edit, delete, send, or report emails.

## Privacy Promise

- Runs phishing checks locally in your browser.
- Looks at the visible sender row, subject, body text, and link URLs for the opened Gmail message.
- Does not read attachments.
- Does not visit links.
- Does not scan your inbox history.
- Does not upload email data.

## Suggested Store Description

Phish Guard helps you spot suspicious brand impersonation in Gmail. If an email says it is from a trusted service but the sender address looks wrong, it shows a clear warning inside the message view before you click.

The extension is intentionally narrow. It runs locally, checks only the open message, and does not upload email data.

## Limited Use Statement

Phish Guard uses Gmail page access only to provide sender warnings inside Gmail. It does not use or transfer user data for advertising, does not sell user data, and does not allow humans to read email data.
