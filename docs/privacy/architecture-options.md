# Architecture Options

## Recommendation

Use a Chrome extension for the consumer MVP. It can place the warning inline in the Gmail message view, which is the moment a normal user needs help.

The Gmail add-on remains a strong long-term path after Google Workspace Marketplace publication and OAuth verification, but it is not the right first consumer surface because the warning lives in the right rail and test deployments show a frightening unverified-app warning.

## Option Comparison

| Option | Use When | Why Not First |
|---|---|---|
| Chrome extension | Normal users need an inline warning and a no-OAuth install path. | DOM access can expose rendered message content, so implementation must constrain itself to the open message and stay local. |
| Gmail add-on | The product needs a Google-native verified add-on with narrow current-message access. | Side-panel UI is easy to miss, and unverified test deployments are not normie-friendly. |
| Gmail API/backend scanner | The product needs labels, background scans, or org-level workflows. | Broader scopes, server data handling, and restricted-scope review add heavy trust burden. |
| Enterprise gateway | Selling to organizations that control mail routing. | Wrong shape for a consumer Gmail MVP. |
| Hybrid add-on plus extension | Add-on privacy boundary is proven but inline UX is required. | Two surfaces create more complexity and consent work. |

## Decision Trigger For Gmail Add-On

Return to the Gmail add-on as a primary surface only after Workspace Marketplace/OAuth verification is complete or when customers explicitly prefer a Google-native add-on despite the side-panel placement.

## Decision Trigger For Backend Scanning

Consider backend scanning only if users need mailbox-wide labels, historical review, organization reporting, or cross-client support.

## Decision Trigger For Enterprise Gateway

Consider an enterprise gateway only after there is a clear business need for pre-delivery enforcement and admin-managed policy.
