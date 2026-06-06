# Chrome Extension Follow-Up

## Why It Is Deferred

A Chrome extension can place an inline banner near Gmail's sender row, but content-script access to Gmail can expose rendered email content. That privacy posture is worse than the Gmail add-on MVP.

## Choose This When

- The add-on warning is not visible enough.
- Users need inline placement beside the sender.
- The detector package has already proven useful with metadata-only inputs.

## Required Constraints

- Limit host permissions to `https://mail.google.com/*`.
- Do not request `<all_urls>`.
- Do not inspect message bodies, attachments, or links by default.
- Keep scoring local.
- Reuse `packages/detector`.
- Add a separate permission and threat-model review before implementation.
