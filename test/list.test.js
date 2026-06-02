const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const list = require("../src/commands/list");

let tmp;
let logs;
let origLog;
let origErr;
let origExit;
let exitCode;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "skill-linker-list-"));
  logs = [];
  origLog = console.log;
  origErr = console.error;
  origExit = process.exit;
  // Capture output so JSON assertions are possible.
  console.log = (...args) => logs.push(args.join(" "));
  console.error = (...args) => logs.push(args.join(" "));
  exitCode = null;
  process.exit = (code) => {
    exitCode = code;
    throw new Error("__exit__");
  };
});

afterEach(() => {
  console.log = origLog;
  console.error = origErr;
  process.exit = origExit;
  fs.rmSync(tmp, { recursive: true, force: true });
});

function seedLibrary() {
  fs.mkdirSync(path.join(tmp, "anthropics", "skills", "skills", "pdf"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(tmp, "anthropics", "skills", "skills", "docx"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(tmp, "someone", "solo"), { recursive: true });
}

test("list: exits 1 when the library does not exist", async () => {
  await assert.rejects(
    () => list({ libPath: path.join(tmp, "missing") }),
    /__exit__/,
  );
  assert.strictEqual(exitCode, 1);
});

test("list --json: outputs the repos in the library", async () => {
  seedLibrary();
  await list({ libPath: tmp, json: true });

  const parsed = JSON.parse(logs.join("\n"));
  const names = parsed.map((r) => r.name).sort();
  assert.deepStrictEqual(names, ["anthropics/skills", "someone/solo"]);
});

test("list --skills --json: flat-lists every skill", async () => {
  seedLibrary();
  await list({ libPath: tmp, skills: true, json: true });

  const parsed = JSON.parse(logs.join("\n"));
  const names = parsed.map((s) => s.name).sort();
  assert.deepStrictEqual(names, [
    "anthropics/skills/docx",
    "anthropics/skills/pdf",
    "someone/solo",
  ]);
});

test("list --repo --json: lists skills inside a multi-skill repo", async () => {
  seedLibrary();
  await list({ libPath: tmp, repo: "anthropics/skills", json: true });

  const parsed = JSON.parse(logs.join("\n"));
  assert.strictEqual(parsed.name, "anthropics/skills");
  assert.strictEqual(parsed.hasSkillsDir, true);
  assert.deepStrictEqual(parsed.skills.sort(), ["docx", "pdf"]);
});

test("list --repo: exits 1 for an unknown repo", async () => {
  seedLibrary();
  await assert.rejects(
    () => list({ libPath: tmp, repo: "nope/nope" }),
    /__exit__/,
  );
  assert.strictEqual(exitCode, 1);
});
