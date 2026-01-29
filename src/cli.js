#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const install = require('./commands/install');
const list = require('./commands/list');

// Package info
const packageJson = require('../package.json');

program
    .name('skill-linker')
    .description('Interactive CLI to link AI Agent Skills to various agents')
    .version(packageJson.version);

// Default command (install)
program
    .argument('[skill-path]', 'Path to skill directory')
    .option('--from <github-url>', 'Clone skill from GitHub URL first, then link')
    .option('-l, --list', 'List available skills in library')
    .action(async (skillPath, options) => {
        // Handle --list flag
        if (options.list) {
            await list();
            return;
        }

        // Run install command
        await install({
            skill: skillPath,
            from: options.from
        });
    });

// Standalone list command
program
    .command('list')
    .description('List all available skills in the library')
    .action(async () => {
        await list();
    });

// Parse command line arguments
program.parse(process.argv);

