# Chrome Extension MVP

## Why It Is Now The Consumer Path

A Chrome extension can place an inline banner near Gmail's sender row, which is where normal users need the warning. It also avoids the Google OAuth unverified-app screen that appears in Apps Script test deployments.

## Trust Trade-Off

The extension asks Chrome for access to `https://mail.google.com/*`. That is broader than the Gmail add-on metadata scope because a content script can technically read rendered Gmail page content. The MVP constrains itself in code and tests to the sender row only.

## Required Constraints

- Limit host permissions to `https://mail.google.com/*`.
- Do not request `<all_urls>`.
- Do not inspect message bodies, attachments, or links by default.
- Do not upload email or sender metadata by default.
- Explain Gmail access before Chrome shows the permission prompt.
- Keep scoring local.
- Reuse `packages/detector`.
- Add a separate permission and threat-model review before implementation.
