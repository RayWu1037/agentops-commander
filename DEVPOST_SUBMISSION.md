# Devpost Draft

## Project name

AgentOps Commander

## Elevator pitch

A Gemini and Google Cloud Agent Builder-ready agent that investigates incidents, takes approved actions, and improves itself using Arize Phoenix traces and MCP review.

## Built with

Gemini, Google Cloud, Google Cloud Agent Builder, Cloud Run, Node.js, HTML, CSS, JavaScript, Arize Phoenix, Phoenix MCP, OpenInference, OpenTelemetry, Firestore, Secret Manager, GitHub Pages

## Links

- Code: https://github.com/RayWu1037/agentops-commander
- Demo: https://raywu1037.github.io/agentops-commander/

## About the project

### Inspiration

Most AI agents can answer questions, but real teams need agents that can safely take action. During an incident, operators need more than another chat window: they need a system that can investigate evidence, explain its plan, request approval, execute low-risk actions, and leave an audit trail.

AgentOps Commander is designed for that gap. It turns Gemini into an observable, human-supervised operations agent that can diagnose a real-world workflow issue and then improve from its own traces.

### What it does

AgentOps Commander receives an operational goal, such as investigating a spike in failed orders, delayed support responses, or degraded service health. The agent breaks the goal into a plan, calls tools to inspect data and logs, summarizes the evidence, proposes next actions, and waits for human approval before executing any action that changes state.

The key feature is the self-improvement loop. Every agent step is traced with Arize Phoenix. The agent can use Phoenix MCP to review its own traces, identify weak reasoning or missing tool calls, and recommend changes to prompts, tool descriptions, or evaluation criteria.

### How we built it

The demo is a code-owned Node.js agent runtime with a web dashboard. The current build includes deterministic demo mode for reliable judging and recording, plus a concrete `agent-builder-config.json` contract for Gemini, Google Cloud Agent Builder, Cloud Run, Arize Phoenix, OpenInference, and Phoenix MCP.

The UI shows the operational incident, the agent plan, tool calls, evidence, approval gate, execution result, trace timeline, evaluation scores, and self-review recommendations.

The repository includes an automated regression suite based on OWASP, WCAG, MDN, and web.dev guidance. It covers security headers, path traversal payloads, HTTP verb tampering, malformed requests, XSS-shaped payload escaping, offline fallback, accessibility metadata, mobile layout risks, hosted-demo readiness, submission assets, and the agent approval flow.

### Challenges we ran into

The biggest product challenge was making the demo feel like a real operational workflow instead of a chatbot. We focused on evidence, auditability, and safety gates so the agent's action path is inspectable.

The biggest technical challenge was designing a submission demo that can run reliably during judging even when API credentials are not available. The app supports a deterministic demo mode while preserving the architecture needed for live Gemini and Phoenix integration.

### Accomplishments that we're proud of

We built a complete plan-act-trace-improve loop. The agent does not just produce an answer; it identifies root cause, proposes a mitigation, requires approval, records execution, and exposes traces and evaluations.

### What we learned

Production agents need observability as a first-class feature. Tracing, evaluation, and human supervision are not extras; they are what make agentic systems trustworthy enough for real work.

### What's next

Next steps are to connect live Gemini reasoning through the Agent Builder contract, deploy the runtime to Cloud Run, stream OpenInference traces into Arize Phoenix, wire Phoenix MCP for real trace queries, and add more operational playbooks.
