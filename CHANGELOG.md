# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `list --skills` flag: flat-lists every individual skill across the whole
  library (supports `--json`).

### Changed

- Agent auto-detection (when `--agent` is omitted) now also detects agents by
  their project skills directory in the current folder, not just the global
  directory.

## [4.1.4] - 2026-06-02

### Fixed

- `--skill` with a relative path (e.g. `./my-skill`) no longer creates a
  broken, self-referential symlink; the source is resolved to an absolute
  path before linking.
- `--from` with a `/tree/<branch>/<path>` URL now actually clones that
  branch instead of silently cloning the default branch.

## [4.1.3] - 2026-06-02

### Changed

- Rewrote the README to be newcomer-friendly: explains what a Skill is,
  adds a copy-paste "golden" example, documents `--agent` auto-detection,
  multi-skill subpath installs, and manual uninstall.

### Fixed

- Corrected stale `install` usage docs that still marked `--skill` as
  required and used the wrong `list --repo` name format.

## [4.1.2] - 2026-06-02

### Added

- Unit tests (`node --test`) for GitHub URL parsing and file-system utils.

### Changed

- `--skill` is now optional: provide either `--skill <path>` or
  `--from <url>` (at least one required).
- `install` exits with a non-zero status when one or more links fail, so
  automation can detect partial failures.

### Fixed

- `createSymlink` refuses to overwrite a real (non-symlink) file or
  directory, preventing silent data loss on `--yes` overwrite.

### Removed

- Deleted the obsolete `legacy-link-skill.sh` and a stale duplicate
  `SKILL.md` at the repo root.

## [4.1.1] - 2026-02-26

### Added

- Agent skill definition so the tool can install itself.

## [4.1.0] - 2026-02-26

### Added

- Release SOP document and `release.sh` helper script.

## [4.0.4] - 2025

### Fixed

- Corrected the OpenCode global skills path to `~/.config/opencode/skills/`.

## [4.0.0] - 2025

### Changed

- **Breaking:** removed interactive mode; the tool is now CLI-only.

### Added

- Agent alias support for common names (e.g. `claude`, `gh-copilot`).
- Shallow clone and rebase for faster git operations.

[Unreleased]: https://github.com/raybird/skill-linker/compare/v4.1.4...HEAD
[4.1.4]: https://github.com/raybird/skill-linker/compare/v4.1.3...v4.1.4
[4.1.3]: https://github.com/raybird/skill-linker/compare/v4.1.2...v4.1.3
[4.1.2]: https://github.com/raybird/skill-linker/compare/v4.1.1...v4.1.2
[4.1.1]: https://github.com/raybird/skill-linker/compare/v4.1.0...v4.1.1
[4.1.0]: https://github.com/raybird/skill-linker/compare/v4.0.4...v4.1.0
[4.0.4]: https://github.com/raybird/skill-linker/compare/v4.0.0...v4.0.4
[4.0.0]: https://github.com/raybird/skill-linker/compare/v3.0.8...v4.0.0
