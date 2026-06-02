const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  createSymlink,
  listDirectories,
  findRepos,
  findSkills,
} = require("../src/utils/file-system");

let tmp;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "skill-linker-test-"));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

test("createSymlink: links a source directory", () => {
  const src = path.join(tmp, "src-skill");
  const target = path.join(tmp, "links", "src-skill");
  fs.mkdirSync(src);

  assert.strictEqual(createSymlink(src, target), true);
  assert.strictEqual(fs.lstatSync(target).isSymbolicLink(), true);
  assert.strictEqual(fs.realpathSync(target), fs.realpathSync(src));
});

test("createSymlink: resolves a relative source into a working link", () => {
  // Regression: a relative source must not be stored verbatim, or the link
  // resolves relative to its own directory and breaks.
  const cwd = process.cwd();
  try {
    process.chdir(tmp);
    fs.mkdirSync("rel-skill");
    fs.writeFileSync(path.join("rel-skill", "SKILL.md"), "content");
    const target = path.join(tmp, "links", "rel-skill");

    assert.strictEqual(createSymlink("./rel-skill", target), true);
    // The link must be readable through, i.e. it points at the real dir.
    assert.strictEqual(
      fs.readFileSync(path.join(target, "SKILL.md"), "utf8"),
      "content",
    );
    assert.strictEqual(path.isAbsolute(fs.readlinkSync(target)), true);
  } finally {
    process.chdir(cwd);
  }
});

test("createSymlink: replaces an existing symlink", () => {
  const oldSrc = path.join(tmp, "old");
  const newSrc = path.join(tmp, "new");
  const target = path.join(tmp, "link");
  fs.mkdirSync(oldSrc);
  fs.mkdirSync(newSrc);

  assert.strictEqual(createSymlink(oldSrc, target), true);
  assert.strictEqual(createSymlink(newSrc, target), true);
  assert.strictEqual(fs.realpathSync(target), fs.realpathSync(newSrc));
});

test("createSymlink: refuses to overwrite a real directory", () => {
  const src = path.join(tmp, "src");
  const target = path.join(tmp, "real-dir");
  fs.mkdirSync(src);
  fs.mkdirSync(target);
  fs.writeFileSync(path.join(target, "keep.txt"), "important");

  assert.strictEqual(createSymlink(src, target), false);
  // The real directory and its contents must be untouched.
  assert.strictEqual(fs.lstatSync(target).isDirectory(), true);
  assert.strictEqual(
    fs.readFileSync(path.join(target, "keep.txt"), "utf8"),
    "important",
  );
});

test("listDirectories: returns only directories", () => {
  fs.mkdirSync(path.join(tmp, "a"));
  fs.mkdirSync(path.join(tmp, "b"));
  fs.writeFileSync(path.join(tmp, "file.txt"), "x");

  assert.deepStrictEqual(listDirectories(tmp).sort(), ["a", "b"]);
});

test("listDirectories: missing path returns empty array", () => {
  assert.deepStrictEqual(listDirectories(path.join(tmp, "nope")), []);
});

test("findRepos: discovers owner/repo layout and skills/ flag", () => {
  // owner1/multi has a skills/ subdir; owner1/single does not.
  fs.mkdirSync(path.join(tmp, "owner1", "multi", "skills"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(tmp, "owner1", "single"), { recursive: true });

  const repos = findRepos(tmp).sort((a, b) => a.name.localeCompare(b.name));
  assert.strictEqual(repos.length, 2);

  const multi = repos.find((r) => r.name === "owner1/multi");
  const single = repos.find((r) => r.name === "owner1/single");
  assert.strictEqual(multi.hasSkillsDir, true);
  assert.strictEqual(single.hasSkillsDir, false);
});

test("findSkills: expands multi-skill repos, keeps single-skill repos whole", () => {
  fs.mkdirSync(path.join(tmp, "org", "bundle", "skills", "pdf"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(tmp, "org", "bundle", "skills", "docx"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(tmp, "org", "solo"), { recursive: true });

  const names = findSkills(tmp)
    .map((s) => s.name)
    .sort();
  assert.deepStrictEqual(names, [
    "org/bundle/docx",
    "org/bundle/pdf",
    "org/solo",
  ]);
});
