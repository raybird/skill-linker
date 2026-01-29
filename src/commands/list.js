const chalk = require('chalk');
const prompts = require('prompts');
const path = require('path');
const { findRepos, listDirectories, dirExists } = require('../utils/file-system');
const { DEFAULT_LIB_PATH } = require('../utils/git');

/**
 * List command - shows repos, then skills within selected repo
 */
async function list() {
    if (!dirExists(DEFAULT_LIB_PATH)) {
        console.error(chalk.red('[ERROR]'), `Skill library not found: ${DEFAULT_LIB_PATH}`);
        console.log(chalk.blue('[INFO]'), 'Use --from <github_url> to clone skills first.');
        process.exit(1);
    }

    const repos = findRepos(DEFAULT_LIB_PATH);

    if (repos.length === 0) {
        console.log(chalk.yellow('[WARNING]'), `No repos found in ${DEFAULT_LIB_PATH}`);
        console.log(chalk.blue('[INFO]'), 'Use --from <github_url> to clone skills first.');
        return;
    }

    console.log('');
    console.log(chalk.blue('[INFO]'), `Repositories in library (${DEFAULT_LIB_PATH}):`);
    console.log('');

    // Show repos with indication if they have skills/ directory
    const { selectedRepo } = await prompts({
        type: 'select',
        name: 'selectedRepo',
        message: 'Select a repository to view:',
        choices: repos.map(repo => ({
            title: `${repo.name}${repo.hasSkillsDir ? chalk.dim(' (has skills/)') : ''}`,
            value: repo,
            description: repo.path
        }))
    });

    if (!selectedRepo) {
        console.log(chalk.yellow('[INFO]'), 'No repository selected.');
        return;
    }

    console.log('');
    console.log(chalk.blue('[INFO]'), `Repository: ${chalk.cyan(selectedRepo.name)}`);
    console.log(chalk.dim(`Path: ${selectedRepo.path}`));
    console.log('');

    // If repo has skills/ subdirectory, list the skills
    if (selectedRepo.hasSkillsDir) {
        const skillsDir = path.join(selectedRepo.path, 'skills');
        const skills = listDirectories(skillsDir);

        if (skills.length === 0) {
            console.log(chalk.yellow('[WARNING]'), 'No skills found in skills/ directory');
            return;
        }

        console.log(chalk.blue('[INFO]'), 'Skills in this repository:');
        console.log('');

        skills.forEach((skill, index) => {
            console.log(`  ${index + 1}. ${chalk.cyan(skill)}`);
            console.log(`     ${chalk.dim(path.join(skillsDir, skill))}`);
        });

        console.log('');
    } else {
        console.log(chalk.blue('[INFO]'), 'This is a single-skill repository (no skills/ subdirectory)');
        console.log(chalk.dim('The entire repository acts as one skill'));
        console.log('');
    }
}

module.exports = list;

