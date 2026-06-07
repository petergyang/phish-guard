# Manual Verification

## Setup

Use a test Gmail account and synthetic messages. Do not use Peter's real inbox for screenshots or demos.

## Build

Run these commands from the repo root:

```bash
npm install
npm test
npm run build
```

## Chrome Extension Checks

1. Run `npm run build:chrome-extension`.
2. Open Chrome Extensions.
3. Enable Developer mode.
4. Load `dist/chrome-extension` as an unpacked extension.
5. Open the extension popup.
6. Confirm the popup says it uses the sender row only, does not read message bodies, and does not upload email.
7. Confirm the popup explains that Chrome says "change" because the extension adds a warning banner, not because it edits email.
8. Click `Turn on Gmail warnings`.
9. Confirm Chrome asks for access only to `mail.google.com`.
10. Open a synthetic suspicious Gmail message.
11. Confirm the inline warning appears near the sender row.
12. Open a safe sender message.
13. Confirm the warning disappears.
14. Deny Gmail permission in a fresh profile and confirm the popup shows a non-scary retry state.

## Gmail Add-On Checks

The add-on path is kept for development and future Marketplace verification. It is not the consumer MVP.

```bash
npm run clasp:login
npm run clasp:create:gmail-addon
npm run deploy:gmail-addon
```

After the push, open the linked Apps Script project and create a test deployment for the Gmail add-on.

## Add-On Checklist

- Install the add-on with only Workspace add-on runtime scopes and current-message metadata scope.
- Open a synthetic message from `"YouTube Account Recovery" <random-person@gmail.com>`.
- Confirm the card says `⚠️ Heads up: this might not be YouTube`.
- Confirm the card explains that the message says YouTube but came from `gmail.com`.
- Open a synthetic message from `"YouTube" <alerts@youtube.com>`.
- Confirm the card stays quiet or safe.
- Open a message with malformed sender metadata.
- Confirm the card shows limited evidence rather than safe.
- Confirm no body, link, attachment, or snippet data appears in logs, screenshots, fixtures, or detector inputs.

## Demo Evidence

Safe demo artifacts include:

- synthetic fixture JSON
- terminal test output
- screenshots of test-account messages
- screenshots of the Chrome extension popup and inline warning in a test mailbox
- screenshots of the add-on card without private inbox content

Unsafe demo artifacts include:

- real inbox screenshots
- raw private email headers from personal mail
- message bodies or snippets
- attachment names from real mail
