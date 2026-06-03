# Judge Q&A

Use this as a concise defense sheet for live judging, Devpost comments, or follow-up questions.

## Is this a real agent or only a UI mockup?

It is a code-owned agent demo with a Node.js runtime, JSON API, deterministic incident data, plan generation, tool-call objects, approval state, execution result, trace rows, evaluation scores, and client-side fallback mode. The hosted demo is static for reliability, but `server.js` exposes the same run and approval endpoints for local execution.

Evidence:

- `server.js`
- `public/app.js`
- `scripts/test.mjs`
- Hosted demo: https://raywu1037.github.io/agentops-commander/

## Where are Gemini and Google Cloud Agent Builder represented?

The submission includes an explicit agent contract in `agent-builder-config.json`. It defines the Gemini model target, Agent Builder import intent, tool contracts, Cloud Run deployment path, Firestore state, Secret Manager boundary, safety policy, and evaluation rubric.

Evidence:

- `agent-builder-config.json`
- Architecture tab in the hosted demo
- `JUDGES_BRIEF.md`

## Where is the partner MCP integration?

The partner track is Arize. The agent flow includes a `phoenix_trace_review` tool and a Phoenix MCP self-review loop. The demo shows Phoenix-style trace rows and evaluation feedback; the contract explains how Phoenix MCP reviews weak traces, missing tool calls, and unsafe recommendations.

Evidence:

- `agent-builder-config.json`
- `public/app.js`
- `server.js`
- Trace, Evals, and Architecture tabs

## Why use deterministic demo mode?

Judging and video recording need reliability. The demo avoids hidden API-key dependency, network flakiness, and live model variance while preserving the product workflow: goal, plan, tools, evidence, approval, execution, trace, eval, and self-review. The production path is documented for Gemini, Agent Builder, Cloud Run, Firestore, Secret Manager, and Phoenix MCP.

## How is unsafe autonomous action prevented?

State-changing actions remain blocked until human approval. The safety policy requires approval for configuration rollback, deployment change, refund or billing action, customer notification, and priority queue routing. The UI shows the gate, and tests verify that runs begin with approval pending.

Evidence:

- Approval gate in hosted demo
- `agent-builder-config.json`
- `scripts/test.mjs`

## How should AI-generated video clips be used?

Only as intro, transition, or outro clips. The Devpost demo should mainly show the real hosted app running. `SEEDANCE_DEMO_PROMPTS.md` and `seedance-demo-prompt-pack.txt` explicitly say the main demo must be real screen recording, not an AI replacement.

## What proves submission readiness?

- Public MIT-licensed repository
- Hosted demo URL
- GitHub Actions CI
- GitHub Pages deploy with post-deploy smoke tests
- Stable release: https://github.com/RayWu1037/agentops-commander/releases/tag/v0.1.0-submission
- Final issue tracker: https://github.com/RayWu1037/agentops-commander/issues/1
- Devpost copy pack, captions, recording console, gallery image, and judge brief

## What remains before final Devpost submission?

Only external actions remain:

- Demo video is uploaded: https://youtu.be/TrcCUcYIb6c
- Paste the video URL into Devpost and issue #1.
- Save or submit the final Devpost form.
