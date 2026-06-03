# 3-Minute Demo Script

## 0:00-0:20 - Problem

This is AgentOps Commander, a human-supervised incident response agent for real-world operations teams.

Most agents can answer questions. This one is designed as a Gemini and Google Cloud Agent Builder workflow: it plans, investigates, asks for approval, acts, and then reviews its own Arize Phoenix traces.

## 0:20-0:45 - Incident

The current incident is a World Cup merchandise launch. Failed orders jumped from 1.8% to 11.6% in 22 minutes, and customers with international shipping addresses are stuck at checkout.

The goal is to find the likely cause and propose a safe mitigation before the promo window closes.

## 0:45-1:25 - Run Agent

I run the agent. It creates a plan with an explicit safety boundary, then calls tools to compare order metrics, inspect recent deployments, search checkout logs, and review Phoenix-style traces.

The key point is that the agent is not guessing. It builds an evidence path.

## 1:25-1:55 - Evidence And Root Cause

The agent finds that failures are concentrated in cross-border express shipping orders. It then links the spike to a configuration change that lowered the shipping quote timeout from 6 seconds to 900 milliseconds.

It proposes a mitigation: restore the safer timeout, enable cached fallback quotes, and notify support with affected order IDs.

## 1:55-2:20 - Human Approval

The action changes operational state, so the agent cannot execute it by itself. I approve the action.

The safety gate changes from pending to approved, and the execution result is recorded.

## 2:20-2:45 - Observability And Evals

Now I switch to the trace view. Each tool call is represented as a span with latency, token use, and an evaluation result.

Then I switch to evaluations. The agent is scored for task success, evidence coverage, action safety, and self-improvement.

## 2:45-3:00 - Why It Matters

The self-review loop is the differentiator. Using Arize Phoenix and Phoenix MCP, the agent can review weak traces and improve its next run. The repository includes the Agent Builder contract, safety policy, and evaluation targets that make this workflow portable to Google Cloud Run.

AgentOps Commander is not just an assistant. It is an observable, evaluated, human-supervised agent that can safely get real work done.
