# KidPix React/Typescript

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Development Setup](#development-setup)
  - [Tech Stack](#tech-stack)
- [Legacy Information](#legacy-information)
  - [One-time Install (OLD)](#one-time-install-old)
  - [How to Play (OLD)](#how-to-play-old)
  - [How to Change Code (OLD)](#how-to-change-code-old)
- [Original Documentation](#original-documentation)
  - [Original README](#original-readme)
  - [Vite README](#vite-readme)

## Overview

The 1989 KidPix drawing app, from vikrum's www.kidpix.app (Kid Pix 1.0 HTML/JS implementation, https://github.com/vikrum/kidpix), ported to React / TypeScript, to learn software best-practices. See below for vikrum's original readme and vite's template readme.

Goal: Port Vikrum's KidPix app into a modern, scalable, production-ready software + infra stack. Let's learn React / TypeScript, web dev, automated testing, CI / CD, deployment, and monitoring / alerting.

Also, let's use this project to learn AI-assisted coding tools (VS Code Copilot, Cursor, Claude Code).

If you are an AI agent, please read the "rules" files in `.cursor/rules`, and the AI-generated summary file `CLAUDE.md`, for guidance on how you should act. Then, read the feature requests in `prompts-TODO/`, and implement the oldest one, putting your changes into logical git commits, and submitting a PR (for details, see `.cursor/rules/feature_workflow.md`). After merging, move completed feature-request files into `prompts-DONE/`.

## Quick Start

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Yarn](https://yarnpkg.com/) package manager
- [Git](https://git-scm.com/)

## Development Setup

```bash
# Clone the repository
git clone https://github.com/justinpearson/kidpix.git
cd kidpix

# Install dependencies
yarn install

# Start development server
yarn dev
# Open http://localhost:5173/ (serves the modular JS version)

# Run tests (see Testing section below for details)
yarn test:unit         # Unit tests
yarn test:e2e          # End-to-end tests

# Build for production
yarn build

# Preview production build
yarn preview

# Build and serve documentation
python3 -m pip install mkdocs  # One-time setup
yarn docs:build               # Build docs
yarn docs:dev                 # Serve docs locally at http://127.0.0.1:8000
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6.3.5 with HMR
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Code Quality**: ESLint + Prettier with pre-commit hooks
- **Package Manager**: Yarn 1.22.22
- **Deployment**: GitHub Actions → GitHub Pages
- **Claude Code Integration**: Browser error monitoring with vite-plugin-terminal allows Claude Code to view browser console errors

### Claude Code Development Features

This project includes special features for AI-assisted development using Claude Code:

- **Real-time Error Monitoring**: Browser runtime errors appear directly in the terminal
- **Timestamped Debugging**: Local timestamps help coordinate debugging sessions
- **Full Stack Traces**: Complete error context with file locations and line numbers

**⚠️ CRITICAL for Claude Code Users**: For Claude Code to view the browser console errors, it must run the dev server (`yarn dev`) in its own background bash shell. Human developers should NOT run their own `yarn dev` in a separate terminal (which is not visible to Claude Code).

For detailed development information, see [Maintainer Documentation](doc/maintainer/).

**Note for AI Agents**: Read `CLAUDE.md` for complete development workflow guidance including error monitoring setup and limitations.

## Testing

This project includes comprehensive testing with both unit tests (Vitest) and end-to-end tests (Playwright).

### Test Commands

| Command                        | Description                        | When to Use                                                   |
| ------------------------------ | ---------------------------------- | ------------------------------------------------------------- |
| `yarn test:unit`               | Run unit tests in watch mode       | Development - automatically reruns tests when code changes    |
| `yarn test:unit:ui`            | Open interactive unit test UI      | Development - visual test runner with filtering and debugging |
| `yarn test:coverage`           | Generate unit test coverage report | CI/validation - see what code is tested                       |
| `yarn test:coverage:ui`        | Interactive coverage report        | Development - visual coverage exploration                     |
| `yarn test:e2e`                | Run all e2e tests headlessly       | CI/validation - fast, automated testing                       |
| `yarn test:e2e:headed`         | Run e2e tests with browser visible | Debugging - see what the tests are doing                      |
| `yarn test:e2e:ui`             | Open Playwright test UI            | Development - interactive test running and debugging          |
| `yarn test:e2e:single`         | Run specific test file             | Debugging - focus on one test suite                           |
| `yarn test:e2e:showlastreport` | View last test report              | Post-test - detailed results and screenshots                  |

### UI vs Headed vs Headless

- **`--ui`**: Opens an interactive graphical interface for selecting, running, and debugging tests
- **`--headed`**: Runs tests with browser windows visible (you can watch them execute)
- **`--headless`** (default): Runs tests in background without opening browser windows (fastest)

### E2E Test Architecture

Our end-to-end tests use a **per-tool architecture** where each drawing tool has its own test file:

- `pencil.spec.ts`, `line.spec.ts`, `wacky-brush.spec.ts`, etc. - Individual tool tests
- `tool-switching.spec.ts`, `canvas-functionality.spec.ts` - Integration tests
- `shared/` - Common test utilities and fixtures

This enables parallel test execution and focused debugging. See [Testing Guide](doc/maintainer/testing-guide.md) for detailed information.

## Legacy Information

### One-time Install (OLD)

Required for both playing and changing code.

Instructions for Mac.

- install npm:
  - install homebrew from https://brew.sh/
  - restart terminal
  - `brew install node` -- to get npm
- install my kidpix fork:
  - option 1: git clone https://github.com/justinpearson/kidpix.git
  - option 2: download zipfile from https://github.com/justinpearson/kidpix
    - if zipfile: you'll also be able to make code local code changes, but not push them to back to the git repo.
  - cd kidpix (or kidpix-main if used zipfile)
  - `./build.sh`
    - if error: `js-beautify.js - "No such file or directory"` - need to 'npm install' :
    - npm install
      - if error message `Run install -g npm@10.5.2`, ok to do it.
    - now should have package-lock.json.
  - now should be able to run locally, see below.

### How to Play (OLD)

(On local laptop -- no internet connection required!)

- cd into kidpix dir
- yarn dev
- open localhost:5173 in browser

### How to Change Code (OLD)

- cd into kidpix dir
- change code in js/ directory as desired
- Vite will auto-reload the browser with changes
- important: if changed assets (like png stamp packs) may need to clear browser cache:
  - can tell if you hover over an asset in Elements inspector pane to get a preview, and you'll see it's the old one
  - chrome settings > search for cache > delete browing history & files from last hour
- should see code changes reflected!

## Original Documentation

### Original README

# jskidpix ✨ https://kidpix.app/

In 1989 Kid Pix 1.0 was released into the public domain and this is an HTML/JS reimplementation.

![ghsplash](https://user-images.githubusercontent.com/291215/129511916-b22bb209-4967-4a4c-9077-22e762950a1b.jpg)

### Guide

Just like the original Kid Pix, there's no guide—have fun! Most of the tools support Shift (^) to enlarge. There are a handful of hidden tool features behind various modifier keys (⌘, ⌥, ⇧). The modifier keys can also be combined. Enjoy! :)

### Mirrors

Please let me know if you mirror the site elsewhere and I'll add it here:

- https://kidpix.app/
- https://kidpix.neocities.org/
- https://kidpix.web.app/
- https://vikrum.github.io/kidpix/
- https://kidpix.glitch.me/

### Questions & Hints

- Leave a note if you have a question or find a bug: https://github.com/vikrum/kidpix/issues
- Check out the hints wiki to get the grownup info: https://github.com/vikrum/kidpix/wiki

### Vite README

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

---
