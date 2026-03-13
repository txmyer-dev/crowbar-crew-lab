---
title: "n8n Now Runs My ENTIRE Homelab"
type: wisdom-extraction
domain: learning
tags: [n8n, homelab, automation, self-hosted, infrastructure, advanced]
date: 2026-03-13
source: https://www.youtube.com/watch?v=vBkD6Hzm6KM
status: active
---

# n8n Now Runs My ENTIRE Homelab

## Summary
In this advanced follow-up, NetworkChuck demonstrates how he has integrated n8n deeply into his homelab infrastructure, automating everything from server monitoring and alerting to DNS management, backup verification, and network security checks. The video shows real workflows running in production, covering patterns like error handling, sub-workflows, and integrating with self-hosted services like Uptime Kuma, Proxmox, and Pi-hole. Chuck shows how a single n8n instance can act as the "brain" of an entire homelab.

## Key Ideas
- n8n can orchestrate complex multi-service homelab environments without code
- Sub-workflows allow modular, reusable automation components
- Error workflows provide a global catch mechanism for failed automations
- Scheduled workflows replace cron jobs for maintenance tasks
- n8n integrates with Proxmox API for VM management and health checks
- Uptime Kuma + n8n creates a powerful alert → response pipeline
- Pi-hole can be managed via n8n for automated blocklist updates
- The "Execute Workflow" node enables workflow composition and reuse
- Wait nodes allow multi-step approval workflows and delayed actions
- Webhook nodes let external services trigger n8n workflows
- n8n can read/write files on the host system via the filesystem nodes
- The Code node (JavaScript) handles edge cases that nodes don't cover
- n8n's queue mode scales to high-volume workloads
- Sticky notes inside workflows document complex logic for future reference
- Environment variables in n8n prevent credential hardcoding

## Insights
- The homelab use case demonstrates n8n's depth — it's not just for "connect app A to app B" but for sophisticated orchestration with branching logic, retries, and state management
- Centralizing automation in one tool (n8n) vs. scattered shell scripts and cron jobs dramatically improves visibility and debugging
- The sub-workflow pattern is essentially microservices for automation — each workflow does one thing well, and they compose into larger systems
- Self-hosted infrastructure generates enormous amounts of operational data; n8n provides the glue to make that data actionable
- n8n as a "homelab brain" is a forcing function to learn APIs — you naturally explore what your services can do programmatically

## Recommendations
- Set up n8n with Docker Compose including a PostgreSQL backend for production persistence
- Enable queue mode if running high-volume workflows to avoid blocking
- Build a "homelab health check" workflow first — it teaches you the patterns and gives immediate value
- Use sticky notes liberally to document why workflows exist, not just what they do
- Create an error workflow early: route failures to a Discord/Slack notification
- Tag and organize workflows with naming conventions from day one — chaos grows fast
- Back up your n8n data directory — losing workflows is painful

## Quotes
- "I don't have to SSH into anything anymore — n8n does it for me"
- "Your homelab has an API for everything. n8n is how you use it."
- "Sub-workflows changed how I think about automation architecture"

## Related
- [[n8n-Getting-Started]]
- [[Docker-Compose]]
- [[Proxmox]]
- [[Uptime-Kuma]]
- [[Self-Hosted-Infrastructure]]
- [[Homelab-Automation]]
