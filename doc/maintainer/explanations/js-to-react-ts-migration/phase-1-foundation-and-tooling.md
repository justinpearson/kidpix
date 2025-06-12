# Phase 1: Foundation & Tooling (Weeks 1-2)

## Table of Contents

1. [Overview](#overview)
2. [Implementation Steps](#implementation-steps)
3. [Background & Context](#background--context)
4. [Verification & Testing](#verification--testing)
5. [Troubleshooting](#troubleshooting)
6. [Next Steps](#next-steps)

## Overview

Phase 1 establishes the foundation for modern web development by setting up essential tooling for code quality, automated testing, and continuous integration. This phase focuses on improving the development experience without changing any application code.

**Learning Focus**: Understanding development tooling ecosystem, automation, and quality assurance practices.

**Duration**: 2 weeks  
**Difficulty**: Beginner to Intermediate  
**Prerequisites**: Basic command line knowledge, Git familiarity

## Implementation Steps

### Step 1.1: Update ESLint Configuration for JavaScript Files

**Goal**: Fix existing ESLint to work with JavaScript files instead of only TypeScript.

```bash
# Install ESLint plugins for JavaScript
yarn add --dev eslint-plugin-import eslint-plugin-node

# Update ESLint configuration
# Edit eslint.config.js to include JS files
```

**Configuration Example**:

```javascript
// eslint.config.js
export default [
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        KiddoPaint: "writable",
      },
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "prefer-const": "warn",
    },
  },
];
```

### Step 1.2: Add Prettier for Code Formatting

**Goal**: Ensure consistent code formatting across the project.

```bash
# Install Prettier
yarn add --dev prettier

# Create configuration file
# Create .prettierrc.json
# Create .prettierignore
```

**Configuration Files**:

```json
// .prettierrc.json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Step 1.3: Set Up Pre-commit Hooks with Husky

**Goal**: Automatically run quality checks before commits.

```bash
# Install Husky and lint-staged
yarn add --dev husky lint-staged

# Initialize Husky
npx husky init

# Configure pre-commit hook
echo "yarn lint-staged" > .husky/pre-commit
```

**Lint-staged Configuration**:

```json
// package.json
{
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"],
    "*.{json,md,css,html}": ["prettier --write"]
  }
}
```

### Step 1.4: Configure Vitest for JavaScript Testing

**Goal**: Set up unit testing framework for JavaScript files.

```bash
# Update Vitest configuration for JS files
# Edit vitest.config.ts to include JS files
```

**Updated Configuration**:

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.{test,spec}.{js,ts}"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
});
```

### Step 1.5: Set Up Code Coverage Reporting

**Goal**: Measure test effectiveness and identify untested code.

```bash
# Install coverage tools
yarn add --dev @vitest/coverage-v8

# Update package.json scripts
```

**Package.json Scripts**:

```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

### Step 1.6: Configure Playwright for E2E Testing

**Goal**: Set up end-to-end testing for user interactions.

```bash
# Update Playwright configuration
# Edit playwright.config.ts for KidPix-specific tests
```

**Configuration Update**:

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    screenshot: "on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "yarn dev",
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Step 1.7: Set Up GitHub Actions CI/CD

**Goal**: Automate testing and quality checks on every commit.

**Create `.github/workflows/ci.yml`**:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "yarn"

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run linting
        run: yarn lint

      - name: Run unit tests
        run: yarn test:coverage

      - name: Run E2E tests
        run: yarn playwright test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Background & Context

### What is ESLint and Why Do We Need It?

**ESLint** is a static analysis tool that identifies and reports patterns in JavaScript code. Think of it as an automated code reviewer that catches common mistakes and enforces coding standards.

**Key Benefits**:

- **Error Prevention**: Catches syntax errors, undefined variables, unreachable code
- **Consistency**: Enforces consistent coding style across team members
- **Best Practices**: Warns about potentially problematic patterns

**How It Works**:

1. Parses your JavaScript code into an Abstract Syntax Tree (AST)
2. Applies rules to analyze the AST for issues
3. Reports violations with specific line numbers and descriptions
4. Can automatically fix many issues with `--fix` flag

**Example Configuration Breakdown**:

```javascript
// eslint.config.js
export default [
  {
    files: ["**/*.js"], // Which files to lint
    languageOptions: {
      ecmaVersion: 2022, // JavaScript version support
      sourceType: "module", // ES modules vs CommonJS
      globals: {
        // Global variables available
        KiddoPaint: "writable", // Our main namespace
      },
    },
    rules: {
      "no-unused-vars": "error", // Fail on unused variables
      "no-undef": "error", // Fail on undefined variables
    },
  },
];
```

**Learn More**: [ESLint Documentation](https://eslint.org/docs/latest/)

### What is Prettier and How Does It Differ from ESLint?

**Prettier** is an opinionated code formatter that automatically formats your code according to consistent rules.

**ESLint vs Prettier**:

- **ESLint**: Focuses on code quality (errors, unused variables, best practices)
- **Prettier**: Focuses on code formatting (spacing, line breaks, quotes)
- **Together**: ESLint catches errors, Prettier makes code beautiful

**Configuration Options**:

```json
{
  "semi": true, // Add semicolons
  "trailingComma": "es5", // Trailing commas where valid in ES5
  "singleQuote": true, // Use single quotes
  "printWidth": 80, // Line length limit
  "tabWidth": 2, // Indentation size
  "useTabs": false // Use spaces instead of tabs
}
```

**Learn More**: [Prettier Documentation](https://prettier.io/docs/en/)

### What are Git Hooks and Husky?

**Git Hooks** are scripts that run automatically at certain points in the Git workflow (before commit, after push, etc.).

**Husky** makes Git hooks easy to use in JavaScript projects by:

- Installing hooks automatically when teammates clone the repository
- Running hooks using Node.js and npm/yarn scripts
- Providing cross-platform compatibility

**Pre-commit Hook Example**:

```bash
#!/bin/sh
# .husky/pre-commit
yarn lint-staged
```

**Lint-staged** runs linters only on staged files (files you're about to commit), which is much faster than linting the entire codebase.

**Learn More**: [Husky Documentation](https://typicode.github.io/husky/)

### What is Vitest and How Does It Compare to Jest?

**Vitest** is a modern testing framework designed specifically for Vite projects. It's essentially Jest reimagined for the modern web.

**Key Advantages**:

- **Speed**: Runs tests in parallel with hot module replacement
- **Vite Integration**: Uses the same configuration as your build tool
- **Modern Features**: Native ES modules, TypeScript support
- **Jest Compatibility**: Same API as Jest, easy migration

**Test Structure**:

```javascript
// Example test file: utils.test.js
import { describe, it, expect } from "vitest";
import { calculateDistance } from "../js/util/utils.js";

describe("calculateDistance", () => {
  it("should calculate distance between two points", () => {
    const result = calculateDistance(0, 0, 3, 4);
    expect(result).toBe(5);
  });
});
```

**Learn More**: [Vitest Documentation](https://vitest.dev/)

### What is Code Coverage and Why Does It Matter?

**Code Coverage** measures how much of your code is executed during tests. It's expressed as a percentage.

**Types of Coverage**:

- **Line Coverage**: Percentage of code lines executed
- **Function Coverage**: Percentage of functions called
- **Branch Coverage**: Percentage of conditional branches taken
- **Statement Coverage**: Percentage of statements executed

**Coverage Reports**:

```bash
# Generate coverage report
yarn test:coverage

# Output example:
File      | % Stmts | % Branch | % Funcs | % Lines
----------|---------|----------|---------|--------
utils.js  |   85.71 |    66.67 |     100 |   85.71
tools.js  |   92.31 |       75 |     100 |   92.31
```

**Good Coverage Guidelines**:

- **80%+**: Good coverage for most projects
- **90%+**: Excellent coverage
- **100%**: Usually overkill, focus on critical paths

**Learn More**: [Code Coverage Best Practices](https://martinfowler.com/bliki/TestCoverage.html)

### What is Playwright and E2E Testing?

**End-to-End (E2E) Testing** simulates real user interactions with your application, testing the complete workflow from user interface to backend.

**Playwright** is a modern E2E testing framework that:

- Controls real browsers (Chrome, Firefox, Safari)
- Simulates user actions (clicks, typing, scrolling)
- Takes screenshots and videos of failures
- Provides powerful debugging tools

**Example E2E Test**:

```javascript
// tests/e2e/drawing.spec.js
import { test, expect } from "@playwright/test";

test("user can draw with pencil tool", async ({ page }) => {
  await page.goto("/");

  // Click pencil tool
  await page.click('[data-testid="pencil-tool"]');

  // Draw on canvas
  const canvas = page.locator("#kiddopaint");
  await canvas.click({ position: { x: 100, y: 100 } });
  await canvas.click({ position: { x: 200, y: 150 } });

  // Verify drawing occurred (canvas changed)
  const canvasData = await page.evaluate(() => {
    const canvas = document.getElementById("kiddopaint");
    return canvas.toDataURL();
  });

  expect(canvasData).not.toBe(/* empty canvas data */);
});
```

**Learn More**: [Playwright Documentation](https://playwright.dev/)

### What is CI/CD and GitHub Actions?

**Continuous Integration/Continuous Deployment (CI/CD)** automatically builds, tests, and deploys your code when changes are made.

**GitHub Actions** is GitHub's built-in CI/CD platform that runs workflows when events occur (push, pull request, etc.).

**Workflow Structure**:

```yaml
name: CI # Workflow name
on: [push, pull_request] # When to run

jobs: # Parallel jobs
  test: # Job name
    runs-on: ubuntu-latest # Server environment
    steps: # Sequential steps
      - uses: actions/checkout@v4 # Download code
      - uses: actions/setup-node@v4 # Install Node.js
      - run: yarn install # Install dependencies
      - run: yarn test # Run tests
```

**Benefits**:

- **Early Detection**: Catch issues before they reach production
- **Consistency**: Same environment for all tests
- **Automation**: No manual testing required
- **Confidence**: Know your code works before deployment

**Learn More**: [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Verification & Testing

### Verify ESLint Configuration

```bash
# Test ESLint on JavaScript files
yarn lint js/

# Should show any issues in JS files
# Fix issues automatically where possible
yarn lint --fix js/
```

### Verify Prettier Setup

```bash
# Format all files
yarn prettier --write .

# Check if files are formatted
yarn prettier --check .
```

### Test Pre-commit Hooks

```bash
# Make a small change to a JS file
echo "// test comment" >> js/tools/pencil.js

# Add to staging
git add js/tools/pencil.js

# Commit should trigger hooks
git commit -m "test: verify pre-commit hooks"
```

### Verify Testing Setup

```bash
# Create simple test
mkdir -p js/__tests__
cat > js/__tests__/example.test.js << EOF
import { describe, it, expect } from 'vitest';

describe('Example Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
});
EOF

# Run tests
yarn test

# Generate coverage
yarn test:coverage
```

### Test E2E Setup

```bash
# Create basic E2E test
mkdir -p tests/e2e
cat > tests/e2e/basic.spec.js << EOF
import { test, expect } from '@playwright/test';

test('KidPix loads successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('canvas#kiddopaint')).toBeVisible();
});
EOF

# Run E2E tests
yarn playwright test
```

## Troubleshooting

### Common ESLint Issues

**Problem**: ESLint reports "KiddoPaint is not defined"

```javascript
// Solution: Add to globals in eslint.config.js
globals: {
  KiddoPaint: "writable";
}
```

**Problem**: ESLint errors on ES6+ features

```javascript
// Solution: Update ecmaVersion
languageOptions: {
  ecmaVersion: 2022;
}
```

### Prettier Formatting Conflicts

**Problem**: ESLint and Prettier disagree on formatting

```bash
# Solution: Install eslint-config-prettier
yarn add --dev eslint-config-prettier

# Add to ESLint config
extends: ['prettier']
```

### Husky Hook Failures

**Problem**: Pre-commit hook fails to run

```bash
# Check if Husky is installed
ls -la .husky/

# Reinstall if necessary
npx husky install

# Make hook executable
chmod +x .husky/pre-commit
```

### Vitest Canvas Issues

**Problem**: Tests fail when testing canvas operations

```javascript
// Solution: Add canvas mock to test setup
// src/test-setup.ts
import { beforeAll } from "vitest";

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn();
});
```

### Playwright Browser Issues

**Problem**: Playwright can't find browsers

```bash
# Install browsers
npx playwright install

# Or install specific browser
npx playwright install chromium
```

## Next Steps

1. **Commit your tooling setup**:

   ```bash
   git add .
   git commit -m "feat(tooling): set up ESLint, Prettier, Husky, and testing infrastructure"
   ```

2. **Test the complete workflow**:

   - Make a small change to a JS file
   - Ensure pre-commit hooks run
   - Push to GitHub and verify CI runs

3. **Prepare for Phase 2**:
   - Review TypeScript basics
   - Understand declaration files concept
   - Plan which utilities to type first

**Continue to**: [Phase 2: Add TypeScript Declarations](./phase-2-add-typescript-declarations.md)

---

**Related Documentation**:

- [Overview](./overview.md) - Migration plan overview
- [Phase 2](./phase-2-add-typescript-declarations.md) - Adding type safety
