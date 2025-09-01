# End-to-End Testing Guide

This directory contains comprehensive end-to-end tests for the KidPix drawing application, ensuring all tools work correctly without console errors.

## Architecture Overview

Our tests follow a **per-tool architecture** for better organization and parallel execution:

```
tests/e2e/
├── shared/
│   ├── tool-helpers.ts      # Common test utilities and functions
│   └── test-fixtures.ts     # Tool definitions and test data
├── pencil.spec.ts           # Pencil tool tests
├── line.spec.ts             # Line tool tests
├── wacky-brush.spec.ts      # All 25+ Brush subtools
├── electric-mixer.spec.ts   # Mixer effects + Venetian Blinds
├── rectangle.spec.ts        # Rectangle tool tests
├── oval.spec.ts             # Circle tool tests
├── paint-can.spec.ts        # Paint Can tool tests
├── eraser.spec.ts           # Eraser tool tests
├── text.spec.ts             # Text/Alphabet tool tests
├── stamps.spec.ts           # Stamp tool tests
├── moving-van.spec.ts       # Truck tool tests
├── tool-switching.spec.ts   # Cross-tool integration tests
└── canvas-functionality.spec.ts # Canvas system tests
```

## Test Categories

### Individual Tool Tests (11 files)

Each drawing tool has its own comprehensive test file covering:

- Tool selection and highlighting
- Subtool selection and highlighting
- Canvas interaction without console errors
- Tool state persistence after switching
- Tool-specific functionality (multi-selection, effects, etc.)

### Integration Tests

- **`tool-switching.spec.ts`** - Tool switching workflows and state persistence
- **`canvas-functionality.spec.ts`** - Multi-layer canvas system and app initialization

### Shared Infrastructure

- **`shared/tool-helpers.ts`** - Reusable test functions (selectTool, testCanvasClick, etc.)
- **`shared/test-fixtures.ts`** - Tool definitions and configuration data

## What These Tests Catch

✅ **Console Errors**: Missing global function exposures (e.g., `clamp`, `rgbToHsl`, `fisherYatesArrayShuffle`)
✅ **Tool Selection**: Tools become highlighted when clicked  
✅ **Subtool Highlighting**: Subtools show red border when selected
✅ **Canvas Interaction**: Drawing on canvas works without errors
✅ **Tool Persistence**: Subtool selections persist when switching tools
✅ **Multi-Set Tools**: Tools like Pencil/Line with size + texture options work correctly
✅ **Regression Prevention**: Specific bug fixes (e.g., Venetian Blinds, Brush subtools)

## Common Test Patterns

All tool tests follow a consistent pattern:

1. **Setup**: Initialize KidPix app and console error monitoring
2. **Tool Selection**: Select tool → verify highlighting
3. **Subtool Selection**: Select subtool(s) → verify highlighting
4. **Canvas Interaction**: Click and drag on canvas → verify no console errors
5. **Tool Persistence**: Switch tools and back → verify selections persist
6. **Comprehensive Workflow**: Test multiple subtools and interaction patterns

## Benefits of Per-Tool Architecture

### Organization

- **Clear Responsibility**: Each file tests one tool thoroughly
- **Focused Debugging**: Tool issues map directly to specific test files
- **Easier Maintenance**: Changes to a tool only affect its test file

### Performance

- **Parallel Execution**: Tests can run simultaneously across multiple files
- **Faster CI**: Reduced total test runtime through parallelization
- **Isolation**: Tool test failures don't affect other tool tests

### Development Experience

- **Targeted Testing**: Run tests for just the tool you're working on
- **Clear Coverage**: Easy to see what's tested for each tool
- **Scalability**: Adding new tools doesn't create unwieldy test files

## Browser Support

Tests run on all major browsers:

- ✅ **Chromium** (Chrome/Edge)
- ✅ **Firefox**
- ✅ **WebKit** (Safari)

Audio is automatically muted during testing to prevent sound effects.

## Development Workflow

### Test-Driven Development

1. **Red**: Write a failing test that detects the bug/missing feature
2. **Green**: Implement the fix to make the test pass
3. **Refactor**: Clean up code while keeping tests passing

### Console Error Monitoring

All tests continuously monitor the browser console for JavaScript errors, ensuring real-time feedback during development.

### Integration with Development Server

Tests work seamlessly with the Vite development server for rapid iteration and debugging.

## Running Specific Tests

```bash
# Run tests for a specific tool
npx playwright test pencil.spec.ts

# Run integration tests only
npx playwright test tool-switching.spec.ts canvas-functionality.spec.ts

# Run tests in a specific browser
npx playwright test --project=chromium

# Run single test for debugging
npx playwright test pencil.spec.ts --workers=1 --headed
```

## CI Integration

These tests are designed for automated CI/CD pipelines to catch regressions before they reach production. The per-tool architecture enables:

- **Parallel CI Execution**: Multiple workers can run different tool tests simultaneously
- **Granular Reporting**: Clear identification of which tools have issues
- **Efficient Retries**: Only failed tests need to be re-run
