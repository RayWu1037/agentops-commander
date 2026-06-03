import { mkdir, readdir, rename, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

async function loadPlaywright() {
  const candidates = [
    process.env.PLAYWRIGHT_CORE_PATH,
    "playwright-core",
    "playwright"
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const resolved = candidate.includes("/") || candidate.includes("\\")
        ? candidate
        : require.resolve(candidate);
      const mod = await import(pathToFileURL(resolved).href);
      return mod.default || mod;
    } catch {
      // Try the next candidate.
    }
  }

  throw new Error(
    "Playwright is required for recording. Install playwright-core/playwright, or set PLAYWRIGHT_CORE_PATH to the package entrypoint."
  );
}

const { chromium } = await loadPlaywright();

const root = resolve(import.meta.dirname, "..");
const outDir = join(root, "..", "agentops-commander-demo-recordings");
const videoDir = join(outDir, "playwright-video");
const profile = process.env.DEMO_PROFILE || "final";
const finalVideo = join(outDir, `agentops-commander-demo-${profile}.webm`);
const demoUrl = process.env.DEMO_URL || "https://raywu1037.github.io/agentops-commander/";
const isQuick = profile === "quick";
const viewport = isQuick ? { width: 1280, height: 720 } : { width: 1920, height: 1080 };

await rm(videoDir, { recursive: true, force: true });
await mkdir(videoDir, { recursive: true });

const executablePath =
  process.env.BROWSER_EXE ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await chromium.launch({
  executablePath,
  headless: false,
  args: [`--window-size=${viewport.width},${viewport.height}`],
});

const context = await browser.newContext({
  viewport,
  recordVideo: {
    dir: videoDir,
    size: viewport,
  },
});

const page = await context.newPage();

async function pause(ms) {
  await page.waitForTimeout(ms);
}

async function showTab(name) {
  await page.getByRole("button", { name }).click();
  await pause(isQuick ? 1800 : 10000);
}

await page.goto(demoUrl, { waitUntil: "networkidle" });
await pause(isQuick ? 2500 : 12000);

await page.getByRole("button", { name: "Run agent" }).click();
await pause(isQuick ? 5000 : 22000);

await page.locator("#approveAction").click();
await pause(isQuick ? 2500 : 14000);

await showTab("Trace");
await showTab("Evals");
await showTab("Architecture");
await showTab("Incident");

await pause(isQuick ? 1500 : 8000);

await context.close();
await browser.close();

const files = await readdir(videoDir);
const webm = files.find((file) => file.endsWith(".webm"));
if (!webm) {
  throw new Error(`No recorded .webm file found in ${videoDir}`);
}

await rename(join(videoDir, webm), finalVideo);

console.log(finalVideo);
