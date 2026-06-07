---
title: "feat: Make Phish Guard release-ready"
type: "feat"
status: "active"
date: "2026-06-07"
origin: "User request: fix the caveats so Phish Guard can be a great public release"
---

# feat: Make Phish Guard release-ready

## Summary

Turn Phish Guard from a good private alpha into a public release that feels credible on first contact. The release should not ask normal users to clone a repo, load an unpacked extension, or read a caveat wall. The public path should be: see the warning UI, understand the privacy boundary, install from Chrome Web Store, and know how to report false positives safely.

The repo should stay private until the release bar below is met.

## Problem Frame

The current product works well enough to test, but the public story still leaks alpha friction:

- The README still says "Install The Alpha" and explains Developer Mode.
- The extension has no real icon set in the manifest.
- The screenshot is a useful mock, but there are no store-grade screenshots from a polished release flow.
- The privacy policy exists, but it does not yet live at a stable public URL for store review.
- The Chrome Web Store packet is a draft, not a completed submission.
- The popup/onboarding still feels utilitarian and repeats some permission caveats.
- Gmail UI testing is mostly unit/fixture based, not a real browser QA pass across common Gmail states.

For a phishing tool, these caveats matter more than they would for a toy extension. Users are being asked to trust software that touches their email UI. The release has to look more trustworthy than the attacks it warns about.

## Release Bar

Phish Guard is ready to be public when:

- Users can install it from Chrome Web Store, ideally as an unlisted release first.
- The public README leads with the product and screenshot, not caveats.
- The README no longer tells normal users to use Chrome Developer Mode.
- The Chrome permission prompt is backed by crisp onboarding copy and a public privacy policy.
- The extension package includes real icons and store assets.
- The store listing, README, popup, and privacy policy all say the same thing.
- End-to-end browser QA confirms the warning appears and does not churn in Gmail.
- CI packages a store-ready ZIP and keeps permission/privacy checks passing.

## Requirements

### User experience

- R1. Public README must show the product image immediately below the title and explain the tool in under 10 seconds.
- R2. Public README must make Chrome Web Store install the primary path once the listing is available.
- R3. Developer Mode install steps must move out of the main README path and into a developer/testing doc.
- R4. Popup onboarding must feel calm and confidence-building, not like an internal permission explanation.
- R5. Gmail warning must remain visible near the message header, with plain title/subtitle copy and no bullet list.
- R6. The extension icon must be visible and recognizable in Chrome light/dark UI.

### Privacy and trust

- R7. Privacy policy must be available at a stable public URL before store submission.
- R8. Store listing, README, popup, and privacy policy must all describe the same data boundary.
- R9. Extension must keep optional Gmail host permission and avoid `<all_urls>`, `cookies`, `webRequest`, Gmail OAuth scopes, telemetry, and backend upload.
- R10. Security and issue-reporting paths must discourage users from posting private email content.

### Store submission

- R11. Manifest must include store-ready icons, version, name, description, and no broad permissions.
- R12. Store assets must include icon, promotional tile if needed, popup screenshot, Gmail warning screenshot, and normal-message screenshot.
- R13. Chrome Web Store dashboard answers must be prepared from repo docs, including single purpose, permission justification, data-use answers, and privacy URL.
- R14. Release should start as an unlisted Chrome Web Store listing until user testing confirms the flow.

### Quality

- R15. Unit tests must cover README/store/privacy assets and manifest permission drift.
- R16. Browser QA must cover suspicious message, normal message, spam folder message, Gmail refresh/navigation, and extension reload.
- R17. Build/package workflow must produce a Chrome Web Store ZIP with icons and no source maps or extra dev artifacts unless intentionally included.
- R18. Release checklist must include public/private visibility timing, Chrome Store submission, and post-approval README update.

## Key Decisions

- KTD1. Keep the repo private during release prep. Make it public only after the README and install path no longer advertise alpha friction.
- KTD2. Use Chrome Web Store as the normie install path. GitHub releases can stay as a tester/developer path, but not the main public call to action.
- KTD3. Submit as unlisted first. This lets testers install normally without making the listing broadly discoverable before confidence is high.
- KTD4. Keep detection local and metadata-only for this release. Link scanning, DM warnings, backend reputation, and telemetry are future features that need new privacy review.
- KTD5. Treat screenshots and icons as release-blocking product assets. Security tools need polish to earn trust.

## External References

Use official Chrome documentation as the source of truth while implementing:

- Chrome Web Store Program Policies: `https://developer.chrome.com/docs/webstore/program-policies/policies`
- Chrome Web Store user data policy: `https://developer.chrome.com/docs/webstore/user_data`
- Chrome Web Store review process: `https://developer.chrome.com/docs/webstore/review-process`
- Extension permissions reference: `https://developer.chrome.com/docs/extensions/reference/permissions`
- Extension icon guidance: `https://developer.chrome.com/docs/extensions/develop/ui/configure-icons`

## Implementation Units

### U1. Finalize public product messaging

**Goal:** Make the repo read like a product page, not a development notebook.

**Requirements:** R1, R2, R3, R8, R18

**Files:**

- `README.md`
- `docs/development/local-install.md`
- `docs/store/release-checklist.md`
- `apps/chrome-extension/tests/store-readiness.test.ts`

**Approach:** Keep the screenshot directly under `# Phish Guard`. Rewrite the README around the product, privacy, Chrome Web Store install, and support. Move Developer Mode installation and troubleshooting into `docs/development/local-install.md`. The README can mention "developer install" only as a secondary link.

**Test scenarios:**

- `apps/chrome-extension/tests/store-readiness.test.ts` asserts README references the screenshot before the first paragraph.
- The same test asserts README does not contain `Install The Alpha`, `Developer mode`, or `Load unpacked` in the main public install section after store launch.
- Manual review confirms a non-technical user can understand what the tool does before seeing any caveat.

### U2. Add real extension and store assets

**Goal:** Replace placeholder visuals with store-ready assets.

**Requirements:** R6, R11, R12, R17

**Files:**

- `apps/chrome-extension/assets/icon-16.png`
- `apps/chrome-extension/assets/icon-32.png`
- `apps/chrome-extension/assets/icon-48.png`
- `apps/chrome-extension/assets/icon-128.png`
- `apps/chrome-extension/manifest.json`
- `docs/assets/phish-guard-gmail-warning.svg`
- `docs/assets/store/popup-before-permission.png`
- `docs/assets/store/gmail-warning.png`
- `docs/assets/store/gmail-normal-message.png`
- `scripts/build-chrome-extension.mjs`
- `apps/chrome-extension/tests/manifest-permissions.test.ts`
- `apps/chrome-extension/tests/store-readiness.test.ts`

**Approach:** Create a simple recognizable shield/warning icon set, include it in `manifest.json`, and copy icons into `dist/chrome-extension`. Capture screenshots from fake/test Gmail scenarios. Keep the README screenshot polished and fake-data-only.

**Test scenarios:**

- Manifest test asserts `icons` contains 16, 32, 48, and 128 pixel assets.
- Store-readiness test asserts all screenshot assets exist.
- Package verification asserts the ZIP contains manifest icons and does not omit required assets.
- Manual visual review checks icons remain legible in Chrome dark mode and at toolbar size.

### U3. Polish popup onboarding

**Goal:** Make the permission flow feel calm and trustworthy.

**Requirements:** R4, R8, R9

**Files:**

- `apps/chrome-extension/src/popup/popup.html`
- `apps/chrome-extension/src/popup/popup.ts`
- `apps/chrome-extension/tests/permission-flow.test.ts`
- `apps/chrome-extension/tests/store-readiness.test.ts`
- `docs/privacy/permissions.md`

**Approach:** Replace the current utilitarian popup with a compact product panel: title, one-sentence value, privacy reassurance, and a single enable button. Keep permission explanation short. Avoid repeating "Chrome says change" more than once. Keep no scare words before the user chooses to enable.

**Test scenarios:**

- Permission-flow test confirms granting Gmail permission registers the content script and shows ready state.
- Denied permission still shows a calm retry state.
- Store-readiness test confirms popup copy includes sender row, no body reading, and no upload.
- Manual review confirms no text overflows in the 330px popup.

### U4. Stabilize Gmail warning QA

**Goal:** Prove the warning works across realistic Gmail reading states.

**Requirements:** R5, R16

**Files:**

- `apps/chrome-extension/src/content/gmail-content.ts`
- `apps/chrome-extension/src/content/gmail-dom.ts`
- `apps/chrome-extension/src/content/message-observer.ts`
- `apps/chrome-extension/src/ui/banner.ts`
- `apps/chrome-extension/src/ui/banner.css`
- `apps/chrome-extension/tests/gmail-dom.test.ts`
- `apps/chrome-extension/tests/content-integration.test.ts`
- `docs/privacy/test-cases.md`
- `docs/store/release-checklist.md`

**Approach:** Keep the warning copy and layout stable, then test the states users actually hit: inbox, spam folder, search result, Gmail refresh, next/previous message, expanded sender details, and extension reload. Add DOM fixtures for these where feasible and run a manual Chrome QA pass for real Gmail.

**Test scenarios:**

- Suspicious sender in Gmail message view renders one warning banner.
- Normal personal sender renders no banner even if subject/body mentions a brand.
- Spam folder suspicious message still renders a warning.
- Rechecking the same message does not remove/reinsert the banner repeatedly.
- Moving to a safe message removes the old warning.
- Warning text wraps cleanly for long sender addresses.

### U5. Complete public privacy and store packet

**Goal:** Prepare the exact Chrome Web Store submission materials.

**Requirements:** R7, R8, R10, R13, R14, R18

**Files:**

- `PRIVACY.md`
- `SECURITY.md`
- `docs/store/chrome-web-store-submission.md`
- `docs/store/release-checklist.md`
- `docs/store/dashboard-answers.md`
- `docs/store/review-notes.md`
- `apps/chrome-extension/tests/store-readiness.test.ts`

**Approach:** Publish the privacy policy to a stable URL, then update store docs with final dashboard answers, reviewer notes, and support URL. Keep the repo private until the public URL and listing story are ready. Submit the extension as unlisted first.

**Test scenarios:**

- Store-readiness test asserts the privacy URL is present in store docs once published.
- Store-readiness test asserts dashboard answers include single purpose, permission justification, and data-use answers.
- Manual review confirms README, privacy policy, popup, and store listing do not contradict each other.

### U6. Harden package and CI release checks

**Goal:** Make the store ZIP reliable and hard to accidentally degrade.

**Requirements:** R9, R11, R15, R17, R18

**Files:**

- `.github/workflows/ci.yml`
- `scripts/package-chrome-extension.mjs`
- `scripts/build-chrome-extension.mjs`
- `apps/chrome-extension/tests/manifest-permissions.test.ts`
- `apps/chrome-extension/tests/store-readiness.test.ts`
- `docs/store/release-checklist.md`

**Approach:** Add package inspection after ZIP creation. Verify required files, icons, popup, content script, service worker, and manifest are present. Verify forbidden permissions are absent. Upload the final ZIP artifact in CI. Keep branch protection requiring the CI job.

**Test scenarios:**

- `npm run package:chrome-extension` creates the ZIP.
- A package-inspection test or script confirms ZIP contents include icons and exclude unexpected broad-permission strings.
- CI runs `npm test`, `npm run build`, `npm audit --audit-level=moderate`, and package inspection.
- Manual release checklist confirms the branch protection check is green before merge.

### U7. Release flow and visibility switch

**Goal:** Avoid making the repo public until the release is ready.

**Requirements:** R2, R7, R14, R18

**Files:**

- `docs/store/release-checklist.md`
- `README.md`
- `docs/store/chrome-web-store-submission.md`

**Approach:** Keep the repo private through asset, QA, and store submission work. Once the unlisted Chrome Web Store listing is approved, update README with the store install link, make a tagged release, then make the repo public. If store review rejects the extension, keep the repo private and use the reviewer feedback to revise the package before public launch.

**Test scenarios:**

- Manual checklist requires approved unlisted listing or explicit decision to publish without store.
- README has a working install link before public visibility is restored.
- `gh repo view --json visibility` confirms visibility during release steps.

## Sequencing

1. U1: Clean public messaging and move developer install docs.
2. U2: Add icons and screenshot assets.
3. U3: Polish popup onboarding.
4. U4: Run Gmail warning QA and fix DOM/layout issues.
5. U5: Finalize privacy URL and store packet.
6. U6: Harden package and CI release checks.
7. U7: Submit unlisted Chrome Web Store listing, then publicize after approval.

## Verification Commands

```bash
npm test
npm run build
npm audit --audit-level=moderate
npm run package:chrome-extension
```

Additional release verification:

- Inspect packaged ZIP contents.
- Validate screenshots are fake/test-data-only.
- Load packaged extension in Chrome and test Gmail suspicious/normal messages.
- Confirm branch protection check passes.
- Confirm repo remains private until release checklist says public.

## Open Questions

- Should the first Chrome Web Store listing be unlisted only, or public immediately after approval? Recommendation: unlisted.
- Where should the stable privacy-policy URL live? Recommendation: GitHub Pages or another public static page controlled by the repo owner.
- Should the README include a short demo GIF, or is the static warning screenshot enough for v0.1? Recommendation: static screenshot first, GIF later only if it does not distract.
