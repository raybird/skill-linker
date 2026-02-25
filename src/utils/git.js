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
  let branch = "main";

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
 * Clone a GitHub repository
 * @param {string} url - GitHub URL
 * @param {string} targetPath - Target directory
 * @param {boolean} shallow - Use shallow clone (default true)
 * @returns {Promise<void>}
 */
async function cloneRepo(url, targetPath, shallow = true) {
  try {
    const args = shallow
      ? ["clone", "--depth", "1", url, targetPath]
      : ["clone", url, targetPath];
    await execa("git", args);
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
    // Clone new repo
    await cloneRepo(parsed.cleanUrl, targetPath);
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
  cloneRepo,
  pullRepo,
  cloneOrUpdateRepo,
};
