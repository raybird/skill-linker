#!/usr/bin/env node

/**
 * skill-linker CLI
 * Node.js wrapper for link-skill.sh
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the path to the shell script
const scriptPath = path.join(__dirname, '..', 'link-skill.sh');

// Check if bash is available
const isWindows = process.platform === 'win32';

if (isWindows) {
    console.error('\x1b[31m[ERROR]\x1b[0m This tool requires Bash.');
    console.error('On Windows, please use WSL (Windows Subsystem for Linux) or Git Bash.');
    console.error('');
    console.error('Example with WSL:');
    console.error('  wsl npx skill-linker');
    process.exit(1);
}

// Check if script exists
if (!fs.existsSync(scriptPath)) {
    console.error('\x1b[31m[ERROR]\x1b[0m Shell script not found:', scriptPath);
    process.exit(1);
}

// Forward all arguments to the shell script
const args = process.argv.slice(2);

const child = spawn('bash', [scriptPath, ...args], {
    stdio: 'inherit',
    cwd: process.cwd()
});

child.on('error', (err) => {
    console.error('\x1b[31m[ERROR]\x1b[0m Failed to run script:', err.message);
    process.exit(1);
});

child.on('close', (code) => {
    process.exit(code || 0);
});
