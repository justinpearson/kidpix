# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React/TypeScript port of the classic 1989 Kid Pix drawing application. The project migrates Vikrum's HTML/JavaScript implementation (kidpix.app) to a modern, scalable React/TypeScript stack for learning software best practices.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.4.9
- **Package Manager**: Yarn 1.22.22
- **Linting**: ESLint 9 with TypeScript support

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

## Development Commands

### Development Server

```bash
yarn dev
# Opens development server at http://localhost:5173/
# Access points:
# - http://localhost:5173/ - React/TypeScript version
# - http://localhost:5173/kidpix.html - Original app using monolithic app.js
# - http://localhost:5173/kidpix-orig.html - Original app using modular JS files
```

### Build

```bash
yarn build
# Runs TypeScript compiler and Vite build
```

### Linting

```bash
yarn lint
# Runs ESLint on all files
```

### Preview Built App

```bash
yarn preview
# Preview the built application locally
```

## Architecture Overview

### Current React Structure

The application is being migrated from a monolithic JavaScript structure to modular React components:

- `src/App.tsx`: Main application component with state management for pen color and selected tool
- `src/ColorPalette.tsx`: Color selection component
- `src/MainToolbar.tsx`: Main toolbar component for tool selection
- `src/Pencil.tsx`: Individual tool components

### Legacy JavaScript Structure (in migration)

The original codebase uses a modular architecture around the `KiddoPaint` namespace with the following structure:

**IMPORTANT**: `js/app.js` is the authoritative source - it's a concatenation of all `js/*` files with additional features implemented directly in it that are not reflected in the individual source files.

**NEW**: The application now supports both monolithic (`kidpix.html`) and modular (`kidpix-orig.html`) loading approaches:

- `kidpix.html` - Uses concatenated `js/app.js` (includes additional features not in modular files)
- `kidpix-orig.html` - Loads individual JS files from `js/` directory in correct order for easier development

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
3. Implement using React/TypeScript best practices
4. Ensure no build or lint errors before committing
5. Use conventional commit format
6. Push branch and create PR via GitHub CLI (`gh pr create`)
7. Verify CI passes on GitHub, make & push any needed corrections
8. **BEFORE MERGING**: Move feature request file from `prompts-TODO/` to `prompts-DONE/` using `git mv`
9. Commit and push the moved feature request file to the PR
10. Merge PR and delete branch
11. Locally: `git fetch origin/main` and fast-forward local main branch

## Key Development Patterns

### Component Structure

Follow React best practices:

- Functional components with hooks
- TypeScript interfaces for props
- Proper state management between components
- Event handlers passed as props

### Canvas Integration

When migrating canvas-based tools:

- Use useRef hooks for canvas elements
- Implement proper cleanup in useEffect
- Maintain the original three-method pattern (mousedown, mousemove, mouseup) in React event handlers

### State Management

Currently using local component state. Consider upgrading to Context API or state management library as complexity grows.

## Testing Strategy

No testing framework is currently configured. When adding tests:

- Add Jest and React Testing Library
- Write unit tests for individual components
- Add integration tests for tool interactions
- Test canvas rendering functionality

## File Organization

- `src/`: React/TypeScript source code
- `src/assets/`: Static assets (images, sounds, CSS from original)
- Original JS codebase preserved in `js/` for reference during migration
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

## Migration Notes

The project maintains both the new React structure and original JavaScript code during migration. Key considerations:

### Critical Source Files

- **Use `js/app.js` as the authoritative reference** - contains latest implementations
- Individual `js/*` files may be outdated compared to app.js
- Preserve original tool behavior, sound effects, and multi-layer canvas architecture
- Asset files (images, sounds) in `src/assets/` maintain original structure

### Canvas Integration Strategy

When migrating canvas-based tools to React:

- Preserve the five-canvas layer system (main, tmp, preview, anim, bnim)
- Maintain pixel-perfect rendering (`imageSmoothingEnabled = false`)
- Keep the three-method pattern (mousedown, mousemove, mouseup) in React event handlers
- Use useRef hooks for canvas elements with proper cleanup in useEffect

### Tool Migration Pattern

For each tool migration:

1. Study the tool's implementation in `js/app.js` (not individual files)
2. Identify associated submenu definitions and sound effects
3. Create React component maintaining original behavior
4. Preserve modifier key functionality and tool-specific features
5. Test with original asset files to ensure compatibility

### State Management Considerations

Original uses global `KiddoPaint.Current` object. In React migration:

- Convert to Context API or state management solution
- Maintain compatibility with canvas layer system
- Preserve undo/redo and local storage functionality
