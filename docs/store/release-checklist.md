# Release Checklist

Use this checklist before submitting to Chrome Web Store, publishing a GitHub prerelease, or announcing Phish Guard publicly.

## Visibility

- Confirm the public repository is intentional: `https://github.com/petergyang/phish-guard`.
- Confirm `https://github.com/petergyang/phish-guard/blob/main/PRIVACY.md` is reachable as the privacy policy URL.
- For public alpha, confirm `README.md` explains the GitHub ZIP install path clearly.
- For the later normal-user launch, submit the first Chrome Web Store listing as unlisted.
- After Chrome Web Store approval, replace the GitHub ZIP install path in `README.md` with the store listing URL.

## Before Packaging

- Confirm `README.md` describes the current install flow.
- Confirm `PRIVACY.md` and `SECURITY.md` still match the implementation.
- Confirm `apps/chrome-extension/manifest.json` has the intended name, version, description, and permissions.
- Confirm `apps/chrome-extension/manifest.json` includes 16, 32, 48, and 128 pixel icons.
- Confirm no broad permissions were added, especially `<all_urls>`, `cookies`, `webRequest`, or Gmail API OAuth scopes.
- Confirm store screenshots exist under `docs/assets/store/`.

## Build And Test

```bash
npm ci
npm test
npm run eval:detector
npm run build
npm audit --audit-level=moderate
npm run package:chrome-extension
npm run inspect:chrome-extension-package
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

## Chrome Web Store Submission

- Use `docs/store/dashboard-answers.md` for dashboard text.
- Use `docs/store/review-notes.md` for reviewer-facing notes.
- Use `docs/store/chrome-web-store-submission.md` for listing copy and permission justification.
- Upload `dist/phish-guard-chrome-extension.zip`.
- Use fake/test screenshots only.
- Submit as unlisted first.
- After approval, replace the GitHub ZIP install path in `README.md` with the listing URL.

## GitHub Prerelease

- Create a prerelease tag, such as `v0.2.5-alpha`.
- Attach `dist/phish-guard-chrome-extension.zip`.
- Include the short privacy boundary:
  - Runs locally.
  - Reads the open Gmail message.
  - Does not read attachments or inbox history.
  - Does not upload email data.
- Treat GitHub prereleases as the public alpha distribution path until Chrome Web Store approval.

## Chrome Web Store Prep

- Use the stable public privacy URL: `https://github.com/petergyang/phish-guard/blob/main/PRIVACY.md`.
- Capture screenshots with fake/test emails.
- Fill the store dashboard using `docs/store/chrome-web-store-submission.md`.
- Recheck that the dashboard disclosures, README, privacy policy, and extension behavior all say the same thing.
