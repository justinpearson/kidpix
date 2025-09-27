# Justin's Kid Pix

**PLAY HERE: https://justinpearson.github.io/kidpix/**

The "Kid Pix" computer drawing program for kids (the public domain version from 1989), forked from vikrum's Javascript re-implementation [here](https://github.com/vikrum/kidpix), with some customizations like:

- Multi-undo / redo (works across page reloads!)
- Highlight currently-selected tool / subtool
- New color-picker tool
- [Docs](https://justinpearson.github.io/kidpix/docs/), for both [Users](https://justinpearson.github.io/kidpix/docs/user/quick-start/) and [Software Maintainers](https://justinpearson.github.io/kidpix/docs/maintainer/quick-start/)
- Automatic deployment via Github Pages
- Expanded "numbers" and "symbols" stamps
- Code cleanup, misc bug fixes

TODO: pic here

## Background

Kid Pix is a 1989 computer drawing program for kids that features fun
tools and wacky sounds -- who can forget the undo button's "Oh No!"??

In 2021, GitHub user vikrum re-implemented the Kid Pix Public Domain Version 1.0 in HTML / Javascript
(https://github.com/vikrum/kidpix), hosting it at www.kidpix.app. Very cool!

I forked that project in 2024 in order to implement custom "features"
requested by my kids, and to practice technical skills like:

- migrating JS codebase to modern React / TypeScript tech stack
- automated testing / TDD
- CI / CD
- devops: deployment, monitoring, alerting
- AI-assisted coding tools (VS Code Copilot, Cursor, Claude Code)
- Best practices for developing software with AI agents

The following sections decribe:

- how to play this version of Kid Pix on the web
- how to download it / play it without an internet connection (useful for long car rides ;)
- how to tweak the code

## Table of Contents

- [Background](#background)
- [How to Play](#how-to-play)
- [How to Play Offline](#how-to-play-offline)
- [How to Change the Code](#how-to-change-the-code)
- [For AI Agents](#for-ai-agents)
- [Releasing](#releasing)
  - [Release manually](#release-manually)
- [Tech Stack](#tech-stack)
  - [Claude Code Development Features](#claude-code-development-features)
  - [Git Hooks](#git-hooks)
- [Testing](#testing)
  - [Test Commands](#test-commands)
  - [UI vs Headed vs Headless](#ui-vs-headed-vs-headless)
  - [E2E Test Architecture](#e2e-test-architecture)
- [Legacy Information](#legacy-information)
  - [One-time Install (OLD)](#one-time-install-old)
  - [How to Play (OLD)](#how-to-play-old)
  - [How to Change Code (OLD)](#how-to-change-code-old)
- [Original Documentation](#original-documentation)
  - [Original README](#original-readme)
  - [Vite README](#vite-readme)

## How to Play

Just browse to **<https://justinpearson.github.io/kidpix/>** !!

## How to Play Offline

1. From an internet-enabled computer, to go the Releases page <https://github.com/justinpearson/kidpix/releases> and download the latest release's tarball, eg, `kidpix-v1.0.0.tar.gz`.

2. Transfer this tarball to the target computer and unzip it.

3. On the target computer, open a terminal, `cd` into the app's folder, and run a local webserver via `python -m http.server` or `npx serve .`

4. Browse to <http://localhost:8000/>

## How to Change the Code

**1. Clone the code:**

- `git clone https://github.com/justinpearson/kidpix.git`
- If you get error 'command not found: git', you need to install git, easiest with: `xcode-select --install`

**2. Install dependencies:**

- Go into your new kidpix dir: `cd kidpix`
- Install required packages: `yarn install`
  - If you get error 'command not found: yarn', you need to install yarn (a package manager for Javascript packages), as follows:
    - Install NodeJS: `brew install node`
      - If you get error 'command not found: brew', you need to install Homebrew following instructions at <https://brew.sh/>.
    - Install yarn: `npm install -g corepack`
- (OPTIONAL) If you want to view the docs, you need to install the Python dependencies: `python3 -m pip install -r requirements.txt`

**3. Run the app locally**

- Start development server: `yarn dev-app`
- The app should open automatically at <http://localhost:5173/>
- The browser updates upon code changes, thanks to Vite

**3. Run the tests**

```bash
yarn test:unit
yarn test:e2e
```

**4. Build & view the docs**

- Serve the docs: `yarn dev-docs`
- Docs URL:
  - Local: <http://127.0.0.1:8000/kidpix/docs/>
  - Note: deployed docs: <https://justinpearson.github.io/kidpix/docs/>

**5. Build & view the app**

- Build for production: `yarn build`
- Preview production build: `yarn preview`

## For AI Agents

If you are an AI agent, please read the "rules" files in `.cursor/rules`, and
the AI-generated summary file `CLAUDE.md`, for guidance on how you should
act. Then, read the feature requests in `prompts-TODO/`, and implement the
oldest one (or `current.txt`), putting your changes into logical git commits, and submitting a
PR (for details, see `.cursor/rules/feature_workflow.md`). After merging,
move completed feature-request files into `prompts-DONE/`.

## Releasing

GitHub releases:

https://github.com/justinpearson/kidpix/releases

To create a new release, 3 options:

```bash
# For bug fixes
yarn release:patch

# For new features
yarn release:minor

# For breaking changes
yarn release:major
```

this runs, eg, `npm version minor && git push origin --tags` from package.json, which basically creates a git tag named `v1.0.0` and pushes it, which gets picked up by the github workflow `kidpix/.github/workflows/release.yml`, which builds the app, tarballs the `dist/` folder, and publishes it to github at <https://github.com/justinpearson/kidpix/releases> .

### Release manually

(change the version number from the examples below -- do not use 1.0.0)

1. Build app: `yarn build`
2. Tarball the `dist/` folder: `tar -czf kidpix-v1.0.0.tar.gz -C dist .`
3. Create github release manually (will create the git tag automatically): `gh release create v1.0.0 kidpix-v1.0.0.tar.gz --title "Justin's KidPix fork v1.0.0 - First Release" --notes "# Justin's KidPix v1.0.0 - Classic ...`

- (Will push the tag, but github is smart enough not to redundantly trigger the workflow.)

4. View new release, eg, <https://github.com/justinpearson/kidpix/releases/tag/v1.0.0>

## Tech Stack

**Current Implementation:**
- **Runtime**: Modular JavaScript (ES5/ES6) loaded via script tags
- **Build Tool**: Vite 6.3.5 for development server and asset serving
- **Package Manager**: Yarn 1.22.22
- **Testing**: Vitest (unit) + Playwright (e2e) configured but not yet used for JS files
- **Deployment**: GitHub Actions → GitHub Pages
- **Claude Code Integration**: Browser error monitoring with vite-plugin-terminal allows Claude Code to view browser console errors

**Future Migration Target:**
- **Framework**: React 18 with TypeScript
- **Code Quality**: ESLint + Prettier with git hooks (no Husky dependency)

### Claude Code Development Features

This project includes special features for AI-assisted development using Claude Code:

- **Real-time Error Monitoring**: Browser runtime errors appear directly in the terminal
- **Timestamped Debugging**: Local timestamps help coordinate debugging sessions
- **Full Stack Traces**: Complete error context with file locations and line numbers

**⚠️ CRITICAL for Claude Code Users**: For Claude Code to view the browser console errors, it must run the dev server (`yarn dev`) in its own background bash shell. Human developers should NOT run their own `yarn dev` in a separate terminal (which is not visible to Claude Code).

### Git Hooks

This project uses git hooks to ensure code quality:

- **Pre-commit**: Runs ESLint and Prettier on staged files
- **Commit-msg**: Validates commit message format using conventional commits

The hooks are configured by running `git config core.hooksPath .githooks` (step 3 in Development Setup above).

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
  - option 2: download tarball from https://github.com/justinpearson/kidpix
    - if tarball: you'll also be able to make code local code changes, but not push them to back to the git repo.
  - cd kidpix (or kidpix-main if used tarball)
  - `./build.sh`
    - if error: `js-beautify.js - "No such file or directory"` - need to 'npm install' :
    - npm install
      - if error message `Run install -g npm@10.5.2`, ok to do it.
    - now should have package-lock.json.
  - now should be able to run locally, see below.

### How to Play (OLD)

(On local laptop -- no internet connection required!)

- cd into kidpix dir
- yarn dev-app
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
