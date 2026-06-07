# Phish Guard Privacy Policy

Last updated: June 7, 2026

Phish Guard is designed to warn you about suspicious phishing attempts without turning your email into someone else's data source.

## Short Version

- Phish Guard runs sender checks locally in your browser.
- It looks at the visible Gmail sender row for the message you are viewing.
- It does not read email bodies, attachments, links, inbox history, cookies, passwords, or contacts.
- It does not upload email data to a server.
- It does not sell data, use data for ads, or share data with third parties.

## Data The Extension Uses

For the current Gmail protection feature, Phish Guard may read:

- Sender display name, such as `Costco Rewards Connection`
- Sender email address or domain, such as `random@hotmail.com`
- Visible header text needed to decide where to place the warning

The extension uses that information only to decide whether to show a local warning inside the open Gmail message.

## Data The Extension Does Not Use

The current prototype does not read, collect, store, or transmit:

- Email message bodies
- Attachments
- Links inside the message
- Inbox history or mailbox-wide search results
- Contacts
- Cookies
- Passwords
- Browsing history outside Gmail
- Analytics or telemetry

## Why Chrome Says "Read And Change"

Chrome may say Phish Guard can "read and change" data on `mail.google.com`.

The "read" part lets Phish Guard inspect the visible sender row. The "change" part lets Phish Guard add a warning banner to the Gmail page. Phish Guard does not edit, delete, send, archive, label, or report emails.

## Data Sharing

Phish Guard does not send Gmail sender data to a backend service. There is currently no server, analytics provider, ad network, or third-party data processor receiving email-related data from the extension.

## Limited Use

Phish Guard's use of information from Gmail page access is limited to providing sender-impersonation warnings inside Gmail. Phish Guard does not use or transfer user data for advertising, creditworthiness, data resale, or unrelated product features.

## Future Features

Future phishing features, such as link checks, DM warnings, or optional cloud reputation checks, must go through a new permission and privacy review before shipping. If the data boundary changes, this policy and the Chrome permission copy must change before users are asked to enable the new feature.

## Contact

For privacy or security concerns, use the repo's security reporting guidance in `SECURITY.md`. Do not post private email bodies, full headers, attachments, or personal messages in public issues.
