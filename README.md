# pnpm Monorepo Template

A robust, modern, and standardized monorepo template built with **pnpm**, **TypeScript**, and **VitePress**. Designed for scalability, speed, and developer experience.

## ✨ Features

- **Monorepo Management**: Powered by [pnpm workspaces](https://pnpm.io/workspaces) for efficient dependency sharing and linking.
- **Modern Tooling**:
  - [tsup](https://tsup.egoist.dev/) for fast TypeScript bundling.
  - [Vitest](https://vitest.dev/) for blazing-fast unit testing.
  - [Prettier](https://prettier.io/) for consistent code formatting.
- **Versioning & Publishing**: Managed by [Changesets](https://github.com/changesets/changesets).
- **Documentation**: Built-in [VitePress](https://vitepress.dev/) site for interactive documentation.
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged) for automated pre-commit checks.
- **Custom Tooling**: Scaffolding scripts for creating new packages quickly.

## 📂 Project Structure

```text
.
├── packages/          # Workspace packages
│   ├── dev-lib        # Example package
│   └── sample-library # Example library
├── docs/              # VitePress documentation
├── tools/             # Build and utility scripts
├── .changeset/        # Changeset configuration
├── tsconfig.base.json # Shared TypeScript configuration
└── pnpm-workspace.yaml# Workspace definition
```

## 🚀 Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/installation) installed (v10+ recommended).
- [Node.js](https://nodejs.org/) (v22+ recommended).

### Installation

```bash
pnpm install
```

### Development

Run the documentation site locally:

```bash
pnpm run docs:dev
```

## 🛠️ Commands

| Command | Description |
| :--- | :--- |
| `pnpm run format` | Format all files in the repository using Prettier. |
| `pnpm run changeset`| Create a new version changeset for documentation. |
| `pnpm tool` | Access custom utility scripts (e.g., `pnpm tool new-package`). |
| `pnpm run docs:dev` | Start the documentation development server. |
| `pnpm run docs:build`| Build the documentation for production. |

## 📦 Creating a New Package

Use the built-in scaffolding tool to quickly generate a new package with the correct structure:

```bash
pnpm tool new-package
```

Follow the prompts to specify the package name and description.

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/my-new-feature`.
2. Commit your changes: `git commit -m 'Add some feature'`.
3. Create a changeset: `pnpm run changeset`.
4. Push to the branch: `git push origin feature/my-new-feature`.
5. Open a Pull Request.

## 📄 License

This project is licensed under the terms of the license found in the [LICENSE](LICENSE) file.
