import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const srcDir = join(root, "dist");
const destDir = join(root, "plugins", "tealfabric-mcp", "dist");

if (!existsSync(srcDir)) {
  console.error("sync-plugin-dist: root dist/ missing. Run tsc first.");
  process.exit(1);
}

if (existsSync(destDir)) {
  rmSync(destDir, { recursive: true });
}
mkdirSync(join(root, "plugins", "tealfabric-mcp"), { recursive: true });
cpSync(srcDir, destDir, { recursive: true });
console.log("sync-plugin-dist: copied dist/ -> plugins/tealfabric-mcp/dist/");
