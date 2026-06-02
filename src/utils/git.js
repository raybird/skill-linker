const execa = require("execa");
const path = require("path");
const os = require("os");
const { dirExists } = require("./file-system");

const DEFAULT_LIB_PATH = path.join(os.homedir(), "Documents/AgentSkills");

/**
 * Parse GitHub URL to extract owner, repo, branch, and subpath
 * @param {string} url - GitHub URL
 * @returns {Object} Parsed components
 */
function parseGitHubUrl(url) {
  let cleanUrl = url;
  let subpath = "";
  // null means "no explicit branch" — let git use the remote default.
  let branch = null;

  // Check for /tree/branch/path format
  const treeMatch = url.match(/(.+)\/tree\/([^/]+)\/(.+)$/);
  if (treeMatch) {
    cleanUrl = treeMatch[1];
    branch = treeMatch[2];
    subpath = treeMatch[3];
  }

  // Extract owner/repo
  const repoMatch = cleanUrl.match(/github\.com[/:]([^/]+)\/([^/]+?)(\.git)?$/);

  if (!repoMatch) {
    throw new Error("Invalid GitHub URL format");
  }

  return {
    owner: repoMatch[1],
    repo: repoMatch[2].replace(".git", ""),
    branch,
    subpath,
    cleanUrl,
  };
}

/**
 * Build the argument list for `git clone`.
 * @param {string} url - GitHub URL
 * @param {string} targetPath - Target directory
 * @param {Object} [opts]
 * @param {boolean} [opts.shallow] - Use shallow clone (default true)
 * @param {string|null} [opts.branch] - Branch to check out, or null for default
 * @returns {string[]} git arguments
 */
function buildCloneArgs(url, targetPath, { shallow = true, branch = null } = {}) {
  const args = ["clone"];
  if (shallow) {
    args.push("--depth", "1");
  }
  if (branch) {
    args.push("--branch", branch);
  }
  args.push(url, targetPath);
  return args;
}

/**
 * Clone a GitHub repository
 * @param {string} url - GitHub URL
 * @param {string} targetPath - Target directory
 * @param {boolean} shallow - Use shallow clone (default true)
 * @param {string|null} branch - Branch to check out, or null for default
 * @returns {Promise<void>}
 */
async function cloneRepo(url, targetPath, shallow = true, branch = null) {
  try {
    await execa("git", buildCloneArgs(url, targetPath, { shallow, branch }));
  } catch (error) {
    throw new Error(`Failed to clone repository: ${error.message}`);
  }
}

/**
 * Pull latest changes in a repository
 * @param {string} repoPath - Path to repository
 * @returns {Promise<void>}
 */
async function pullRepo(repoPath) {
  try {
    await execa("git", ["-C", repoPath, "pull", "--rebase"]);
  } catch (error) {
    throw new Error(`Failed to pull repository: ${error.message}`);
  }
}

/**
 * Clone or update a GitHub repository
 * @param {string} url - GitHub URL
 * @returns {Promise<{skillPath: string, needsUpdate: boolean}>}
 */
async function cloneOrUpdateRepo(url) {
  const parsed = parseGitHubUrl(url);
  const targetPath = path.join(DEFAULT_LIB_PATH, parsed.owner, parsed.repo);

  let needsUpdate = false;

  if (dirExists(targetPath)) {
    // Repo exists, ask if user wants to update
    needsUpdate = true;
  } else {
    // Clone new repo (honour an explicit branch from /tree/<branch>/ URLs)
    await cloneRepo(parsed.cleanUrl, targetPath, true, parsed.branch);
  }

  // Determine final skill path
  let skillPath = targetPath;
  if (parsed.subpath) {
    skillPath = path.join(targetPath, parsed.subpath);
  }

  return {
    skillPath,
    targetPath,
    needsUpdate,
    hasSubpath: !!parsed.subpath,
  };
}

module.exports = {
  DEFAULT_LIB_PATH,
  parseGitHubUrl,
  buildCloneArgs,
  cloneRepo,
  pullRepo,
  cloneOrUpdateRepo,
};
