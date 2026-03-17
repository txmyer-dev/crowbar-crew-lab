# Claude Agent SDK: Deep-Dive Analysis
## For Productizing Agent Services at The Crowbar Crew

**Date:** March 17, 2026  
**Author:** Ava Sterling (Research Agent)  
**Issue:** [#3 — Research: Claude Agent SDK deep-dive for productizing agent services](https://github.com/txmyer-dev/crowbar-crew-lab/issues/3)  
**Sources:** Anthropic claude-cookbooks, official Agent SDK docs, pricing pages

---

## Executive Summary

Anthropic's Claude Agent SDK (formerly Claude Code SDK) is the same engine that powers Claude Code, now exposed as a programmable Python and TypeScript library. For a one-person consulting business like The Crowbar Crew, it represents the clearest path to packaging repeatable, high-margin AI agent infrastructure for clients — without building model infrastructure from scratch.

The four tutorial notebooks in `anthropics/claude-cookbooks/claude_agent_sdk/` form a deliberate progression: from a trivial one-liner to a full autonomous SRE incident-response system. Each level introduces exactly one new architectural concept. The patterns are production-ready, not academic. The cost math is favorable. The gaps are real but workable.

The strategic read: **this SDK is a productization toolkit in disguise.** Anthropic has done the hard infrastructure work. The Crowbar Crew's job is to own the domain logic layer — the CLAUDE.md files, subagent definitions, hooks, and MCP integrations that transform a generic agent into a specialized business tool for a specific client vertical.

---

## Table of Contents

1. [SDK Overview and Architecture](#1-sdk-overview-and-architecture)
2. [Notebook 00: The One-Liner Research Agent](#2-notebook-00-the-one-liner-research-agent)
3. [Notebook 01: The Chief of Staff Agent](#3-notebook-01-the-chief-of-staff-agent)
4. [Notebook 02: The Observability Agent](#4-notebook-02-the-observability-agent)
5. [Notebook 03: The SRE Incident Response Agent](#5-notebook-03-the-sre-incident-response-agent)
6. [Cross-Cutting Patterns](#6-cross-cutting-patterns)
   - [Evaluator-Optimizer: Self-Improving Agents](#61-evaluator-optimizer-self-improving-agents)
   - [Instant Session Compaction](#62-instant-session-compaction)
   - [Prompt Caching Economics](#63-prompt-caching-economics)
7. [Cost Analysis](#7-cost-analysis)
8. [Crowbar Crew Service Mapping](#8-crowbar-crew-service-mapping)
9. [Recommended Starter Template](#9-recommended-starter-template)
10. [Gaps and Limitations](#10-gaps-and-limitations)
11. [Strategic Recommendations](#11-strategic-recommendations)

---

## 1. SDK Overview and Architecture

### What It Is

The Claude Agent SDK gives you the same agent loop, tools, and context management that power Claude Code, accessible programmatically. The core abstraction is simple:

```python
# Python
async for message in query(
    prompt="Find and fix the bug in auth.py",
    options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"]),
):
    print(message)
```

```typescript
// TypeScript
for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);
}
```

The SDK handles the full agent loop — tool execution, context management, multi-turn memory — without you implementing it. You configure what the agent can do; Claude decides how.

### Core Capabilities

| Capability | What It Enables | Key Config |
|---|---|---|
| **Built-in tools** | File ops, Bash, WebSearch, WebFetch out of the box | `allowed_tools` |
| **MCP integration** | Connect to any external system (GitHub, Prometheus, Slack, DBs) | `mcp_servers` |
| **Subagents** | Spawn specialized agents for parallel or domain-specific work | `agents` dict or `.claude/agents/` |
| **Hooks** | Deterministic code at lifecycle events (PreToolUse, PostToolUse, etc.) | `hooks` dict or `settings.json` |
| **Sessions** | Persistent context across turns; resume by session ID | `resume=session_id` |
| **Skills** | Markdown-defined behavioral modules loaded at runtime | `.claude/skills/` |
| **Slash commands** | Expandable prompt templates with argument substitution | `.claude/commands/` |
| **CLAUDE.md** | Filesystem-based memory and project context | `cwd` + `setting_sources=["project"]` |
| **Permission modes** | `plan` (no execution), `acceptEdits` (auto-approve), interactive | `permission_mode` |

### SDK vs. Client SDK

The existing Anthropic Client SDK requires you to implement the tool execution loop manually — you get a response, check if it's a tool call, execute it, send the result back, repeat. The Agent SDK eliminates all of that. This is a meaningful development-time advantage: a working tool-using agent goes from ~200 lines of boilerplate to ~10.

### Hosting Architecture

The SDK is a **long-running process**, not a stateless API call. It executes commands in a persistent shell, manages files within a working directory, and maintains context across turns. Production deployments require containerization. Recommended providers: Modal, E2B, Fly Machines, Cloudflare Sandboxes, Vercel Sandbox. Self-hosted: Docker + gVisor or Firecracker. Resource baseline per instance: 1 GiB RAM, 5 GiB disk, 1 CPU. Container cost: roughly $0.05/hour.

Four deployment patterns exist:
1. **Ephemeral** — fresh container per task (bug fixes, document processing)
2. **Long-running** — persistent container for proactive agents (email triage, monitoring)
3. **Hybrid** — ephemeral + state rehydration from DB (research, project management)
4. **Single container, multiple agents** — tight collaboration simulations (less common)

---

## 2. Notebook 00: The One-Liner Research Agent

**File:** `claude_agent_sdk/00_The_one_liner_research_agent.ipynb`  
**Complexity:** Minimal — single function call  
**Core concept introduced:** The `query()` loop and stateless vs. stateful agent patterns

### Architecture

Three progressive levels in a single notebook:

**Level 1 — Stateless (the actual one-liner):**
```python
async for msg in query(
    prompt="Research the latest trends in AI agents with citations.",
    options=ClaudeAgentOptions(model=MODEL, allowed_tools=["WebSearch"]),
):
    print_activity(msg)
```
No memory. No state. One call, one result. Appropriate for independent, parallelizable tasks.

**Level 2 — Stateful multi-turn:**
```python
async with ClaudeSDKClient(
    options=ClaudeAgentOptions(
        model=MODEL,
        system_prompt=RESEARCH_SYSTEM_PROMPT,
        allowed_tools=["WebSearch", "Read"],
        max_buffer_size=10 * 1024 * 1024,  # Required for image/PDF analysis
    )
) as agent:
    await agent.query("Analyze this chart...")
    # Second query inherits chart analysis context
    await agent.query("Search for news validating these findings...")
```

**Level 3 — Production module wrapper:**
```python
result = await send_query(query, continue_conversation=True)
```

### What Makes It Notable for Productizing

The progression from one-liner to production module is the real lesson. `ClaudeSDKClient` as a context manager is the right abstraction for client-facing tools: wrap it in a module, expose `send_query()`, hide the SDK internals. Clients get a clean interface; you own the agent configuration underneath.

The `max_buffer_size` detail matters: the default 1 MB buffer is insufficient for multimodal inputs (a 200 KB image becomes 270+ KB base64-encoded). Any client agent doing document or image analysis needs this raised.

### Relevant Service Offering
Document analysis bots, research assistants, competitive intelligence agents. Low-complexity entry point for first client engagements.

---

## 3. Notebook 01: The Chief of Staff Agent

**File:** `claude_agent_sdk/01_The_chief_of_staff_agent.ipynb`  
**Complexity:** High — seven interconnected architectural components  
**Core concept introduced:** The full filesystem-based configuration stack

### Architecture

This notebook assembles seven components into a cohesive multi-agent system managing a fictional 50-person startup. Each component is independently valuable; the notebook demonstrates how they compose.

#### Component 1: CLAUDE.md (Persistent Memory)

```markdown
# TechStart Inc - Chief of Staff Context
## Company Profile
- Stage: Series A ($10M raised), 50 people, $500K/mo burn
- Current ARR: $2.4M (15% MoM growth)
- Series B Target: $30M ARR
```

Loaded via `cwd="chief_of_staff_agent"` + `setting_sources=["project"]`. Provides durable business context without repeating it in every prompt. Critical insight from the notebook: **CLAUDE.md guides agents but doesn't constrain data source selection** — agents may choose granular CSVs over high-level summaries. Explicit prompt guidance is needed if you want the agent to reference CLAUDE.md specifically.

#### Component 2: Bash Tool + Python Scripts

Scripts in `chief_of_staff_agent/scripts/` handle domain-specific computation: `hiring_impact.py`, `financial_forecast.py`, `decision_matrix.py`. The agent calls these via `Bash`. Pattern: **computation in deterministic scripts, reasoning in Claude**. This separation makes results auditable and testable independently of the model.

#### Component 3: Output Styles

```yaml
# .claude/output-styles/executive.md
---
name: executive
description: High-level insights, business impact, actionable recommendations
---
Focus on: strategic implications, bottom-line impact, 2-3 sentence recommendations.
Avoid: technical details.
```

Multiple output styles (executive, technical, narrative) from the same underlying agent. Requires `settings='{ "outputStyle": "executive" }'` and `setting_sources=["project"]`. For client work: **same agent, different presentation layer per stakeholder**. A CEO gets bullets; an engineer gets implementation details.

#### Component 4: Plan Mode

```python
ClaudeAgentOptions(permission_mode="plan", ...)
```

Generates a full execution plan without making any changes. Plans are saved to disk, reviewed, then executed with `continue_conversation=True` after removing `permission_mode`. Extraction uses a priority chain: message stream → Write tool captures → `.claude/` plan directory. Critical for client trust: show what the agent *will* do before it does it.

#### Component 5: Slash Commands

```yaml
# .claude/commands/budget-impact.md
---
name: budget-impact
description: Analyze financial impact of decisions
---
Analyze impact of: $ARGUMENTS
Delegate to financial-analyst subagent for modeling.
Use hiring_impact.py for scenario modeling.
```

Called as `/budget-impact hiring 3 senior engineers`. Expands `$ARGUMENTS` at runtime. Auto-invoked by Claude when the description matches the task — no explicit call needed. For client work: encode client-specific workflows as slash commands. The client's team gets a vocabulary of predefined agent capabilities.

#### Component 6: Hooks (Audit Trails)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [{"type": "command", "command": ".claude/hooks/report-tracker.py"}]
      }
    ]
  }
}
```

Hooks fire deterministically at lifecycle events. `PostToolUse` with matcher `Write` captures every file write to an audit log. `PreToolUse` can block operations (exit code 2 = block + feed error back to Claude). For client work: hooks are your compliance layer. Every action logged, validated, or blocked without modifying the agent's core reasoning.

#### Component 7: Subagents via Task Tool

```yaml
# .claude/agents/financial-analyst.md
---
name: financial-analyst
description: Analyzes financial impact of decisions, models scenarios, projects cash flow
tools: [Bash, Read, Write]
---
# Specialist context, constraints, and data references
```

The orchestrator delegates to specialists via the `Task` tool. Each subagent runs in its own isolated context with its own tools and conversation history. Three specialists in this notebook: `financial-analyst`, `recruiter`, `operations`. For client work: subagents are the unit of specialization. You can swap, upgrade, or version individual specialists without touching the orchestrator.

### Critical Configuration Note

`setting_sources` determines which filesystem features are available:

| Source | Enables |
|---|---|
| `"project"` | CLAUDE.md, output styles, slash commands, subagents from `.claude/` |
| `"local"` | Hooks from `.claude/settings.local.json` |
| `"user"` | Global `~/.claude/settings.json` |

Missing `setting_sources` is the most common integration failure point. Always include `["project", "local"]` for production agents.

### Relevant Service Offering
Business operations agents, executive assistants, hiring workflow automation, financial analysis agents. The highest-complexity offering; most appropriate for mid-market clients with defined workflows.

---

## 4. Notebook 02: The Observability Agent

**File:** `claude_agent_sdk/02_The_observability_agent.ipynb`  
**Complexity:** Medium — MCP integration focus  
**Core concept introduced:** External system connectivity via MCP servers

### Architecture

```
ClaudeSDKClient
├── Git MCP Server (13 git tools via uv/mcp_server_git)
├── GitHub MCP Server (100+ tools via Docker/ghcr.io/github/github-mcp-server)
├── allowed_tools=["mcp__git", "mcp__github"]
├── disallowed_tools=["Bash", "Task", "WebSearch", "WebFetch"]
└── permission_mode="acceptEdits"
```

#### Git MCP Integration

```python
git_mcp = {
    "git": {
        "command": "uv",
        "args": ["run", "python", "-m", "mcp_server_git", "--repository", git_repo_root],
    }
}
```

Local git history access: commit logs, file changes, branch status. No credentials needed.

#### GitHub MCP Integration

```python
github_mcp = {
    "github": {
        "command": "docker",
        "args": ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
                 "ghcr.io/github/github-mcp-server"],
        "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": os.environ.get("GITHUB_TOKEN")},
    }
}
```

100+ GitHub tools. Requires: fine-grained PAT, Docker running, token in `.env`. Covers issues, PRs, CI/CD workflow runs, security alerts, code search.

#### Real-World CI Health Analysis Pattern

```python
prompt = """Analyze CI health for facebook/react.
Examine the most recent 'CI' workflow runs and provide:
1. Current status and trigger (push, PR, schedule)
2. If failing: specific failing jobs, severity assessment
3. If passing: concerning patterns (duration, flakiness)
4. Recommended actions with priority (critical/high/medium/low)
Do not create issues or PRs — read-only analysis."""
```

The read-only constraint is the key insight for client work: scoped access means the agent can observe without risk of modification.

#### Critical Implementation Detail

```python
# IMPORTANT: disallowed_tools is not the same as not listing in allowed_tools
# Without explicit disallow, the agent still has access to Bash and could use
# the gh CLI as a bypass. Explicit disallow is required for true tool scoping.
disallowed_tools=["Bash", "Task", "WebSearch", "WebFetch"]
```

This is a security pattern, not just a preference. For client deployments, explicitly disallow everything not needed — do not rely on omission from `allowed_tools`.

### Multi-Turn Conversation Support

```python
result1 = await send_query("What's the CI status for facebook/react?")
result2 = await send_query(
    "Are there flaky tests in the recent failures?",
    continue_conversation=True,  # Inherits prior context
)
```

### Relevant Service Offering
GitHub repository health monitoring, CI/CD observability, code review automation, security alert triage. Natural fit for small engineering teams without dedicated DevOps.

---

## 5. Notebook 03: The SRE Incident Response Agent

**File:** `claude_agent_sdk/03_The_site_reliability_agent.ipynb`  
**Complexity:** Highest — full autonomous remediation with safety layers  
**Core concept introduced:** Write-capable agents with multi-layer safety constraints

### Architecture

```
Claude Agent SDK
    └── Custom MCP Server (subprocess via stdio/JSON-RPC)
            ├── Prometheus tools (observe)
            ├── Infrastructure tools (read + write, scoped)
            ├── Diagnostic tools (investigate)
            └── Documentation tools (post-mortem)
```

This is the most significant architectural advance in the series: a custom MCP server that the agent controls via JSON-RPC. The separation of concerns is deliberate — infrastructure operations run in an isolated subprocess, preventing agent crashes from affecting production systems.

### The 12 MCP Tools (4 Categories)

**Prometheus (Observability):**
- `query_metrics` — PromQL queries against Prometheus
- `list_metrics` — enumerate available metrics
- `get_service_health` — single-call comprehensive health summary (error rates, latency P50/P99, DB connections)

**Infrastructure (Read/Write — safety-scoped):**
- `read_config_file` — restricted to `config/` directory only
- `edit_config_file` — restricted to `config/`, validates `old_value` exists before writing
- `run_shell_command` — restricted to `docker-compose` and `docker` prefixes only
- `get_container_logs` — whitelist of allowed container names

**Diagnostics:**
- `get_logs`, `get_alerts`, `get_recent_deployments`, `execute_runbook`

**Documentation:**
- `write_postmortem`

### Two-Layer Safety Model

This is the design insight that makes autonomous write agents viable for client work:

**Layer 1 — Tool handler validation (in code):**
```python
# Directory scoping
full_path = Path(path).resolve()
if not full_path.is_relative_to(allowed_root):  # config/ only
    return {"isError": True, ...}

# Command prefix whitelist
if args[0] not in ("docker-compose", "docker"):
    return {"isError": True, ...}

# Container name whitelist
if container not in {"api-server", "postgres", "prometheus"}:
    return {"isError": True, ...}
```

**Layer 2 — PreToolUse hooks (shell script validation):**
```bash
# hooks/validate_pool_size.sh — blocks config edits outside safe range
NEW_VALUE=$(echo "$1" | grep -o '"new_value":"[^"]*' | cut -d'"' -f4)
if [ "$NEW_VALUE" -lt 5 ] || [ "$NEW_VALUE" -gt 100 ]; then
    echo "ERROR: DB_POOL_SIZE must be 5-100"
    exit 1  # Exit 1 blocks + feeds error back to Claude
fi
```

Layer 1 enforces structural constraints (where, what). Layer 2 enforces value constraints (how much, what range). The agent can write, but only within tight guardrails it cannot reason around.

### Incident Response Workflow

**Phase 1 — Investigation (read-only):**
1. `get_service_health` — overview
2. `query_metrics` — drill into error rates by service
3. `get_container_logs` — specific error messages
4. `read_config_file` — check for misconfigurations
5. Correlation → root cause diagnosis

**Phase 2 — Remediation (write):**
1. `edit_config_file` — fix config (hooks validate)
2. `run_shell_command` — redeploy (hooks validate config before deploy)
3. `get_service_health` — verify error rates resolved
4. `write_postmortem` — document incident

### System Prompt Philosophy

The notebook's system prompt is deliberately minimal:
```
You are an expert SRE incident response bot.
Investigation approach:
1. Start with get_service_health for quick overview
2. Drill into error rates...
[methodology continues]
```

Key design principle validated here: **tool descriptions drive behavior more effectively than elaborate prompts**. Clear tool names, descriptions, and example queries matter more than a 2,000-token system prompt. Build tools that are self-describing; keep system prompts methodological.

### Production Extensions Included

The notebook ships with optional PagerDuty and Confluence integrations (conditionally registered based on `.env` presence). This is the pattern for client-specific integrations: detect credentials, register tools. The agent gets new capabilities without code changes.

### Relevant Service Offering
Infrastructure monitoring and auto-remediation, on-call augmentation, incident response automation. Highest-value and highest-complexity offering — appropriate for engineering-focused clients with existing Docker/Prometheus infrastructure.

---

## 6. Cross-Cutting Patterns

### 6.1 Evaluator-Optimizer: Self-Improving Agents

**Source:** `patterns/agents/evaluator_optimizer.ipynb`

This pattern pairs two LLM calls in a feedback loop — a generator and an evaluator — iterating until a quality threshold is met.

**Architecture:**
```python
def loop(task, evaluator_prompt, generator_prompt):
    memory = []
    thoughts, result = generate(generator_prompt, task)
    memory.append(result)
    
    while True:
        evaluation, feedback = evaluate(evaluator_prompt, result, task)
        if evaluation == "PASS":
            return result, chain_of_thought
        
        # Context accumulates: previous attempts + feedback
        context = "Previous attempts:\n" + "\n".join(memory) + f"\nFeedback: {feedback}"
        thoughts, result = generate(generator_prompt, task, context)
        memory.append(result)
```

**Evaluator prompt structure:**
```
Evaluate for: correctness, performance, style
Output only:
<evaluation>PASS | NEEDS_IMPROVEMENT | FAIL</evaluation>
<feedback>Specific, actionable improvement criteria</feedback>
```

**When to use:**
- Clear, measurable evaluation criteria exist
- First-attempt quality meaningfully differs from polished output
- The cost of extra iterations is justified by the quality delta

**Use cases for client work:**
- Code generation with security/style standards
- Report writing with client-specific tone requirements
- Data transformation with validation criteria
- Proposal generation against defined rubrics

**Second-order consideration:** The pattern's memory (`chain_of_thought`) captures not just the final answer but the entire reasoning evolution. For compliance-sensitive clients, this is an audit trail showing *why* the final output looks the way it does.

### 6.2 Instant Session Compaction

**Source:** `misc/session_memory_compaction.ipynb`

Traditional compaction is reactive — the agent hits the context limit, spends 40+ seconds generating a summary, then continues. Instant compaction is proactive — background threads build the summary continuously, so when the limit is hit, the swap is instant.

**Implementation:**
```python
class InstantCompactingChatSession:
    def chat(self, user_message):
        # Check if approaching context limit
        if self.current_context_window_tokens + estimate_tokens(user_message) >= self.context_limit:
            self.compact()  # Swap in pre-built memory — zero wait
        
        # Normal response processing...
        
        # Trigger background update proactively (not reactively)
        if self._should_init_memory() or self._should_update_memory():
            self._trigger_background_update()  # Daemon thread, non-blocking
```

**The compaction memory prompt preserves:**
- Exact identifiers (IDs, paths, URLs, keys)
- Error messages verbatim
- User corrections and negative feedback
- In-progress work state
- Pending tasks

**Trigger thresholds (configurable):**
- `min_tokens_to_init` (default: 7,500) — when to create first summary
- `min_tokens_between_updates` (default: 2,000) — how often to refresh
- `context_limit` — when to trigger compaction swap

**UX impact:** The difference between 40-second stalls and zero-second swaps is the difference between a tool clients use and a tool they complain about. For long-running sessions (deep research, complex project management), instant compaction is not optional — it's what makes the product viable.

### 6.3 Prompt Caching Economics

**Source:** Official Anthropic pricing docs

Prompt caching is the most impactful cost lever available. Cache reads cost 10% of standard input token prices. The compaction notebook demonstrates ~80% cost reduction in background summarization operations by sharing cache with the main conversation.

**Current pricing (March 2026):**

| Model | Input | Cache Write (5-min) | Cache Write (1-hr) | Cache Read | Output |
|---|---|---|---|---|---|
| Claude Opus 4.6 | $5/MTok | $6.25/MTok | $10/MTok | $0.50/MTok | $25/MTok |
| Claude Sonnet 4.6 | $3/MTok | $3.75/MTok | $6/MTok | $0.30/MTok | $15/MTok |
| Claude Haiku 4.5 | $1/MTok | $1.25/MTok | $2/MTok | $0.10/MTok | $5/MTok |

**Cache ROI breakeven:**
- 5-minute cache: breaks even after 1 cache read (1.25x write cost, 0.1x read cost)
- 1-hour cache: breaks even after 2 cache reads (2x write cost, 0.1x read cost)

**Batch API (50% discount on everything):**

| Model | Batch Input | Batch Output |
|---|---|---|
| Claude Opus 4.6 | $2.50/MTok | $12.50/MTok |
| Claude Sonnet 4.6 | $1.50/MTok | $7.50/MTok |

**Combined strategy:** Prompt caching + Batch API + session compaction can reduce agent operational costs by 75-90% compared to naive repeated full-context calls. For background operations (scheduled monitoring, report generation, nightly analysis), always use Batch API. For interactive sessions with stable system prompts, always cache.

**MCP Tool Search (January 2026):** When tool definitions exceed 10% of context window, the SDK automatically defers loading and discovers tools on-demand. Users are reporting up to 95% reduction in startup token cost for MCP-heavy configurations. This is automatic — no configuration needed.

---

## 7. Cost Analysis

### Scenario: Client Operations Agent (Chief of Staff Pattern)

Assumptions: 50 queries/day, ~3,000 input tokens/query, ~1,000 output tokens/query, stable system prompt (2,000 tokens) cached.

**Without optimization (Claude Sonnet 4.6):**
- Input: 50 × 3,000 = 150,000 tokens × $3/MTok = $0.45/day
- Output: 50 × 1,000 = 50,000 tokens × $15/MTok = $0.75/day
- **Daily total: ~$1.20 | Monthly: ~$36**

**With prompt caching (system prompt cached):**
- Cache write (once/hour): 2,000 tokens × $3.75/MTok = $0.0075
- Cache reads (49 remaining): 49 × 2,000 × $0.30/MTok = $0.029/day
- Input (non-cached): 50 × 1,000 × $3/MTok = $0.15/day
- Output unchanged: $0.75/day
- **Daily total: ~$0.93 | Monthly: ~$28 (~22% savings)**

**With Batch API for non-time-sensitive ops:**
- Batch Input: 150,000 × $1.50/MTok = $0.225/day
- Batch Output: 50,000 × $7.50/MTok = $0.375/day
- **Daily total: ~$0.60 | Monthly: ~$18 (~50% savings vs. baseline)**

**With caching + batch + compaction:**
- Background summarization with cache sharing: ~80% reduction on summary calls
- **Effective monthly cost: ~$15-18 for a 50-query/day enterprise ops agent**

### Scenario: CI Health Monitoring Agent (Observability Pattern)

Assumptions: 24 checks/day (hourly), 5,000 input tokens/check (GitHub API results), 500 output tokens/check.

**Baseline (Claude Haiku 4.5, appropriate for structured monitoring):**
- Input: 24 × 5,000 × $1/MTok = $0.12/day
- Output: 24 × 500 × $5/MTok = $0.06/day
- **Daily: $0.18 | Monthly: ~$5.40**

Haiku 4.5 is the right model choice for structured monitoring tasks. The savings from using Haiku vs. Opus are 5x on input, 5x on output. Reserve Opus for reasoning-intensive tasks (strategy, complex diagnosis); use Haiku for pattern-matching tasks (health checks, status monitoring).

### Scenario: SRE Incident Response (On-Demand)

Assumptions: 5 incidents/month, 15 investigation turns/incident, 4,000 input + 2,000 output tokens/turn.

**Claude Opus 4.6 (appropriate — high-stakes reasoning):**
- Input: 5 × 15 × 4,000 × $5/MTok = $1.50/month
- Output: 5 × 15 × 2,000 × $25/MTok = $3.75/month
- **Monthly: ~$5.25 for full autonomous incident response**

At $5.25/month in API costs for SRE automation, the economics of a $500-$1,000/month managed service are trivially favorable.

---

## 8. Crowbar Crew Service Mapping

The four notebooks define a natural product ladder:

### Tier 1: Agent Starter ($0 setup, included in managed service)

**Pattern:** Research Agent (Notebook 00)  
**Complexity:** Trivial  
**Value:** Immediate — clients see an agent doing real work in <1 hour

Deliverable: A `query()` wrapper configured for the client's domain. WebSearch enabled, system prompt with client context, citation enforcement. Works standalone or as a building block.

Use cases: competitive intelligence, market research, document analysis, Q&A over client knowledge base.

### Tier 2: Business Operations Agent ($2,500-$5,000 setup + monthly retainer)

**Pattern:** Chief of Staff Agent (Notebook 01)  
**Complexity:** High  
**Value:** Process automation for repeatable business workflows

Deliverables:
- CLAUDE.md with client company context
- 3-5 domain-specific subagents (e.g., finance, recruiting, ops)
- Custom slash commands encoding client workflows
- Output styles per stakeholder (executive, technical, detailed)
- Hooks for audit trail and compliance
- Plan mode enabled by default with human-in-the-loop approval

Use cases: financial modeling, hiring workflow, board reporting, strategic planning assistance.

### Tier 3: Infrastructure Monitoring Agent ($3,000-$7,500 setup + monthly retainer)

**Pattern:** Observability Agent (Notebook 02) or SRE Agent (Notebook 03)  
**Complexity:** Medium-High  
**Value:** Operational leverage for small engineering teams

Deliverables (Observability variant):
- GitHub MCP integration configured for client repos
- CI/CD health monitoring on a schedule
- Slack/email alerting on failures
- Read-only mode with explicit disallow list
- Weekly health summary reports

Deliverables (SRE variant — premium):
- Custom MCP server for client infrastructure
- Prometheus integration
- Two-layer safety model (code + hooks)
- Automatic remediation for defined incident types
- Post-mortem generation and Confluence/Notion publishing

Use cases: On-call augmentation, CI health dashboards, infrastructure drift detection.

### Tier 4: Self-Improving Quality Pipeline ($5,000-$10,000 setup)

**Pattern:** Evaluator-Optimizer (cross-cutting)  
**Complexity:** Medium  
**Value:** Consistent quality output at scale

Deliverables:
- Generator agent for the client's specific content type
- Evaluator agent with client-defined quality rubric
- Iteration loop with configurable quality gates
- Chain-of-thought audit trail
- Integration with client's existing review workflow

Use cases: Proposal generation, contract drafting, code review, marketing copy, compliance documentation.

---

## 9. Recommended Starter Template

The following is a reference architecture for a first client engagement. It is intentionally conservative — demonstrable value, minimal blast radius, clear upgrade path.

### File Structure

```
client-agent/
├── CLAUDE.md                     # Client company context
├── .claude/
│   ├── settings.json             # Shared config (version-controlled)
│   ├── settings.local.json       # Hooks config (gitignored)
│   ├── agents/
│   │   └── domain-specialist.md  # Primary specialist subagent
│   ├── commands/
│   │   └── weekly-report.md      # Example slash command
│   └── output-styles/
│       ├── executive.md
│       └── detailed.md
├── scripts/
│   └── domain-calculation.py     # Deterministic computation
├── agent.py                      # SDK wrapper module
├── requirements.txt
└── .env                          # ANTHROPIC_API_KEY (gitignored)
```

### CLAUDE.md Template

```markdown
# [Client Name] — Agent Context

## Company
- Industry: [vertical]
- Size: [headcount]
- Key metrics: [2-3 KPIs]
- Current priorities: [top 3]

## Workflows
- [Workflow 1]: [brief description, key data sources]
- [Workflow 2]: [brief description, key data sources]

## Constraints
- Tone: [formal/conversational/technical]
- Escalate to human when: [criteria]
- Never: [explicit prohibitions]
```

### agent.py Module

```python
import asyncio
from pathlib import Path
from claude_agent_sdk import ClaudeAgentOptions, ClaudeSDKClient

MODEL = "claude-sonnet-4-6"  # Upgrade to Opus for complex reasoning tasks
CLIENT_DIR = Path(__file__).parent

class ClientAgent:
    def __init__(self, output_style: str = "executive", plan_mode: bool = False):
        self.options = ClaudeAgentOptions(
            model=MODEL,
            cwd=str(CLIENT_DIR),
            allowed_tools=["Task", "Bash", "Read", "Write"],
            setting_sources=["project", "local"],  # Load all filesystem config
            settings=f'{{"outputStyle": "{output_style}"}}',
            permission_mode="plan" if plan_mode else None,
            max_buffer_size=10 * 1024 * 1024,  # 10MB for document/image input
        )
    
    async def query(self, prompt: str) -> str:
        messages = []
        async with ClaudeSDKClient(options=self.options) as agent:
            await agent.query(prompt)
            async for msg in agent.receive_response():
                messages.append(msg)
        return self._extract_result(messages)
    
    def _extract_result(self, messages) -> str:
        from claude_agent_sdk import AssistantMessage, TextBlock
        for msg in reversed(messages):
            if isinstance(msg, AssistantMessage):
                for block in msg.content:
                    if isinstance(block, TextBlock):
                        return block.text
        return ""

# Convenience function
async def run(prompt: str, style: str = "executive", plan: bool = False) -> str:
    agent = ClientAgent(output_style=style, plan_mode=plan)
    return await agent.query(prompt)

if __name__ == "__main__":
    result = asyncio.run(run("Generate weekly operations summary"))
    print(result)
```

### Hooks Configuration (.claude/settings.local.json)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{
          "type": "command",
          "command": "python .claude/hooks/audit-logger.py"
        }]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "bash .claude/hooks/validate-command.sh"
        }]
      }
    ]
  }
}
```

### Domain Specialist Subagent Template

```yaml
---
name: domain-specialist
description: Performs [client domain] analysis and generates [output type]
tools:
  - Bash
  - Read
  - Write
---

# [Client] Domain Specialist

You are a specialist in [client domain] for [client name].

## Responsibilities
1. [Primary responsibility]
2. [Secondary responsibility]

## Data Sources
- [data file or API]: [what it contains]

## Output Format
[Required output structure]

## Escalation Criteria
Return to orchestrator if: [conditions requiring human judgment]
```

### Deployment Checklist

- [ ] CLAUDE.md reviewed and approved by client stakeholder
- [ ] Subagent definitions tested independently
- [ ] Hooks validated (PostToolUse audit log writing correctly)
- [ ] Plan mode demonstrated to client before enabling full execution
- [ ] `setting_sources=["project", "local"]` confirmed in all options
- [ ] `disallowed_tools` explicitly set for anything not needed
- [ ] `max_buffer_size` raised for any document/image workflow
- [ ] Batch API enabled for scheduled/non-interactive runs
- [ ] Container resource allocation set (1 GiB RAM, 5 GiB disk minimum)
- [ ] Session compaction thresholds configured for expected conversation length

---

## 10. Gaps and Limitations

### 10.1 Python-First SDK

The official cookbooks are Python-only (Jupyter notebooks). TypeScript SDK exists and is documented, but the cookbook examples, community patterns, and reference implementations are all Python. For a TypeScript-native shop (Tony's preference), this means:
- Translating Python patterns to TypeScript manually for early adopters
- TypeScript V2 SDK (preview) simplifies the interface but is not yet GA
- Monitoring `anthropics/claude-agent-sdk-typescript` CHANGELOG actively is necessary

### 10.2 Docker Dependency for GitHub MCP

The GitHub MCP server runs via Docker (`ghcr.io/github/github-mcp-server`). Any client deployment that needs GitHub integration requires Docker in the execution environment. Modal, E2B, and Fly Machines all support this, but it adds a dependency and startup latency (~2-3 seconds for container pull on cold start).

### 10.3 Hook Security Requires External Scripting

Filesystem-defined hooks (`.claude/settings.local.json`) run as shell commands or Python scripts. This is powerful but means hook logic lives outside the type-safe application code. For production clients, hooks need their own test coverage and review process — they are the safety layer but are not automatically validated.

### 10.4 No Native Multi-Tenancy

The SDK has no built-in concept of tenants, users, or access control above the tool permission level. For a managed service serving multiple clients, you need to implement:
- Per-client `cwd` isolation (different working directories)
- Per-client API key management or proxying
- Session isolation between clients
- Audit log separation

This is solvable but is your infrastructure to build, not Anthropic's.

### 10.5 State Persistence is DIY

Session IDs enable resumption, but the SDK does not persist session state to a database. For hybrid deployments (Ephemeral containers + state rehydration), you need to:
- Store session IDs and summaries externally (Postgres, Redis)
- Implement rehydration logic manually
- Handle session expiry and invalidation

The `InstantCompactingChatSession` pattern from the cookbook is a good starting point but is not production-hardened out of the box.

### 10.6 Model Version Pinning

The cookbooks use `claude-opus-4-6` (current as of March 2026). Model versions change. For client deployments, pin the model version explicitly and define an upgrade path — do not use aliases like `claude-opus-latest`. Behavioral changes between model versions can break fine-tuned prompt/tool configurations in ways that are hard to debug.

### 10.7 Observability is Add-On

The SDK has no built-in tracing or telemetry. For production clients, you need to add:
- OpenTelemetry instrumentation (see `claude_telemetry` open-source wrapper)
- Langfuse for prompt/response logging
- Token usage tracking per session (cost attribution per client)

The `PostToolUse` hook and the `messages` stream are the instrumentation surfaces. Build a thin wrapper that captures tool calls, token counts, and latency before delivering to clients.

### 10.8 Rate Limits and Queuing

The SDK does not handle API rate limits, queuing, or backpressure. For high-volume client deployments, you need to implement:
- Exponential backoff on `429` errors
- Request queuing for burst scenarios
- Usage tier monitoring (Anthropic's rate limits vary by tier)

---

## 11. Strategic Recommendations

### For The Crowbar Crew Immediately

**1. Build the starter template first.**  
The `client-agent/` structure defined in Section 9 should be a live repository in `txmyer-dev/crowbar-crew-lab`. Every client engagement starts from this template. Iteration on the template is how the business learns — each client engagement that reveals a gap in the template makes every future engagement better.

**2. Prioritize Tier 2 (Business Operations Agent) as the flagship offering.**  
The Chief of Staff architecture (Notebook 01) is the right complexity for a first paid engagement. It is sophisticated enough to justify a consulting fee, demonstrable enough for a client stakeholder to understand, and modular enough to scope down if needed. Tier 1 (Research Agent) is a loss-leader demo. Tier 3 (Infra Monitoring) requires deeper client technical access. Tier 2 is the sweet spot.

**3. Own the CLAUDE.md layer.**  
Anthropic builds the engine. You build the domain knowledge layer. The CLAUDE.md file, subagent definitions, slash commands, and hooks are where your value lives — they encode client-specific business logic that a generic SDK cannot provide. This is the defensible moat: deep knowledge of the client's workflows encoded in agent configuration.

**4. Lead with Plan Mode.**  
For every new client deployment, the first month should be plan mode only. The agent generates plans; humans approve or reject. This builds client trust, surfaces edge cases before they become incidents, and creates a feedback loop that improves agent quality. Plan mode is not a limitation — it is a sales tool.

**5. Instrument everything from day one.**  
Build the observability wrapper (token counts, tool calls, latency, cost per session) before the first client engagement. Cost attribution per client is how you price the managed service. Without it you are guessing at margins.

**6. Use Sonnet 4.6 as the default model, Opus 4.6 only for complex reasoning.**  
The cost differential is 1.67x (Sonnet: $3/$15 input/output vs. Opus: $5/$25). For most client operations tasks (report generation, data analysis, workflow automation), Sonnet is sufficient. Reserve Opus for tasks that demonstrably require deeper reasoning: strategic planning, incident diagnosis, complex financial modeling.

**7. Consider the second-order effects of agent autonomy on client relationships.**  
The more autonomously the agent operates, the more critical the audit trail becomes. Clients who delegate meaningful work to an agent will eventually want to know exactly what it did and why — especially when something goes wrong. The hooks + plan mode + PostToolUse audit log is not just a safety feature; it is your liability management strategy. Build it in from the start.

---

## Sources

- [claude-cookbooks — anthropics/claude-cookbooks (GitHub)](https://github.com/anthropics/claude-cookbooks)
- [claude_agent_sdk directory](https://github.com/anthropics/claude-cookbooks/tree/main/claude_agent_sdk)
- [Notebook 00: The One-Liner Research Agent](https://platform.claude.com/cookbook/claude-agent-sdk-00-the-one-liner-research-agent)
- [Notebook 01: The Chief of Staff Agent](https://platform.claude.com/cookbook/claude-agent-sdk-01-the-chief-of-staff-agent)
- [Notebook 02: The Observability Agent](https://platform.claude.com/cookbook/claude-agent-sdk-02-the-observability-agent)
- [Notebook 03: The SRE Incident Response Agent](https://platform.claude.com/cookbook/claude-agent-sdk-03-the-site-reliability-agent)
- [Agent SDK Overview — Anthropic Docs](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Hosting the Agent SDK — Anthropic Docs](https://platform.claude.com/docs/en/agent-sdk/hosting)
- [Evaluator-Optimizer Workflow — Cookbook](https://platform.claude.com/cookbook/patterns-agents-evaluator-optimizer)
- [Session Memory Compaction — Cookbook](https://platform.claude.com/cookbook/misc-session-memory-compaction)
- [Prompt Caching — Anthropic Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [Pricing — Anthropic Docs](https://platform.claude.com/docs/en/about-claude/pricing)
- [Building Agents with the Claude Agent SDK — Anthropic Engineering Blog](https://claude.com/blog/building-agents-with-the-claude-agent-sdk)
- [Claude Agent SDK — Promptfoo Integration Docs](https://www.promptfoo.dev/docs/providers/claude-agent-sdk/)
- [Observability for Claude Agent SDK with Langfuse](https://langfuse.com/integrations/frameworks/claude-agent-sdk)
