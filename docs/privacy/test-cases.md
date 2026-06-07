# Privacy Test Cases

## Required Automated Checks

- A suspicious YouTube impersonation fixture produces a warning using sender metadata only.
- A generic organization-style sender name, such as "Costco Rewards Connection", warns when the claimed name is absent from the sender address.
- A legitimate YouTube sender fixture stays quiet.
- A malformed sender produces limited evidence, not a safe result.
- Body-like fields are ignored before metadata reaches the detector.
- A friend mentioning a brand in the subject does not trigger a warning.
- A normal personal display name does not warn just because it has multiple words.
- The Chrome extension manifest uses optional `mail.google.com` access and no broad host permissions.
- The Chrome extension DOM adapter ignores body, link, and attachment nodes.
- Lookalike domains such as `youtube.com.attacker.example` do not match trusted-domain rules.

## Required Manual Checks

- The Chrome extension installs without Google OAuth.
- The extension popup explains Gmail access before requesting it.
- Chrome asks only for `mail.google.com` access.
- Opening a suspicious Gmail message shows an inline warning near the sender row.
- Opening a safe Gmail message does not show a warning.
- Opening a suspicious message in the spam folder still shows the Phish Guard warning.
- Navigating from a suspicious message to a safe message removes the old warning.
- Refreshing Gmail or rechecking the same message does not create duplicate warning banners.
- Long sender addresses wrap inside the warning without covering Gmail controls.
- The add-on can be installed with only Workspace add-on runtime scopes and current-message metadata scope.
- Opening a Gmail message can render the add-on card.
- A warning can be demonstrated with synthetic or test-account messages.
- Screenshots used for demos do not reveal real private inbox content.

## Regression Rule

If any test begins passing message body, snippet, link, or attachment fields to the detector, treat it as a privacy regression.
