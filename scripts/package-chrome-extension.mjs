import { rm } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const repoRoot = process.cwd();
const extensionDir = path.join(repoRoot, "dist", "chrome-extension");
const zipPath = path.join(repoRoot, "dist", "phish-guard-chrome-extension.zip");

await rm(zipPath, { force: true });
await run("npm", ["run", "build:chrome-extension"]);
await run("zip", ["-r", zipPath, "."], { cwd: extensionDir });
await run("npm", ["run", "inspect:chrome-extension-package"]);

console.log(`Packaged ${path.relative(repoRoot, zipPath)}`);

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? repoRoot,
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}
