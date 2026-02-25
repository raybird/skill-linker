const chalk = require("chalk");
const path = require("path");
const {
  dirExists,
  ensureDir,
  createSymlink,
  listDirectories,
} = require("../utils/file-system");
const {
  getAllAgents,
  detectInstalledAgents,
  findAgentIndex,
} = require("../utils/agents");
const { cloneOrUpdateRepo, pullRepo } = require("../utils/git");

/**
 * Main install command (CLI mode only)
 * @param {Object} options - Command options
 * @param {string} options.skill - Skill path or --from clone URL
 * @param {string} [options.from] - GitHub URL to clone from
 * @param {string[]} [options.agents] - Agent names to install to
 * @param {string} [options.scope] - Scope: project, global, or both
 * @param {boolean} [options.yes] - Auto-overwrite existing links
 */
async function install(options) {
  let skillPaths = [];

  // Handle --from flag: Clone from GitHub
  if (options.from) {
    console.log(chalk.blue("[INFO]"), `Cloning from ${options.from}...`);

    try {
      const {
        skillPath: clonedPath,
        targetPath,
        needsUpdate,
        hasSubpath,
      } = await cloneOrUpdateRepo(options.from);

      if (needsUpdate) {
        if (options.yes) {
          await pullRepo(targetPath);
          console.log(chalk.green("[SUCCESS]"), "Repository updated!");
        } else {
          console.log(
            chalk.yellow("[WARNING]"),
            "Repository already exists. Use --yes to update.",
          );
        }
      }

      // If no subpath, check for skills/ subdirectory
      if (!hasSubpath && dirExists(path.join(targetPath, "skills"))) {
        const subSkills = listDirectories(path.join(targetPath, "skills"));

        if (subSkills.length > 0) {
          // Install all skills from skills/ directory
          skillPaths = subSkills.map((s) => path.join(targetPath, "skills", s));
        } else {
          skillPaths = [targetPath];
        }
      } else {
        skillPaths = [clonedPath];
      }

      console.log(chalk.green("[SUCCESS]"), "Clone completed!");
    } catch (error) {
      console.error(chalk.red("[ERROR]"), error.message);
      process.exit(1);
    }
  }

  // If no skill path provided via --from, use --skill
  if (skillPaths.length === 0 && options.skill) {
    skillPaths = [options.skill];
  }

  // Validate skill paths
  for (const p of skillPaths) {
    if (!dirExists(p)) {
      console.error(chalk.red("[ERROR]"), `Skill directory not found: ${p}`);
      process.exit(1);
    }
  }

  if (skillPaths.length > 1) {
    console.log(chalk.blue("[INFO]"), `Selected ${skillPaths.length} skills`);
  } else {
    const skillName = path.basename(skillPaths[0]);
    console.log(
      chalk.blue("[INFO]"),
      `Selected Skill: ${chalk.cyan(skillName)} (${skillPaths[0]})`,
    );
  }

  // Agent selection
  const agents = getAllAgents();
  const installedIndices = detectInstalledAgents();

  let selectedAgents = [];

  // Use provided agents list
  if (options.agents && options.agents.length > 0) {
    selectedAgents = options.agents
      .map((agentName) => {
        const idx = findAgentIndex(agentName);
        if (idx === null) {
          console.log(
            chalk.yellow("[WARNING]"),
            `Unknown agent: ${agentName}, skipping...`,
          );
          return null;
        }
        return idx;
      })
      .filter((idx) => idx !== null);

    if (selectedAgents.length === 0) {
      console.error(chalk.red("[ERROR]"), "No valid agents specified");
      process.exit(1);
    }
  } else {
    // Use all installed agents
    selectedAgents = installedIndices;
    if (selectedAgents.length === 0) {
      console.error(
        chalk.red("[ERROR]"),
        "No installed agents detected. Please specify --agent.",
      );
      process.exit(1);
    }
  }

  console.log(
    chalk.blue("[INFO]"),
    `Installing to ${selectedAgents.length} agent(s): ${selectedAgents.map((i) => agents[i].name).join(", ")}`,
  );

  // Determine scope
  let scope = options.scope ? options.scope.toLowerCase() : "both";
  if (!["project", "global", "both"].includes(scope)) {
    console.error(
      chalk.red("[ERROR]"),
      `Invalid scope: ${scope}. Use: project, global, or both`,
    );
    process.exit(1);
  }
  console.log(chalk.blue("[INFO]"), `Scope: ${scope}`);

  // Process each selected agent
  for (const agentIndex of selectedAgents) {
    const agent = agents[agentIndex];

    console.log("");
    console.log(
      chalk.blue("[INFO]"),
      `Configuring for ${chalk.cyan(agent.name)}...`,
    );

    const targets = [];
    if (scope === "project" || scope === "both") {
      targets.push(path.join(process.cwd(), agent.projectDir));
    }
    if (scope === "global" || scope === "both") {
      targets.push(agent.globalDir);
    }

    for (const targetBase of targets) {
      ensureDir(targetBase);

      // Loop through all selected skills and link them
      for (const sPath of skillPaths) {
        const sName = path.basename(sPath);
        const targetLink = path.join(targetBase, sName);

        if (dirExists(targetLink)) {
          if (!options.yes) {
            console.log(
              chalk.yellow("[WARNING]"),
              `Already exists: ${targetLink}. Use --yes to overwrite.`,
            );
            continue;
          }
          console.log(
            chalk.blue("[INFO]"),
            `Overwriting existing: ${targetLink}`,
          );
        }

        if (createSymlink(sPath, targetLink)) {
          console.log(chalk.green("[SUCCESS]"), `Linked ${sName}`);
        } else {
          console.error(chalk.red("[ERROR]"), `Failed to link ${sName}`);
        }
      }
    }
  }

  console.log("");
  console.log(chalk.green("[SUCCESS]"), "All operations completed.");
}

module.exports = install;
