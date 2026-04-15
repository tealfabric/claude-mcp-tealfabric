# Changelog

All notable changes to the Tealfabric MCP Server are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2026-04-15

### Fixed

- **API endpoint prefixing** — Updated connector and integration API calls to use `/api/v1/...` routes to avoid frontend-auth redirects and ensure MCP calls hit API endpoints.

### Changed

- **Claude Code plugin model** — Replaced the previous marketplace plugin layout with Claude Code layout: root `.claude-plugin/marketplace.json`, plugin manifest at `plugins/tealfabric-mcp/.claude-plugin/plugin.json`, and MCP config at `plugins/tealfabric-mcp/.mcp.json` using `${CLAUDE_PLUGIN_ROOT}` and stdio.
- **Build** — `npm run build` now copies compiled output to `plugins/tealfabric-mcp/dist/` so the plugin bundle stays self-contained (required for Claude Code plugin installs).
- **Documentation** — README and `docs/DEVELOPER.md` now describe Claude Code (`claude mcp add`, project `.mcp.json`, `/plugin marketplace add`).

### Added

- **MCP server instructions** — Server advertises `instructions` for Claude Code tool search.
- **Large JSON tools** — Selected tools include `anthropic/maxResultSizeChars` metadata for large list/get responses.
- **Skill** — `safe-api-key-handling` migrated from prior `rules/*.mdc` files into `skills/safe-api-key-handling/SKILL.md`.

### Removed

- **Legacy plugin manifests** — Removed the old marketplace and nested plugin manifests, plus the previous `plugins/tealfabric-mcp/mcp.json` that relied on IDE-specific placeholders (`${workspaceFolder}`, `${input:...}`).

## [0.1.2] - Released

### Added

- **Marketplace packaging** — Added IDE marketplace manifests, plugin scaffolding, and plugin-level MCP config
- **Skills** — Added low-token MCP usage skills for efficient integration create/update and schema-safe tool calling
- **Validation and CI** — Added marketplace validation script and GitHub Actions workflow for build/validation checks
- **Plugin docs** — Added plugin README with setup and quick verification steps

## [0.1.1] - Released

### Added

- **Connectors** — Added MCP tools to list connectors, test connector configuration, and check OAuth2 requirements
- **Integrations** — Added MCP tools to list integrations with filters/actions and to create/update integrations
- **API coverage** — Extended client and MCP tool registration to support Tealfabric `/connectors` and `/integrations` endpoints
- **Documentation** — Updated `README.md` and developer docs with new connectors/integrations tools and API mapping

## [0.1.0] - Released

### Added

- **Webapps** — List, get, create, update, and publish Tealfabric webapps
- **Processes** — List processes, get process, list process steps, get process step, execute process
- **Documents** — List, get metadata, upload, move, and delete documents (package files for delivery)
- MCP server with stdio transport for Claude Code and compatible clients
- API key authentication via `X-API-Key` header
- Configurable base URL via `TEALFABRIC_API_URL` environment variable
