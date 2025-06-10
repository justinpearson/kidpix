# Quick Start - Kid Pix Maintainer Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Environment Setup](#development-environment-setup)
  - [1. Get the Code](#1-get-the-code)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Start Development Server](#3-start-development-server)
  - [4. Verify Your Setup](#4-verify-your-setup)
- [Development Workflow](#development-workflow)
  - [Code Organization](#code-organization)
  - [Making Changes](#making-changes)
  - [Git Workflow](#git-workflow)
- [Testing Your Changes](#testing-your-changes)
  - [Unit Testing (Vitest)](#unit-testing-vitest)
  - [End-to-End Testing (Playwright)](#end-to-end-testing-playwright)
  - [Manual Testing Checklist](#manual-testing-checklist)
  - [Performance Testing](#performance-testing)
- [Deployment](#deployment)
  - [Automatic Deployment](#automatic-deployment)
  - [Manual Deployment Testing](#manual-deployment-testing)
- [Technology Decisions](#technology-decisions)
  - [Why These Tools?](#why-these-tools)
- [Next Steps](#next-steps)

## Prerequisites

Before you begin, make sure you understand what Kid Pix is by reading the [user quick-start guide](../user/quick-start.md).

**Required Software:**

- [Node.js](https://nodejs.org/) v18 or higher
- [Yarn](https://yarnpkg.com/) package manager
- [Git](https://git-scm.com/)
- Modern IDE with TypeScript support (VS Code recommended)

## Development Environment Setup

### 1. Get the Code

```bash
git clone https://github.com/justinpearson/kidpix.git
cd kidpix
```

### 2. Install Dependencies

```bash
yarn install
```

This installs:

- **React 19** - UI framework
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool with HMR
- **Vitest** - Jest-compatible testing framework
- **Playwright** - Browser automation for e2e tests
- **ESLint + Prettier** - Code quality and formatting
- **Husky** - Git hooks for automated quality checks

### 3. Start Development Server

```bash
yarn dev
# Open http://localhost:5173/
```

**Available Development Endpoints:**

- `http://localhost:5173/` - React/TypeScript version (new architecture)
- `http://localhost:5173/kidpix.html` - Original app using monolithic `app.js`
- `http://localhost:5173/kidpix-orig.html` - Original app using modular JS files

The development server includes:

- Hot module replacement (HMR) for instant updates
- TypeScript compilation with error reporting
- Source maps for debugging
- Direct serving of individual JS files for easier debugging

### 4. Verify Your Setup

```bash
# Run linting
yarn lint

# Run unit tests
yarn test

# Run e2e tests (opens browser)
yarn test:e2e

# Build for production
yarn build
```

## Development Workflow

### Code Organization

**New React/TypeScript Structure:**

```
src/
├── assets/           # Static assets (images, sounds, CSS)
├── components/       # React components
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── __tests__/       # Unit tests
└── App.tsx          # Main application component
```

**Legacy JavaScript Structure:**

```
js/
├── init/            # Original initialization code (kiddopaint.js, submenus.js)
├── util/            # Core utilities (display, colors, caching, filters)
├── tools/           # Drawing tools (pencil, brush, eraser, effects)
├── textures/        # Fill pattern generators
├── submenus/        # UI submenu definitions for tool options
├── brushes/         # Brush pattern generators
├── builders/        # Complex shape builders (arrows, roads, rails)
├── stamps/          # Stamp and alphabet systems
├── sounds/          # Audio system and sound library
└── app.js           # Concatenated legacy code (DO NOT EDIT)
```

**Important Notes:**

- `kidpix.html` loads `app.js` (concatenated version with additional features)
- `kidpix-orig.html` loads individual modular files for easier development
- Use modular files when making changes to legacy JavaScript functionality
- Both versions preserve original behavior and asset compatibility

### Making Changes

#### For New React Development:

1. Create/edit components in `src/`
2. Add unit tests in `src/__tests__/`
3. Add e2e tests in `tests/e2e/`
4. Use TypeScript for type safety
5. Pre-commit hooks automatically run linting and formatting

#### For Legacy JavaScript Development:

- **NEVER edit `js/app.js`** directly - it's auto-generated
- Edit individual files in `js/` subdirectories (init, util, tools, etc.)
- Test changes using `kidpix-orig.html` which loads modular files
- Use legacy code as reference for porting to React
- Files are loaded in specific order: init → util → tools → textures → submenus → brushes → builders → stamps → sounds

### Git Workflow

**Conventional Commits (enforced by commitlint):**

```bash
# Examples of proper commit messages
git commit -m "feat(canvas): add drawing tool component"
git commit -m "fix(ui): resolve color picker accessibility issue"
git commit -m "test(tools): add unit tests for brush generator"
```

**Pre-commit Hooks:**

- ESLint automatically fixes code style issues
- Prettier formats all files
- TypeScript compilation checked
- Commit message format validated

## Testing Your Changes

### Unit Testing (Vitest)

```bash
yarn test          # Run tests once
yarn test:ui       # Interactive test runner
yarn test --watch  # Watch mode during development
```

### End-to-End Testing (Playwright)

```bash
yarn test:e2e                    # Run all browsers
yarn test:e2e --project=chromium # Single browser
yarn test:e2e --headed           # See browser during test
```

### Manual Testing Checklist

- [ ] Drawing tools work correctly
- [ ] Color picker functions properly
- [ ] Audio plays when expected
- [ ] Responsive design works on mobile
- [ ] Keyboard shortcuts function
- [ ] Local storage saves/loads artwork

### Performance Testing

- [ ] Large drawings remain responsive
- [ ] No memory leaks during extended use
- [ ] Canvas operations are smooth
- [ ] Build bundle size is reasonable

## Deployment

### Automatic Deployment

- **Main branch**: Auto-deploys to GitHub Pages via GitHub Actions
- **PR branches**: Build and test verification only

### Manual Deployment Testing

```bash
yarn build          # Create production build
yarn preview        # Test production build locally
```

## Technology Decisions

### Why These Tools?

**Vite over Create React App:**

- Faster development server with native ESM
- Better TypeScript integration
- Smaller bundle sizes
- Modern tooling ecosystem

**Vitest over Jest:**

- Native Vite integration
- Faster test execution
- Same API as Jest (easy migration)
- Better ESM support

**Playwright over Cypress:**

- Multiple browser testing (Chrome, Firefox, Safari)
- Better CI/CD integration
- More reliable for canvas testing
- Native TypeScript support

**Yarn over npm:**

- Deterministic dependency resolution
- Better workspace management
- Faster installation

## Next Steps

- Read the [maintainer how-to guides](how-to/) for specific development tasks
- Review the [architecture explanations](explanations/) for deeper understanding
- Check the development patterns in `CLAUDE.md`
- Review the testing strategy in this documentation
