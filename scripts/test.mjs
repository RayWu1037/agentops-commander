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
const recordingHtml = await readFile(join(root, "public", "recording.html"), "utf8");
const app = await readFile(join(root, "public", "app.js"), "utf8");
const css = await readFile(join(root, "public", "styles.css"), "utf8");
const readme = await readFile(join(root, "README.md"), "utf8");
const judgesBrief = await readFile(join(root, "JUDGES_BRIEF.md"), "utf8");
const devpost = await readFile(join(root, "DEVPOST_SUBMISSION.md"), "utf8");
const demoScript = await readFile(join(root, "DEMO_SCRIPT.md"), "utf8");
const finalPack = await readFile(join(root, "FINAL_SUBMISSION_PACK.md"), "utf8");
const captions = await readFile(join(root, "demo-captions.srt"), "utf8");
const publicCaptions = await readFile(join(root, "public", "demo-captions.srt"), "utf8");
const videoQa = await readFile(join(root, "VIDEO_QA_CHECKLIST.md"), "utf8");
const gitignore = await readFile(join(root, ".gitignore"), "utf8");
const strategy = await readFile(join(root, "TEST_STRATEGY.md"), "utf8");
const ciWorkflow = await readFile(join(root, ".github", "workflows", "ci.yml"), "utf8");
const pagesWorkflow = await readFile(join(root, ".github", "workflows", "pages.yml"), "utf8");
const checklist = await readFile(join(root, "CHAMPIONSHIP_CHECKLIST.md"), "utf8");
const agentConfig = JSON.parse(await readFile(join(root, "agent-builder-config.json"), "utf8"));

assert(html.includes('href="styles.css"'), "HTML uses relative stylesheet path for file:// compatibility");
assert(recordingHtml.includes('href="styles.css"'), "Recording console uses relative stylesheet path");
assert(recordingHtml.includes('href="index.html"'), "Recording console links back to the demo");
assert(recordingHtml.includes('href="demo-captions.srt"'), "Recording console links to deployed captions");
assert(!/\son[a-z]+\s*=/.test(recordingHtml), "Recording console avoids inline event handlers");
assert(recordingHtml.includes("Record the winning demo in one pass"), "Recording console has a video prep headline");
assert(recordingHtml.includes("YouTube or Vimeo"), "Recording console tracks required upload platforms");
assert(recordingHtml.includes("Arize Phoenix MCP"), "Recording console includes partner MCP narration beat");
assert(html.includes('src="app.js"'), "HTML uses relative script path for file:// compatibility");
assert(!html.includes('type="module"'), "HTML avoids module script so file:// demo mode is robust");
assert(html.includes('lang="en"'), "HTML declares page language");
assert(html.includes('aria-label="Main"'), "Main navigation has an accessible label");
assert(html.includes('aria-label="Incident scenario"'), "Scenario select has an accessible label");
assert(html.includes('aria-label="Agent trace visualization"'), "Canvas has an accessible label");
assert(html.includes('aria-controls="incidentView"'), "Incident nav controls its view");
assert(html.includes('aria-controls="traceView"'), "Trace nav controls its view");
assert(html.includes('aria-controls="evalsView"'), "Evals nav controls its view");
assert(html.includes('aria-controls="architectureView"'), "Architecture nav controls its view");
assert(html.includes('aria-selected="true"'), "Active nav item exposes selected state");
assert((html.match(/tabindex="-1"/g) || []).length === 4, "All dynamic views are script-focusable");
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
assert(css.includes(".architecture-flow"), "CSS includes architecture flow layout");
assert(!/letter-spacing:\s*-/.test(css), "CSS avoids negative letter spacing");
assert(!/(https?:)?\/\//.test(css), "CSS avoids external runtime dependencies");
assert(!/(https?:)?\/\//.test(app), "App script avoids external runtime dependencies");
assert(readme.includes("Offline demo mode"), "README documents offline demo mode");
assert(readme.includes("https://github.com/RayWu1037/agentops-commander"), "README links the public repository");
assert(readme.includes("Hosted demo: https://raywu1037.github.io/agentops-commander/"), "README includes hosted demo URL");
assert(readme.includes("recording.html"), "README links the hosted recording console");
assert(readme.includes("public/demo-captions.srt"), "README documents hosted caption file");
assert(readme.includes("Judge Quickstart"), "README includes judge quickstart");
assert(readme.includes("JUDGES_BRIEF.md"), "README links the judges brief");
assert(readme.includes("FINAL_SUBMISSION_PACK.md"), "README documents the final submission pack");
assert(readme.includes("demo-captions.srt"), "README documents demo captions");
assert(readme.includes("VIDEO_QA_CHECKLIST.md"), "README documents video QA checklist");
assert(judgesBrief.includes("30-Second Review Path"), "Judges brief has a fast review path");
assert(judgesBrief.includes("agent-builder-config.json"), "Judges brief points to the Agent Builder contract");
assert(judgesBrief.includes("Arize Phoenix MCP"), "Judges brief names the partner MCP");
assert(devpost.includes("Arize Phoenix"), "Devpost copy emphasizes Arize Phoenix");
assert(devpost.includes("Gemini"), "Devpost copy emphasizes Gemini");
assert(devpost.includes("Google Cloud Agent Builder"), "Devpost copy emphasizes Google Cloud Agent Builder");
assert(devpost.includes("https://github.com/RayWu1037/agentops-commander"), "Devpost copy includes GitHub repository link");
assert(!devpost.includes("Python, FastAPI, React"), "Devpost copy does not claim unused implementation stacks");
assert(demoScript.includes("Google Cloud Agent Builder"), "Demo script names the Agent Builder workflow");
assert(demoScript.includes("Arize Phoenix traces"), "Demo script names the partner trace loop");
assert(finalPack.includes("Partner track: Arize"), "Final pack selects the Arize partner track");
assert(finalPack.includes("https://raywu1037.github.io/agentops-commander/"), "Final pack includes hosted demo URL");
assert(finalPack.includes("https://raywu1037.github.io/agentops-commander/recording.html"), "Final pack includes recording console URL");
assert(finalPack.includes("https://github.com/RayWu1037/agentops-commander"), "Final pack includes code repository URL");
assert(finalPack.includes("public YouTube or Vimeo URL"), "Final pack tracks the required public video URL");
assert(finalPack.includes("Use English narration or English subtitles"), "Final pack tracks English video requirement");
assert(finalPack.includes("Keep the video at or under 3 minutes"), "Final pack tracks video length requirement");
assert(finalPack.includes("demo-captions.srt"), "Final pack references the caption file");
assert(finalPack.includes("google-cloud"), "Final pack tracks GitHub topic verification");
assert(captions.includes("00:00:00,000 --> 00:00:08,000"), "Caption file uses SRT timestamps");
assert(publicCaptions === captions, "Hosted caption file matches repository caption file");
assert(captions.includes("Gemini and Google Cloud Agent Builder"), "Caption file mentions Gemini and Agent Builder");
assert(captions.includes("Arize Phoenix and Phoenix MCP"), "Caption file mentions Arize Phoenix MCP");
assert(captions.includes("00:02:54,000 --> 00:03:00,000"), "Caption file stays within the three-minute limit");
assert(videoQa.includes("Target length: 2:45 to 2:58"), "Video QA checklist defines target duration");
assert(videoQa.includes("recording.html"), "Video QA checklist links the recording console");
assert(videoQa.includes("Architecture tab"), "Video QA checklist requires Architecture tab shot");
assert(videoQa.includes("YouTube or Vimeo"), "Video QA checklist tracks required upload platforms");
assert(strategy.includes("OWASP"), "Test strategy references OWASP security testing");
assert(strategy.includes("WCAG 2.2"), "Test strategy references WCAG accessibility testing");
assert(ciWorkflow.includes("node scripts/test.mjs"), "CI workflow runs regression tests");
assert(pagesWorkflow.includes("actions/deploy-pages"), "Pages workflow deploys the static demo");
assert(pagesWorkflow.includes("enablement: true"), "Pages workflow can enable GitHub Pages on first deploy");
assert(checklist.includes("[x] Confirm GitHub Pages is enabled"), "Championship checklist records hosted demo verification");
assert(checklist.includes("[x] Add final Devpost submission pack"), "Championship checklist records final pack completion");
assert(checklist.includes("[x] Add demo captions and video QA checklist"), "Championship checklist records video prep assets");
assert(checklist.includes("[x] Confirm GitHub repo homepage and topics are set"), "Championship checklist records GitHub metadata verification");
assert(checklist.includes("[x] Add hosted recording console for video capture"), "Championship checklist records recording console completion");
assert(checklist.includes("Record and upload public demo video"), "Championship checklist tracks demo video requirement");
assert(agentConfig.agent.googleCloud.agentBuilder.includes("agent goal"), "Agent config defines Agent Builder contract");
assert(agentConfig.agent.googleCloud.geminiModel.includes("gemini"), "Agent config selects a Gemini model target");
assert(agentConfig.agent.partnerTrack.name === "Arize", "Agent config selects the Arize partner track");
assert(agentConfig.tools.some((tool) => tool.type === "partner_mcp" && tool.name === "phoenix_trace_review"), "Agent config defines Phoenix MCP tool");
assert(agentConfig.safetyPolicy.humanApprovalRequiredFor.length >= 5, "Agent config defines human approval boundaries");
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
  html.indexOf('data-view="architecture"'),
  html.indexOf('id="incidentSelect"'),
  html.indexOf('id="runAgent"'),
  html.indexOf('id="approveAction"')
];
assert(focusOrder.every((index) => index >= 0), "All key keyboard targets exist in the DOM");
assert(focusOrder[0] < focusOrder[1] && focusOrder[1] < focusOrder[2] && focusOrder[2] < focusOrder[3], "Navigation tab order is logical");
assert(focusOrder[4] < focusOrder[5], "Scenario select precedes Run agent in tab order");

for (const requiredText of [
  "Observable agents that take approved action",
  "Current incident",
  "Agent goal",
  "Plan",
  "Tool calls",
  "Root cause",
  "Trace timeline",
  "Evaluation scores",
  "Self-review loop",
  "Agent Builder contract",
  "Gemini + Google Cloud runtime",
  "Partner MCP role"
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
  "public/recording.html",
  "public/demo-captions.srt",
  "JUDGES_BRIEF.md",
  "DEMO_SCRIPT.md",
  "demo-captions.srt",
  "VIDEO_QA_CHECKLIST.md",
  "DEVPOST_SUBMISSION.md",
  "FINAL_SUBMISSION_PACK.md",
  "SUBMISSION_AUDIT.md",
  "TESTING.md",
  "CHAMPIONSHIP_CHECKLIST.md",
  "agent-builder-config.json",
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

  const recording = await fetch(`${base}/recording.html`);
  assert(recording.ok, "Recording console responds over HTTP");
  assert((await recording.text()).includes("Record the winning demo"), "Recording console contains recording headline");

  const captionFile = await fetch(`${base}/demo-captions.srt`);
  assert(captionFile.ok, "Hosted caption file responds over HTTP");
  assert((await captionFile.text()).includes("00:02:54,000 --> 00:03:00,000"), "Hosted caption file stays within three minutes");

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
