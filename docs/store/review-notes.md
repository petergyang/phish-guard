# Reviewer Notes

Phish Guard is intentionally narrow.

The extension checks the open Gmail message the user is viewing. It compares the sender display name and sender email address, checks visible subject/body text for brand claims with suspicious subscription, payment, account, or urgency language, and checks link domains against the claimed brand. Link checks are local URL parsing only; the extension does not visit links.

The extension does not use Gmail API OAuth scopes. It does not request `<all_urls>`, `cookies`, or `webRequest`. It does not scan inbox history or attachments. It does not upload email data.

Chrome describes the Gmail host permission as the ability to read and change data on Gmail. Phish Guard uses the read side to inspect the open message locally and the change side to add a warning banner. It does not edit, delete, send, archive, label, or report emails.

The first submission should be unlisted so trusted testers can install through Chrome Web Store while the product is still being validated.
