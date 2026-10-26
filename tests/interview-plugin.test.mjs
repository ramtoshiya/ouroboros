import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const source = fileURLToPath(new URL("../plugins/ouroboros-interview/", import.meta.url));

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    assert.ok(!entry.isSymbolicLink(), `Distribution contains a link: ${path}`);
    return entry.isDirectory() ? files(path) : [path];
  });
}

test("the isolated distribution contains self-contained interview and unstuck skills with no runtime integrations", (t) => {
  const workspace = mkdtempSync(join(tmpdir(), "ouroboros-interview-check-"));
  t.after(() => rmSync(workspace, { recursive: true, force: true }));
  const installed = join(workspace, "plugin");
  cpSync(source, installed, { recursive: true });

  const manifest = JSON.parse(readFileSync(join(installed, ".claude-plugin/plugin.json"), "utf8"));
  assert.equal(manifest.name, "ouroboros-interview");
  const allowedFields = new Set(["name", "description", "author", "repository", "license", "skills"]);
  assert.deepEqual(Object.keys(manifest).filter((key) => !allowedFields.has(key)), []);
  assert.equal(typeof manifest.skills, "string");
  assert.ok(!isAbsolute(manifest.skills));
  const skillRoot = resolve(installed, manifest.skills);
  assert.ok(skillRoot.startsWith(`${installed}${sep}`));
  const skillNames = readdirSync(skillRoot).filter((name) => statSync(join(skillRoot, name)).isDirectory());
  assert.deepEqual(skillNames, ["interview", "unstuck"]);
  for (const skillName of skillNames) {
    const skill = readFileSync(join(skillRoot, `${skillName}/SKILL.md`), "utf8");
    assert.match(skill, new RegExp(`^---\\nname: ${skillName}\\n`));
  }
  assert.equal(manifest.license, "MIT");
  assert.match(readFileSync(join(installed, "LICENSE"), "utf8"), /Copyright \(c\) 2025 Q00/);

  const paths = files(installed);
  for (const path of paths) {
    const name = relative(installed, path);
    assert.ok(name === "LICENSE" || /\.(?:md|json)$/.test(name), `Unexpected runtime file: ${name}`);
    assert.ok(!/(?:^|\/)(?:hooks|\.mcp\.json|settings\.json)(?:\/|$)/.test(name), `Unexpected integration: ${name}`);
    if (!path.endsWith(".md")) continue;
    const text = readFileSync(path, "utf8");
    for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1].split("#")[0];
      if (!target || /^https?:\/\//.test(target)) continue;
      assert.ok(!isAbsolute(target), `Non-portable reference in ${name}: ${target}`);
      const resolved = resolve(dirname(path), target);
      assert.ok(resolved.startsWith(`${installed}${sep}`), `Reference escapes the plugin: ${target}`);
      assert.ok(statSync(resolved).isFile(), `Missing reference in ${name}: ${target}`);
    }
    if (!name.startsWith(`skills${sep}`)) continue;
    assert.doesNotMatch(text, /\b(?:MCP|uvx|mcp_tool|mcp_args|call_mcp|OUROBOROS_AGENTS_DIR|ouroboros_\w+)\b|\booo\s+(?:seed|run|setup|config|update)\b/);
  }
});
