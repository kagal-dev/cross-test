# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.1.3] - 2026-03-25

### Added

- **ci**: Node.js compatibility matrix (18, 20, 22) with standalone
  compat test validating the `engines.node` claim
- **ci**: Renovate configuration with config validator workflow
- **pkg**: `homepage`, `bugs`, and `keywords` fields for npm discovery
- **scripts**: `clean` script with `rimraf`

### Fixed

- **pkg**: Use full `git+https://` URL for repository

### Changed

- **deps**: Bump `@poupe/eslint-config` ~0.8.2 → ~0.8.4
- **deps**: Bump `eslint` ~9.30.1 → ~9.39.4
- **deps**: Bump `pkg-pr-new` ^0.0.65 → ^0.0.66
- **ci**: Skip `pkg-pr-new` preview on tag pushes — the real npm
  publish handles those

## [0.1.2] - 2026-03-11

### Fixed

- **ci**: Upgrade npm for OIDC trusted publishing support
- **ci**: Add `--no-git-checks` for detached HEAD tag publish

## [0.1.0] - 2026-03-11

Initial release.

### Added

- **core**: Cross-platform shell condition evaluator with file tests
  (`-d`, `-e`, `-f`, `-s`), string tests (`-n`, `-z`), comparison
  operators (`=`, `!=`), logic (`-a`, `-o`, `!`), and grouping
  (`(`, `)`)
- **core**: Environment variable expansion (`$VAR`, `${VAR}`)
- **ci**: Publish workflow with npm provenance via GitHub Actions
  OIDC trusted publishing
- **ci**: `pkg-pr-new` preview publishing on branch pushes
