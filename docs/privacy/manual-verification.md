# Manual Verification

## Setup

Use a test Gmail account and synthetic messages. Do not use Peter's real inbox for screenshots or demos.

## Checklist

- Install the add-on with only current-message metadata scope.
- Open a synthetic message from `"YouTube Account Recovery" <random-person@gmail.com>`.
- Confirm the card says to check the sender.
- Confirm the card explains that the message says YouTube but came from `gmail.com`.
- Open a synthetic message from `"YouTube" <alerts@youtube.com>`.
- Confirm the card stays quiet or safe.
- Open a message with malformed sender metadata.
- Confirm the card shows limited evidence rather than safe.
- Confirm no body, link, attachment, or snippet data appears in logs, screenshots, fixtures, or detector inputs.

## Demo Evidence

Safe demo artifacts include:

- synthetic fixture JSON
- terminal test output
- screenshots of test-account messages
- screenshots of the add-on card without private inbox content

Unsafe demo artifacts include:

- real inbox screenshots
- raw private email headers from personal mail
- message bodies or snippets
- attachment names from real mail
