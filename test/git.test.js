const { test } = require("node:test");
const assert = require("node:assert");

const { parseGitHubUrl } = require("../src/utils/git");

test("parseGitHubUrl: plain https URL", () => {
  const r = parseGitHubUrl("https://github.com/anthropics/skills");
  assert.strictEqual(r.owner, "anthropics");
  assert.strictEqual(r.repo, "skills");
  assert.strictEqual(r.branch, "main");
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
