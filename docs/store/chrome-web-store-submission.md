# Chrome Web Store Submission Packet

Status: release materials in progress, not submitted.

This document is the working packet for a future Chrome Web Store submission. It is grounded in Chrome's official extension policy areas: single purpose, least privilege, accurate privacy disclosures, Limited Use, and review consistency.

Official references:

- https://developer.chrome.com/docs/webstore/program-policies/policies
- https://developer.chrome.com/docs/webstore/user_data
- https://developer.chrome.com/docs/webstore/review-process
- https://developer.chrome.com/docs/extensions/reference/permissions

## Single Purpose

Phish Guard shows local phishing warnings inside Gmail when an opened message appears to impersonate a brand or organization.

## Store Listing Draft

Short description:

```text
Shows local sender warnings in Gmail when a message may be impersonating a brand.
```

Long description:

```text
Phish Guard helps you notice suspicious Gmail messages before you click.

If a message appears to be from a familiar brand, but the sender email address or message content looks suspicious, Phish Guard shows a clear warning inside the open Gmail message.

The extension checks the open message locally in your browser, including sender details, subject/body text, and link URLs. It does not read attachments, inbox history, cookies, or passwords, and it does not visit links or upload email data.
```

## Permission Justification

Requested permission:

```text
https://mail.google.com/*
```

Why it is needed:

Phish Guard needs Gmail page access to read the visible sender row, subject, body text, and link URLs for the open message, then add a warning banner inside that message. Chrome describes this as "read and change" access because the extension both reads the open message and changes the page by inserting the warning. It does not edit, delete, send, archive, label, or report emails.

Least privilege posture:

- No `<all_urls>` permission
- No `cookies` permission
- No `webRequest` permission
- No Gmail API OAuth scopes
- No background inbox scanning
- No backend upload

## Public URLs

Repository URL after public release:

```text
https://github.com/petergyang/phish-guard
```

Privacy policy URL after public release:

```text
https://github.com/petergyang/phish-guard/blob/main/PRIVACY.md
```

Support URL after public release:

```text
https://github.com/petergyang/phish-guard/issues
```

Keep the repo private until the Chrome Web Store submission package is ready.

## Privacy Policy Requirements

Use `PRIVACY.md` as the source of truth. Before submitting to the store, publish it at a stable public URL and ensure the Chrome Web Store developer dashboard disclosures match it exactly.

The policy must keep these statements true:

- Sender checks run locally.
- The current feature reads the visible sender row, subject, body text, and link URLs for the open message.
- The extension does not read attachments or inbox history.
- The extension does not visit links.
- The extension does not upload email data.
- User data is not sold, used for ads, or shared with third parties.

## Data Use Answers

Recommended dashboard posture for the current MVP:

- Data collection: no collected user data.
- Personally identifiable information: not collected.
- Web history: not collected.
- Email content: not collected.
- Authentication information: not collected.
- User activity: not collected.
- Website content: only the open Gmail message is processed locally and not collected.

If the dashboard treats local page processing as "website content" access, explain that it is used only for the user-facing sender warning and is not transmitted or stored.

## Screenshot Assets

Prepared assets:

- `docs/assets/store/popup-before-permission.png`
- `docs/assets/store/gmail-warning.png`
- `docs/assets/store/gmail-normal-message.png`

Any additional screenshots must use test accounts and fake messages only. Do not include real private email.

## Review Risks

- Gmail page access is sensitive even when local-only.
- Any mismatch between `PRIVACY.md`, the dashboard disclosures, and actual behavior can cause rejection.
- The extension must not imply it catches every phishing email.
- The warning copy must avoid certainty when evidence is limited.
- Store reviewers may ask why page access is needed instead of a lighter API. The answer is inline placement: the warning has to appear where the user is reading.

## Submission Checklist

- `npm test` passes.
- `npm run eval:detector` passes.
- `npm run build` passes.
- `npm audit --audit-level=moderate` passes.
- `npm run package:chrome-extension` creates the package ZIP.
- `PRIVACY.md` is published at a stable public URL.
- `SECURITY.md` is available from the repo.
- Store listing copy matches README and privacy policy.
- Permission justification matches `docs/privacy/permissions.md`.
- Screenshots use fake/test emails only.
- Extension ZIP has been loaded unpacked and tested in Gmail.
- Chrome Web Store dashboard answers have been copied from `docs/store/dashboard-answers.md`.
- Reviewer notes have been copied from `docs/store/review-notes.md`.
