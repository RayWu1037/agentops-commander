import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicRoot = join(root, "public");
const port = Number(process.env.PORT || 8080);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png"
};

const securityHeaders = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
  "content-security-policy":
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'"
};

const incidents = [
  {
    id: "world-cup-checkout",
    title: "Checkout failures during World Cup merch launch",
    severity: "SEV-2",
    signal: "Failed orders jumped from 1.8% to 11.6% in 22 minutes.",
    customerImpact: "Fans can browse products but payment confirmation stalls for international shipping addresses.",
    goal: "Find the likely cause and propose a safe mitigation before the promo window closes.",
    metrics: {
      "Failed orders": "11.6%",
      "p95 checkout": "7.8s",
      "Support tickets": "+142",
      "Revenue at risk": "$18.4k/hr"
    }
  },
  {
    id: "support-backlog",
    title: "Support backlog after billing policy change",
    severity: "SEV-3",
    signal: "VIP ticket wait time rose from 18 minutes to 2.7 hours.",
    customerImpact: "Renewal-risk accounts are waiting for policy clarifications and refunds.",
    goal: "Prioritize root causes and draft a safe operator action plan.",
    metrics: {
      "Open tickets": "684",
      "VIP wait": "2.7h",
      "SLA breach risk": "High",
      "Repeat contact": "31%"
    }
  }
];

function nowPlus(offsetSeconds) {
  return new Date(Date.now() + offsetSeconds * 1000).toISOString();
}

function buildRun(incidentId = "world-cup-checkout") {
  const incident = incidents.find((item) => item.id === incidentId) || incidents[0];
  const isCheckout = incident.id === "world-cup-checkout";
  const tools = isCheckout
    ? [
        {
          name: "query_order_metrics",
          summary: "Compared failed orders by region, shipping method, and payment provider.",
          finding: "Failures are concentrated in cross-border orders using express shipping.",
          status: "success"
        },
        {
          name: "inspect_deployments",
          summary: "Reviewed configuration changes in the failure window.",
          finding: "A shipping quote timeout was lowered from 6s to 900ms 17 minutes before the spike.",
          status: "success"
        },
        {
          name: "search_logs",
          summary: "Searched checkout logs for timeout, retry, and fallback patterns.",
          finding: "93% of failed sessions include SHIP_QUOTE_TIMEOUT before payment authorization.",
          status: "success"
        },
        {
          name: "phoenix_trace_review",
          summary: "Queried Phoenix-style traces and evals for weak or missing evidence.",
          finding: "The first draft underweighted regional segmentation; self-review added a region filter.",
          status: "improved"
        }
      ]
    : [
        {
          name: "cluster_support_tickets",
          summary: "Grouped recent tickets by account tier, issue type, and policy version.",
          finding: "Refund-policy confusion accounts for 58% of new VIP contacts.",
          status: "success"
        },
        {
          name: "inspect_knowledge_base",
          summary: "Compared policy language in public docs and internal macros.",
          finding: "Internal macro still references the old billing grace period.",
          status: "success"
        },
        {
          name: "rank_accounts_at_risk",
          summary: "Prioritized tickets by renewal date, ARR, and sentiment.",
          finding: "42 accounts should receive the corrected macro in the next hour.",
          status: "success"
        },
        {
          name: "phoenix_trace_review",
          summary: "Reviewed failed evaluation samples for unsafe action recommendations.",
          finding: "Self-review tightened approval gates for refund actions.",
          status: "improved"
        }
      ];

  const rootCause = isCheckout
    ? "Express shipping quote timeouts after an aggressive timeout configuration change."
    : "A mismatch between the updated billing policy and the support macro used by VIP agents.";

  const action = isCheckout
    ? "Restore the 6s shipping quote timeout, enable cached fallback quotes for express international orders, and notify support with affected order IDs."
    : "Publish the corrected VIP billing macro, route high-risk renewal accounts to a priority queue, and require approval before any refund batch.";

  const approval = isCheckout
    ? "Approve config rollback and cached fallback quotes"
    : "Approve support macro update and priority routing";

  const traceRows = tools.map((tool, index) => ({
    span: `span-${index + 1}`,
    time: nowPlus(index * 7),
    tool: tool.name,
    latencyMs: [482, 719, 1184, 391][index],
    tokens: [610, 780, 1260, 540][index],
    eval: index === 3 ? "improved" : "pass",
    status: tool.status
  }));

  return {
    incident,
    plan: [
      "State the operational goal and safety boundary.",
      "Collect metric slices before and after the spike.",
      "Compare recent config and deployment changes.",
      "Search logs for the strongest causal signature.",
      "Ask for approval before changing production state.",
      "Review Phoenix traces and update the next-run checklist."
    ],
    tools,
    rootCause,
    proposedAction: action,
    approvalLabel: approval,
    approved: false,
    execution: null,
    traceRows,
    evals: {
      taskSuccess: 0.91,
      evidenceCoverage: 0.87,
      actionSafety: 0.96,
      selfImprovement: 0.82
    },
    selfReview: [
      "Require at least two independent evidence sources before proposing a state-changing action.",
      "Add regional segmentation earlier when a metric spike is not globally uniform.",
      "Keep human approval mandatory for config rollback, refund, customer notification, and deployment actions."
    ]
  };
}

function json(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...securityHeaders
  });
  res.end(JSON.stringify(body));
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return {};
  }
}

async function serveStatic(req, res) {
  const requested = req.url === "/" ? "/index.html" : new URL(req.url, "http://localhost").pathname;
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(requested);
  } catch {
    res.writeHead(400, securityHeaders);
    res.end("Bad request");
    return;
  }
  if (decodedPath.includes("..") || decodedPath.includes("\\")) {
    res.writeHead(400, securityHeaders);
    res.end("Bad request");
    return;
  }
  const filePath = resolve(publicRoot, `.${decodedPath}`);
  if (!filePath.startsWith(resolve(publicRoot))) {
    res.writeHead(403, securityHeaders);
    res.end("Forbidden");
    return;
  }

  try {
    const content = await readFile(filePath);
    res.writeHead(200, {
      "content-type": mimeTypes[extname(filePath)] || "application/octet-stream",
      "cache-control": "no-store",
      ...securityHeaders
    });
    res.end(content);
  } catch {
    res.writeHead(404, securityHeaders);
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "GET" && url.pathname === "/api/incidents") {
    json(res, 200, { incidents });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/agent/run") {
    const body = await parseBody(req);
    json(res, 200, buildRun(body.incidentId));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/agent/approve") {
    const body = await parseBody(req);
    const run = buildRun(body.incidentId);
    run.approved = true;
    run.execution = {
      status: "executed",
      completedAt: nowPlus(42),
      operator: "human-approved",
      result:
        "Mitigation applied in simulation. New traces show lower risk and a cleaner evidence path for the next run."
    };
    json(res, 200, run);
    return;
  }

  if (req.method === "GET" && url.pathname === "/healthz") {
    json(res, 200, { ok: true, service: "agentops-commander" });
    return;
  }

  await serveStatic(req, res);
});

server.listen(port, () => {
  console.log(`AgentOps Commander listening on http://localhost:${port}`);
});
