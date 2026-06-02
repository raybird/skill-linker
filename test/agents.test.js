const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  findAgentIndex,
  detectInstalledAgents,
  getAllAgents,
} = require("../src/utils/agents");

test("findAgentIndex: resolves names and aliases case-insensitively", () => {
  const agents = getAllAgents();
  assert.strictEqual(agents[findAgentIndex("claude")].name, "Claude Code");
  assert.strictEqual(agents[findAgentIndex("anthropic")].name, "Claude Code");
  assert.strictEqual(agents[findAgentIndex("GH-Copilot")].name, "GitHub Copilot");
  assert.strictEqual(findAgentIndex("nonexistent-agent"), null);
});

let tmp;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "skill-linker-agents-"));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

test("detectInstalledAgents: detects an agent by its project skills dir", () => {
  const agents = getAllAgents();
  const cursorIdx = findAgentIndex("cursor");

  // Create only the project-scope skills dir for Cursor inside the temp cwd.
  fs.mkdirSync(path.join(tmp, agents[cursorIdx].projectDir), {
    recursive: true,
  });

  const detected = detectInstalledAgents(tmp);
  assert.ok(
    detected.includes(cursorIdx),
    "cursor should be detected via its project skills directory",
  );
});
