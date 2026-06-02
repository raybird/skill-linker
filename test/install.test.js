const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const install = require("../src/commands/install");

let tmp;
let cwd;
let origLog;
let origErr;
let origExit;
let exitCode;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "skill-linker-install-"));
  cwd = process.cwd();
  process.chdir(tmp);

  // Silence command output and capture process.exit without killing the run.
  origLog = console.log;
  origErr = console.error;
  origExit = process.exit;
  console.log = () => {};
  console.error = () => {};
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
  process.chdir(cwd);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test("install: links a local skill into the project scope", async () => {
  fs.mkdirSync(path.join(tmp, "my-skill"));

  await install({
    skill: path.join(tmp, "my-skill"),
    agents: ["claude"],
    scope: "project",
    yes: true,
  });

  const link = path.join(tmp, ".claude", "skills", "my-skill");
  assert.strictEqual(fs.lstatSync(link).isSymbolicLink(), true);
});

test("install: resolves the agent alias (anthropic -> Claude Code)", async () => {
  fs.mkdirSync(path.join(tmp, "my-skill"));

  await install({
    skill: path.join(tmp, "my-skill"),
    agents: ["anthropic"],
    scope: "project",
    yes: true,
  });

  assert.strictEqual(
    fs.existsSync(path.join(tmp, ".claude", "skills", "my-skill")),
    true,
  );
});

test("install: exits 1 when no source is provided", async () => {
  await assert.rejects(
    () => install({ agents: ["claude"], scope: "project", yes: true }),
    /__exit__/,
  );
  assert.strictEqual(exitCode, 1);
});

test("install: exits 1 when a non-existent skill path is given", async () => {
  await assert.rejects(
    () =>
      install({
        skill: path.join(tmp, "does-not-exist"),
        agents: ["claude"],
        scope: "project",
        yes: true,
      }),
    /__exit__/,
  );
  assert.strictEqual(exitCode, 1);
});

test("install: exits 1 when a link fails (real dir already at target)", async () => {
  fs.mkdirSync(path.join(tmp, "my-skill"));
  // A real directory sits where the symlink should go; createSymlink refuses
  // to delete it, so the run must report failure via a non-zero exit.
  fs.mkdirSync(path.join(tmp, ".claude", "skills", "my-skill"), {
    recursive: true,
  });

  await assert.rejects(
    () =>
      install({
        skill: path.join(tmp, "my-skill"),
        agents: ["claude"],
        scope: "project",
        yes: true,
      }),
    /__exit__/,
  );
  assert.strictEqual(exitCode, 1);
});
