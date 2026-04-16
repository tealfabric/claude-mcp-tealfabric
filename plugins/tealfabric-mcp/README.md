# Tealfabric MCP (Claude Code plugin)

Claude Code plugin that registers a stdio MCP server for Tealfabric: WebApps, ProcessFlow, documents, connectors, and integrations.

## Requirements

- **Node.js** on the machine running Claude Code (the MCP server is started with `node`).
- After cloning this repository, run **`npm install` and `npm run build` at the repository root** so `plugins/tealfabric-mcp/dist/` contains the built server (the plugin path must stay self-contained; see [plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)).

## Configure the API key

Set `TEALFABRIC_API_KEY` in your environment before enabling the plugin, or use a project `.mcp.json` / shell profile with `${TEALFABRIC_API_KEY}`.

Optional: `TEALFABRIC_API_URL` (default `https://tealfabric.io`).

## Install via marketplace

From the repository root:

```text
/plugin marketplace add .
/plugin install tealfabric-mcp@tealfabric-team-marketplace
```

## Verify

In Claude Code: `/mcp` — the `tealfabric` server should appear when the plugin is enabled.

## Document tools

- `tealfabric_list_documents` — list files/directories
- `tealfabric_get_document_metadata` — fetch metadata for a file
- `tealfabric_download_document` — download a file; returns JSON response or base64 payload for binary-safe transfer
- `tealfabric_upload_document` — upload a local file
- `tealfabric_move_document` — move/rename files or directories
- `tealfabric_delete_document` — delete files or directories

## Contents

- **Skills** — Efficient tool usage and safe API key handling (`skills/`)
- **Agents** — Release checks (`agents/`)
