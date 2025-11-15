# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

- **Live App**: https://justinpearson.github.io/kidpix/
- **Main Branch**: `main`
- **Current Branch**: `name-stamps` (as of October 2025)
- **Tech Stack**: Vanilla JS (~16,300 lines) + Vite 6.4.1 + Vitest + Playwright
- **No Linting**: ESLint/Prettier removed - AI writes correct code without them
- **Dev Server**: `yarn dev-app` → http://localhost:5173/
- **Feature Requests**: See `prompts-TODO/current.txt`

## Project Overview

This is a modular JavaScript implementation of the classic 1989 Kid Pix drawing application, based on Vikrum's HTML/JavaScript implementation (kidpix.app). The current focus is on maintaining and improving the modular JavaScript codebase as a foundation for future migration to React/TypeScript.

### Recent Improvements (September-October 2025)

- Multi-level undo/redo that persists across page reloads
- Expanded stamp collection with organized naming system
- Enhanced color picker tool
- Improved image organization (moved to logical folders)
- GitHub releases support for offline distribution
- Browser error monitoring integration for AI-assisted development
- Removed ESLint/Prettier to reduce development friction (AI writes correct code without them)

## Technology Stack

- **Runtime**: Modular JavaScript (ES5/ES6) loaded via script tags
- **Build Tool**: Vite 6.4.1 for development server and asset serving
- **Package Manager**: Yarn 1.22.22
- **Node.js**: v24.9.0
- **Linting**: None (ESLint and Prettier removed in commit 3f1155b - September 2025)
- **Testing**: Vitest 3.2.3 and Playwright 1.56.1 configured for JavaScript files
- **Error Monitoring**: Playwright MCP for browser console errors in Claude Code development

## CRITICAL COMMIT WORKFLOW

⚠️ **MANDATORY INTERMEDIATE COMMITS** ⚠️

Following the pattern from `.cursor/rules/git_auto_commit.md`, when implementing multi-step features:

### RULE: Commit After Each Logical Step

1. **NEVER** batch multiple completed tasks into one commit
2. **ALWAYS** commit immediately after completing each logical piece of work
3. **MUST** use conventional commit format for all commits
4. **MUST** maintain clear and consistent commit history
5. **MUST** document Claude settings changes in commit messages when any file under `.claude/` is modified

### Implementation Pattern:

- Complete one feature component → **COMMIT IMMEDIATELY**
- Complete configuration setup → **COMMIT IMMEDIATELY**
- Complete testing setup → **COMMIT IMMEDIATELY**

### Benefits:

- Maintains clear and consistent commit history
- Provides traceability between tasks and code changes
- Prevents losing work if something goes wrong
- Follows industry best practices for version control

### Example Workflow:

```bash
# ✅ CORRECT: Intermediate commits
git commit -m "feat(tooling): set up ESLint with Husky pre-commit hooks"
git commit -m "feat(tooling): configure Conventional Commits validation"
git commit -m "feat(ci): set up GitHub Actions for deployment"

# ❌ INCORRECT: Batched commit
git commit -m "feat(tooling): set up entire tech stack"
```

## Commit and PR Workflow

- After finishing a feature and moving its feature-request file to prompts-DONE, offer to create a pull request (PR)

## CI/CD and Deployment

### GitHub Actions Workflows

The project uses GitHub Actions for continuous integration and deployment:

1. **build-and-deploy-all.yml** (PRIMARY - Active)
   - Triggers: Push to main, manual workflow_dispatch
   - Builds app with Vite (to `dist/` and `dist-gh/`)
   - Deploys to GitHub Pages at https://justinpearson.github.io/kidpix/
   - Sets base URL to `/kidpix/` for GitHub Pages

2. **release.yml** (Active)
   - Triggers: Tag push matching `v*` pattern
   - Builds application for production
   - Creates tarball of `dist/` directory
   - Publishes GitHub Release with downloadable archive
   - Usage: `git tag v1.0.0 && git push --tags`

3. **test.yml** (Currently disabled)
   - Would run unit tests with coverage
   - Would run Playwright E2E tests
   - Upload test results and coverage to Codecov

4. **deploy.yml** (Currently disabled)
   - Alternative deployment workflow
   - Runs tests before deploying

### Release Process

To create a new release:

```bash
# Using npm version command (increments package.json version)
yarn release:patch   # v1.0.0 -> v1.0.1
yarn release:minor   # v1.0.0 -> v1.1.0
yarn release:major   # v1.0.0 -> v2.0.0

# Or manually create and push a tag
git tag v1.0.0
git push origin --tags
```

The release workflow automatically:
- Builds the application
- Creates a tarball (e.g., `kidpix-v1.0.0.tar.gz`)
- Publishes a GitHub Release with the tarball
- Users can download and run locally with `python -m http.server`

### Deployment URLs

- **Live App**: https://justinpearson.github.io/kidpix/
- **Releases**: https://github.com/justinpearson/kidpix/releases

## Development Commands

### Development Server

```bash
yarn dev-app       # Start dev server (opens at http://localhost:5173/)
yarn dev-app-stop  # Stop the background dev server
```

**Dev Server Notes:**
- Opens automatically at http://localhost:5173/
- Hot module reloading for instant updates
- Process ID saved to `.vite.pid` for cleanup

### Build

```bash
yarn build  # Build app for both local (dist/) and GitHub Pages (dist-gh/)
```

**Build Notes:**
- Creates `dist/` directory for local deployment (base URL: `/`)
- Creates `dist-gh/` directory for GitHub Pages deployment (base URL: `/kidpix/`)

### Testing

```bash
yarn test              # Run unit tests once
yarn test:unit         # Run unit tests in watch mode
yarn test:coverage     # Run unit tests with coverage report
yarn test:e2e          # Run Playwright end-to-end tests (headless)
yarn test:e2e:headed   # Run Playwright tests with visible browser
```

### Preview Built App

```bash
yarn preview-release        # Preview local build at http://localhost:8080/ (dist/)
yarn preview-github-pages   # Preview GitHub Pages build at http://localhost:8080/kidpix/ (dist-gh/)
```

**Preview Notes:**
- Uses Python's built-in HTTP server (`python3 -m http.server`)
- Must run `yarn build` first to generate the build directories

### Utilities

```bash
yarn screenshot  # Capture screenshots of the app (uses scripts/screenshot-capture.js)
```

**Note:** There is no `type-check` script in this project

## Claude Code Development Workflow

### Browser Error Monitoring with Playwright MCP

Claude Code can monitor browser console errors using Playwright MCP, which provides direct access to the browser's console without requiring special Vite plugins or routing errors through the webserver.

#### Setup Details

- **Tool**: Playwright MCP (Model Context Protocol)
- **Access**: Direct browser console monitoring
- **Available MCP Tools**:
  - `mcp__playwright__browser_click` - Interact with browser elements
  - `mcp__playwright__browser_console_messages` - Access browser console messages
- **Timestamps**: Browser native timestamps

#### Usage for Claude Code

1. **Start Development Server**: Run `yarn dev-app` in background bash shell
2. **Navigate to App**: Use Playwright MCP to navigate to http://localhost:5173/
3. **Monitor Console**: Use `mcp__playwright__browser_console_messages` to access console logs and errors
4. **Real-time Debugging**: Check console messages as user interacts with browser

#### Workflow Benefits

- **Direct Browser Access**: No need for webserver middleware or plugins
- **Cleaner Architecture**: Separation of concerns between dev server and error monitoring
- **Full Console Access**: See all console messages, not just errors
- **No Special Configuration**: Standard Vite setup without additional plugins
- **Reliable Monitoring**: No timing issues with BashOutput tool consumption

## Architecture Overview

### Current JavaScript Structure

The original codebase uses a modular architecture around the `KiddoPaint` namespace with the following structure:

**IMPORTANT**: The individual files in `js/` directories are now the primary source code. The application loads these modular files directly via script tags in `index.html` for easier development and maintenance.

#### Core Namespaces

```javascript
var KiddoPaint = {};
KiddoPaint.Tools = {}; // Drawing tools
KiddoPaint.Textures = {}; // Pattern generators
KiddoPaint.Brushes = {}; // Brush generators
KiddoPaint.Builders = {}; // Complex shape builders
KiddoPaint.Stamps = {}; // Stamp/sticker system
KiddoPaint.Sounds = {}; // Audio system
KiddoPaint.Display = {}; // Multi-layer canvas management
KiddoPaint.Colors = {}; // Color palette system
KiddoPaint.Current = {}; // Application state
KiddoPaint.Cache = {}; // Performance caching
KiddoPaint.Text = {}; // Letter/number stamps
KiddoPaint.Sprite = {}; // Sprite management
```

#### Multi-Layer Canvas System

The application uses multiple HTML5 canvas layers:

- **Main Canvas** (`kiddopaint`): Final rendered artwork
- **Tmp Canvas** (`tmpCanvas`): Current drawing operations and primary interaction layer
- **Preview Canvas** (`previewCanvas`): Tool previews and temporary effects
- **Animation Canvas** (`animCanvas`): Animated effects and background animations
- **Bnim Canvas** (`bnimCanvas`): Background image manipulation

#### Tool Architecture

All tools follow a consistent interface pattern with three mouse event handlers:

```javascript
KiddoPaint.Tools.Toolbox.ToolName = function () {
  this.mousedown = function (ev) {
    /* start drawing */
  };
  this.mousemove = function (ev) {
    /* continue drawing */
  };
  this.mouseup = function (ev) {
    /* finish drawing */
  };
};
```

#### Key Directories

- `js/tools/`: Drawing tools (pencil, brush, eraser, effects)
- `js/brushes/`: Brush pattern generators (circles, splatters, animations)
- `js/textures/`: Fill pattern generators (stripes, speckles, gradients)
- `js/builders/`: Complex shape builders (arrows, roads, rails)
- `js/stamps/`: Stamp and text systems
- `js/submenus/`: UI submenu definitions for tool options
- `js/sounds/`: Audio system and sound library
- `js/util/`: Core utilities (display, colors, caching, filters)
- `js/init/`: Application initialization and setup

## Feature Development Workflow

1. Read feature requests from `prompts-TODO/` directory (check `current.txt` first, then others)
2. Create a new git branch for the feature
3. **First commit**: Add the feature request file to git (if not already tracked)
4. Implement using JavaScript best practices in the modular structure
5. Make logical, incremental commits following conventional commit format
6. Run tests locally (`yarn test`) before pushing
7. Push branch and create PR via GitHub CLI (`gh pr create`)
8. Verify CI passes on GitHub, make & push any needed corrections
9. **BEFORE MERGING**: Move feature request file from `prompts-TODO/` to `prompts-DONE/` using `git mv`
10. Commit and push the moved feature request file to the PR
11. Merge PR and delete branch via GitHub UI
12. Locally: `git checkout main && git pull origin main` to sync with remote

## Key Development Patterns

### Adding New Tools

1. Create tool file in `js/tools/` following the three-method pattern (mousedown, mousemove, mouseup)
2. Add submenu definition in `js/submenus/` if needed
3. Add associated sounds in `js/sounds/sounds.js`
4. Update HTML toolbar in `index.html` with tool button
5. Test changes with development server

### Adding New Brushes/Textures

1. Create generator function in respective directory (`js/brushes/` or `js/textures/`)
2. Return canvas element or pattern for use by tools
3. Follow naming convention: `KiddoPaint.Brushes.BrushName` or `KiddoPaint.Textures.TextureName`

### Canvas Integration

- Always use `KiddoPaint.Display` methods for canvas operations
- Maintain proper layer management and undo functionality
- Preserve pixel-perfect rendering (`imageSmoothingEnabled = false`)
- Keep the three-method pattern for all tools

## Testing Strategy

### Current Test Setup

- **Unit Tests**: Vitest 3.2.3 configured for both JavaScript and TypeScript files
  - Test files: `**/*.{test,spec}.{js,ts,tsx}` and `**/js/**/*.{test,spec}.js`
  - Environment: jsdom for DOM testing
  - Setup file: `src/test-setup.ts`
  - Coverage provider: v8
  - Coverage output: text, json, html formats

- **E2E Tests**: Playwright 1.52.0 configured
  - Test files in `tests/e2e/`
  - Excluded from Vitest coverage
  - Multiple browser support (Chromium, Firefox, WebKit)

- **Coverage Scope**:
  - Includes: `js/**/*.js` and `src/**/*.{js,ts,tsx}`
  - Excludes: config files, test files, node_modules, coverage, dist, site

### Coverage Thresholds (TODO: Increase as tests are added)

**Current Status (as of June 2025)**: Very low coverage thresholds set to allow CI to pass:

- Lines: 1% (currently 1.76%)
- Functions: 10% (currently 14.96%)
- Branches: 20% (currently 25%)
- Statements: 1% (currently 1.76%)

**Target Goals**: 70% lines/functions/statements, 60% branches

⚠️ **IMPORTANT**: These thresholds should be gradually increased as we add more comprehensive tests to the JavaScript codebase. See [vitest.config.ts](vitest.config.ts:30-35) for current configuration.

### Test Development Priorities

1. Utility functions in `js/util/` (most testable, already has some tests)
2. Brush and texture generators (pure functions)
3. Tool behavior and canvas operations
4. Integration tests for multi-tool workflows
5. E2E tests for complete user journeys

## File Organization

- `js/`: Modular JavaScript source code (~15,700 lines, primary codebase)
  - `js/tools/`: 50+ drawing tools
  - `js/brushes/`: 20+ brush pattern generators
  - `js/textures/`: Texture/fill pattern generators
  - `js/builders/`: Complex shape builders
  - `js/stamps/`: Stamp and text systems
  - `js/submenus/`: UI submenu definitions
  - `js/sounds/`: Audio system and sound library
  - `js/util/`: Core utilities (display, colors, caching, filters)
  - `js/init/`: Application initialization and setup
- `src/`: React/TypeScript components and assets
  - `src/assets/`: Static assets (images, sounds, CSS)
  - `src/components/`, `src/contexts/`, `src/hooks/`: Future React migration target
  - `src/kidpix-main.js`: Main entry point for React version (future)
  - `src/test-setup.ts`: Vitest test setup
- `index.html`: Main application entry point loading modular JS files
- `prompts-TODO/`: Feature request files (newest first)
- `prompts-DONE/`: Completed feature requests
- `util/`: Utility scripts for stamp management
  - Stamp spritesheet PNGs (kidpix-spritesheet-0.png through -8.png)
  - Stamp name JSON files with metadata for all stamps
  - `stamp-verification.html`: Visual tool for verifying stamp names and positions
- `scripts/`: Development scripts (screenshot capture, install scripts)
- `tests/`: Test files
  - `tests/e2e/`: Playwright end-to-end tests
- `.github/workflows/`: CI/CD workflows

## Key Systems

### Event Handling

Central event dispatcher routes mouse/touch events to the current tool:

```javascript
function ev_canvas(ev) {
  var func = KiddoPaint.Current.tool[ev.type];
  if (func) func(ev);
}
```

### Modifier Keys

Extensive use of modifier keys (Shift, Alt, Ctrl, Meta) to alter tool behavior. Many tools support Shift to enlarge their effect.

### Submenu System

Submenus are defined as arrays of button configurations that are dynamically rendered:

```javascript
KiddoPaint.Submenu.toolname = [
  {
    name: "Option Name",
    imgSrc: "img/icon.png",
    handler: function () {
      /* configure tool */
    },
  },
];
```

### Sound Integration

Each tool can have associated sounds (start, during, end) with support for random sound selection and multi-part audio sequences.

### Canvas Management and Persistence

The `KiddoPaint.Display` system handles:

- Canvas clearing and saving operations
- **Multi-level undo/redo** (works across page reloads!)
  - Implemented in commit f25d218 (September 2025)
  - Stores canvas states in browser localStorage
  - Maintains undo/redo history across sessions
- Local storage persistence for drawings
- Layer compositing across five canvas layers

## Future Migration Notes

The project currently uses modular JavaScript as a foundation for future React/TypeScript migration. Key considerations:

### Current State

- Individual `js/*` files are the primary source code
- Application loads modular files directly for easier development
- Preserve original tool behavior, sound effects, and multi-layer canvas architecture
- Asset files (images, sounds) in `src/assets/` maintain original structure

### Future React Migration Strategy

When migrating to React/TypeScript:

- Use current modular JS files as reference implementation
- Preserve the five-canvas layer system (main, tmp, preview, anim, bnim)
- Maintain pixel-perfect rendering (`imageSmoothingEnabled = false`)
- Convert three-method pattern to React event handlers with hooks
- Convert global `KiddoPaint.Current` object to Context API or state management
- Maintain compatibility with existing assets and sounds
