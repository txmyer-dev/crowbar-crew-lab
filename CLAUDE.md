# Agent Attribution Rules

Every commit, PR, and file in this repo MUST be traceable to the agent that produced it.

## Commit Convention

```
[agent-name] Short description

Body with details.

Agent: colonel | claude-w | gemini-w | codie
Adapter: claude_local | gemini_local | opencode_local
Issue: #N
```

## Branch Naming

```
agent/{agent-name}/{issue-number}-short-description
```

Examples:
- `agent/claude-w/3-pdf-generation`
- `agent/gemini-w/5-extractwisdom-batch`

## PR Template

Every PR must include:
- Which agent did the work
- Which issue it closes
- A summary of approach taken
- Any decisions made autonomously

## File Headers

For new source files, include a comment header:

```
# Agent: {agent-name}
# Issue: #{issue-number}
# Date: {YYYY-MM-DD}
```

## Quality Gate

Colonel (CEO agent) reviews all PRs before merge. No self-merges.
