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
