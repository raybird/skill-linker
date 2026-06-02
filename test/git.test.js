const { test } = require("node:test");
const assert = require("node:assert");

const { parseGitHubUrl, buildCloneArgs } = require("../src/utils/git");

test("parseGitHubUrl: plain https URL has no explicit branch", () => {
  const r = parseGitHubUrl("https://github.com/anthropics/skills");
  assert.strictEqual(r.owner, "anthropics");
  assert.strictEqual(r.repo, "skills");
  assert.strictEqual(r.branch, null);
  assert.strictEqual(r.subpath, "");
});

test("parseGitHubUrl: strips .git suffix", () => {
  const r = parseGitHubUrl("https://github.com/owner/my-repo.git");
  assert.strictEqual(r.owner, "owner");
  assert.strictEqual(r.repo, "my-repo");
});

test("parseGitHubUrl: SSH-style URL", () => {
  const r = parseGitHubUrl("git@github.com:owner/my-repo.git");
  assert.strictEqual(r.owner, "owner");
  assert.strictEqual(r.repo, "my-repo");
});

test("parseGitHubUrl: /tree/<branch>/<subpath> form", () => {
  const r = parseGitHubUrl(
    "https://github.com/anthropics/skills/tree/main/skills/pdf",
  );
  assert.strictEqual(r.owner, "anthropics");
  assert.strictEqual(r.repo, "skills");
  assert.strictEqual(r.branch, "main");
  assert.strictEqual(r.subpath, "skills/pdf");
  assert.strictEqual(r.cleanUrl, "https://github.com/anthropics/skills");
});

test("parseGitHubUrl: non-default branch in tree form", () => {
  const r = parseGitHubUrl(
    "https://github.com/owner/repo/tree/dev/path/to/skill",
  );
  assert.strictEqual(r.branch, "dev");
  assert.strictEqual(r.subpath, "path/to/skill");
});

test("parseGitHubUrl: invalid URL throws", () => {
  assert.throws(() => parseGitHubUrl("not-a-github-url"), /Invalid GitHub URL/);
});

test("buildCloneArgs: shallow clone without branch", () => {
  assert.deepStrictEqual(buildCloneArgs("URL", "DEST"), [
    "clone",
    "--depth",
    "1",
    "URL",
    "DEST",
  ]);
});

test("buildCloneArgs: passes --branch when a branch is given", () => {
  // Regression: a /tree/<branch>/ URL must actually clone that branch.
  assert.deepStrictEqual(
    buildCloneArgs("URL", "DEST", { branch: "dev" }),
    ["clone", "--depth", "1", "--branch", "dev", "URL", "DEST"],
  );
});

test("buildCloneArgs: omits --branch when branch is null", () => {
  const args = buildCloneArgs("URL", "DEST", { branch: null });
  assert.ok(!args.includes("--branch"));
});

test("buildCloneArgs: non-shallow clone omits --depth", () => {
  const args = buildCloneArgs("URL", "DEST", { shallow: false });
  assert.ok(!args.includes("--depth"));
});
