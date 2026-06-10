import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const phishingPath = path.join(repoRoot, "packages/detector/fixtures/corpus/phishing.json");
const safePath = path.join(repoRoot, "packages/detector/fixtures/corpus/safe.json");

const minRecall = Number.parseFloat(process.env.PHISH_GUARD_MIN_RECALL ?? "0.9");
const maxFalsePositiveRate = Number.parseFloat(process.env.PHISH_GUARD_MAX_FALSE_POSITIVE_RATE ?? "0.1");

const tempDir = await mkdtemp(path.join(tmpdir(), "phish-guard-detector-"));
const bundledDetectorPath = path.join(tempDir, "detector.mjs");

try {
  await build({
    bundle: true,
    entryPoints: [path.join(repoRoot, "packages/detector/src/index.ts")],
    format: "esm",
    logLevel: "silent",
    outfile: bundledDetectorPath,
    platform: "node",
    target: "node22"
  });

  const [{ analyzeMessage }, phishingCases, safeCases] = await Promise.all([
    import(`${pathToFileURL(bundledDetectorPath).href}?t=${Date.now()}`),
    readJson(phishingPath),
    readJson(safePath)
  ]);

  const cases = [...phishingCases, ...safeCases];
  const results = cases.map((fixture) => {
    const detection = analyzeMessage(toMessageMetadata(fixture));
    const predicted = detection.riskLevel === "suspicious" ? "phishing" : "safe";
    return {
      fixture,
      detection,
      predicted,
      correct: predicted === fixture.label,
      brandMatches: fixture.expectedBrand === undefined || fixture.expectedBrand === detection.claimedBrand
    };
  });

  const phishingResults = results.filter((result) => result.fixture.label === "phishing");
  const safeResults = results.filter((result) => result.fixture.label === "safe");
  const misses = phishingResults.filter((result) => result.predicted !== "phishing");
  const falsePositives = safeResults.filter((result) => result.predicted === "phishing");
  const brandMismatches = results.filter((result) => !result.brandMatches);
  const recall = ratio(phishingResults.length - misses.length, phishingResults.length);
  const falsePositiveRate = ratio(falsePositives.length, safeResults.length);

  const report = [
    "Phish Guard detector corpus",
    "",
    `Cases: ${cases.length} (${phishingResults.length} phishing, ${safeResults.length} safe)`,
    `Phishing recall: ${formatCount(phishingResults.length - misses.length, phishingResults.length)} = ${formatPercent(recall)}`,
    `Safe false-positive rate: ${formatCount(falsePositives.length, safeResults.length)} = ${formatPercent(falsePositiveRate)}`,
    `Expected-brand mismatches: ${brandMismatches.length}`,
    "",
    formatResultList("Misses", misses),
    formatResultList("False positives", falsePositives),
    formatBrandMismatches(brandMismatches)
  ].join("\n");

  console.log(report.trimEnd());

  if (recall < minRecall || falsePositiveRate > maxFalsePositiveRate || brandMismatches.length > 0) {
    console.error("");
    console.error(`Thresholds failed: min recall ${formatPercent(minRecall)}, max false-positive rate ${formatPercent(maxFalsePositiveRate)}.`);
    process.exitCode = 1;
  }
} finally {
  await rm(tempDir, { force: true, recursive: true });
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function toMessageMetadata(fixture) {
  return {
    from: fixture.from,
    ...(fixture.replyTo ? { replyTo: fixture.replyTo } : {}),
    ...(fixture.subject ? { subject: fixture.subject } : {}),
    ...(fixture.bodyText ? { bodyText: fixture.bodyText } : {}),
    ...(fixture.links ? { links: fixture.links } : {}),
    provider: "corpus"
  };
}

function ratio(numerator, denominator) {
  return denominator === 0 ? 0 : numerator / denominator;
}

function formatCount(numerator, denominator) {
  return `${numerator}/${denominator}`;
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatResultList(title, results) {
  if (results.length === 0) {
    return `${title}: none\n`;
  }

  return [
    `${title}:`,
    ...results.map((result) => {
      const evidenceKinds = result.detection.evidence.map((item) => item.kind).join(", ") || "none";
      return `- ${result.fixture.id}: predicted ${result.predicted}, brand ${result.detection.claimedBrand ?? "none"}, evidence ${evidenceKinds}`;
    }),
    ""
  ].join("\n");
}

function formatBrandMismatches(results) {
  if (results.length === 0) {
    return "Brand mismatches: none\n";
  }

  return [
    "Brand mismatches:",
    ...results.map((result) => {
      return `- ${result.fixture.id}: expected ${result.fixture.expectedBrand ?? "none"}, got ${result.detection.claimedBrand ?? "none"}`;
    }),
    ""
  ].join("\n");
}
