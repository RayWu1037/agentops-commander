const state = {
  incidents: [],
  activeIncidentId: "world-cup-checkout",
  run: null,
  activeView: "incident",
  offline: false
};

const $ = (selector) => document.querySelector(selector);
const formatPercent = (value) => `${Math.round(value * 100)}%`;
const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const fallbackIncidents = [
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

function clientRun(incidentId, approved = false) {
  const incident = fallbackIncidents.find((item) => item.id === incidentId) || fallbackIncidents[0];
  const checkout = incident.id === "world-cup-checkout";
  const tools = checkout
    ? [
        ["query_order_metrics", "Compared failed orders by region, shipping method, and payment provider.", "Failures are concentrated in cross-border orders using express shipping.", "success"],
        ["inspect_deployments", "Reviewed configuration changes in the failure window.", "A shipping quote timeout was lowered from 6s to 900ms 17 minutes before the spike.", "success"],
        ["search_logs", "Searched checkout logs for timeout, retry, and fallback patterns.", "93% of failed sessions include SHIP_QUOTE_TIMEOUT before payment authorization.", "success"],
        ["phoenix_trace_review", "Queried Phoenix-style traces and evals for weak or missing evidence.", "The first draft underweighted regional segmentation; self-review added a region filter.", "improved"]
      ]
    : [
        ["cluster_support_tickets", "Grouped recent tickets by account tier, issue type, and policy version.", "Refund-policy confusion accounts for 58% of new VIP contacts.", "success"],
        ["inspect_knowledge_base", "Compared policy language in public docs and internal macros.", "Internal macro still references the old billing grace period.", "success"],
        ["rank_accounts_at_risk", "Prioritized tickets by renewal date, ARR, and sentiment.", "42 accounts should receive the corrected macro in the next hour.", "success"],
        ["phoenix_trace_review", "Reviewed failed evaluation samples for unsafe action recommendations.", "Self-review tightened approval gates for refund actions.", "improved"]
      ];
  const mappedTools = tools.map(([name, summary, finding, status]) => ({ name, summary, finding, status }));
  const rootCause = checkout
    ? "Express shipping quote timeouts after an aggressive timeout configuration change."
    : "A mismatch between the updated billing policy and the support macro used by VIP agents.";
  const proposedAction = checkout
    ? "Restore the 6s shipping quote timeout, enable cached fallback quotes for express international orders, and notify support with affected order IDs."
    : "Publish the corrected VIP billing macro, route high-risk renewal accounts to a priority queue, and require approval before any refund batch.";

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
    tools: mappedTools,
    rootCause,
    proposedAction,
    approvalLabel: checkout
      ? "Approve config rollback and cached fallback quotes"
      : "Approve support macro update and priority routing",
    approved,
    execution: approved
      ? {
          status: "executed",
          completedAt: nowPlus(42),
          operator: "human-approved",
          result:
            "Mitigation applied in simulation. New traces show lower risk and a cleaner evidence path for the next run."
        }
      : null,
    traceRows: mappedTools.map((tool, index) => ({
      span: `span-${index + 1}`,
      time: nowPlus(index * 7),
      tool: tool.name,
      latencyMs: [482, 719, 1184, 391][index],
      tokens: [610, 780, 1260, 540][index],
      eval: index === 3 ? "improved" : "pass",
      status: tool.status
    })),
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

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

function setView(view) {
  state.activeView = view;
  document.querySelectorAll(".view").forEach((node) => node.classList.remove("is-visible"));
  document.querySelectorAll(".nav-item").forEach((node) => node.classList.remove("is-active"));
  document.querySelectorAll(".nav-item").forEach((node) => node.setAttribute("aria-selected", "false"));
  $(`#${view}View`).classList.add("is-visible");
  const activeNav = document.querySelector(`[data-view="${view}"]`);
  activeNav.classList.add("is-active");
  activeNav.setAttribute("aria-selected", "true");
  $(`#${view}View`).focus({ preventScroll: true });
}

function renderIncident(incident) {
  if (!incident) return;
  $("#incidentTitle").textContent = incident.title;
  $("#severity").textContent = incident.severity;
  $("#incidentSignal").textContent = incident.signal;
  $("#incidentImpact").textContent = incident.customerImpact;
  $("#incidentGoal").textContent = incident.goal;
  const metricValues = Object.values(incident.metrics);
  $("#metricOne").textContent = metricValues[0] || "--";
  $("#metricTwo").textContent = metricValues[1] || "--";
}

function renderRun(run) {
  state.run = run;
  renderIncident(run.incident);
  $("#planState").textContent = "Ready";
  $("#toolState").textContent = "Complete";
  $("#metricTrace").textContent = "Traced";
  $("#metricSafety").textContent = run.approved ? "Approved" : "Pending";
  $("#planList").innerHTML = run.plan.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  $("#toolList").innerHTML = run.tools
    .map(
      (tool) => `
        <div class="tool-card">
          <strong>${escapeHtml(tool.name)}</strong>
          <p>${escapeHtml(tool.summary)}</p>
          <p>${escapeHtml(tool.finding)}</p>
        </div>
      `
    )
    .join("");
  $("#rootCause").textContent = run.rootCause;
  $("#proposedAction").textContent = run.proposedAction;
  $("#approveAction").textContent = run.approvalLabel;
  $("#approveAction").disabled = run.approved;
  $("#traceRows").innerHTML = run.traceRows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.span)}</td>
          <td>${escapeHtml(row.tool)}</td>
          <td>${escapeHtml(row.latencyMs)} ms</td>
          <td>${escapeHtml(row.tokens)}</td>
          <td>${escapeHtml(row.eval)}</td>
        </tr>
      `
    )
    .join("");
  $("#evalList").innerHTML = Object.entries(run.evals)
    .map(
      ([name, value]) => `
        <div class="eval-row">
          <strong>${escapeHtml(name.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`))}</strong>
          <div><span style="width: ${formatPercent(value)}"></span></div>
          <small>${formatPercent(value)}</small>
        </div>
      `
    )
    .join("");
  $("#selfReview").innerHTML = run.selfReview.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  if (run.execution) {
    $("#executionPanel").classList.remove("is-hidden");
    $("#executionResult").textContent = run.execution.result;
  } else {
    $("#executionPanel").classList.add("is-hidden");
  }

  drawTraceCanvas(run);

  if (!run.approved) {
    $("#rootCause").scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function drawTraceCanvas(run) {
  const canvas = $("#traceCanvas");
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0f1b22";
  ctx.fillRect(0, 0, width, height);

  const nodes = [
    { x: 78, y: 178, label: "Goal", color: "#e6f4f1" },
    { x: 192, y: 94, label: "Plan", color: "#f0d49b" },
    { x: 330, y: 178, label: "Tools", color: "#b7d7ec" },
    { x: 462, y: 96, label: "Approval", color: "#f2b7bf" },
    { x: 548, y: 214, label: "Phoenix", color: "#b4dccb" }
  ];

  ctx.strokeStyle = "rgba(229, 241, 242, 0.38)";
  ctx.lineWidth = 2;
  for (let i = 0; i < nodes.length - 1; i += 1) {
    ctx.beginPath();
    ctx.moveTo(nodes[i].x, nodes[i].y);
    ctx.lineTo(nodes[i + 1].x, nodes[i + 1].y);
    ctx.stroke();
  }

  nodes.forEach((node, index) => {
    const pulse = 4 + Math.sin(Date.now() / 420 + index) * 2;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 31 + pulse, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(node.x, node.y, 26, 0, Math.PI * 2);
    ctx.fillStyle = node.color;
    ctx.fill();
    ctx.fillStyle = "#0f1b22";
    ctx.font = "700 13px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(node.label, node.x, node.y + 5);
  });

  ctx.fillStyle = "#dfecee";
  ctx.font = "700 18px system-ui";
  ctx.textAlign = "left";
  ctx.fillText(run ? "Plan -> act -> trace -> improve" : "Run the agent to generate traces", 28, 40);

  if (run?.approved) {
    ctx.fillStyle = "#b4dccb";
    ctx.fillText("Human approval recorded", 28, height - 32);
  }
}

async function loadIncidents() {
  try {
    const data = await api("/api/incidents");
    state.incidents = data.incidents;
  } catch {
    state.offline = true;
    state.incidents = fallbackIncidents;
  }
  $("#incidentSelect").innerHTML = state.incidents
    .map((incident) => `<option value="${escapeHtml(incident.id)}">${escapeHtml(incident.title)}</option>`)
    .join("");
  renderIncident(state.incidents[0]);
  drawTraceCanvas(null);
}

async function runAgent() {
  $("#runAgent").textContent = "Running...";
  $("#runAgent").disabled = true;
  try {
    let run;
    if (state.offline) {
      run = clientRun(state.activeIncidentId);
    } else {
      try {
        run = await api("/api/agent/run", {
          method: "POST",
          body: JSON.stringify({ incidentId: state.activeIncidentId })
        });
      } catch {
        state.offline = true;
        run = clientRun(state.activeIncidentId);
      }
    }
    renderRun(run);
  } finally {
    $("#runAgent").textContent = "Run agent";
    $("#runAgent").disabled = false;
  }
}

async function approveAction() {
  let run;
  if (state.offline) {
    run = clientRun(state.activeIncidentId, true);
  } else {
    try {
      run = await api("/api/agent/approve", {
        method: "POST",
        body: JSON.stringify({ incidentId: state.activeIncidentId })
      });
    } catch {
      state.offline = true;
      run = clientRun(state.activeIncidentId, true);
    }
  }
  renderRun(run);
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

$("#incidentSelect").addEventListener("change", (event) => {
  state.activeIncidentId = event.target.value;
  const incident = state.incidents.find((item) => item.id === state.activeIncidentId);
  renderIncident(incident);
  state.run = null;
  $("#planList").innerHTML = "";
  $("#toolList").innerHTML = "";
  $("#rootCause").textContent = "Run the agent to investigate.";
  $("#proposedAction").textContent = "";
  $("#approveAction").disabled = true;
  $("#metricTrace").textContent = "Ready";
  $("#metricSafety").textContent = "Required";
  $("#executionPanel").classList.add("is-hidden");
  drawTraceCanvas(null);
});

$("#runAgent").addEventListener("click", runAgent);
$("#approveAction").addEventListener("click", approveAction);

setInterval(() => drawTraceCanvas(state.run), 900);
loadIncidents().catch((error) => {
  state.offline = true;
  state.incidents = fallbackIncidents;
  $("#incidentSelect").innerHTML = state.incidents
    .map((incident) => `<option value="${escapeHtml(incident.id)}">${escapeHtml(incident.title)}</option>`)
    .join("");
  renderIncident(state.incidents[0]);
  drawTraceCanvas(null);
  console.error(error);
});
