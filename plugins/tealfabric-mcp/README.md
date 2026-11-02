# Tealfabric MCP (Claude Code plugin)

Claude Code plugin that registers a stdio MCP server for Tealfabric: WebApps, ProcessFlow, documents, connectors, and integrations (**v0.2.0**, backend-next aligned).

## Requirements

- **Node.js** on the machine running Claude Code (the MCP server is started with `node`).
- After cloning this repository, run **`npm install` and `npm run build` at the repository root** so `plugins/tealfabric-mcp/dist/` contains the built server (the plugin path must stay self-contained; see [plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)).

## Configure the API key

Set `TEALFABRIC_API_KEY` in your environment before enabling the plugin, or use a project `.mcp.json` / shell profile with `${TEALFABRIC_API_KEY}`.

Optional: `TEALFABRIC_API_URL` (default `https://tealfabric.io`).

API key scopes as needed: `connectors.*`, `integrations.*`, `webapps.*`, `processflow.*`, `documents.*`.

## Install via marketplace

From the repository root:

```text
/plugin marketplace add .
/plugin install tealfabric-mcp@tealfabric-team-marketplace
```

## Verify

In Claude Code: `/mcp` — the `tealfabric` server should appear when the plugin is enabled.

## Docs

- Package README: [../../README.md](../../README.md)
- Release notes 0.2.0: [../../docs/RELEASE_NOTES_0.2.0.md](../../docs/RELEASE_NOTES_0.2.0.md)
- Migrating: [../../docs/MIGRATING.md](../../docs/MIGRATING.md)

## Contents

- **Skills** — Efficient tool usage (integrations, webapps, processes, documents) and safe API key handling (`skills/`)
- **Agents** — Release checks (`agents/`)
