# AgentOps Commander

AgentOps Commander is a Gemini-ready, human-supervised incident response agent demo for the Google Cloud Rapid Agent Hackathon.

Repository: https://github.com/RayWu1037/agentops-commander

Hosted demo: https://raywu1037.github.io/agentops-commander/

The demo shows the loop the submission will emphasize:

1. Receive a real-world operations incident.
2. Plan the investigation.
3. Call structured tools.
4. Explain evidence and root cause.
5. Require human approval before state-changing actions.
6. Emit Phoenix-style traces and evaluations.
7. Use the trace review to improve the next run.

## Why this can win

Most hackathon agents stop at tool calling. AgentOps Commander is framed as a production agent: it takes action, but it is observable, evaluated, and gated by a human approval step. That maps directly to the judging criteria for technical implementation, design, impact, and creativity.

## Run locally

```bash
npm start
```

Open `http://localhost:8080`.

On Windows PowerShell, if `npm.ps1` is blocked by execution policy, run:

```powershell
node server.js
```

You can also open the static demo directly:

```text
public/index.html
```

No API keys are required for the demo mode. The backend returns deterministic agent runs so the demo is reliable for recording.

## Quality gate

```bash
node scripts/test.mjs
```

The current suite covers security headers, path traversal payloads, HTTP verb tampering, malformed requests, XSS-shaped payload escaping, offline fallback, accessibility metadata, mobile layout risks, submission assets, and the agent approval flow.

GitHub Actions runs the same checks on push and pull requests. A Pages workflow deploys the static demo from `public/`.

## Offline demo mode

The front end can run directly from `public/index.html`. If the API is unavailable, the app automatically falls back to deterministic client-side data, so the demo flow still works for recording and review.

## Submission assets

- `project-gallery.png` is a 3:2 image suitable for the Devpost image gallery.
- `DEMO_SCRIPT.md` contains the three-minute video narration.
- `demo-captions.srt` contains upload-ready English captions for the demo video.
- `VIDEO_QA_CHECKLIST.md` contains the pre-upload video recording checks.
- `DEVPOST_SUBMISSION.md` contains copy-ready Devpost text.
- `FINAL_SUBMISSION_PACK.md` contains copy-ready Devpost fields, links, and video compliance checks.
- `SUBMISSION_AUDIT.md` maps the project to requirements and judging criteria.
- `agent-builder-config.json` defines the Gemini, Google Cloud Agent Builder, Arize Phoenix MCP, safety, and eval contract.
- `TESTING.md` contains the regression checklist.
- `.github/workflows/ci.yml` runs the quality gate.
- `.github/workflows/pages.yml` deploys the static demo to GitHub Pages.

## Google Cloud and Gemini integration plan

The local runtime is intentionally code-owned so it can be moved to Google Cloud Run and wired to Gemini, Google Cloud Agent Builder, and Arize Phoenix MCP without rebuilding the product surface. The concrete agent contract is captured in `agent-builder-config.json`.

Planned production components:

- Gemini / Google ADK for reasoning and tool selection
- Cloud Run for the web app and agent runtime
- Secret Manager for API keys
- Firestore for run state and approvals
- Arize Phoenix for traces, spans, evaluations, and datasets
- Phoenix MCP for agent self-review over previous traces
- OpenInference / OpenTelemetry for instrumenting model and tool calls

## Environment variables

```bash
GOOGLE_API_KEY=
GOOGLE_CLOUD_PROJECT=
PHOENIX_COLLECTOR_ENDPOINT=
PHOENIX_API_KEY=
PHOENIX_MCP_SERVER_URL=
```

## Deploy to Cloud Run

```bash
gcloud run deploy agentops-commander --source . --region us-central1 --allow-unauthenticated
```

The repository includes a `Dockerfile` for container builds, but Cloud Run source deploy also works for this Node runtime.

## Demo video outline

1. Show the incident page and metrics spike.
2. Run the agent.
3. Walk through the plan and tool calls.
4. Show the root cause and approval gate.
5. Approve the mitigation.
6. Switch to traces and evals.
7. Explain the Phoenix MCP self-review loop.

Keep the final video under three minutes.
