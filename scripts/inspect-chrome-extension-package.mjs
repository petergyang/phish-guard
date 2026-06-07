import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const zipPath = path.join(repoRoot, "dist", "phish-guard-chrome-extension.zip");
const requiredFiles = [
  "manifest.json",
  "popup/popup.html",
  "popup/popup.js",
  "background/service-worker.js",
  "content/gmail-content.js",
  "ui/banner.css",
  "assets/icon-16.png",
  "assets/icon-32.png",
  "assets/icon-48.png",
  "assets/icon-128.png"
];

const listing = run("zipinfo", ["-1", zipPath]).stdout.trim().split("\n");
for (const file of requiredFiles) {
  if (!listing.includes(file)) {
    throw new Error(`Chrome extension package is missing ${file}`);
  }
}

const manifestText = run("unzip", ["-p", zipPath, "manifest.json"]).stdout;
const manifest = JSON.parse(manifestText);
const manifestString = JSON.stringify(manifest);
for (const forbidden of ["<all_urls>", "cookies", "webRequest", "gmail.readonly", "gmail.metadata"]) {
  if (manifestString.includes(forbidden)) {
    throw new Error(`Chrome extension package contains forbidden permission or scope: ${forbidden}`);
  }
}

if (manifest.optional_host_permissions?.[0] !== "https://mail.google.com/*") {
  throw new Error("Chrome extension package must keep Gmail host permission optional and scoped.");
}

if (!manifest.icons?.["128"] || !manifest.action?.default_icon?.["16"]) {
  throw new Error("Chrome extension package must include manifest icons and action icons.");
}

const contentScript = await readFile(path.join(repoRoot, "dist", "chrome-extension", "content", "gmail-content.js"), "utf8");
if (/(^|\n)\s*(import|export)\s/m.test(contentScript)) {
  throw new Error("Chrome content script build must not contain top-level import/export syntax.");
}

console.log(`Inspected ${path.relative(repoRoot, zipPath)}: ${requiredFiles.length} required files present`);

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed:\n${result.stderr || result.stdout}`);
  }

  return result;
}
