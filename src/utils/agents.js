const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Supported AI Agent configurations
 * Format: { name, projectDir, globalDir }
 */
const AGENTS = [
    {
        name: 'Claude Code',
        projectDir: '.claude/skills',
        globalDir: path.join(os.homedir(), '.claude/skills')
    },
    {
        name: 'GitHub Copilot',
        projectDir: '.github/skills',
        globalDir: path.join(os.homedir(), '.copilot/skills')
    },
    {
        name: 'Google Antigravity',
        projectDir: '.agent/skills',
        globalDir: path.join(os.homedir(), '.gemini/antigravity/skills')
    },
    {
        name: 'Cursor',
        projectDir: '.cursor/skills',
        globalDir: path.join(os.homedir(), '.cursor/skills')
    },
    {
        name: 'OpenCode',
        projectDir: '.opencode/skill',
        globalDir: path.join(os.homedir(), '.config/opencode/skill')
    },
    {
        name: 'OpenAI Codex',
        projectDir: '.codex/skills',
        globalDir: path.join(os.homedir(), '.codex/skills')
    },
    {
        name: 'Gemini CLI',
        projectDir: '.gemini/skills',
        globalDir: path.join(os.homedir(), '.gemini/skills')
    },
    {
        name: 'Windsurf',
        projectDir: '.windsurf/skills',
        globalDir: path.join(os.homedir(), '.codeium/windsurf/skills')
    }
];

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
    getAllAgents
};
