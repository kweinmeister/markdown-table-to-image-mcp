# GitHub Actions CI Workflow Design

## Overview
This design specifies a robust, high-performance GitHub Actions CI workflow for the `markdown-table-to-image-mcp` project. It ensures code quality through automated linting, formatting checks, type safety, and testing on every pull request.

## Goals
- **Automate Quality Checks:** Ensure all code adheres to project standards before merging.
- **Fail Fast:** Order steps so the fastest, "cheapest" checks (linting/formatting) run first.
- **Maintain Stability:** Pin versions and use reliable caching to prevent flaky builds.
- **Developer Parity:** Use `package.json` scripts to ensure CI runs the same commands as local development.

## Architecture

### Triggers
- **Pull Requests:** Triggered on all pull requests targeting the `main` branch.
- **Manual (workflow_dispatch):** Allows maintainers to run the CI suite manually for debugging or custom branches.
- *Note:* Push to `main` is intentionally omitted to avoid redundant runs on merge commits when PR checks are enforced.

### Environment
- **Runner:** `ubuntu-latest`
- **Node.js:** `24` (Current LTS)
- **Caching:** `actions/setup-node` configured with `cache: 'npm'` to accelerate dependency installation.

### Components
1. **Biome:** Unified tool for ultra-fast linting and formatting checks.
2. **TypeScript (tsc):** Static type checking to ensure type safety.
3. **Vitest:** Test runner for unit and integration tests.
4. **tsup:** Build tool to verify that the production bundle can be generated successfully.

## Workflow Steps

| Step | Command | Purpose |
| :--- | :--- | :--- |
| **1. Install** | `npm ci` | Clean, reproducible installation using package-lock.json and cache. |
| **2. Lint** | `npm run lint` | Runs `biome ci .` to verify formatting and linting rules. |
| **3. Type Check** | `npm run typecheck` | Runs `tsc --noEmit` to catch TypeScript errors. |
| **4. Test** | `npm test` | Executes the Vitest suite. |
| **5. Build** | `npm run build` | Runs `tsup` to verify build integrity. |

## Dependencies
- `@biomejs/biome` must be added to `devDependencies`.
- `package.json` scripts must be updated to include `lint` and `typecheck`.

## Testing Strategy
- The CI workflow itself will be verified by opening a test PR once implemented.
- Success is defined as all steps passing in the GitHub Actions runner.
- Failure in any step must block the workflow and prevent merging (via branch protection rules).
