---
name: skill-linker
description: Install and manage AI Agent Skills for Claude, Cursor, OpenCode, Gemini, Windsurf and other AI coding assistants. Use when you need to add new capabilities to your AI agent.
---

# Skill: skill-linker

A CLI tool to install and manage AI Agent Skills.

## When to Use This Skill

Use this skill when:

- Installing new AI Agent Skills from GitHub or local directories
- Adding capabilities to Claude, Cursor, OpenCode or other AI assistants
- Managing skill installations (project or global)

## Installation

```bash
# Install from GitHub
npx skill-linker install --from <url> --agent <agent> --scope both

# Install from local directory
npx skill-linker install --skill <path> --agent <agent> --scope both --yes
```

## Supported Agents

| Agent    | Skill Directory     |
| -------- | ------------------- |
| opencode | `.opencode/skills/` |
| claude   | `.claude/skills/`   |
| cursor   | `.cursor/skills/`   |
| gemini   | `.gemini/skills/`   |
| windsurf | `.windsurf/skills/` |

## Parameters

| Parameter        | Description                 |
| ---------------- | --------------------------- |
| `--from <url>`   | GitHub repository URL       |
| `--skill <path>` | Local skill directory       |
| `-a, --agent`    | Target agent                |
| `-s, --scope`    | Scope (project/global/both) |
| `-y, --yes`      | Auto overwrite              |

## Examples

```bash
# Install for OpenCode
npx skill-linker install --from https://github.com/user/repo --agent opencode --scope both

# Install for Claude
npx skill-linker install --from https://github.com/org/skills --agent claude --scope project

# Update existing skill
npx skill-linker install --from https://github.com/org/skills --agent opencode --scope both --yes
```
