# Contributing to OpenFetch

First off, thank you for considering contributing to OpenFetch! It's people like you that make OpenFetch such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please treat everyone with respect.

## Development Setup

1. Make sure you have the following installed:
   - Node.js (v20+)
   - pnpm (v9+)
   - Rust toolchain
   - Platform-specific Tauri dependencies
2. Clone the repository: `git clone https://github.com/openfetch/openfetch.git`
3. Install dependencies: `pnpm install`
4. Start development server: `pnpm run dev`

## Branching Strategy

- `main` is our primary branch.
- Feature branches should be created from `main` (e.g., `feat/new-plugin-api`, `fix/download-crash`).

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, if applicable.
3. Your PR must pass all CI checks (linting, tests, build) before it can be merged.
4. You may merge the PR in once you have the sign-off of at least one core maintainer.

## Plugin Development

If you're looking to contribute a plugin, please check our [Plugin Development Guide](../docs/plugins.md) in the `docs` folder.
