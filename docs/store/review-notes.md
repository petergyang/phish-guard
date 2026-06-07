# Reviewer Notes

Phish Guard is intentionally narrow.

The extension checks the visible sender row in the Gmail message the user is viewing. It compares the sender display name with the sender email address and shows a warning when the sender appears to be impersonating a brand.

The extension does not use Gmail API OAuth scopes. It does not request `<all_urls>`, `cookies`, or `webRequest`. It does not scan inbox history, message bodies, attachments, or links. It does not upload email data.

Chrome describes the Gmail host permission as the ability to read and change data on Gmail. Phish Guard uses the read side to inspect the sender row and the change side to add a warning banner. It does not edit, delete, send, archive, label, or report emails.

The first submission should be unlisted so trusted testers can install through Chrome Web Store while the product is still being validated.
