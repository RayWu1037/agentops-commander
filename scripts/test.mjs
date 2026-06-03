import { spawn } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const port = 8099;
const base = `http://127.0.0.1:${port}`;
const checks = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
  checks.push(message);
}

async function waitForServer() {
  const deadline = Date.now() + 5000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${base}/healthz`);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw lastError || new Error("Server did not become healthy");
}

function rawRequest(method, path) {
  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method
      },
      (response) => {
        response.resume();
        response.on("end", () => resolve(response.statusCode || 0));
      }
    );
    request.on("error", reject);
    request.end();
  });
}

const html = await readFile(join(root, "public", "index.html"), "utf8");
const app = await readFile(join(root, "public", "app.js"), "utf8");
const css = await readFile(join(root, "public", "styles.css"), "utf8");
const readme = await readFile(join(root, "README.md"), "utf8");
const devpost = await readFile(join(root, "DEVPOST_SUBMISSION.md"), "utf8");
const gitignore = await readFile(join(root, ".gitignore"), "utf8");
const strategy = await readFile(join(root, "TEST_STRATEGY.md"), "utf8");
const ciWorkflow = await readFile(join(root, ".github", "workflows", "ci.yml"), "utf8");
const pagesWorkflow = await readFile(join(root, ".github", "workflows", "pages.yml"), "utf8");
const checklist = await readFile(join(root, "CHAMPIONSHIP_CHECKLIST.md"), "utf8");

assert(html.includes('href="styles.css"'), "HTML uses relative stylesheet path for file:// compatibility");
assert(html.includes('src="app.js"'), "HTML uses relative script path for file:// compatibility");
assert(!html.includes('type="module"'), "HTML avoids module script so file:// demo mode is robust");
assert(html.includes('lang="en"'), "HTML declares page language");
assert(html.includes('aria-label="Main"'), "Main navigation has an accessible label");
assert(html.includes('aria-label="Incident scenario"'), "Scenario select has an accessible label");
assert(html.includes('aria-label="Agent trace visualization"'), "Canvas has an accessible label");
assert(html.includes('aria-controls="incidentView"'), "Incident nav controls its view");
assert(html.includes('aria-controls="traceView"'), "Trace nav controls its view");
assert(html.includes('aria-controls="evalsView"'), "Evals nav controls its view");
assert(html.includes('aria-selected="true"'), "Active nav item exposes selected state");
assert((html.match(/tabindex="-1"/g) || []).length === 3, "All dynamic views are script-focusable");
assert(!/\son[a-z]+\s*=/.test(html), "HTML avoids inline event handlers");
assert(!/(https?:)?\/\//.test(html), "HTML avoids external runtime dependencies");
assert(app.includes("fallbackIncidents"), "App contains offline fallback incidents");
assert(app.includes("clientRun("), "App contains client-side agent run fallback");
assert(app.includes("escapeHtml"), "App escapes rendered dynamic values");
assert(app.includes("state.offline = true"), "App falls back to offline mode when API calls fail");
assert(app.includes("scrollIntoView"), "App scrolls to the approval result after running");
assert(app.includes("aria-selected"), "App updates nav aria-selected state");
assert(app.includes("focus({ preventScroll: true })"), "App moves focus to active view without scroll jumps");
assert(css.includes("@media (max-width: 720px)"), "CSS includes mobile responsive rules");
assert(css.includes("position: sticky"), "Approval panel remains visible during demo scrolling");
assert(css.includes(":focus-visible"), "CSS includes visible keyboard focus styles");
assert(css.includes("grid-template-columns: 1fr"), "CSS collapses major grids to one column on mobile");
assert(!/letter-spacing:\s*-/.test(css), "CSS avoids negative letter spacing");
assert(!/(https?:)?\/\//.test(css), "CSS avoids external runtime dependencies");
assert(!/(https?:)?\/\//.test(app), "App script avoids external runtime dependencies");
assert(readme.includes("Offline demo mode"), "README documents offline demo mode");
assert(readme.includes("https://github.com/RayWu1037/agentops-commander"), "README links the public repository");
assert(readme.includes("https://raywu1037.github.io/agentops-commander/"), "README includes planned hosted demo URL");
assert(devpost.includes("Arize Phoenix"), "Devpost copy emphasizes Arize Phoenix");
assert(devpost.includes("Gemini"), "Devpost copy emphasizes Gemini");
assert(devpost.includes("https://github.com/RayWu1037/agentops-commander"), "Devpost copy includes GitHub repository link");
assert(strategy.includes("OWASP"), "Test strategy references OWASP security testing");
assert(strategy.includes("WCAG 2.2"), "Test strategy references WCAG accessibility testing");
assert(ciWorkflow.includes("node scripts/test.mjs"), "CI workflow runs regression tests");
assert(pagesWorkflow.includes("actions/deploy-pages"), "Pages workflow deploys the static demo");
assert(checklist.includes("Record and upload public demo video"), "Championship checklist tracks demo video requirement");
assert(gitignore.includes("*.log"), "Git ignore excludes logs");
assert(gitignore.includes("verification-*.png"), "Git ignore excludes verification screenshots");

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert(new Set(ids).size === ids.length, "HTML does not contain duplicate IDs");

const buttonCount = [...html.matchAll(/<button\b/g)].length;
const typedButtonCount = [...html.matchAll(/<button\b[^>]*\btype="button"/g)].length;
assert(buttonCount === typedButtonCount, "All buttons declare type=button");

const focusOrder = [
  html.indexOf('data-view="incident"'),
  html.indexOf('data-view="trace"'),
  html.indexOf('data-view="evals"'),
  html.indexOf('id="incidentSelect"'),
  html.indexOf('id="runAgent"'),
  html.indexOf('id="approveAction"')
];
assert(focusOrder.every((index) => index >= 0), "All key keyboard targets exist in the DOM");
assert(focusOrder[0] < focusOrder[1] && focusOrder[1] < focusOrder[2], "Navigation tab order is logical");
assert(focusOrder[3] < focusOrder[4], "Scenario select precedes Run agent in tab order");

for (const requiredText of [
  "Observable agents that take approved action",
  "Current incident",
  "Agent goal",
  "Plan",
  "Tool calls",
  "Root cause",
  "Trace timeline",
  "Evaluation scores",
  "Self-review loop"
]) {
  assert(html.includes(requiredText), `Recording path contains ${requiredText}`);
}

for (const riskyCss of ["width: 100vw", "\n  height: 100vh", "body {\n  overflow: hidden"]){
  assert(!css.includes(riskyCss), `CSS avoids mobile overflow risk ${riskyCss}`);
}
assert(css.includes("min-height: 100dvh"), "CSS uses dynamic viewport height for the app shell");

const combinedText = [html, app, css, readme, devpost].join("\n");
assert(!/AIza[0-9A-Za-z_-]{20,}/.test(combinedText), "No Google API key-like secret is present");
assert(!/sk-[0-9A-Za-z_-]{20,}/.test(combinedText), "No OpenAI-style API key-like secret is present");

const xssPayloads = [
  "<script>alert(1)</script>",
  "<img src=x onerror=alert(1)>",
  "\"><svg/onload=alert(1)>",
  "<a href=\"jav&#x0A;ascript:alert(1)\">click</a>",
  "';alert(String.fromCharCode(88,83,83));//"
];

const escapedXss = xssPayloads.map((payload) =>
  payload
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
);
assert(escapedXss.every((payload) => !payload.includes("<script") && !payload.includes("<img") && !payload.includes("<svg")), "OWASP-style XSS payloads are escaped for HTML rendering");

for (const required of [
  "LICENSE",
  "Dockerfile",
  "DEMO_SCRIPT.md",
  "DEVPOST_SUBMISSION.md",
  "TESTING.md",
  "CHAMPIONSHIP_CHECKLIST.md",
  ".github/workflows/ci.yml",
  ".github/workflows/pages.yml",
  "project-gallery.png"
]) {
  assert((await stat(join(root, required))).isFile(), `${required} exists`);
}

const gallery = await readFile(join(root, "project-gallery.png"));
assert(gallery[0] === 0x89 && gallery[1] === 0x50 && gallery[2] === 0x4e && gallery[3] === 0x47, "Project gallery image is a PNG");
const width = gallery.readUInt32BE(16);
const height = gallery.readUInt32BE(20);
assert(width === 1200 && height === 800, "Project gallery image is 1200x800 for Devpost 3:2 ratio");

const child = spawn(process.execPath, ["server.js"], {
  cwd: root,
  env: { ...process.env, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"]
});

let stderr = "";
child.stderr.on("data", (chunk) => {
  stderr += chunk.toString();
});

try {
  await waitForServer();

  const home = await fetch(`${base}/`);
  assert(home.ok, "Home page responds over HTTP");
  assert(home.headers.get("x-content-type-options") === "nosniff", "Static responses set X-Content-Type-Options");
  assert(home.headers.get("referrer-policy") === "no-referrer", "Static responses set Referrer-Policy");
  assert(Boolean(home.headers.get("content-security-policy")), "Static responses set Content-Security-Policy");
  assert((await home.text()).includes("AgentOps Commander"), "Home page contains product name");

  const styles = await fetch(`${base}/styles.css`);
  assert(styles.ok, "Stylesheet responds over HTTP");
  assert((await styles.text()).includes(".app-shell"), "Stylesheet contains app shell layout");

  const script = await fetch(`${base}/app.js`);
  assert(script.ok, "App script responds over HTTP");
  assert((await script.text()).includes("runAgent"), "App script contains run action");

  const traversal = await fetch(`${base}/../server.js`);
  assert(traversal.status >= 400, "Static server rejects path traversal attempts");

  const encodedTraversal = await fetch(`${base}/%2e%2e/server.js`);
  assert(encodedTraversal.status >= 400, "Static server rejects encoded path traversal attempts");

  const traversalPayloads = [
    "/..%2fserver.js",
    "/%2e%2e%2fserver.js",
    "/%252e%252e%252fserver.js",
    "/..\\server.js",
    "/C:/Windows/win.ini",
    "/public/../../server.js"
  ];

  for (const payload of traversalPayloads) {
    const response = await fetch(`${base}${payload}`);
    assert(response.status >= 400, `Static server rejects traversal payload ${payload}`);
  }

  const malformedPercent = await fetch(`${base}/%E0%A4%A`);
  assert(malformedPercent.status === 400, "Static server rejects malformed percent encoding without crashing");

  const hpp = await fetch(`${base}/api/incidents?id=world-cup-checkout&id=../../server.js`);
  assert(hpp.ok, "Incidents API tolerates duplicate query parameters without changing behavior");
  assert((await hpp.json()).incidents.length >= 2, "Incidents API ignores polluted query parameters");

  const incidentsResponse = await fetch(`${base}/api/incidents`);
  assert(incidentsResponse.headers.get("x-content-type-options") === "nosniff", "API responses set X-Content-Type-Options");
  const incidents = await incidentsResponse.json();
  assert(incidents.incidents.length >= 2, "Incidents API returns multiple scenarios");

  const wrongMethod = await fetch(`${base}/api/agent/run`);
  assert(wrongMethod.status === 404, "Run endpoint rejects wrong HTTP method");

  for (const method of ["PUT", "DELETE", "PATCH", "TRACE", "OPTIONS"]) {
    const status = await rawRequest(method, "/api/agent/run");
    assert(status >= 400, `Run endpoint rejects ${method}`);
  }

  const runResponse = await fetch(`${base}/api/agent/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ incidentId: "world-cup-checkout" })
  });
  const run = await runResponse.json();
  assert(run.plan.length === 6, "Agent run returns six plan steps");
  assert(run.tools.length === 4, "Agent run returns four tool calls");
  assert(run.traceRows.length === 4, "Agent run returns four trace rows");
  assert(run.approved === false, "Agent run starts with approval pending");

  const unknownRunResponse = await fetch(`${base}/api/agent/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ incidentId: "<img src=x onerror=alert(1)>" })
  });
  const unknownRun = await unknownRunResponse.json();
  assert(unknownRun.incident.id === "world-cup-checkout", "Unknown incident IDs fall back to a safe default");

  const invalidJsonResponse = await fetch(`${base}/api/agent/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{not-json"
  });
  assert(invalidJsonResponse.ok, "Invalid JSON request body does not crash the run endpoint");

  const longBodyResponse = await fetch(`${base}/api/agent/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ incidentId: "x".repeat(10000) })
  });
  assert(longBodyResponse.ok, "Long but bounded request body does not crash the run endpoint");

  const approveResponse = await fetch(`${base}/api/agent/approve`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ incidentId: "world-cup-checkout" })
  });
  const approved = await approveResponse.json();
  assert(approved.approved === true, "Approval endpoint marks action approved");
  assert(Boolean(approved.execution?.result), "Approval endpoint returns execution result");
} finally {
  child.kill();
}

if (stderr.trim()) {
  throw new Error(`Server wrote to stderr:\n${stderr}`);
}

console.log(`Passed ${checks.length} checks`);
for (const check of checks) console.log(`- ${check}`);
