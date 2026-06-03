# Testing Checklist

Run after every meaningful change:

```bash
node --check server.js
node --check public/app.js
node scripts/test.mjs
```

If PowerShell blocks `npm.ps1`, use the direct Node commands above.

## Covered by `scripts/test.mjs`

- HTML loads stylesheet and script with relative paths, so `file://` demo mode works.
- The app avoids module scripts for more reliable local-file playback.
- HTML has language metadata, labeled nav/select/canvas controls, no duplicate IDs, and typed buttons.
- Navigation buttons expose `aria-controls` and `aria-selected`.
- Dynamic views are script-focusable so keyboard focus can move when switching tabs.
- Visible `:focus-visible` styles exist for buttons and select controls.
- The key tab order is checked: nav, scenario select, Run agent, approval.
- The app has no external runtime dependencies in HTML, CSS, or JS.
- Offline fallback incidents exist.
- Client-side agent run fallback exists.
- Dynamic rendered values are escaped.
- API failures fall back to offline mode.
- Static and API responses include basic security headers.
- Static routing rejects plain and encoded path traversal.
- Static routing rejects OWASP-style traversal variants, including encoded slash, double encoding, backslash, absolute Windows path, and nested public escape attempts.
- Static routing rejects malformed percent-encoded URLs without crashing.
- Wrong HTTP methods are rejected.
- HTTP verb tampering checks cover PUT, DELETE, PATCH, TRACE, and OPTIONS.
- HTTP parameter pollution with duplicate query parameters does not change API behavior.
- Unknown incident IDs, invalid JSON, long request bodies, and XSS-shaped incident IDs do not crash the agent endpoints.
- OWASP-style XSS payloads are checked against the app's HTML escaping behavior.
- Project files are checked for obvious API-key-like secrets.
- Mobile responsive CSS exists.
- Major grids collapse to one column on mobile.
- The app shell uses `100dvh` for more reliable mobile viewport behavior.
- The CSS avoids common mobile overflow risks such as `width: 100vw`, fixed `height: 100vh`, and body-level hidden overflow.
- The approval panel stays visible during demo scrolling.
- The recording path contains all key visible states: incident, goal, plan, tool calls, root cause, trace timeline, evals, and self-review.
- HTTP home page, CSS, and JS respond.
- Incidents API returns multiple scenarios.
- Agent run returns plan steps, tool calls, trace rows, and pending approval.
- Approval endpoint returns an execution result.

## Method Sources

The current test strategy is summarized in `TEST_STRATEGY.md` and is based on OWASP Web Security Testing Guide input/path/XSS testing, MDN fetch behavior, W3C WCAG 2.2 keyboard accessibility, MDN keyboard-accessible widget guidance, and web.dev manual accessibility review guidance.

## Manual Recording Pass

Before recording the Devpost video:

1. Open `public/index.html` directly or run `node server.js` and open `http://localhost:8080`.
2. Confirm the first screen shows the incident, metrics, and trace canvas.
3. Click `Run agent`.
4. Confirm Plan, Tool calls, Root cause, and Trace status update.
5. Scroll to the approval panel.
6. Click the approval button.
7. Confirm Safety gate changes to Approved and execution result appears.
8. Open the Trace tab and confirm rows appear.
9. Open the Evals tab and confirm scores and self-review items appear.

## Known Safe Fallback

If the local server is unavailable during recording, open:

```text
public/index.html
```

The app will use deterministic offline data and still show the full demo flow.
