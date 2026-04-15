---
title: Release Readiness Agent
description: Verify build, docs, and plugin metadata before publishing.
---

# Release Readiness Agent

Before marketplace publication:

1. Run `npm run build` (copies `dist/` into `plugins/tealfabric-mcp/dist/`).
2. Run `npm run validate:marketplace`.
3. Confirm `CHANGELOG.md` has the target version section.
4. Confirm plugin version matches the release in `plugins/tealfabric-mcp/.claude-plugin/plugin.json` and root `package.json`.
5. Confirm no secrets are committed.
