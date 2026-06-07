# Brand Rule Policy

## Purpose

Brand rules identify high-risk display-name claims and the sender domains that are allowed to make those claims. They are an extra confidence layer, not the only detection path.

The detector also has a generic sender-name mismatch rule. If an organization-style display name claims a brand-like identity, such as "Costco Rewards Connection", and that identity is absent from the actual sender address, the message can be flagged without adding a hardcoded brand rule first.

## Rule Shape

Each rule has:

- stable `id`
- user-visible `brandName`
- `displayNames` that may appear in sender names or subject context
- `trustedDomains` that may send for that brand

## Domain Matching

Trusted domains match exact domains and subdomains. They do not match arbitrary suffixes.

Examples:

- `youtube.com` matches `youtube.com`.
- `accounts.google.com` matches `google.com`.
- `youtube.com.attacker.example` does not match `youtube.com`.

## Adding Brands

Start small. Add brands where extra domain confidence is useful and user confusion is costly, such as account recovery, payment, device, cloud, and identity providers.

Every new brand rule needs fixture coverage for:

- a trusted sender
- an obvious impersonator
- a lookalike domain

## Copy Rule

Warning copy should say what evidence was found. It should not claim the email is definitely malicious.
