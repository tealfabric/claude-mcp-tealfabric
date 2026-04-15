# Tealfabric MCP — Developer Documentation

This document is for developers who use, configure, or extend the **Tealfabric MCP Server** for the Tealfabric platform.

**Tealfabric platform documentation:** [https://tealfabric.io/docs](https://tealfabric.io/docs)

**Claude Code MCP:** [https://code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp)

---

## Table of contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Installation and build](#3-installation-and-build)
4. [Claude Code configuration](#4-claude-code-configuration)
5. [Tools reference](#5-tools-reference)
6. [Tealfabric API mapping](#6-tealfabric-api-mapping)
7. [Environment variables](#7-environment-variables)
8. [Security and API keys](#8-security-and-api-keys)
9. [Project structure](#9-project-structure)
10. [Extending the server](#10-extending-the-server)
11. [Troubleshooting](#11-troubleshooting)
12. [References](#12-references)

---

## 1. Overview

The Tealfabric MCP Server is an **MCP (Model Context Protocol) server** that runs locally and talks to the Tealfabric REST API. It lets the AI in **Claude Code** (and other MCP clients):

- **List** connectors and check connector OAuth2 requirements
- **List, create, and update** integrations
- **List** webapps and ProcessFlow processes/steps
- **Read** webapp and process details
- **Create** and **update** webapps (e.g. `page_content`, name)
- **Publish** webapps
- **Execute** ProcessFlow processes (with optional input)
- **Create** and **update** processes (process flows)
- **Create** and **update** process steps
- **List, upload, move, delete** documents (package files for delivery)

The server is **standalone**: it only depends on Node.js, npm packages (`@modelcontextprotocol/sdk`, `zod`), and the Tealfabric API.

- **Transport:** stdio (the client spawns the process and communicates via stdin/stdout).
- **Authentication:** Tealfabric API key via `TEALFABRIC_API_KEY` (sent as `X-API-Key`).
- **Plugin bundle:** `npm run build` copies `dist/` to `plugins/tealfabric-mcp/dist/` so the Claude plugin can reference `${CLAUDE_PLUGIN_ROOT}/dist/index.js` without leaving the plugin directory.

---

## 2. Prerequisites

- **Node.js 18+**
- **Tealfabric account** and an **API key**
- **Claude Code** (or another MCP-capable client) for local stdio

---

## 3. Installation and build

```bash
cd claude-mcp-tealfabric
npm install
npm run build
```

- **Output:** `dist/index.js` (and `dist/client.js`), plus `plugins/tealfabric-mcp/dist/` (copy for the plugin).
- **Scripts:**
  - `npm run build` — compile TypeScript and sync plugin `dist/`
  - `npm run start` — run `node dist/index.js` (manual testing)
  - `npm run dev` — build then run
  - `npm run validate:marketplace` — validate `.claude-plugin/marketplace.json` and plugin layout

---

## 4. Claude Code configuration

### Plugin (marketplace)

From the repo root:

```text
/plugin marketplace add .
/plugin install tealfabric-mcp@tealfabric-team-marketplace
```

Set `TEALFABRIC_API_KEY` in your environment. Plugin MCP is defined in `plugins/tealfabric-mcp/.mcp.json` and uses `${CLAUDE_PLUGIN_ROOT}/dist/index.js`.

### Manual stdio

```bash
claude mcp add --transport stdio \
  --env TEALFABRIC_API_KEY=YOUR_KEY \
  tealfabric -- node /ABSOLUTE/PATH/TO/claude-mcp-tealfabric/dist/index.js
```

Options must come **before** the server name; use `--` before the command. See [Option ordering](https://code.claude.com/docs/en/mcp#option-3-add-a-local-stdio-server).

### Project `.mcp.json`

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

Use `/mcp` in Claude Code to verify the connection.

---

## 5. Tools reference

All tools return JSON (or error text) in MCP content. Parameters are validated with Zod schemas.

| Tool | Description | Parameters |
|------|-------------|------------|
| `tealfabric_list_connectors` | List connectors, get connector details, or get connector parameters | `action` (optional: `get`, `parameters`), `connector_id` (optional) |
| `tealfabric_test_connector` | Test connector configuration | `payload` (object) |
| `tealfabric_get_connector_oauth2_required` | Check if a connector requires OAuth2 | `connector_id` |
| `tealfabric_list_integrations` | List integrations or query by action/filter | optional: `action`, `integration_id`, `execution_id`, `limit`, `search`, `type`, `status`, `is_active`, `page`, `items_per_page`, `sort_by`, `sort_direction` |
| `tealfabric_create_integration` | Create a new integration | `name`, `type`, optional: `description`, `connector_id`, `status`, `is_active` |
| `tealfabric_update_integration` | Update an existing integration | `integration_id`, optional: `name`, `type`, `description`, `connector_id`, `status`, `is_active` |
| `tealfabric_list_webapps` | List webapps for the authenticated tenant | `search` (optional), `limit` (optional) |
| `tealfabric_get_webapp` | Get one webapp by ID | `webapp_id`, `version` (optional) |
| `tealfabric_create_webapp` | Create a new webapp | `name`, optional: `description`, `page_content`, `page_header`, `page_footer`, `custom_css`, `custom_js`, `process_id` |
| `tealfabric_update_webapp` | Update an existing webapp | `webapp_id`, optional: `name`, `description`, `page_content`, `page_header`, `page_footer`, `custom_css`, `custom_js`, `process_id` |
| `tealfabric_publish_webapp` | Publish a webapp (make current version live) | `webapp_id` |
| `tealfabric_list_processes` | List ProcessFlow processes | (none) |
| `tealfabric_get_process` | Get one process by ID | `process_id` |
| `tealfabric_list_process_steps` | List steps of a process | `process_id` |
| `tealfabric_get_process_step` | Get one process step by step_id | `step_id` |
| `tealfabric_execute_process` | Execute a process | `process_id`, `input` (optional object) |
| `tealfabric_create_process` | Create a new process (process flow) | `name`, optional: `description`, `type`, `status`, `version`, `category`, `tags`, etc. |
| `tealfabric_update_process` | Update an existing process | `process_id`, optional: `name`, `description`, `status`, etc. |
| `tealfabric_create_process_step` | Create a new step in a process flow | `process_id`, `step_name`, optional: `step_type`, `description`, `code_snippet`, etc. |
| `tealfabric_update_process_step` | Update an existing process step | `step_id`, optional: `step_name`, `description`, `code_snippet`, etc. |
| `tealfabric_list_documents` | List documents in a directory | `path` (optional), `tenant_id` (optional) |
| `tealfabric_get_document_metadata` | Get file metadata | `file_path`, `tenant_id` (optional) |
| `tealfabric_upload_document` | Upload a file (e.g. built package) | `destination_path`, `file_path`, `tenant_id` (optional) |
| `tealfabric_move_document` | Move or rename file/directory | `old_path`, `new_path`, `tenant_id` (optional) |
| `tealfabric_delete_document` | Delete file or directory | `path`, `tenant_id` (optional) |

Several list/get tools set `anthropic/maxResultSizeChars` in tool metadata for large JSON responses (see [MCP output limits](https://code.claude.com/docs/en/mcp#raise-the-limit-for-a-specific-tool)).

---

## 6. Tealfabric API mapping

The connector calls the Tealfabric REST API. All requests use the base URL from `TEALFABRIC_API_URL` and send `X-API-Key: <TEALFABRIC_API_KEY>`.

| Tool | HTTP | Tealfabric endpoint |
|------|------|---------------------|
| `tealfabric_list_connectors` | GET | `/api/v1/connectors` (+ optional query) |
| `tealfabric_test_connector` | POST | `/api/v1/connectors?action=test` |
| `tealfabric_get_connector_oauth2_required` | GET | `/api/v1/connectors/{id}/oauth2-required` |
| `tealfabric_list_integrations` | GET | `/api/v1/integrations` (+ optional query) |
| `tealfabric_create_integration` | POST | `/api/v1/integrations?action=create` |
| `tealfabric_update_integration` | PUT | `/api/v1/integrations?action=update` |
| `tealfabric_list_webapps` | GET | `/api/v1/webapps` |
| `tealfabric_get_webapp` | GET | `/api/v1/webapps/{id}` |
| `tealfabric_create_webapp` | POST | `/api/v1/webapps` |
| `tealfabric_update_webapp` | PUT | `/api/v1/webapps/{id}` |
| `tealfabric_publish_webapp` | POST | `/api/v1/webapps/{id}/publish` |
| `tealfabric_list_processes` | GET | `/api/v1/processflow?action=processes` |
| `tealfabric_get_process` | GET | `/api/v1/processflow?action=process&process_id={id}` |
| `tealfabric_list_process_steps` | GET | `/api/v1/processflow?action=steps&process_id={id}` |
| `tealfabric_get_process_step` | GET | `/api/v1/processflow?action=step&step_id={id}` |
| `tealfabric_execute_process` | POST | `/api/v1/processflow?action=execute-process` |
| `tealfabric_create_process` | POST | `/api/v1/processes?action=create` |
| `tealfabric_update_process` | PUT | `/api/v1/processes?action=update` |
| `tealfabric_create_process_step` | POST | `/api/v1/processes?action=create-step` |
| `tealfabric_update_process_step` | PUT | `/api/v1/processes?action=update-step` |
| `tealfabric_list_documents` | GET | `/api/v1/documents?action=list` |
| `tealfabric_get_document_metadata` | GET | `/api/v1/documents?action=metadata` |
| `tealfabric_upload_document` | POST | `/api/v1/documents?action=upload` (multipart) |
| `tealfabric_move_document` | PUT | `/api/v1/documents?action=move` |
| `tealfabric_delete_document` | DELETE | `/api/v1/documents?action=delete` |

---

## 7. Environment variables

| Variable | Required | Default | Description |
|---------|----------|---------|-------------|
| `TEALFABRIC_API_KEY` | Yes | — | Tealfabric API key (`X-API-Key`). |
| `TEALFABRIC_API_URL` | No | `https://tealfabric.io` | Base URL (no trailing slash). |

---

## 8. Security and API keys

- **Do not commit** real API keys. Use environment variables or `.mcp.json` expansion.
- Keys are **tenant- and user-scoped** in Tealfabric; restrict scopes where supported.
- The connector uses **HTTPS** only; it does not log the key.

---

## 9. Project structure

```
claude-mcp-tealfabric/
├── package.json
├── tsconfig.json
├── README.md
├── .claude-plugin/
│   └── marketplace.json          # Claude Code plugin marketplace index
├── docs/
│   └── DEVELOPER.md
├── plugins/
│   └── tealfabric-mcp/
│       ├── .claude-plugin/
│       │   └── plugin.json       # Plugin manifest
│       ├── .mcp.json             # MCP stdio config (${CLAUDE_PLUGIN_ROOT}/dist/index.js)
│       ├── skills/               # Claude Skills
│       ├── agents/
│       ├── assets/
│       └── dist/                 # Populated by npm run build (gitignored)
├── src/
│   ├── index.ts                  # MCP server
│   └── client.ts                 # Tealfabric API client
└── dist/                         # Built output (gitignored)
```

---

## 10. Extending the server

1. Add a method in `src/client.ts` using the existing `request()` pattern.
2. Register a tool in `src/index.ts` with `server.registerTool(...)`.
3. Run `npm run build`.

---

## 11. Troubleshooting

| Issue | What to check |
|-------|----------------|
| "TEALFABRIC_API_KEY is not set" | Set the variable in the environment or MCP `env`. |
| 401 from Tealfabric | Key invalid or revoked. |
| Plugin MCP fails to start | Run `npm run build` so `plugins/tealfabric-mcp/dist/index.js` exists; paths must use `${CLAUDE_PLUGIN_ROOT}`. |
| `claude plugin validate` errors | Fix manifest and paths per [plugins reference](https://code.claude.com/docs/en/plugins-reference). |

---

## 12. References

- **Tealfabric:** [https://tealfabric.io/docs](https://tealfabric.io/docs)
- **MCP:** [https://modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Claude Code MCP:** [https://code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp)
- **Claude plugins:** [https://code.claude.com/docs/en/plugins-reference](https://code.claude.com/docs/en/plugins-reference)
