# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ 最重要規則

**Git commit 訊息絕對不可包含 `Co-Authored-By: Claude` 或任何 AI 署名資訊。** 只寫功能描述，不附加任何尾行。

## What this is

`skill-linker` is a published npm CLI (`npx skill-linker`) that **symlinks** AI Agent Skill directories into the skill folders of various AI coding agents (Claude Code, Copilot, Cursor, Gemini, etc.). It links, it does not copy — edits to the source skill propagate to every agent immediately.

## Commands

```bash
npm install            # install deps (chalk, commander, execa)
npm link               # expose the `skill-linker` command locally for testing
node bin/cli.js <args> # run the CLI directly without linking

# Exercise the two subcommands:
node bin/cli.js install --skill <path> --agent claude --scope both --yes
node bin/cli.js install --from <github-url> --agent claude cursor --scope both
node bin/cli.js list
node bin/cli.js list --repo owner/repo --json
```

There is **no test suite** (`npm test` is a stub) and no lint/build step. Verify changes by running the CLI against a throwaway skill directory.

## Architecture

Entry: `bin/cli.js` → `src/cli.js` (commander setup, defines `install` and `list`). Each command delegates to `src/commands/` and shared logic lives in `src/utils/`.

- **`src/utils/agents.js`** — the `AGENTS` array is the **single source of truth** for every supported agent: its display name, `projectDir`, `globalDir`, and lookup `aliases`. To add or change a supported agent, edit this array only; commands and the README table follow from it. `findAgentIndex` resolves a user-supplied name/alias to an index.
- **`src/utils/git.js`** — `parseGitHubUrl` understands both plain repo URLs and `/tree/<branch>/<subpath>` URLs. Clones land under `DEFAULT_LIB_PATH` (`~/Documents/AgentSkills`) in an **`owner/repo/` layout**. Clones are shallow (`--depth 1`).
- **`src/utils/file-system.js`** — symlink creation (force-removes any existing target first) plus the library scanners. `findRepos` walks the `owner/repo` layout; a repo with a `skills/` subdirectory is a **multi-skill repo**, otherwise the whole repo is one skill.

### Two install paths (`src/commands/install.js`)

1. `--skill <path>`: link a single local directory.
2. `--from <url>`: clone (or, with `--yes`, `git pull --rebase` if it already exists) into the library, then link. If the cloned repo has a `skills/` subdirectory and no explicit subpath was given, **every** subdirectory under `skills/` is linked.

Agent selection: if `--agent` is omitted, the CLI links to *all detected* agents (`detectInstalledAgents` = those whose `globalDir` exists). Scope defaults to `both` (project dir under cwd + global dir).

## Skill self-definition

This repo ships its own Agent Skill so it can install itself. The canonical, published copy is **`skills/skill-linker/SKILL.md`** (only `skills/` is listed in `package.json` `files`). `skill-linker/SKILL.md` at the repo root is a stale duplicate — prefer editing the one under `skills/`.

`legacy-link-skill.sh` is the original interactive Bash implementation, superseded by the Node CLI. Keep it for reference; new behavior goes in `src/`.

## Releasing

Publishing is automated: pushing a `v*` git tag triggers `.github/workflows/publish.yml`, which runs `npm publish --provenance`. Use the helper rather than tagging by hand:

```bash
./release.sh patch   # or minor / major — bumps package.json, commits, tags, pushes
```

See `RELEASE_SOP.md` for the version-bump rules.
