# Chrome Web Store Dashboard Answers

Use these answers when preparing the first unlisted Chrome Web Store submission.

## Single Purpose

Phish Guard shows local sender warnings inside Gmail when an opened message may be impersonating a brand.

## Permission Justification

### `activeTab`

Used only after the user enables Gmail warnings so Phish Guard can activate the current Gmail tab without scanning unrelated pages.

### `scripting`

Used to register and inject the Gmail content script after the user grants Gmail access.

### `storage`

Reserved for local extension state, such as whether Gmail warnings are enabled. It is not used for email bodies or inbox history.

### `https://mail.google.com/*`

Used to read the visible sender row in the Gmail message the user is viewing and to add a warning banner to the Gmail page. Phish Guard does not edit, delete, send, archive, label, or report emails.

## Data Use

Phish Guard processes the visible Gmail sender row locally in the browser. It does not collect, transmit, sell, or share user data.

Current Gmail protection does not read:

- Message bodies
- Attachments
- Links inside messages
- Inbox history
- Contacts
- Cookies
- Passwords

## Privacy Policy URL

Use this after the repository is public:

```text
https://github.com/petergyang/phish-guard/blob/main/PRIVACY.md
```

## Support URL

Use this after the repository is public:

```text
https://github.com/petergyang/phish-guard/issues
```
