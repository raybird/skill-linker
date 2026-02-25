const chalk = require("chalk");
const path = require("path");
const {
  findRepos,
  listDirectories,
  dirExists,
} = require("../utils/file-system");
const { DEFAULT_LIB_PATH } = require("../utils/git");

/**
 * List command - shows repos and skills (CLI mode only)
 * @param {Object} options - Command options
 * @param {string} [options.repo] - Repository name to list
 * @param {boolean} [options.json] - Output as JSON
 */
async function list(options = {}) {
  const repoName = options.repo;
  const outputJson = options.json || false;

  if (!dirExists(DEFAULT_LIB_PATH)) {
    console.error(
      chalk.red("[ERROR]"),
      `Skill library not found: ${DEFAULT_LIB_PATH}`,
    );
    console.log(
      chalk.blue("[INFO]"),
      "Use --from <github_url> to clone skills first.",
    );
    process.exit(1);
  }

  const repos = findRepos(DEFAULT_LIB_PATH);

  if (repos.length === 0) {
    console.log(
      chalk.yellow("[WARNING]"),
      `No repos found in ${DEFAULT_LIB_PATH}`,
    );
    console.log(
      chalk.blue("[INFO]"),
      "Use --from <github_url> to clone skills first.",
    );
    return;
  }

  // CLI mode: use provided repo name
  if (repoName) {
    const selectedRepo = repos.find(
      (r) => r.name.toLowerCase() === repoName.toLowerCase(),
    );

    if (!selectedRepo) {
      console.error(chalk.red("[ERROR]"), `Repository not found: ${repoName}`);
      console.log(
        chalk.blue("[INFO]"),
        "Available repos:",
        repos.map((r) => r.name).join(", "),
      );
      process.exit(1);
    }

    if (outputJson) {
      const skills = selectedRepo.hasSkillsDir
        ? listDirectories(path.join(selectedRepo.path, "skills"))
        : [];
      console.log(
        JSON.stringify(
          {
            name: selectedRepo.name,
            path: selectedRepo.path,
            hasSkillsDir: selectedRepo.hasSkillsDir,
            skills: skills,
          },
          null,
          2,
        ),
      );
    } else {
      console.log("");
      console.log(
        chalk.blue("[INFO]"),
        `Repository: ${chalk.cyan(selectedRepo.name)}`,
      );
      console.log(chalk.dim(`Path: ${selectedRepo.path}`));
      console.log("");

      if (selectedRepo.hasSkillsDir) {
        const skillsDir = path.join(selectedRepo.path, "skills");
        const skills = listDirectories(skillsDir);

        if (skills.length === 0) {
          console.log(
            chalk.yellow("[WARNING]"),
            "No skills found in skills/ directory",
          );
          return;
        }

        console.log(chalk.blue("[INFO]"), "Skills in this repository:");
        console.log("");

        skills.forEach((skill, index) => {
          console.log(`  ${index + 1}. ${chalk.cyan(skill)}`);
          console.log(`     ${chalk.dim(path.join(skillsDir, skill))}`);
        });

        console.log("");
      } else {
        console.log(
          chalk.blue("[INFO]"),
          "This is a single-skill repository (no skills/ subdirectory)",
        );
        console.log(chalk.dim("The entire repository acts as one skill"));
        console.log("");
      }
    }
    return;
  }

  // No repo specified - list all repos
  if (outputJson) {
    console.log(
      JSON.stringify(
        repos.map((repo) => ({
          name: repo.name,
          path: repo.path,
          hasSkillsDir: repo.hasSkillsDir,
        })),
        null,
        2,
      ),
    );
  } else {
    console.log("");
    console.log(
      chalk.blue("[INFO]"),
      `Repositories in library (${DEFAULT_LIB_PATH}):`,
    );
    console.log("");

    repos.forEach((repo, index) => {
      const hasSkills = repo.hasSkillsDir ? chalk.dim(" (has skills/)") : "";
      console.log(`  ${index + 1}. ${chalk.cyan(repo.name)}${hasSkills}`);
      console.log(`     ${chalk.dim(repo.path)}`);
    });

    console.log("");
    console.log(
      chalk.blue("[INFO]"),
      "Use --repo <name> to list skills in a specific repo.",
    );
  }
}

module.exports = list;
