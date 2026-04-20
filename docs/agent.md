# Guidelines

This page outlines the standards and guidelines for contributing to this monorepo.

## Package Structure

Each package should follow the standard structure:

- `src/`: Source code.
- `test/`: Unit and integration tests.
- `package.json`: Local dependencies and scripts.
- `tsconfig.json`: TypeScript configuration extending the base.

## Workflow

1. Create a new branch for your feature or fix.
2. Use `pnpm tool new-package` to scaffold new packages.
3. Run `pnpm run format` before committing.
4. Use `pnpm run changeset` to document your changes.

## Documentation Workflow Specification

This monorepo utilizes a dynamic documentation system built on VitePress, designed to automatically surface package information and support multiple versions.

### 1. Package Discovery
The documentation build process automatically discovers packages within the `packages/` directory. For a package to be documented, it must contain a `README.md` and a `CHANGELOG.md` file.

### 2. Version Management
The system supports multi-version documentation using the following structure:
- Packages should store versioned documentation source in `packages/<pkg>/src/<version>`.
- The `v*` naming convention is used for version directories.

### 3. Sync Logic (`sync-latest.js`)
Before the VitePress build, a synchronization script (`docs/scripts/sync-latest.js`) runs to:
- Map `packages/<pkg>/README.md` to `docs/packages/<pkg>/src/<version>/index.md`.
- Map `packages/<pkg>/CHANGELOG.md` to `docs/packages/<pkg>/src/<version>/changelog.md`.
- Ensure that the latest documentation is always available at a predictable path.

### 4. The `/latest` Alias
To simplify navigation, the system automatically creates a symlink from `src/latest` to the most recent version directory in the documentation tree. This allows for stable URLs like `/packages/my-pkg/src/latest/`.

### 5. CI/CD Deployment
Documentation is automatically deployed via GitHub Actions:
- **Trigger**: Every push to the `main` branch that modifies code, docs, or package configurations.
- **Workflow**: `.github/workflows/docs.yml`
- **Behavior**:
    1. Installs dependencies using `pnpm`.
    2. Runs `pnpm docs:build` (which triggers the sync script).
    3. Uploads the built static site (`docs/.vitepress/dist`) as a GitHub Pages artifact.
    4. Deploys to the `github-pages` environment.
