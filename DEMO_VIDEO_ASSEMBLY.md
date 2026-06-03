# Demo Video Assembly Plan

Use this plan to create the final Devpost demo with Seedance, Runway, Pika, Kling, or a similar AI video tool.

Important: the real hosted app walkthrough must remain the center of the video. AI clips should only add polish at the opening, transitions, or closing.

## Final Timeline

- 0:00-0:06 AI intro clip: product context and incident pressure.
- 0:06-0:18 Real screen recording: hosted app opens and the incident goal is visible.
- 0:18-0:55 Real screen recording: run the agent and show the plan plus tool calls.
- 0:55-1:25 Real screen recording: show evidence, root cause, and proposed mitigation.
- 1:25-1:50 Real screen recording: approve the gated action and show execution result.
- 1:50-2:25 Real screen recording: show Trace and Evals tabs.
- 2:25-2:42 Real screen recording: show Architecture tab with Gemini, Agent Builder, Cloud Run, and Arize Phoenix MCP.
- 2:42-2:56 AI closing clip or static end card: summarize the differentiator.

## AI Clip Generation Queue

Generate these clips at 16:9, 1920x1080, 24 or 30 fps, with no music baked in.

### Clip 1: Intro

```text
6-second cinematic product intro for AgentOps Commander, a human-supervised incident response agent. Show an enterprise operations dashboard during a checkout incident: failed orders rise, an agent plan appears, tool-call cards animate in, and a clear human approval gate pauses execution. Add subtle Google Cloud-style infrastructure lines and clean Arize Phoenix-style trace spans. Text overlay: "Observable agents that take approved action." Modern SaaS product aesthetic, crisp readable interface, no third-party logos, no cartoon characters, no stock footage.
```

### Clip 2: Approval Transition

```text
4-second transition clip. A safety gate moves from Pending to Approved, then tool-call evidence becomes a clean audit trail. Metrics stabilize without claiming the incident is magically solved. Text overlay: "Human approval before action." Enterprise dashboard style, restrained motion, readable UI, no unrelated people, no copyrighted marks.
```

### Clip 3: Closing

```text
10-second closing clip for AgentOps Commander. Show a clean workflow: Goal, Gemini plan, tools, human approval, Arize Phoenix MCP trace review, evaluation scores, next-run improvement. Text overlay: "Human-supervised. Observable. Evaluated." End card: "AgentOps Commander" and "Google Cloud Rapid Agent Hackathon". Clean product-demo style, no third-party logos, no fake customer data, no fantasy robot imagery.
```

## Negative Prompt

```text
Avoid cartoon mascots, fantasy robots, cyberpunk clutter, unreadable UI text, dark blurry dashboards, unrelated people, fake brands, third-party logos, copyrighted media, stock footage, weapons, medical/legal claims, private customer data, ads, or replacing the real hosted app walkthrough with generated UI.
```

## Screen Recording Checklist

- Record: https://raywu1037.github.io/agentops-commander/
- Use the recording console first: https://raywu1037.github.io/agentops-commander/recording.html
- Capture at 1920x1080 or 1280x720.
- Keep browser zoom at 100 percent or 110 percent.
- Hide personal tabs, bookmarks, notifications, and account menus.
- Show the URL or clearly open the hosted app.
- Show `Run agent`, approval, Trace, Evals, and Architecture.

## Editing Order

1. Put Clip 1 at the beginning.
2. Add the real screen recording as the main body.
3. Insert Clip 2 only if the approval moment needs visual separation.
4. Add Clip 3 or a static end card at the end.
5. Add the English voiceover from `DEMO_SCRIPT.md`.
6. Add captions from `demo-captions.srt`.
7. Export under 3 minutes.
8. Upload as public or unlisted YouTube/Vimeo.
9. Paste the video URL into Devpost and GitHub issue #1.

## Final Title And Description

Title:

```text
AgentOps Commander - Google Cloud Rapid Agent Hackathon Demo
```

Description:

```text
AgentOps Commander is an observable, evaluated, human-supervised incident response agent built for the Google Cloud Rapid Agent Hackathon. The demo shows a Gemini and Google Cloud Agent Builder workflow with an Arize Phoenix MCP self-review loop, human approval before state-changing action, trace visibility, and evaluation scores.

Live demo: https://raywu1037.github.io/agentops-commander/
Code: https://github.com/RayWu1037/agentops-commander
```
