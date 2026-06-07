# Security Policy

Phish Guard is a security-adjacent browser extension, so reports should be useful without exposing private email.

## Supported Version

This repository is currently an alpha prototype. Security reports should target the latest code on `main` or the latest GitHub prerelease.

## Reporting A Vulnerability

If GitHub private vulnerability reporting is available for this repo, use it.

If it is not available, open a short public issue that says you have a security report and avoid including sensitive details. Do not post private email bodies, attachments, full message headers, account identifiers, or screenshots that reveal personal messages.

Good public issue title:

```text
Security report: possible Gmail permission boundary issue
```

Avoid public details like:

- Full sender headers from a real private email
- Message body screenshots
- Links from suspicious emails
- Personal Gmail account information

## What Helps

Helpful reports include:

- Extension version or commit SHA
- Chrome version
- Whether the issue happens before or after enabling Gmail warnings
- The minimum sender display name and sender domain needed to reproduce the issue
- A redacted screenshot when the UI is relevant

## Security Design Boundary

The current Gmail MVP should stay within this boundary:

- Optional host access for `https://mail.google.com/*`
- Local sender-row analysis
- No message-body scanning
- No attachment scanning
- No backend upload
- No cookies, webRequest, or `<all_urls>` permission

Any proposed feature that expands this boundary should include an explicit privacy and permission review.
