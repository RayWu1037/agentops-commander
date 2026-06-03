# Deep Test Strategy

This plan adapts public web testing guidance to this hackathon demo.

## Source-backed test areas

1. Security input and output handling

   OWASP Web Security Testing Guide prioritizes input validation testing, including reflected XSS, HTTP verb tampering, parameter pollution, injection, and server-side request forgery. For this project, the relevant risks are DOM rendering, JSON request handling, HTTP method handling, and static file path traversal.

   References:

   - https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/
   - https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/01-Testing_Directory_Traversal_File_Include
   - https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

2. Client-side failure behavior

   MDN notes that `fetch()` rejects on network-level failure, while HTTP errors still resolve and must be checked through the response. For this project, the app must keep working if the backend is unavailable, and must check `response.ok`.

   Reference:

   - https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch

3. Accessibility and keyboard usability

   WCAG 2.2 recommends keyboard accessibility. MDN recommends native interactive elements where possible because buttons, inputs, and selects already support keyboard interaction. web.dev recommends manual keyboard testing with Tab order and semantic information.

   References:

   - https://www.w3.org/TR/WCAG22/
   - https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets
   - https://web.dev/learn/accessibility/test-manual

4. Responsive and recording reliability

   web.dev recommends checking accessibility, responsive behavior, and performance with realistic manual testing in addition to automated tools. For this project, the recording path must be stable: first screen loads, Run works, approval is visible, and Trace/Evals tabs work.

   References:

   - https://web.dev/learn/design/accessibility/
   - https://web.dev/how-to-review/

5. Regression automation

   Node's built-in runtime is enough for this project's current regression tests: parse files, start the local server, hit endpoints, and assert expected behavior.

   Reference:

   - https://nodejs.org/api/test.html

## Test matrix

| Area | Risk | Automated check | Manual check |
| --- | --- | --- | --- |
| Static load | Blank page from bad paths | Relative CSS/JS paths, HTTP 200 for assets | Open `public/index.html` |
| Server routing | Wrong endpoint behavior | Health, static, API, bad method checks | Open `localhost` |
| Path traversal | Reading files outside public | `../`, encoded traversal, malformed percent | N/A |
| Path traversal variants | Encoded slash, double encoding, backslash, absolute Windows paths | Real payload list in `scripts/test.mjs` | N/A |
| XSS | HTML injection after live API | Escaping helper present and used; OWASP-style script/img/svg/javascript payloads encoded | Try obvious payload if live inputs are added |
| HTTP verb tampering | Unexpected behavior under PUT/DELETE/PATCH/TRACE/OPTIONS | Raw HTTP method checks | N/A |
| HTTP parameter pollution | Duplicate query parameters alter API behavior | Duplicate `id` query params ignored | N/A |
| Malformed input | Bad JSON, long strings, XSS-shaped IDs crash endpoint | API fuzz checks | N/A |
| Offline fallback | Demo dies when API down | Client fallback exists; API failure switches offline | Open file mode and run agent |
| Accessibility | Keyboard or screen reader blockers | Native controls, labels, landmarks, no duplicate IDs | Tab through: select, Run, nav, Approve |
| Keyboard state | Nav tabs lose semantic state | `aria-controls`, `aria-selected`, focusable views, focus styles | Switch tabs using keyboard |
| Mobile layout | Text overflow or viewport traps | One-column breakpoints, `100dvh`, no `100vw`/fixed `100vh`/body hidden overflow | Resize to narrow viewport |
| Recording flow | User must hunt for action | Run scrolls to result; approval sticky | Record dry run under 3 minutes |
| Submission package | Missing Devpost requirements | License, Dockerfile, README, script, image | Upload image, paste copy, verify links |
