#!/usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");
const install = require("./commands/install");
const list = require("./commands/list");

// Package info
const packageJson = require("../package.json");

program
  .name("skill-linker")
  .description(
    "CLI to link AI Agent Skills to various agents (Claude, Copilot, Antigravity, Cursor, etc.)",
  )
  .version(packageJson.version);

// Install command
program
  .command("install")
  .description("Install a skill to specified agents")
  .requiredOption(
    "--skill <path>",
    "Path to skill directory or --from clone URL",
  )
  .option("--from <github-url>", "Clone skill from GitHub URL first, then link")
  .option(
    "-a, --agent <names...>",
    "Agent names to install to (opencode, claude, cursor, etc.)",
  )
  .option("-s, --scope <scope>", "Scope: project, global, or both")
  .option("-y, --yes", "Skip confirmation prompts")
  .action(async (options) => {
    await install({
      skill: options.skill,
      from: options.from,
      agents: options.agent,
      scope: options.scope,
      yes: options.yes || false,
    });
  });

// List command
program
  .command("list")
  .description("List available skills in library")
  .option("-r, --repo <name>", "Repository name to list skills from")
  .option("--json", "Output as JSON")
  .action(async (options) => {
    await list({
      repo: options.repo,
      json: options.json || false,
    });
  });

// Parse command line arguments
program.parse(process.argv);
