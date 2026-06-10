# Detector Fixtures

Fixtures are synthetic examples for detector and add-on tests. Do not add real private email headers or inbox exports.

## Current Fixtures

- `youtube-gmail-impersonation.json` checks a protected brand claim from a personal mailbox domain.
- `google-legit-subdomain.json` checks a trusted YouTube sender.
- `delegated-sender-limited-evidence.json` checks a delegated-looking sender that needs evidence-based handling.
- `brand-rules.json` mirrors the data shape expected by brand-rule validation.
- `corpus/phishing.json` and `corpus/safe.json` are the release corpus used by `npm run eval:detector`.

## Corpus

The corpus is synthetic rendered-message metadata, not real inbox data. It covers sender-name impersonation, body-brand claims, urgent language, suspicious link domains, redirects, shorteners, and ordinary safe messages that mention brands.

Run it before releases:

```bash
npm run eval:detector
```

## Fixture Rules

- Keep examples synthetic.
- Include only metadata fields allowed by the MVP privacy boundary.
- Add both positive and negative examples when adding a new brand rule.
