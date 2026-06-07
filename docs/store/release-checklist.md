# Release Checklist

Use this checklist before publishing a GitHub prerelease or preparing a Chrome Web Store package.

## Before Packaging

- Confirm `README.md` describes the current install flow.
- Confirm `PRIVACY.md` and `SECURITY.md` still match the implementation.
- Confirm `apps/chrome-extension/manifest.json` has the intended name, version, description, and permissions.
- Confirm no broad permissions were added, especially `<all_urls>`, `cookies`, `webRequest`, or Gmail API OAuth scopes.

## Build And Test

```bash
npm ci
npm test
npm run build
npm audit --audit-level=moderate
npm run package:chrome-extension
```

Expected package:

```text
dist/phish-guard-chrome-extension.zip
```

## Manual Smoke Test

Use a test Gmail account when possible.

1. Open `chrome://extensions`.
2. Remove any old Phish Guard test installs.
3. Load the unpacked folder from `dist/chrome-extension`.
4. Open the Phish Guard popup.
5. Enable Gmail warnings.
6. Refresh Gmail.
7. Open a fake/test brand-impersonation email.
8. Confirm the warning banner appears near the message header.
9. Open a normal message from a person.
10. Confirm no warning appears just because the message mentions a brand.
11. Open `chrome://extensions`, check Phish Guard errors, and clear only stale errors.

## GitHub Prerelease

- Create a prerelease tag, such as `v0.1.1-alpha`.
- Attach `dist/phish-guard-chrome-extension.zip`.
- Include the short privacy boundary:
  - Runs locally.
  - Reads the visible Gmail sender row.
  - Does not read message bodies.
  - Does not upload email data.

## Chrome Web Store Prep

- Publish `PRIVACY.md` at a stable public URL.
- Capture screenshots with fake/test emails.
- Fill the store dashboard using `docs/store/chrome-web-store-submission.md`.
- Recheck that the dashboard disclosures, README, privacy policy, and extension behavior all say the same thing.
