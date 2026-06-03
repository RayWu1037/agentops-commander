# Final Submission Pack

Use this file as the copy/paste source for the final Devpost submission.

## Required Links

- Hosted demo URL: https://raywu1037.github.io/agentops-commander/
- Recording console: https://raywu1037.github.io/agentops-commander/recording.html
- Code repository: https://github.com/RayWu1037/agentops-commander
- Submission release: https://github.com/RayWu1037/agentops-commander/releases/tag/v0.1.0-submission
- Devpost submission: https://devpost.com/software/agentops-commander
- Demo video URL: https://youtu.be/TrcCUcYIb6c
- Partner track: Arize
- Final external checklist issue: https://github.com/RayWu1037/agentops-commander/issues/1
- Optional AI video prompt pack: `SEEDANCE_DEMO_PROMPTS.md`

## Project Name

AgentOps Commander

## Tagline

Observable incident response agents that take approved action and improve from Arize Phoenix traces.

## Elevator Pitch

AgentOps Commander is a Gemini and Google Cloud Agent Builder-ready incident response agent. It investigates real operational failures, calls tools, explains evidence, requires human approval before state-changing actions, and uses Arize Phoenix MCP trace review to improve the next run.

## Built With

Gemini, Google Cloud, Google Cloud Agent Builder, Cloud Run, Node.js, HTML, CSS, JavaScript, Arize Phoenix, Phoenix MCP, OpenInference, OpenTelemetry, Firestore, Secret Manager, GitHub Pages

## Submission Description

Most AI agents can answer questions, but real teams need agents that can safely take action. During an incident, operators need a system that can investigate evidence, explain its plan, request approval, execute bounded mitigations, and leave an audit trail.

AgentOps Commander is built for that workflow. The demo receives an operational incident, creates a plan, calls structured tools, identifies root cause, proposes a mitigation, and blocks execution until a human approves it. After approval, the run records execution and shows Phoenix-style traces, evaluation scores, and self-review recommendations.

The Arize track integration is centered on Phoenix MCP. The agent uses Phoenix-style trace review to inspect spans and evaluation samples, identify missing evidence or weak tool calls, and improve its next run. This makes observability part of the agent loop rather than a dashboard added afterward.

The repository includes a concrete `agent-builder-config.json` contract for Gemini, Google Cloud Agent Builder, Cloud Run, Arize Phoenix MCP, safety policy, and evaluation targets. It also includes automated regression tests covering security headers, traversal payloads, HTTP verb tampering, malformed input, XSS-shaped payload escaping, offline fallback, accessibility metadata, mobile layout risks, CI, Pages deployment, and submission assets.

## What To Show In The Video

1. Open the hosted demo URL.
   Optional prep page: https://raywu1037.github.io/agentops-commander/recording.html
2. Show the incident metrics and operational goal.
3. Click `Run agent`.
4. Show the plan, tool calls, evidence, and root cause.
5. Show the approval gate and approve the mitigation.
6. Open `Trace` and point out spans, latency, tokens, and eval results.
7. Open `Evals` and show task success, evidence coverage, action safety, and self-improvement.
8. Open `Architecture` and show Gemini, Google Cloud Agent Builder, Cloud Run, and Arize Phoenix MCP.
9. Close on the differentiator: plan, act with approval, trace, evaluate, improve.

## Demo Video Compliance Checklist

- Keep the video at or under 3 minutes.
- Upload to YouTube or Vimeo.
- Make the video publicly visible.
- Use English narration or English subtitles.
- Upload `demo-captions.srt` if the video platform supports caption files.
- Show the project functioning on the web platform.
- Avoid third-party logos, trademarks, ads, personal information, or copyrighted media not owned by the team.
- Use the hosted demo URL, not only local files, during the recording.

## Final Devpost Checklist

- Submitted to Devpost: https://devpost.com/software/agentops-commander
- Selected Partner track: Arize.
- Pasted hosted demo URL: https://raywu1037.github.io/agentops-commander/
- Pasted code URL: https://github.com/RayWu1037/agentops-commander
- Pasted public video URL: https://youtu.be/TrcCUcYIb6c
- Uploaded `project-gallery.png` as the project gallery image.
- Verified English captions are available in `demo-captions.srt`.
- If using Seedance-style AI clips, keep them as intro/transition/outro only; the main video must show the real hosted app.
- Used the tagline, built-with list, and submission description above.
- Verified the repository is public and has `LICENSE` visible.
- Use release `v0.1.0-submission` as the stable judging snapshot if Devpost asks for a specific release or version.
- Verified GitHub repository homepage points to the hosted demo and topics include `google-cloud`, `gemini`, `agent-builder`, `arize`, and `mcp`.
- Ran the final hosted smoke test before submission.
