# Tealfabric MCP Server (Claude Code & compatible clients)

MCP (Model Context Protocol) server that connects **Claude Code** (and other MCP clients) to the **Tealfabric** platform. The model can list webapps and processes, publish webapps, manage process steps, execute processes, and upload or manage documents (package files for delivery).

The server runs **locally** as a **stdio** process; it calls Tealfabric’s HTTPS API using your API key.

## Prerequisites

- **Node.js 18+**
- A **Tealfabric API key** (create one in Tealfabric: User settings → API Keys, or `POST /api/v1/api-keys` when logged in)

## Install

```bash
cd claude-mcp-tealfabric
npm install
npm run build
```

`npm run build` compiles TypeScript to `dist/` and copies the output to `plugins/tealfabric-mcp/dist/` so the Claude plugin bundle is self-contained.

## Claude Code: plugin (recommended)

From the repository root (after `npm run build`):

```text
/plugin marketplace add .
/plugin install tealfabric-mcp@tealfabric-team-marketplace
```

Set `TEALFABRIC_API_KEY` in your environment (or use a project `.mcp.json` with `${TEALFABRIC_API_KEY}`). See [Environment variables](#environment-variables).

Use `/mcp` in Claude Code to verify the server. See [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp).

## Claude Code: manual stdio server

```bash
claude mcp add --transport stdio \
  --env TEALFABRIC_API_KEY=YOUR_KEY \
  --env TEALFABRIC_API_URL=https://tealfabric.io \
  tealfabric -- node /ABSOLUTE/PATH/TO/claude-mcp-tealfabric/dist/index.js
```

Place all flags (`--transport`, `--env`, …) **before** the server name; use `--` before the command that starts the MCP server. On native Windows, some setups need `cmd /c` before `npx`/`node` (see Claude docs).

## Project-scoped `.mcp.json` (team sharing)

At the project root:

```json
{
  "mcpServers": {
    "tealfabric": {
      "type": "stdio",
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/claude-mcp-tealfabric/dist/index.js"],
      "env": {
        "TEALFABRIC_API_KEY": "${TEALFABRIC_API_KEY}",
        "TEALFABRIC_API_URL": "${TEALFABRIC_API_URL:-https://tealfabric.io}"
      }
    }
  }
}
```

Do not commit real secrets; use env expansion and local env or secrets.

## Other MCP clients

Any editor or CLI that supports MCP over stdio can run `node …/dist/index.js` with the same environment variables as in [Claude Code: manual stdio server](#claude-code-manual-stdio-server) and [Project-scoped `.mcp.json`](#project-scoped-mcpjson-team-sharing). Configure `command`, `args`, and `env` in that client’s MCP settings to match.

## Tools exposed

| Tool | Description |
|------|-------------|
| `tealfabric_list_connectors` | List connectors (optional action: get, parameters) |
| `tealfabric_test_connector` | Test connector configuration |
| `tealfabric_get_connector_oauth2_required` | Check whether connector requires OAuth2 |
| `tealfabric_list_integrations` | List integrations or query by action/filter |
| `tealfabric_create_integration` | Create a new integration |
| `tealfabric_update_integration` | Update an existing integration |
| `tealfabric_list_webapps` | List webapps (optional: search, limit) |
| `tealfabric_get_webapp` | Get one webapp by ID (optional version) |
| `tealfabric_create_webapp` | Create a new webapp |
| `tealfabric_update_webapp` | Update webapp (e.g. page_content, name) |
| `tealfabric_publish_webapp` | Publish a webapp |
| `tealfabric_list_processes` | List ProcessFlow processes |
| `tealfabric_get_process` | Get one process by ID |
| `tealfabric_list_process_steps` | List steps of a process |
| `tealfabric_get_process_step` | Get one process step by step_id |
| `tealfabric_execute_process` | Execute a process (optional input) |
| `tealfabric_create_process` | Create a new process (process flow) |
| `tealfabric_update_process` | Update an existing process |
| `tealfabric_create_process_step` | Create a new step in a process flow |
| `tealfabric_update_process_step` | Update an existing process step |
| `tealfabric_list_documents` | List documents in a directory |
| `tealfabric_get_document_metadata` | Get file metadata |
| `tealfabric_upload_document` | Upload a file (e.g. built package) |
| `tealfabric_move_document` | Move or rename file/directory |
| `tealfabric_delete_document` | Delete file or directory |

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TEALFABRIC_API_KEY` | Yes | — | Tealfabric API key (`X-API-Key`) |
| `TEALFABRIC_API_URL` | No | `https://tealfabric.io` | Tealfabric base URL |

## Security

- Do **not** commit real API keys. Use environment variables or `.mcp.json` expansion with secrets outside Git.
- API keys are scoped to your user/tenant in Tealfabric; use minimal scopes where supported.

## Documentation

- **Developer guide:** [docs/DEVELOPER.md](docs/DEVELOPER.md)
- **Tealfabric platform:** [https://tealfabric.io/docs](https://tealfabric.io/docs)
- **Claude Code MCP:** [https://code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp)
