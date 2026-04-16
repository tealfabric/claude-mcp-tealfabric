# Tealfabric MCP for Claude Code — v0.1.4

Hotfix release for ProcessFlow execution input mapping.

## Fixed

- **ProcessFlow execute payload key** — Updated the MCP API client for `POST /api/v1/processflow?action=execute-process` to send `input_data` (instead of `input`).
- **Impact** — ProcessFlow executions now receive user-provided input from MCP clients correctly, instead of running with empty/default input.

## Technical details

- Updated payload shape in `executeProcess()`:
  - Before: `{ "process_id": "...", "input": { ... } }`
  - After: `{ "process_id": "...", "input_data": { ... } }`

## Upgrade notes

- No configuration changes required.
- Existing MCP client calls to `tealfabric_execute_process` continue to work; only backend payload mapping changed.

## Links

- **Repository:** https://github.com/tealfabric/claude-mcp-tealfabric
- **Tealfabric docs:** https://tealfabric.io/docs
- **Claude Code MCP:** https://code.claude.com/docs/en/mcp
