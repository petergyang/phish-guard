# Detector Corpus

Synthetic rendered-message fixtures for measuring Phish Guard's detector.

These are not raw emails. They model the fields the Chrome extension reads from the open Gmail message:

- `from`
- `subject`
- `bodyText`
- `links`

Do not add real private emails, full headers, attachments, screenshots, or inbox exports.

## Labels

- `phishing`: should produce `riskLevel: "suspicious"`.
- `safe`: should produce `riskLevel: "safe"` or `riskLevel: "limited_evidence"` without a warning banner.

## Fixture Shape

```json
{
  "id": "hbo-expired-subscription-outlook",
  "label": "phishing",
  "from": "\"H.B.O\" <niverbertina9473@outlook.com>",
  "subject": "Re: Your subscription could not be renewed",
  "bodyText": "HBOmax Hurry! This offer will expire soon. Your membership has expired!",
  "links": [
    {
      "href": "https://hbo-renewal.example/login",
      "text": "Renew membership"
    }
  ],
  "expectedBrand": "HBO",
  "notes": "Brand-like dotted acronym sender, public mailbox, urgency, suspicious link."
}
```

## Evaluation

Run:

```bash
npm run eval:detector
```

The evaluator reports phishing recall, safe false-positive rate, misses, false positives, and expected-brand mismatches.
