---
name: skill-linker
description: Install and manage AI Agent Skills for Claude, Cursor, OpenCode, Gemini and other AI coding assistants.
---

# Skill: skill-linker

## Overview

Install and manage AI Agent Skills for various AI coding assistants. This skill enables AI agents to discover and integrate new capabilities from the Agent Skills ecosystem.

## When to Use

- When you need to install new AI Agent Skills
- When you want to add capabilities to Claude Code, Cursor, OpenCode, or other AI assistants
- When you need to manage skill installations across multiple agents

## Installation

```bash
# Install from GitHub
npx skill-linker install --from <repo-url> --agent <agent-name> --scope both

# Install from local directory
npx skill-linker install --skill <path> --agent <agent-name> --scope both --yes
```

## Commands

```bash
# Install a skill from GitHub
npx skill-linker install --from https://github.com/owner/repo --agent opencode --scope both

# Install from local path
npx skill-linker install --skill ./my-skill --agent claude --scope project

# List installed skills
npx skill-linker list --agent opencode
```

## Supported Agents

| Agent    | Skill Directory     |
| -------- | ------------------- |
| opencode | `.opencode/skills/` |
| claude   | `.claude/skills/`   |
| cursor   | `.cursor/skills/`   |
| windsurf | `.windsurf/skills/` |
| gemini   | `.gemini/skills/`   |

## Options

| Option           | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `--from <url>`   | GitHub repository URL to install from                 |
| `--skill <path>` | Local skill directory path                            |
| `-a, --agent`    | Target agent (opencode/claude/cursor/windsurf/gemini) |
| `-s, --scope`    | Installation scope (project/global/both)              |
| `-y, --yes`      | Auto-confirm overwrites                               |

## Examples

```bash
# Install a skill for OpenCode
npx skill-linker install --from https://github.com/anthropics/skills --agent opencode --scope both

# Install for Claude Code globally
npx skill-linker install --from https://github.com/user/my-skill --agent claude --scope global

# Install from local directory
npx skill-linker install --skill /path/to/skill --agent opencode --scope both --yes
```

## Requirements

- Node.js >= 18.0.0
- Git installed

## Resources

- [GitHub Repository](https://github.com/raybird/skill-linker)
- [Agent Skills Specification](https://agentskills.io)
