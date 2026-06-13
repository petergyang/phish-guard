# Local Testing Install

Use this page only for pre-store testing or local development. Normal users should install Phish Guard from the Chrome Web Store once the listing is approved.

## Install A Release ZIP

Use this path when you are helping test before Chrome Web Store approval and do not need to build from source.

![Chrome extension setup screen](../assets/readme/chrome-extension-setup.svg)

1. Go to [Phish Guard releases](https://github.com/petergyang/phish-guard/releases).
2. Open the newest prerelease.
3. Download `phish-guard-chrome-extension.zip`.
4. Unzip the file.
5. Open Chrome and go to `chrome://extensions`.
6. Turn on **Developer mode**.
7. Click **Load unpacked**.
8. Select the unzipped folder that contains `manifest.json`.
9. Open Gmail, click the Phish Guard toolbar icon, and turn on Gmail warnings.

If Chrome shows extension errors later, go back to `chrome://extensions`, click **Reload** on Phish Guard, and refresh Gmail.

## Build From Source

```bash
npm install
npm test
npm run build:chrome-extension
```

Then open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**, and select `dist/chrome-extension`.

## Package A Tester ZIP

```bash
npm run package:chrome-extension
```

The ZIP is created at `dist/phish-guard-chrome-extension.zip`.
