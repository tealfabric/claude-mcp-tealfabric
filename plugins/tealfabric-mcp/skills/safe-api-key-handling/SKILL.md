---
name: Tealfabric Safe API Key Handling
description: Keep Tealfabric API credentials out of source control and logs when using the Tealfabric MCP server.
---

# Safe API key handling

- Never commit real values for `TEALFABRIC_API_KEY`.
- Prefer environment variables or your shell profile for secrets; for project `.mcp.json`, use `${TEALFABRIC_API_KEY}` expansion and set the variable outside Git.
- Do not paste API keys into code, docs, issues, or commits.
- When sharing config, use placeholders like `tf_live_...` or `${TEALFABRIC_API_KEY}`.
