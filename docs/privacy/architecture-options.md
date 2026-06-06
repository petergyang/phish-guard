# Architecture Options

## Recommendation

Start with a Gmail add-on using current-message metadata. It gives the product a warning surface inside Gmail while keeping access narrower than a Chrome content script or backend Gmail API scanner.

For consumer distribution, the Gmail add-on path requires Google Workspace Marketplace publication and OAuth verification before normal users should install it. An unverified test deployment can show a frightening Google warning, even with narrow current-message metadata access.

## Option Comparison

| Option | Use When | Why Not First |
|---|---|---|
| Gmail add-on | The product needs current-message warnings with narrow Gmail access and can go through Marketplace/OAuth verification. | Side-panel UI may be less visible than an inline banner, and unverified test deployments are not normie-friendly. |
| Chrome extension | Inline Gmail placement or simpler consumer install becomes necessary after the detector proves useful. | DOM access can expose rendered message content and feels less privacy-safe. |
| Gmail API/backend scanner | The product needs labels, background scans, or org-level workflows. | Broader scopes, server data handling, and restricted-scope review add heavy trust burden. |
| Enterprise gateway | Selling to organizations that control mail routing. | Wrong shape for a consumer Gmail MVP. |
| Hybrid add-on plus extension | Add-on privacy boundary is proven but inline UX is required. | Two surfaces create more complexity and consent work. |

## Decision Trigger For Chrome

Prototype a Chrome extension if users miss or ignore the Gmail add-on card during real usage testing, or if Marketplace/OAuth verification becomes too slow for consumer validation.

## Decision Trigger For Backend Scanning

Consider backend scanning only if users need mailbox-wide labels, historical review, organization reporting, or cross-client support.

## Decision Trigger For Enterprise Gateway

Consider an enterprise gateway only after there is a clear business need for pre-delivery enforcement and admin-managed policy.
