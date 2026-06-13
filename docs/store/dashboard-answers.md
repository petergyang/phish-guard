# Chrome Web Store Dashboard Answers

Use these answers when preparing the first unlisted Chrome Web Store submission.

## Single Purpose

Phish Guard shows local sender warnings inside Gmail when an opened message may be impersonating a brand.

## Permission Justification

### `scripting`

Used to register and inject the Gmail content script after the user grants Gmail access.

### `https://mail.google.com/*`

Used to read the visible sender row, subject, body text, and link URLs in the Gmail message the user is viewing and to add a warning banner to the Gmail page. Phish Guard does not edit, delete, send, archive, label, or report emails.

## Data Use

Phish Guard processes the open Gmail message locally in the browser. It does not collect, transmit, sell, or share user data.

Current Gmail protection does not read:

- Attachments
- Inbox history
- Contacts
- Cookies
- Passwords

It does not visit links or upload link URLs.

## Privacy Policy URL

```text
https://github.com/petergyang/phish-guard/blob/main/PRIVACY.md
```

## Support URL

```text
https://github.com/petergyang/phish-guard/issues
```
