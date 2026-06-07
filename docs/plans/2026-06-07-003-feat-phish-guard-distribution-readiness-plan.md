---
title: "feat: Prepare Phish Guard for trusted tester distribution"
type: "feat"
status: "completed"
date: "2026-06-07"
origin: "User request: get as far along as possible on making Phish Guard easy and trustworthy for normal users"
---

# feat: Prepare Phish Guard for trusted tester distribution

## Summary

Move Phish Guard from "working local prototype" toward a credible alpha that a non-technical tester can understand, inspect, install, and report problems on. The next milestone is not broad consumer launch yet; it is a trust-building package that supports GitHub releases now and keeps the Chrome Web Store path realistic later.

## Problem Frame

Phish Guard protects users from suspicious Gmail senders, but the distribution surface can feel scarier than the phishing warning itself. Normal users will not clone a repo, run Node, or reason through browser permission prompts. At the same time, a phishing-protection extension needs unusually high trust because it touches email UI.

This plan treats installation confidence as product work. The repo should clearly explain what the extension reads, what it never reads, why Chrome says "read and change," how a tester installs a built package, how issues should be reported without leaking private email, and what still blocks a real Chrome Web Store release.

## Requirements

- R1. Keep the project name generalized as Phish Guard, while preserving Gmail as the first protected surface.
- R2. Make the GitHub-first install path understandable for technical testers and "friend test" helpers.
- R3. Provide a formal privacy policy that matches the implementation: local-only sender-row checks, no message-body scanning, no telemetry, no backend upload.
- R4. Provide a security/reporting path that discourages sharing private email content in public issues.
- R5. Add Chrome Web Store readiness documentation grounded in official policy areas: least privilege, privacy disclosures, limited use, review risk, listing copy, and screenshots.
- R6. Add CI/package automation so every PR proves the extension can be built, tested, audited, and zipped.
- R7. Add issue templates for bug reports and false positives so early testers can give useful feedback without needing engineering context.
- R8. Keep the existing detector, Gmail banner, and permission model unchanged unless documentation or tests reveal a mismatch.

## Key Decisions

- KTD1. Do not make the repository public automatically. Public visibility is a product/reputation decision; the repo can be prepared for public release without flipping the switch.
- KTD2. Keep GitHub releases as the short-term alpha distribution path. It is not a normie-grade install flow, but it lets a trusted helper download a ZIP without building from source.
- KTD3. Prepare for Chrome Web Store rather than assuming immediate approval. The store path needs a public privacy-policy URL, screenshots, icons, listing copy, data-use answers, and consistency with Chrome's user-data policies.
- KTD4. Favor written, test-backed claims over marketing copy. For a security tool, trust comes from narrow permissions, verifiable behavior, and clear docs.

Official policy references used for planning:

- `https://developer.chrome.com/docs/webstore/program-policies/policies`
- `https://developer.chrome.com/docs/webstore/user_data`
- `https://developer.chrome.com/docs/webstore/review-process`
- `https://developer.chrome.com/docs/extensions/reference/permissions`

## Scope

In scope:

- Root trust docs and README improvements
- Chrome Web Store submission packet
- CI workflow and packaging checks
- Early tester issue templates
- Tests that keep trust/distribution artifacts from drifting

Out of scope for this pass:

- Publishing to the Chrome Web Store
- Making the GitHub repo public
- Adding telemetry, analytics, or backend scanning
- Expanding detection beyond Gmail
- Changing the core Gmail banner UX

## Implementation Units

### U1. Add trust and privacy docs

**Goal:** Give testers and future store reviewers a clear account of what Phish Guard does with email-adjacent data.

**Requirements:** R2, R3, R4

**Files:**

- `PRIVACY.md`
- `SECURITY.md`
- `README.md`

**Approach:** Add a plain-language privacy policy with the exact data boundary, no-collection promises, permission explanation, Limited Use language, and future-change caveat. Add security reporting guidance that tells users not to post private sender/body details publicly.

**Test scenarios:**

- `apps/chrome-extension/tests/store-readiness.test.ts` verifies the required docs exist and include local-only, no-email-body, no-upload, and permission-explanation language.
- Manual review confirms README links the docs and does not overpromise Chrome Web Store availability.

### U2. Add Chrome Web Store readiness packet

**Goal:** Make the store submission path concrete enough that gaps are visible.

**Requirements:** R5

**Files:**

- `docs/store/chrome-web-store-submission.md`
- `docs/store/release-checklist.md`
- `README.md`

**Approach:** Document listing copy, single-purpose statement, permission justification, data-use answers, review risks, screenshot/icon needs, and release steps. Keep the status honest: prepared, not submitted.

**Test scenarios:**

- `apps/chrome-extension/tests/store-readiness.test.ts` verifies store docs exist and name privacy policy, least privilege, package ZIP, and reviewer-facing permission rationale.
- Manual review confirms the docs distinguish GitHub alpha distribution from Chrome Web Store distribution.

### U3. Add CI and package verification

**Goal:** Make every future branch prove the extension still builds, passes tests, audits dependencies, and produces a ZIP.

**Requirements:** R6

**Files:**

- `.github/workflows/ci.yml`
- `package.json`
- `scripts/package-chrome-extension.mjs`
- `apps/chrome-extension/tests/store-readiness.test.ts`

**Approach:** Add a GitHub Actions workflow that runs `npm ci`, `npm test`, `npm run build`, `npm audit --audit-level=moderate`, and `npm run package:chrome-extension`, then uploads the ZIP as an artifact.

**Test scenarios:**

- Local command `npm test` passes.
- Local command `npm run build` passes.
- Local command `npm run package:chrome-extension` creates `dist/phish-guard-chrome-extension.zip`.
- `apps/chrome-extension/tests/store-readiness.test.ts` verifies the CI workflow contains build, test, audit, and package steps.

### U4. Add tester feedback templates

**Goal:** Help early testers report useful bugs and false positives without sharing private email content.

**Requirements:** R4, R7

**Files:**

- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/ISSUE_TEMPLATE/false_positive.yml`
- `.github/ISSUE_TEMPLATE/config.yml`
- `README.md`

**Approach:** Provide issue templates that ask for browser/version, extension version, Gmail surface, sender display name/domain, expected behavior, and screenshot notes. Explicitly discourage posting full email bodies, attachments, or personal messages.

**Test scenarios:**

- `apps/chrome-extension/tests/store-readiness.test.ts` verifies issue templates exist and include private-email warnings.
- Manual review confirms the templates are understandable to non-engineers.

## Risks

- Chrome Web Store approval can still fail if reviewers treat Gmail DOM access as too sensitive or find privacy/listing inconsistencies.
- GitHub releases are still not a true normie install path; they work mainly for trusted testers or helpers.
- A public repo with a downloadable extension needs support expectations, screenshots, and a steady release process.
- Issue templates reduce accidental oversharing but cannot prevent users from posting private information.

## Verification

- `npm test`
- `npm run build`
- `npm audit --audit-level=moderate`
- `npm run package:chrome-extension`
- Manual review of README, privacy policy, security file, store packet, and issue templates
- Pull request CI watch after pushing the branch
