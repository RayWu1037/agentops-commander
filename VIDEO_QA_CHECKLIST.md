# Video QA Checklist

Use this immediately before uploading the public Devpost demo video.

## Recording Setup

- Record the hosted demo URL: https://raywu1037.github.io/agentops-commander/
- Use the recording console before capture: https://raywu1037.github.io/agentops-commander/recording.html
- Target length: 2:45 to 2:58.
- Absolute maximum length: 3:00.
- Resolution: 1920x1080 or 1280x720.
- Audio: English narration, clear enough to understand without captions.
- Captions: upload `demo-captions.srt` or burn equivalent English subtitles into the video.
- Browser: hide bookmarks, unrelated tabs, personal information, account menus, and notifications.
- Page zoom: 100 percent or 110 percent, whichever keeps labels readable.

## Required Shots

1. Hosted URL visible or clearly opened.
2. Incident metrics and agent goal.
3. `Run agent` click.
4. Plan and tool calls.
5. Root cause and proposed action.
6. Human approval gate and approval click.
7. Execution result.
8. Trace tab with spans, latency, tokens, and eval result.
9. Evals tab with task success, evidence coverage, action safety, and self-improvement.
10. Architecture tab with Gemini, Google Cloud Agent Builder, Cloud Run, and Arize Phoenix MCP.

## Compliance Checks

- The video is public or unlisted, not private.
- The video is uploaded to YouTube or Vimeo.
- The video contains no copyrighted music, stock video, unrelated logos, personal data, or third-party ads.
- If Seedance-style AI clips are used, they are intro/transition/outro only and do not replace the real hosted app walkthrough.
- The video shows the web project functioning, not only slides or screenshots.
- The narration mentions Arize/Phoenix MCP and the human approval gate.
- The narration mentions Gemini and Google Cloud Agent Builder.
- The final Devpost form includes the video URL.

## Final Smoke Test Before Submit

```bash
node scripts/test.mjs
```

Then open:

```text
https://raywu1037.github.io/agentops-commander/
```

Confirm the page loads, the `Run agent` button works, the approval action works, and the `Trace`, `Evals`, and `Architecture` tabs are readable.
