# Google Workspace CLI (`@googleworkspace/cli`) Evaluation

## Overview
The `@googleworkspace/cli` is a unified CLI tool that dynamically consumes Google Workspace Discovery Service APIs. It provides a common interface across all Google Workspace services.

## Feature Comparison
| Feature | Individual MCPs | gws CLI |
| :--- | :--- | :--- |
| **API Coverage** | Hardcoded specific endpoints (Gmail, Calendar, Drive) | 100% dynamic coverage (Gmail, Calendar, Drive, Sheets, Docs, Tasks, etc.) |
| **Ergonomics** | Native tool call arguments | `gws <service> <resource> <method> --params '{}'` |
| **Maintenance** | High (must update server code for new endpoints) | Low (auto-updates via Discovery schema) |
| **Auth** | Varies per server | Unified (`gws auth login`, Credentials File, Token Env Vars) |

## Auth Setup
The CLI supports multiple authentication workflows, which is excellent for MCP wrapping:
1. **Interactive:** `gws auth login` (requires client ID/secret)
2. **Service Account/File:** `GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE=/path/to/creds.json`
3. **Environment Token:** `GOOGLE_WORKSPACE_CLI_TOKEN=ya29...` (ideal for MCP servers passing tokens down to the CLI)

## MCP Wrappability
**Can it be wrapped as a single MCP server?**
Yes, highly feasible. A single generic MCP server can be built that uses the CLI under the hood. The MCP tools can be mapped dynamically using `gws schema <service.resource.method>`. The MCP server would construct the CLI command with `--params` and `--json` arguments based on the tool call payload.

## Coverage Additions
By migrating, we immediately gain access to:
- **Sheets** (read/write/update)
- **Docs** (read/write)
- **Slides, Tasks, People, Admin Reports, etc.**

## Recommendation
**Replace.** 
The unified CLI is a much stronger foundation than maintaining disparate, hardcoded MCP servers. We should build a single `google-workspace-mcp` server that wraps `gws`. 

## Migration Path
1. Create a new `google-workspace-mcp` wrapper server.
2. Implement a schema generator script that parses `gws schema <xyz>` to generate MCP tool definitions.
3. Migrate the auth flow to provide the `GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE` environment variable to the MCP server environment.
4. Deprecate the old Gmail, Calendar, and Drive MCPs once the unified server is tested.

## Blockers/Dealbreakers
- **Performance:** `gws` spawns a Node.js process per command. If the MCP server is heavily used, the initialization overhead might be noticeable compared to an in-memory SDK call.
- **Complexity of Schemas:** Some Google API payloads are extremely deeply nested. Exposing the full schema directly to an LLM might consume significant context window. A filtering or schema-simplification layer might be necessary in the new MCP server.