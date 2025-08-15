# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modular JavaScript implementation of the classic 1989 Kid Pix drawing application, based on Vikrum's HTML/JavaScript implementation (kidpix.app). The current focus is on maintaining and improving the modular JavaScript codebase as a foundation for future migration to React/TypeScript.

## Technology Stack

- **Runtime**: Modular JavaScript (ES5/ES6) loaded via script tags
- **Build Tool**: Vite 6.3.5 for development server and asset serving
- **Package Manager**: Yarn 1.22.22
- **Linting**: ESLint 9 (currently configured for TypeScript, needs update for JS)
- **Testing**: Vitest and Playwright configured but not yet used for JS files
- **Error Monitoring**: vite-plugin-terminal for browser console errors in Claude Code development

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
- Complete documentation → **COMMIT IMMEDIATELY**

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

- Always write commit messages to a file, to avoid newline errors. same with PR descriptions. remove the files after a successful commit.
- After finishing a feature and moving its feature-request file to prompts-DONE, offer to create a pull request (PR)
- Always delete pr-body.txt after you submit the PR, so we don't use the old one by accident.

## Development Commands

### Development Server

```bash
yarn dev
# Opens development server at http://localhost:5173/
# Access points:
# - http://localhost:5173/ - Modular JavaScript version (main entry point)
```

### Build

```bash
yarn build
# Runs Vite build for production deployment
```

### Linting

```bash
yarn lint
# Runs ESLint (currently only on TypeScript files, needs update for JS files)
```

### Preview Built App

```bash
yarn preview
# Preview the built application locally
```

## Claude Code Development Workflow

### Browser Error Monitoring Setup

To facilitate development with Claude Code, this project is configured with `vite-plugin-terminal` to display browser runtime errors directly in the Vite dev server terminal; this makes browser console errors visible to Claude Code when it runs `yarn dev` in its own sub-shell.

- **NOTE FOR CLAUDE CODE**: If claude code is running the local dev server in a sub-shell (ie, `yarn dev`), claude code should remember to frequently check its stdout / stderr for browser console errors, and compare the errors' timestamps with the current time to ensure it doesn't get confused by reading old errors.

#### Setup Details

- **Plugin**: `vite-plugin-terminal@1.3.0`
- **Configuration**: Outputs to both browser console and terminal
- **Error Handlers**: Captures uncaught exceptions, unhandled promise rejections, and console errors
- **Location**: Error handling script in `index.html` imports from `virtual:terminal`
- **Timestamps**: Local time format for human readability

#### Usage for Claude Code

1. **Start Development Server**: Claude Code runs `yarn dev` in background bash shell
2. **Error Monitoring**: Runtime errors appear in terminal with full stack traces
3. **Real-time Debugging**: Errors visible immediately as user interacts with browser
4. **Error Format**: Shows file location, line numbers, complete stack traces, and timestamps

Example error output:

```
🚨 [8/14/2025, 6:09:37 AM] Runtime Error: Uncaught ReferenceError: distanceBetween is not defined
   at http://localhost:5173/js/init/kiddopaint.js:586:14
   Stack: ReferenceError: distanceBetween is not defined
    at common_ev_proc (http://localhost:5173/js/init/kiddopaint.js:586:14)
    at HTMLCanvasElement.ev_canvas (http://localhost:5173/js/init/kiddopaint.js:577:3)
```

#### Important Limitations and Pitfalls

⚠️ **BashOutput Tool Behavior**: Claude Code's `BashOutput` tool only shows **NEW** output since the last check. Once checked, previous output is "consumed" and won't appear again.

**Potential Issues:**

- **Timing Sync Problems**: If Claude checks for errors before user triggers them, may miss errors
- **Accidental Clearing**: Checking output prematurely can clear error history
- **Old vs New Confusion**: Claude might see old cached errors instead of current ones
- **Lost Context**: Previous error context disappears after each check

**Best Practices:**

- **Coordinate Timing**: User should signal when they've triggered new errors
- **Check Systematically**: Claude should only check output when expecting new errors
- **Use Timestamps**: Local timestamps help identify fresh errors vs cached ones
- **Communicate Status**: Both parties should be clear about what errors are being discussed
- **Use Browser Console as Backup**: User can always reference browser console for full error history

#### Version Compatibility

⚠️ **Important**: We use Vite 6.3.5 (not the latest 7.x) for security reasons and plugin compatibility. The `vite-plugin-terminal` has [known compatibility issues](https://github.com/patak-dev/vite-plugin-terminal/issues/34) with Vite 7.x. If you need Vite 7.x, consider implementing a custom error monitoring solution.

#### Workflow Benefits

- **Immediate Error Visibility**: No need to manually check browser console
- **Detailed Stack Traces**: Full error context with file locations
- **Continuous Monitoring**: Errors appear in real-time during development
- **Timestamped History**: Local timestamps help coordinate debugging sessions
- **Claude Code Integration**: Seamless debugging workflow for AI-assisted development

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
KiddoPaint.Alphabet = {}; // Letter/number stamps
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
- `js/stamps/`: Stamp and alphabet systems
- `js/submenus/`: UI submenu definitions for tool options
- `js/sounds/`: Audio system and sound library
- `js/util/`: Core utilities (display, colors, caching, filters)
- `js/init/`: Application initialization and setup

## Feature Development Workflow

1. Read feature requests from `prompts-TODO/` directory (newest first)
2. Create a new git branch for the feature
3. Implement using JavaScript best practices in the modular structure
4. Ensure no build or lint errors before committing
5. Use conventional commit format
6. Push branch and create PR via GitHub CLI (`gh pr create`)
7. Verify CI passes on GitHub, make & push any needed corrections
8. **BEFORE MERGING**: Move feature request file from `prompts-TODO/` to `prompts-DONE/` using `git mv`
9. Commit and push the moved feature request file to the PR
10. Merge PR and delete branch
11. Locally: `git fetch origin/main` and fast-forward local main branch

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

Testing framework is configured but not yet adapted for JavaScript files:

- Vitest and Playwright are set up but configured for TypeScript
- Need to adapt testing for JavaScript files in `js/` directory
- Focus on utility functions first (most testable)
- Consider integration tests for tool interactions
- Test canvas rendering functionality

### Coverage Thresholds (TODO: Increase as tests are added)

**Current Status (2025-06-17)**: Very low coverage thresholds set to allow CI to pass:

- Lines: 1% (currently 1.76%)
- Functions: 10% (currently 14.96%)
- Branches: 20% (currently 25%)
- Statements: 1% (currently 1.76%)

**Target Goals**: 70% lines/functions/statements, 60% branches

⚠️ **IMPORTANT**: These thresholds should be gradually increased as we add more comprehensive tests to the JavaScript codebase. See `vitest.config.ts` for current configuration.

## File Organization

- `js/`: Modular JavaScript source code (primary codebase)
- `src/assets/`: Static assets (images, sounds, CSS)
- `src/`: React/TypeScript components (future migration target)
- `index.html`: Main application entry point loading modular JS files
- Documentation in `doc/` with user and maintainer guides

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

### Canvas Management

The `KiddoPaint.Display` system handles:

- Canvas clearing and saving operations
- Undo functionality (single-level)
- Local storage persistence
- Layer compositing

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
