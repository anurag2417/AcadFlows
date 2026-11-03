# Contributing to AcadFlows

Thank you for your interest in contributing to **AcadFlows**! We welcome contributions from engineers, designers, and educators to help build world-class school management software.

---

## 1. Code of Conduct

All contributors and maintainers are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to `acadflows00@gmail.com`.

---

## 2. Getting Started

1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/AcadFlows.git
   cd AcadFlows
   ```
3. Read the [Local Development Manual](docs/DEVELOPMENT.md) for full prerequisites and environment setup.
4. Install dependencies:
   ```bash
   pnpm install
   ```

---

## 3. Development Workflow & Standards

### 3.1 Branching Strategy
- Create a dedicated branch off `main` for your work:
  ```bash
  git checkout -b feature/attendance-sms-notifications
  ```
- Keep branch names descriptive and prefixed with `feature/`, `fix/`, `docs/`, or `refactor/`.

### 3.2 TypeScript & Module Syntax Standards
- We enforce strict TypeScript across all workspaces.
- Always use `import type { ... }` when importing interfaces or types to comply with `verbatimModuleSyntax`.
- Shared types must be placed in `packages/shared/src/types/` and exported via `packages/shared/src/index.ts`.

### 3.3 Verification Before Committing
Always ensure the entire validation suite passes cleanly:
```bash
# Compile shared packages
pnpm --filter @acadflows/shared build

# Run type checking across apps and packages
pnpm run type-check

# Run linter
pnpm run lint

# Verify web build
pnpm run build:web
```

---

## 4. Submitting Pull Requests

1. Push your branch to your GitHub fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request targeting the `main` branch of `anurag2417/AcadFlows`.
3. Provide a clear description in your PR:
   - What problem does this solve?
   - How was it tested?
   - Are there any database schema migrations or environment variable changes required?
4. Ensure all CI checks (linting, type-checking, and build validation) pass before requesting review.

