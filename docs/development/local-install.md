# Local Development Install

For normal private testing, use the install steps in [README.md](../../README.md).

Use this page only when building the extension from source.

```bash
npm install
npm test
npm run build:chrome-extension
```

Then open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**, and select `dist/chrome-extension`.

To package a private test ZIP:

```bash
npm run package:chrome-extension
```

The ZIP is created at `dist/phish-guard-chrome-extension.zip`.
