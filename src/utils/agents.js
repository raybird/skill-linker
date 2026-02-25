const fs = require("fs");
const path = require("path");
const os = require("os");

/**
 * Supported AI Agent configurations
 * Format: { name, projectDir, globalDir, aliases }
 */
const AGENTS = [
  {
    name: "Claude Code",
    projectDir: ".claude/skills",
    globalDir: path.join(os.homedir(), ".claude/skills"),
    aliases: ["claude", "claude-code", "anthropic"],
  },
  {
    name: "GitHub Copilot",
    projectDir: ".github/skills",
    globalDir: path.join(os.homedir(), ".copilot/skills"),
    aliases: ["copilot", "github", "gh-copilot"],
  },
  {
    name: "Google Antigravity",
    projectDir: ".agent/skills",
    globalDir: path.join(os.homedir(), ".gemini/antigravity/skills"),
    aliases: ["antigravity", "gemini-antigravity"],
  },
  {
    name: "Cursor",
    projectDir: ".cursor/skills",
    globalDir: path.join(os.homedir(), ".cursor/skills"),
    aliases: ["cursor"],
  },
  {
    name: "OpenCode",
    projectDir: ".opencode/skill",
    globalDir: path.join(os.homedir(), ".config/opencode/skill"),
    aliases: ["opencode", "open-code"],
  },
  {
    name: "OpenAI Codex",
    projectDir: ".codex/skills",
    globalDir: path.join(os.homedir(), ".codex/skills"),
    aliases: ["codex", "openai", "openai-codex"],
  },
  {
    name: "Gemini CLI",
    projectDir: ".gemini/skills",
    globalDir: path.join(os.homedir(), ".gemini/skills"),
    aliases: ["gemini", "gemini-cli", "google-gemini"],
  },
  {
    name: "Windsurf",
    projectDir: ".windsurf/skills",
    globalDir: path.join(os.homedir(), ".codeium/windsurf/skills"),
    aliases: ["windsurf", "codeium"],
  },
];

/**
 * Find agent index by name or alias (case-insensitive)
 * @param {string} name - Agent name or alias
 * @returns {number|null} Agent index or null if not found
 */
function findAgentIndex(nameOrAlias) {
  const lower = nameOrAlias.toLowerCase();
  const idx = AGENTS.findIndex(
    (agent) =>
      agent.name.toLowerCase() === lower ||
      (agent.aliases &&
        agent.aliases.some((alias) => alias.toLowerCase() === lower)),
  );
  return idx !== -1 ? idx : null;
}

/**
 * Detect which agents are installed on the system
 * @returns {Array} List of detected agent indices
 */
function detectInstalledAgents() {
  const installed = [];

  AGENTS.forEach((agent, index) => {
    // Check if global directory exists
    if (fs.existsSync(agent.globalDir)) {
      installed.push(index);
    }
  });

  return installed;
}

/**
 * Get agent configuration by index
 * @param {number} index
 * @returns {Object} Agent configuration
 */
function getAgent(index) {
  return AGENTS[index];
}

/**
 * Get all agents
 * @returns {Array} All agent configurations
 */
function getAllAgents() {
  return AGENTS;
}

module.exports = {
  AGENTS,
  detectInstalledAgents,
  getAgent,
  getAllAgents,
  findAgentIndex,
};
