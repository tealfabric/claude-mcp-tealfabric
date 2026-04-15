import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const failures = [];
const rootPackageJsonPath = join(root, "package.json");
const rootPackageJson = existsSync(rootPackageJsonPath) ? readJson(rootPackageJsonPath) : null;

function fail(message) {
  failures.push(message);
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    fail(`Invalid JSON: ${relative(root, path)} (${err.message})`);
    return null;
  }
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const marketplacePath = join(root, ".claude-plugin", "marketplace.json");
if (!existsSync(marketplacePath)) {
  fail("Missing .claude-plugin/marketplace.json");
} else {
  const marketplace = readJson(marketplacePath);
  if (marketplace) {
    if (!marketplace.name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(marketplace.name)) {
      fail("marketplace.json needs a valid kebab-case name");
    }
    if (!marketplace.owner?.name) {
      fail("marketplace.json must include owner.name");
    }
    if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
      fail("marketplace.json must include a non-empty plugins array");
    } else {
      for (const plugin of marketplace.plugins) {
        if (!plugin?.name || !plugin?.source) {
          fail("Each marketplace plugin entry needs name and source");
          continue;
        }
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(plugin.name)) {
          fail(`Plugin name must be kebab-case: ${plugin.name}`);
        }
        const pluginDir =
          typeof plugin.source === "string" && plugin.source.startsWith("./")
            ? join(root, plugin.source.slice(2))
            : join(root, plugin.source);
        if (!existsSync(pluginDir)) {
          fail(`Plugin path missing: ${plugin.source}`);
          continue;
        }

        const pluginJsonPath = join(pluginDir, ".claude-plugin", "plugin.json");
        if (!existsSync(pluginJsonPath)) {
          fail(`Missing plugin manifest: ${relative(root, pluginJsonPath)}`);
          continue;
        }
        const pluginJson = readJson(pluginJsonPath);
        if (!pluginJson) continue;

        for (const required of ["name", "description", "version"]) {
          if (!pluginJson[required]) {
            fail(`Missing ${required} in ${relative(root, pluginJsonPath)}`);
          }
        }

        if (pluginJson.name !== plugin.name) {
          fail(
            `Plugin name mismatch: marketplace=${plugin.name}, plugin.json=${pluginJson.name}`
          );
        }

        if (
          rootPackageJson?.version &&
          pluginJson.version &&
          rootPackageJson.version !== pluginJson.version
        ) {
          fail(
            `Version mismatch: package.json=${rootPackageJson.version}, ${relative(root, pluginJsonPath)}=${pluginJson.version}`
          );
        }

        if (pluginJson.logo) {
          const logoPath = join(pluginDir, pluginJson.logo);
          if (!existsSync(logoPath)) {
            fail(`Logo path not found: ${relative(root, logoPath)}`);
          }
        }

        const mcpConfigPath = join(pluginDir, ".mcp.json");
        if (!existsSync(mcpConfigPath)) {
          fail(`Missing plugin MCP config: ${relative(root, mcpConfigPath)}`);
        } else {
          const mcp = readJson(mcpConfigPath);
          const servers = mcp?.mcpServers;
          if (!servers || typeof servers !== "object") {
            fail(`${relative(root, mcpConfigPath)} must define mcpServers object`);
          } else {
            for (const [key, cfg] of Object.entries(servers)) {
              if (!cfg || typeof cfg !== "object") {
                fail(`Invalid mcpServers entry: ${key}`);
                continue;
              }
              if (cfg.type === "stdio" || !cfg.type) {
                if (!cfg.command) {
                  fail(`stdio server "${key}" missing command in .mcp.json`);
                }
                const args = cfg.args;
                if (!Array.isArray(args) || !args.some((a) => String(a).includes("${CLAUDE_PLUGIN_ROOT}"))) {
                  fail(
                    `stdio server "${key}" should use \${CLAUDE_PLUGIN_ROOT} in args for portable plugin installs`
                  );
                }
              }
            }
          }
        }

        const pluginDist = join(pluginDir, "dist", "index.js");
        if (!existsSync(pluginDist)) {
          fail(
            `Missing ${relative(root, pluginDist)} — run npm run build (copies dist into the plugin directory)`
          );
        }

        for (const contentFolder of ["skills", "agents"]) {
          const folderPath = join(pluginDir, contentFolder);
          if (!existsSync(folderPath)) continue;
          const files = walk(folderPath).filter((f) => statSync(f).isFile());
          for (const file of files) {
            if (!file.endsWith(".md")) continue;
            const text = readFileSync(file, "utf8");
            if (!text.startsWith("---")) {
              fail(`Missing frontmatter in ${relative(root, file)}`);
            }
          }
        }
      }
    }
  }
}

if (failures.length) {
  console.error("Template validation failed:");
  for (const msg of failures) console.error(`- ${msg}`);
  process.exit(1);
}

console.log("Template validation passed.");
