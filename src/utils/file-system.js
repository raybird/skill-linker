const fs = require('fs');
const path = require('path');

/**
 * Check if a directory exists
 * @param {string} dirPath
 * @returns {boolean}
 */
function dirExists(dirPath) {
    try {
        return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
    } catch {
        return false;
    }
}

/**
 * Ensure directory exists (create if not)
 * @param {string} dirPath
 */
function ensureDir(dirPath) {
    if (!dirExists(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Create a symbolic link
 * @param {string} source - Source path
 * @param {string} target - Target symlink path
 * @returns {boolean} Success status
 */
function createSymlink(source, target) {
    try {
        // Resolve the source to an absolute path. A relative source (e.g.
        // "./my-skill") would otherwise be stored verbatim and resolved
        // relative to the link's own directory, producing a broken link.
        const resolvedSource = path.resolve(source);

        // Ensure parent directory exists
        ensureDir(path.dirname(target));

        // Inspect the target itself without following symlinks.
        let stat = null;
        try {
            stat = fs.lstatSync(target);
        } catch {
            // Target does not exist — nothing to remove.
        }

        if (stat) {
            if (stat.isSymbolicLink()) {
                // Safe: we are replacing a link, not real content.
                fs.rmSync(target, { force: true });
            } else {
                // A real file or directory lives here. Refuse to delete it so
                // we never destroy user data that we did not create.
                console.error(
                    `Refusing to overwrite non-symlink target: ${target}`,
                );
                return false;
            }
        }

        fs.symlinkSync(resolvedSource, target, 'dir');
        return true;
    } catch (error) {
        console.error(`Failed to create symlink: ${error.message}`);
        return false;
    }
}

/**
 * List directories in a path
 * @param {string} dirPath
 * @returns {Array<string>} List of directory names
 */
function listDirectories(dirPath) {
    if (!dirExists(dirPath)) {
        return [];
    }

    try {
        return fs.readdirSync(dirPath)
            .filter(item => {
                const fullPath = path.join(dirPath, item);
                return fs.statSync(fullPath).isDirectory();
            });
    } catch {
        return [];
    }
}


/**
 * Find all repositories in library
 * @param {string} libPath - Library root path
 * @returns {Array<{name: string, path: string, owner: string, repo: string, hasSkillsDir: boolean}>}
 */
function findRepos(libPath) {
    if (!dirExists(libPath)) {
        return [];
    }

    const repos = [];

    // Scan owner directories
    const owners = listDirectories(libPath);

    for (const owner of owners) {
        const ownerPath = path.join(libPath, owner);
        const repoList = listDirectories(ownerPath);

        for (const repo of repoList) {
            const repoPath = path.join(ownerPath, repo);
            const skillsDir = path.join(repoPath, 'skills');

            repos.push({
                name: `${owner}/${repo}`,
                path: repoPath,
                owner,
                repo,
                hasSkillsDir: dirExists(skillsDir)
            });
        }
    }

    return repos;
}

/**
 * Find all skill directories in library
 * @param {string} libPath - Library root path
 * @returns {Array<{name: string, path: string, owner: string, repo: string}>}
 */
function findSkills(libPath) {
    if (!dirExists(libPath)) {
        return [];
    }

    const skills = [];

    // Scan owner directories
    const owners = listDirectories(libPath);

    for (const owner of owners) {
        const ownerPath = path.join(libPath, owner);
        const repos = listDirectories(ownerPath);

        for (const repo of repos) {
            const repoPath = path.join(ownerPath, repo);

            // Check if this repo has a skills/ subdirectory
            const skillsDir = path.join(repoPath, 'skills');

            if (dirExists(skillsDir)) {
                // Multi-skill repo
                const subSkills = listDirectories(skillsDir);

                for (const skill of subSkills) {
                    skills.push({
                        name: `${owner}/${repo}/${skill}`,
                        path: path.join(skillsDir, skill),
                        owner,
                        repo,
                        skill
                    });
                }
            } else {
                // Single skill repo
                skills.push({
                    name: `${owner}/${repo}`,
                    path: repoPath,
                    owner,
                    repo
                });
            }
        }
    }

    return skills;
}

module.exports = {
    dirExists,
    ensureDir,
    createSymlink,
    listDirectories,
    findRepos,
    findSkills
};
