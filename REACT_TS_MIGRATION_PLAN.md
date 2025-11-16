# React/TypeScript Migration Plan

**Project:** Kid Pix
**Created:** 2025-01-16
**Status:** Planning Phase

---

## Executive Summary

This document outlines a comprehensive plan to migrate the Kid Pix codebase from vanilla JavaScript to React/TypeScript. The migration will be executed in 5 phases over 9-14 weeks using an incremental, bottom-up approach that keeps the application functional at every stage.

**Key Statistics:**
- **Current Codebase:** 115 JavaScript files, 23,680 lines of code
- **Components to Migrate:** 49 tools, 20 brushes, 13 submenus, 5-layer canvas system
- **Migration Strategy:** Incremental with side-by-side dual-mode operation
- **Risk Level:** Low to Medium (managed through phased approach)

**Critical Success Factors:**
1. App remains functional throughout migration
2. Pixel-perfect rendering matches vanilla JS version
3. All 16 E2E tests pass at each phase
4. Performance equals or exceeds current implementation

---

## Table of Contents

1. [Current State Assessment](#current-state-assessment)
2. [Migration Strategy](#migration-strategy)
3. [Phase 1: Foundation & Infrastructure](#phase-1-foundation--infrastructure)
4. [Phase 2: Core Systems](#phase-2-core-systems)
5. [Phase 3: Simple Tools](#phase-3-simple-tools)
6. [Phase 4: Complex Tools](#phase-4-complex-tools)
7. [Phase 5: UI & Polish](#phase-5-ui--polish)
8. [Testing Strategy](#testing-strategy)
9. [Risk Assessment & Mitigation](#risk-assessment--mitigation)
10. [Timeline & Resources](#timeline--resources)
11. [Success Criteria](#success-criteria)

---

## Current State Assessment

### Vanilla JavaScript Architecture

**Namespace Structure:**
- Global `KiddoPaint` namespace with 12 sub-namespaces
- Tools, Brushes, Textures, Builders, Stamps, Sounds, Display, Colors, etc.

**File Organization (115 files, 23,680 lines):**
- `js/tools/` - 49 files (pencil, brush, eraser, effects)
- `js/brushes/` - 20 files (pattern generators)
- `js/util/` - 20 files (display, colors, filters, caching)
- `js/submenus/` - 13 files (UI submenu definitions)
- `js/sounds/` - 1 file, 448 lines (audio system)
- `js/stamps/` - 4 files (stamp and text systems)
- `js/builders/` - 4 files (complex shape builders)
- `js/textures/` - 2 files (fill patterns)
- `js/init/` - 2 files (initialization, event routing)

**Key Systems:**
1. **Five-Layer Canvas System:**
   - Main canvas (`kiddopaint`) - Final artwork
   - Tmp canvas (`tmpCanvas`) - Current drawing, primary interaction
   - Preview canvas (`previewCanvas`) - Tool previews
   - Animation canvas (`animCanvas`) - Animated effects
   - Background canvas (`bnimCanvas`) - Background images
   - All layers: 1300x650px, pixel-perfect rendering

2. **Tool Architecture:**
   - Consistent three-method pattern: `mousedown`, `mousemove`, `mouseup`
   - Central event dispatcher routes to current tool
   - Extensive modifier key support (Shift, Alt, Ctrl, Meta, Tilde)
   - Velocity tracking for pressure-sensitive effects

3. **Undo/Redo System:**
   - Multi-level undo with localStorage persistence
   - 30 states in memory, 10 persisted across reloads
   - Quota handling with JPEG fallback
   - Implemented in `js/util/display.js` (284 lines)

4. **Sound System:**
   - 45+ sound effects with randomization
   - Enable/disable toggle
   - Multi-part sequences (e.g., doorbell: ding-dong, creak, wow)
   - Pre-loaded Audio objects in `js/sounds/sounds.js`

5. **Global State:**
   - `KiddoPaint.Current` object holds all application state
   - Colors, tool reference, modifier keys, scaling, velocity
   - No persistence except canvas content

### Existing React Infrastructure

**Already Implemented in `src/`:**

1. **Components (5 files):**
   - `App.tsx` - Basic app shell
   - `Canvas/CanvasContainer.tsx` - Five-layer canvas setup
   - `Canvas/CanvasLayer.tsx` - Individual layer component
   - `UI/Toolbar.tsx` - Skeleton toolbar
   - `UI/ColorPalette.tsx` - Skeleton color palette

2. **Context & State:**
   - `contexts/KidPixContext.tsx` - React Context with reducer
   - State: `currentTool`, `currentColor`, `brushSize`, `isDrawing`, `canvasLayers`, `undoStack`, `redoStack`
   - Actions: `SET_TOOL`, `SET_COLOR`, `SET_BRUSH_SIZE`, etc.
   - Undo/redo using ImageData arrays (max 20, no localStorage)

3. **Hooks (2 files):**
   - `hooks/useCanvasSetup.ts` - Canvas initialization (minimal)
   - `hooks/useDrawingEvents.ts` - Event handler stub (console.log only)

4. **Entry Point:**
   - `main.tsx` - React app entry (activated via `?react` URL param)

**Current Canvas State:**
- ✅ Five layers created with correct z-index
- ✅ Pixel-perfect rendering enabled (`imageSmoothingEnabled = false`)
- ✅ Canvas refs stored in context
- ❌ Wrong dimensions (640x480 instead of 1300x650)
- ❌ Event handlers stubbed out
- ❌ No display utilities ported
- ❌ No localStorage persistence

### TypeScript Configuration

**Already Configured:**
- `tsconfig.json` - Root config
- `tsconfig.app.json` - App-specific (ES2020, React JSX, strict mode)
- TypeScript includes `js/` directory for gradual migration
- All necessary type packages installed

### Build & Test Infrastructure

**Build Tools:**
- Vite 6.4.1 with React plugin
- Dual build: `dist/` (local) and `dist-gh/` (GitHub Pages)
- Dev server on port 5173 with hot reload

**Testing:**
- **Unit Tests:** Vitest 3.2.3, jsdom environment
  - 4 existing tests in `js/util/` (colors, keyboard, stamp-names, utils)
  - Very low coverage: 1.76% lines, 14.96% functions, 25% branches
  - Target: 70% lines/functions/statements, 60% branches

- **E2E Tests:** Playwright 1.56.1
  - 16 test files covering canvas, tools, keyboard shortcuts
  - Tests: pencil, line, rectangle, oval, eraser, paint-can, text, stamps, wacky-brush, electric-mixer, moving-van
  - Multiple browsers: Chromium, Firefox, WebKit

**CI/CD:**
- GitHub Actions workflows for build, deploy, test, release
- Deploys to https://justinpearson.github.io/kidpix/

---

## Migration Strategy

### Core Principles

1. **Incremental Migration:** Bottom-up approach from utilities to UI
2. **Side-by-Side Operation:** Both versions run concurrently (vanilla JS via default, React via `?react`)
3. **Continuous Validation:** E2E tests run at each phase boundary
4. **Pixel-Perfect Parity:** Visual regression testing ensures identical rendering
5. **Performance First:** Benchmark canvas operations to prevent regressions

### Dual-Mode Operation

The existing URL parameter system (`?react`) enables:
- **Default:** Vanilla JS version (production)
- **`?react`:** React version (development)
- **Benefits:**
  - Immediate A/B comparison
  - Safe rollback if issues arise
  - Tool-by-tool migration validation
  - User testing before cutover

### Phase Boundaries

Each phase ends with:
1. All unit tests passing
2. All E2E tests passing
3. Manual visual comparison with vanilla JS
4. Performance benchmarks meeting targets
5. Git commit with conventional commit message
6. Documentation updates

### Rollback Plan

At any phase, if critical issues arise:
1. Keep React version behind `?react` parameter
2. Continue using vanilla JS as default
3. Fix issues in React version without user impact
4. Re-validate before advancing

---

## Phase 1: Foundation & Infrastructure

**Timeline:** 1-2 weeks
**Risk Level:** Low
**Goal:** Establish type-safe foundation without touching drawing logic

### Overview

Phase 1 focuses on creating the foundational infrastructure that all subsequent phases will build upon. This includes TypeScript type definitions, utility function migrations, and completing the canvas infrastructure. Since these are primarily pure functions and infrastructure code, the risk is low and testing is straightforward.

### Task 1: TypeScript Type Definitions (2-3 days)

#### 1.1 Core Type Definitions

**Create:** `src/types/kiddopaint.ts`

```typescript
// Tool interface - every tool follows this pattern
export interface Tool {
  mousedown: (ev: MouseEvent) => void;
  mousemove: (ev: MouseEvent) => void;
  mouseup: (ev: MouseEvent) => void;
}

// Canvas layer names
export type CanvasLayerName = 'main' | 'tmp' | 'preview' | 'anim' | 'bnim';

// Canvas layer collection
export interface CanvasLayers {
  main: HTMLCanvasElement | null;
  tmp: HTMLCanvasElement | null;
  preview: HTMLCanvasElement | null;
  anim: HTMLCanvasElement | null;
  bnim: HTMLCanvasElement | null;
}

// Global application state (matches vanilla JS KiddoPaint.Current)
export interface KidPixAppState {
  // Colors
  color: string;
  altColor: string;
  terColor: string;

  // Current tool
  tool: Tool | null;
  toolName: string;

  // Modifier keys
  modified: boolean;      // Shift key
  modifiedAlt: boolean;   // Alt key
  modifiedCtrl: boolean;  // Ctrl key
  modifiedMeta: boolean;  // Meta/Cmd key
  modifiedTilde: boolean; // Tilde key

  // Scaling and multipliers
  scaling: number;        // Affected by Shift key
  multiplier: number;     // User-set multiplier (1-9)

  // Velocity (pressure-sensitive drawing)
  velocity: number;
  velocityMultiplier: number;
  velToggle: boolean;
  modifiedToggle: boolean;
}

// Sound system types
export interface SoundLibrary {
  [key: string]: HTMLAudioElement | HTMLAudioElement[];
}

export type SoundName = string;

// Brush and texture generator types
export type BrushGenerator = (size: number) => HTMLCanvasElement;
export type TextureGenerator = () => CanvasPattern | null;

// GlobalCompositeOperation type alias
export type CompositeOperation = GlobalCompositeOperation;

// Undo/redo persistence
export interface UndoRedoState {
  undoData: string[];  // base64 data URLs
  redoData: string[];
}
```

**Deliverable:** Complete type definitions covering all KiddoPaint subsystems

#### 1.2 Utility Type Definitions

**Create:** `src/types/utils.ts`

```typescript
// Color utilities
export interface RGB {
  r: number;  // 0-255
  g: number;  // 0-255
  b: number;  // 0-255
}

export interface HSV {
  h: number;  // 0-360
  s: number;  // 0-1
  v: number;  // 0-1
}

export interface RGBA extends RGB {
  a: number;  // 0-1
}

// Filter function type
export type FilterFunction = (
  imageData: ImageData,
  ...params: any[]
) => ImageData;

// Canvas dimensions
export interface CanvasDimensions {
  width: number;
  height: number;
}

// Default canvas size (matches vanilla JS)
export const DEFAULT_CANVAS_SIZE: CanvasDimensions = {
  width: 1300,
  height: 650,
};
```

**Deliverable:** Utility type definitions file

#### 1.3 Update Context Types

**Edit:** `src/contexts/KidPixContext.tsx`

Expand state interface to match vanilla JS more closely:

```typescript
export interface KidPixState {
  // Tool and colors
  currentTool: string;
  currentColor: string;
  altColor: string;
  terColor: string;
  brushSize: number;

  // Drawing state
  isDrawing: boolean;

  // Modifier keys
  shiftPressed: boolean;
  altPressed: boolean;
  ctrlPressed: boolean;
  metaPressed: boolean;

  // Canvas layers
  canvasLayers: CanvasLayers;

  // Undo/redo (enhanced with localStorage in Task 3.3)
  undoStack: string[];  // data URLs instead of ImageData
  redoStack: string[];

  // Settings
  undoEnabled: boolean;
  soundEnabled: boolean;
}
```

Add new actions:

```typescript
export type KidPixAction =
  // ... existing actions
  | { type: 'SET_ALT_COLOR'; payload: string }
  | { type: 'SET_TER_COLOR'; payload: string }
  | { type: 'SET_MODIFIER_KEY'; payload: { key: 'shift' | 'alt' | 'ctrl' | 'meta'; pressed: boolean } }
  | { type: 'LOAD_UNDO'; payload: string[] }
  | { type: 'LOAD_REDO'; payload: string[] }
  | { type: 'PUSH_UNDO'; payload: string }
  | { type: 'UNDO'; payload: string }
  | { type: 'REDO'; payload: string }
  | { type: 'TOGGLE_UNDO' }
  | { type: 'TOGGLE_SOUND' };
```

**Deliverable:** Updated context with expanded state and actions

#### 1.4 JSDoc Annotations for Gradual Typing

Add JSDoc comments to existing vanilla JS files for incremental type safety:

**Files to annotate:**
- `js/util/colors.js`
- `js/util/utils.js`
- `js/util/filters.js`
- `js/util/display.js`

**Example:**
```javascript
/**
 * Convert RGB to HSV color space
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {{h: number, s: number, v: number}} HSV object
 */
function rgbToHsv(r, g, b) { ... }
```

**Deliverable:** JSDoc annotations for top 10 utility files

### Task 2: Utility Functions Migration (3-4 days)

#### 2.1 Color Utilities

**Source:** `js/util/colors.js` (220 lines)
**Target:** `src/utils/colors.ts` (~250 lines with types)
**Existing Tests:** `js/util/colors.test.js` (3 tests)

**Functions to migrate:**
1. `rgbToHsv(r: number, g: number, b: number): HSV`
2. `hsvToRgb(h: number, s: number, v: number): RGB`
3. `hexToRgb(hex: string): RGB | null`
4. `rgbToHex(r: number, g: number, b: number): string`
5. `getContrastColor(hexColor: string): string`
6. Color palette generation helpers

**Testing:**
- Port existing tests to `src/utils/colors.test.ts`
- Add edge case tests (invalid hex, boundary values)
- Add round-trip tests (RGB→HSV→RGB consistency)
- Target: 100% test coverage

**Commands:**
```bash
yarn test:unit src/utils/colors.test.ts
yarn test:coverage src/utils/colors.ts
```

**Deliverable:** Fully typed, 100% tested color utilities

#### 2.2 Math Utilities

**Source:** `js/util/utils.js` (~150 lines, extract math functions)
**Target:** `src/utils/math.ts`

**Functions to migrate:**

```typescript
export function clamp(value: number, min: number, max: number): number;
export function lerp(start: number, end: number, t: number): number;
export function distance(x1: number, y1: number, x2: number, y2: number): number;
export function randomInt(min: number, max: number): number;
export function randomFloat(min: number, max: number): number;
```

**Testing:**
- Create `src/utils/math.test.ts`
- Test each function comprehensively
- Edge cases: NaN, Infinity, negative values, zero
- Target: 100% coverage

**Deliverable:** Typed math utilities with full test coverage

#### 2.3 Filter Utilities

**Source:** `js/util/filters.js`
**Target:** `src/utils/filters.ts`

**Functions to migrate:**

```typescript
export function invertColors(imageData: ImageData): ImageData;
export function grayscale(imageData: ImageData): ImageData;
export function threshold(imageData: ImageData, level: number): ImageData;
export function adjustBrightness(imageData: ImageData, amount: number): ImageData;
```

**Testing:**
- Create `src/utils/filters.test.ts`
- Use canvas test utilities (jsdom)
- Verify pixel-level correctness
- Target: 100% coverage

**Deliverable:** Typed filter functions with pixel-perfect tests

#### 2.4 Canvas Helper Utilities

**Create:** `src/utils/canvas.ts` (new file)

Core canvas utilities used throughout the app:

```typescript
/**
 * Create a canvas with pixel-perfect rendering
 */
export function createCanvas(
  width = DEFAULT_CANVAS_SIZE.width,
  height = DEFAULT_CANVAS_SIZE.height,
  pixelPerfect = true
): HTMLCanvasElement;

/**
 * Get 2D context with pixel-perfect rendering
 */
export function getPixelPerfectContext(
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D | null;

/**
 * Clear entire canvas
 */
export function clearCanvas(canvas: HTMLCanvasElement): void;

/**
 * Copy source canvas to destination canvas
 */
export function copyCanvas(
  source: HTMLCanvasElement,
  dest: HTMLCanvasElement
): void;

/**
 * Get canvas as data URL with quota handling
 */
export function canvasToDataURL(canvas: HTMLCanvasElement): string;

/**
 * Load image from data URL (returns Promise)
 */
export function loadImageFromDataURL(
  dataURL: string
): Promise<HTMLImageElement>;

/**
 * Convert canvas to ImageData
 */
export function canvasToImageData(
  canvas: HTMLCanvasElement
): ImageData | null;

/**
 * Convert ImageData to canvas
 */
export function imageDataToCanvas(imageData: ImageData): HTMLCanvasElement;
```

**Testing:**
- Create `src/utils/canvas.test.ts`
- Test canvas creation, clearing, copying
- Test data URL conversion and quota handling
- Target: 100% coverage

**Deliverable:** Canvas utility library with tests

### Task 3: Complete Canvas Infrastructure (4-5 days)

#### 3.1 Fix Canvas Dimensions

**Edit:** `src/components/Canvas/CanvasContainer.tsx`

Change from 640x480 to 1300x650 (matches vanilla JS):

```typescript
const CANVAS_WIDTH = 1300;
const CANVAS_HEIGHT = 650;

// Update all CanvasLayer components
<CanvasLayer
  name="bnim"
  width={CANVAS_WIDTH}
  height={CANVAS_HEIGHT}
  zIndex={1}
  className="canvas-bnim"
/>
// ... repeat for all 5 layers
```

**Validation:**
- Visual inspection: canvas size correct
- Browser DevTools: verify canvas element dimensions
- Compare with vanilla JS version

**Deliverable:** Correct canvas dimensions (1300x650)

#### 3.2 Create Display Utilities Hook

**Create:** `src/hooks/useDisplayUtils.ts`

Port display utility functions from `js/util/display.js`:

```typescript
export function useDisplayUtils() {
  const { state } = useKidPix();
  const { canvasLayers } = state;

  const clearMain = useCallback(() => { ... }, [canvasLayers.main]);
  const clearTmp = useCallback(() => { ... }, [canvasLayers.tmp]);
  const clearPreview = useCallback(() => { ... }, [canvasLayers.preview]);
  const clearAnim = useCallback(() => { ... }, [canvasLayers.anim]);
  const clearBnim = useCallback(() => { ... }, [canvasLayers.bnim]);

  const saveMain = useCallback(() => {
    // Copy tmp canvas to main canvas, then clear tmp
    if (canvasLayers.tmp && canvasLayers.main) {
      const ctx = canvasLayers.main.getContext('2d');
      if (ctx) {
        ctx.drawImage(canvasLayers.tmp, 0, 0);
        clearTmp();
      }
    }
  }, [canvasLayers.main, canvasLayers.tmp, clearTmp]);

  const saveMainWithComposite = useCallback(
    (operation: GlobalCompositeOperation) => {
      // Save with custom composite operation (e.g., 'destination-out' for eraser)
      if (canvasLayers.tmp && canvasLayers.main) {
        const ctx = canvasLayers.main.getContext('2d');
        if (ctx) {
          const prevOp = ctx.globalCompositeOperation;
          ctx.globalCompositeOperation = operation;
          ctx.drawImage(canvasLayers.tmp, 0, 0);
          ctx.globalCompositeOperation = prevOp;
          clearTmp();
        }
      }
    },
    [canvasLayers.main, canvasLayers.tmp, clearTmp]
  );

  return {
    clearMain,
    clearTmp,
    clearPreview,
    clearAnim,
    clearBnim,
    saveMain,
    saveMainWithComposite,
  };
}
```

**Testing:**
- Create integration test for display operations
- Test clearing each layer
- Test saveMain composites tmp to main
- Test composite operations work correctly

**Deliverable:** Display utilities hook with tests

#### 3.3 Create Undo/Redo with localStorage Hook

**Create:** `src/hooks/useUndoRedo.ts`

Port undo/redo system from `js/util/display.js` (lines 1-223):

**Key Requirements:**
- 30 states in memory, 10 persisted to localStorage
- Load from localStorage on mount
- Save to localStorage after each operation
- Quota handling: clear storage on quota exceeded
- Important: Current canvas state is NOT in buffers (tools save BEFORE drawing)

```typescript
const UNDO_MEMORY_LIMIT = 30;
const UNDO_STORAGE_LIMIT = 10;

export function useUndoRedo() {
  const { state, dispatch } = useKidPix();
  const { canvasLayers, undoStack, redoStack, undoEnabled } = state;
  const isInitialized = useRef(false);

  // Load undo/redo from localStorage on mount (one time only)
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    try {
      const undoData = localStorage.getItem('kiddopaint_undo');
      const redoData = localStorage.getItem('kiddopaint_redo');

      if (undoData) {
        const parsed = JSON.parse(undoData);
        dispatch({
          type: 'LOAD_UNDO',
          payload: parsed.slice(-UNDO_STORAGE_LIMIT)
        });
      }
      if (redoData) {
        const parsed = JSON.parse(redoData);
        dispatch({
          type: 'LOAD_REDO',
          payload: parsed.slice(-UNDO_STORAGE_LIMIT)
        });
      }
    } catch (e) {
      console.warn('Failed to load undo/redo state:', e);
    }
  }, [dispatch]);

  // Save to localStorage when stacks change
  const saveToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem(
        'kiddopaint_undo',
        JSON.stringify(undoStack.slice(-UNDO_STORAGE_LIMIT))
      );
      localStorage.setItem(
        'kiddopaint_redo',
        JSON.stringify(redoStack.slice(-UNDO_STORAGE_LIMIT))
      );
    } catch (e) {
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, clearing undo/redo');
        localStorage.removeItem('kiddopaint_undo');
        localStorage.removeItem('kiddopaint_redo');
      }
    }
  }, [undoStack, redoStack]);

  // Save undo state (called BEFORE drawing by tools)
  const saveUndo = useCallback(() => {
    if (!undoEnabled || !canvasLayers.main) return false;

    const dataURL = canvasToDataURL(canvasLayers.main);
    dispatch({ type: 'PUSH_UNDO', payload: dataURL });
    saveToLocalStorage();
    return true;
  }, [undoEnabled, canvasLayers.main, dispatch, saveToLocalStorage]);

  // Undo operation
  const undo = useCallback(async () => {
    if (undoStack.length === 0 || !canvasLayers.main) {
      console.log('undo buffer empty');
      return;
    }

    // Save current state to redo stack
    const currentState = canvasToDataURL(canvasLayers.main);
    const previousState = undoStack[undoStack.length - 1];

    // Load previous state
    const img = await loadImageFromDataURL(previousState);
    const ctx = canvasLayers.main.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasLayers.main.width, canvasLayers.main.height);
      ctx.drawImage(img, 0, 0);
    }

    // Update stacks
    dispatch({ type: 'UNDO', payload: currentState });
    saveToLocalStorage();
  }, [undoStack, canvasLayers.main, dispatch, saveToLocalStorage]);

  // Redo operation
  const redo = useCallback(async () => {
    if (redoStack.length === 0 || !canvasLayers.main) {
      console.log('redo buffer empty');
      return;
    }

    // Save current state to undo stack
    const currentState = canvasToDataURL(canvasLayers.main);
    const nextState = redoStack[0];

    // Load next state
    const img = await loadImageFromDataURL(nextState);
    const ctx = canvasLayers.main.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasLayers.main.width, canvasLayers.main.height);
      ctx.drawImage(img, 0, 0);
    }

    // Update stacks
    dispatch({ type: 'REDO', payload: currentState });
    saveToLocalStorage();
  }, [redoStack, canvasLayers.main, dispatch, saveToLocalStorage]);

  return {
    saveUndo,
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  };
}
```

**Update Context Reducer:**

Add cases to `src/contexts/KidPixContext.tsx`:

```typescript
case 'LOAD_UNDO':
  return { ...state, undoStack: action.payload };

case 'LOAD_REDO':
  return { ...state, redoStack: action.payload };

case 'PUSH_UNDO':
  return {
    ...state,
    undoStack: [...state.undoStack, action.payload].slice(-30),
    redoStack: [],  // Clear redo on new action
  };

case 'UNDO':
  if (state.undoStack.length === 0) return state;
  return {
    ...state,
    undoStack: state.undoStack.slice(0, -1),
    redoStack: [action.payload, ...state.redoStack],
  };

case 'REDO':
  if (state.redoStack.length === 0) return state;
  return {
    ...state,
    undoStack: [...state.undoStack, action.payload],
    redoStack: state.redoStack.slice(1),
  };

case 'TOGGLE_UNDO':
  return { ...state, undoEnabled: !state.undoEnabled };
```

**Testing:**
- Test undo/redo operations
- Test localStorage persistence (reload page)
- Test quota exceeded handling
- Test state limits (30 in memory, 10 persisted)

**Deliverable:** localStorage-backed undo/redo system

#### 3.4 Create Canvas Persistence Hook

**Create:** `src/hooks/useCanvasPersistence.ts`

Port canvas save/load from `js/util/display.js` (lines 225-265):

```typescript
export function useCanvasPersistence() {
  const { state } = useKidPix();
  const { canvasLayers } = state;

  // Load canvas from localStorage on mount (or splash screen if empty)
  useEffect(() => {
    if (!canvasLayers.main) return;

    const loadCanvas = async () => {
      try {
        const saved = localStorage.getItem('kiddopaint');
        const imgSrc = saved || 'static/splash.png';

        const img = await loadImageFromDataURL(imgSrc);
        const ctx = canvasLayers.main?.getContext('2d');
        if (ctx && canvasLayers.main) {
          ctx.clearRect(0, 0, canvasLayers.main.width, canvasLayers.main.height);
          ctx.drawImage(img, 0, 0);
        }
      } catch (e) {
        console.warn('Failed to load canvas from localStorage:', e);
      }
    };

    loadCanvas();
  }, [canvasLayers.main]);

  // Save canvas to localStorage
  const saveCanvas = useCallback(() => {
    if (!canvasLayers.main) return;

    try {
      const dataURL = canvasToDataURL(canvasLayers.main);
      localStorage.setItem('kiddopaint', dataURL);
    } catch (e) {
      console.warn('Failed to save canvas:', e);
    }
  }, [canvasLayers.main]);

  // Clear localStorage (all keys)
  const clearStorage = useCallback(() => {
    localStorage.removeItem('kiddopaint');
    localStorage.removeItem('kiddopaint_undo');
    localStorage.removeItem('kiddopaint_redo');
  }, []);

  return {
    saveCanvas,
    clearStorage,
  };
}
```

**Testing:**
- Test canvas loads from localStorage
- Test canvas loads splash.png if localStorage empty
- Test canvas saves to localStorage
- Test clearStorage removes all keys

**Deliverable:** Canvas persistence hook with tests

### Phase 1 Deliverables

**End of Phase 1 you should have:**

1. ✅ **Type Definitions**
   - `src/types/kiddopaint.ts` - Core types (Tool, CanvasLayers, KidPixAppState, etc.)
   - `src/types/utils.ts` - Utility types (RGB, HSV, FilterFunction, etc.)
   - Updated `src/contexts/KidPixContext.tsx` with expanded state

2. ✅ **Utility Functions** (100% tested)
   - `src/utils/colors.ts` + `colors.test.ts` (100% coverage)
   - `src/utils/math.ts` + `math.test.ts` (100% coverage)
   - `src/utils/canvas.ts` + `canvas.test.ts` (100% coverage)
   - `src/utils/filters.ts` + `filters.test.ts` (if time permits)

3. ✅ **Canvas Infrastructure**
   - Fixed canvas dimensions (1300x650)
   - `src/hooks/useDisplayUtils.ts` - Display operations (clear, save, composite)
   - `src/hooks/useUndoRedo.ts` - Undo/redo with localStorage persistence
   - `src/hooks/useCanvasPersistence.ts` - Canvas save/load

4. ✅ **Testing**
   - Unit tests for all utilities (100% coverage)
   - Integration tests for canvas operations
   - Manual testing checklist completed

### Phase 1 Success Criteria

- [ ] All TypeScript compiles without errors
- [ ] Unit test coverage ≥ 100% for utilities
- [ ] Canvas renders correctly (1300x650, pixel-perfect)
- [ ] Undo/redo works and persists across page reloads
- [ ] localStorage quota handling tested
- [ ] No regressions in vanilla JS version
- [ ] All existing E2E tests still pass

### Phase 1 Testing Commands

```bash
# Run all unit tests
yarn test:unit

# Run with coverage
yarn test:coverage

# Run E2E tests (ensure vanilla JS still works)
yarn test:e2e

# Type check
yarn tsc --noEmit

# Build (ensure no build errors)
yarn build
```

---

## Phase 2: Core Systems

**Timeline:** 2-3 weeks
**Risk Level:** Medium
**Goal:** Implement critical systems that all tools depend on

### Overview

Phase 2 builds upon the foundation from Phase 1 to implement the core systems needed by all tools: sound system, event handling framework, and modifier key tracking. These systems are critical because every tool depends on them.

### Task 2.1: Sound System (5-7 days)

**Source:** `js/sounds/sounds.js` (448 lines)

#### Requirements

- 45+ sound effects (single sounds and arrays for randomization)
- Enable/disable toggle
- Lazy loading for better performance
- Random selection from sound arrays
- Multi-part sequences (e.g., eraser doorbell: ding-dong, creak, wow)

#### Implementation

**Create:** `src/contexts/SoundContext.tsx`

```typescript
interface SoundContextType {
  playSound: (soundName: string) => void;
  toggleSound: () => void;
  soundEnabled: boolean;
  loadSound: (soundName: string, path: string | string[]) => Promise<void>;
}
```

**Create:** `src/hooks/useSoundLibrary.ts`

Port sound library structure and playback logic.

**Create:** `src/utils/soundLoader.ts`

Lazy loading system for Audio objects.

#### Testing

- Test sound enable/disable
- Test random selection from arrays
- Test multi-part sequences
- Test lazy loading
- Mock Audio objects in tests

**Deliverable:** Working sound system with lazy loading

### Task 2.2: Event Handling Framework (4-5 days)

**Source:** `js/init/kiddopaint.js` (event dispatcher, lines 100-200)

#### Requirements

- Central event dispatcher
- Route events to current tool's three methods
- Touch-to-mouse event conversion
- Velocity tracking for pressure effects
- Coordinate normalization

#### Implementation

**Create:** `src/hooks/useTool.ts`

```typescript
interface ToolHandlers {
  onMouseDown: (ev: MouseEvent) => void;
  onMouseMove: (ev: MouseEvent) => void;
  onMouseUp: (ev: MouseEvent) => void;
}

export function useTool(toolName: string): ToolHandlers;
```

**Update:** `src/hooks/useDrawingEvents.ts`

Complete the event handler stub with full implementation.

**Create:** `src/hooks/useVelocityTracking.ts`

Port velocity calculation logic for pressure-sensitive drawing.

#### Testing

- Test event routing to correct tool
- Test touch event conversion
- Test velocity calculation
- Test coordinate normalization

**Deliverable:** Event handling framework with velocity tracking

### Task 2.3: Modifier Key System (3-4 days)

**Source:** `js/init/kiddopaint.js` (keyboard event handlers)

#### Requirements

- Track Shift, Alt, Ctrl, Meta, Tilde keys
- Update context state on keydown/keyup
- Prevent default behavior where needed
- Consistent state across components

#### Implementation

**Create:** `src/hooks/useModifierKeys.ts`

```typescript
export function useModifierKeys() {
  const { state, dispatch } = useKidPix();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Update modifier key state
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Update modifier key state
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [dispatch]);

  return {
    shiftPressed: state.shiftPressed,
    altPressed: state.altPressed,
    ctrlPressed: state.ctrlPressed,
    metaPressed: state.metaPressed,
  };
}
```

#### Testing

- Test keydown/keyup events
- Test multiple simultaneous keys
- Test state updates in context
- Test event cleanup on unmount

**Deliverable:** Modifier key tracking system

### Phase 2 Deliverables

1. ✅ Sound system with lazy loading and randomization
2. ✅ Event handling framework routing events to tools
3. ✅ Velocity tracking for pressure-sensitive drawing
4. ✅ Modifier key tracking (Shift, Alt, Ctrl, Meta, Tilde)
5. ✅ All systems tested and integrated with context

### Phase 2 Success Criteria

- [ ] Sound system plays all 45+ sound effects correctly
- [ ] Randomization works for sound arrays
- [ ] Multi-part sequences play in order
- [ ] Events route to current tool correctly
- [ ] Velocity tracking calculates accurately
- [ ] Modifier keys update context state
- [ ] All unit tests pass
- [ ] No regressions in vanilla JS version

---

## Phase 3: Simple Tools

**Timeline:** 2-3 weeks
**Risk Level:** Medium
**Goal:** Prove the tool migration pattern works with simple tools

### Overview

Phase 3 focuses on migrating the simplest drawing tools to validate the migration pattern. Starting with basic tools like pencil, line, rectangle, and oval allows us to work out the kinks in the tool architecture before tackling complex tools.

### Tool Migration Order

**Start with simplest (5-10 tools):**

1. **Pencil** - Basic free-form drawing, simplest tool
2. **Line** - Start/end point drawing
3. **Rectangle** - Shape with fill/stroke modes
4. **Oval** - Another basic shape
5. **Eraser** - Uses destination-out composite operation

**Then medium complexity:**

6. **Paint Can** - Flood fill algorithm
7. **Text** - Letter stamp placement
8. **Moving Van** - Selection and move tool
9. **Undo Button** (special case)
10. **ABC Eraser** (special case)

### Tool Migration Pattern

For each tool:

#### Step 1: Create Tool Hook

**Create:** `src/hooks/tools/usePencilTool.ts`

```typescript
export function usePencilTool() {
  const { state } = useKidPix();
  const { canvasLayers, currentColor } = state;
  const displayUtils = useDisplayUtils();
  const { saveUndo } = useUndoRedo();

  const handlers = useRef({
    mousedown: (ev: MouseEvent) => {
      // Save undo before drawing
      saveUndo();
      // Initialize drawing state
      // Draw first point
    },

    mousemove: (ev: MouseEvent) => {
      // Continue drawing from last point
      // Draw to tmp canvas
    },

    mouseup: (ev: MouseEvent) => {
      // Finish drawing
      displayUtils.saveMain();  // Composite tmp to main
    }
  });

  return handlers.current;
}
```

#### Step 2: Port Tool Logic

Copy logic from vanilla JS tool file (`js/tools/pencil.js`) and adapt to React hooks:

- Convert `this.isDown` → `useRef` for state
- Convert `KiddoPaint.Display.context` → `canvasLayers.tmp.getContext('2d')`
- Convert `KiddoPaint.Current.color` → `state.currentColor`
- Maintain exact same drawing logic (pixel-perfect parity)

#### Step 3: Register Tool

**Update:** `src/hooks/useTool.ts`

```typescript
export function useTool(toolName: string): ToolHandlers {
  const pencil = usePencilTool();
  const line = useLineTool();
  // ... other tools

  const tools: Record<string, ToolHandlers> = {
    pencil,
    line,
    // ... other tools
  };

  return tools[toolName] || tools.pencil;
}
```

#### Step 4: Port Submenu

**Create:** `src/components/Submenus/PencilSubmenu.tsx`

Port submenu definition from `js/submenus/pencil.js`:

```typescript
export const PencilSubmenu: React.FC = () => {
  const { dispatch } = useKidPix();

  const options = [
    {
      name: "Pencil",
      imgSrc: "img/tools/pencil.png",
      onClick: () => {
        dispatch({ type: 'SET_TOOL', payload: 'pencil' });
        // Configure pencil settings
      }
    },
    // ... other options
  ];

  return (
    <div className="submenu">
      {options.map(option => (
        <button key={option.name} onClick={option.onClick}>
          <img src={option.imgSrc} alt={option.name} />
        </button>
      ))}
    </div>
  );
};
```

#### Step 5: Test

**Create:** `src/hooks/tools/__tests__/usePencilTool.test.ts`

Unit test the tool hook:
- Test mousedown saves undo
- Test mousemove draws to tmp canvas
- Test mouseup composites to main

**Run existing E2E test:**
```bash
yarn test:e2e tests/e2e/pencil.spec.ts
```

Compare React version (`?react`) with vanilla JS:
- Same drawing behavior
- Same line thickness
- Same color rendering
- Pixel-perfect match

#### Step 6: Visual Comparison

Manual testing:
1. Open vanilla JS version
2. Draw with pencil tool
3. Open React version (`?react`)
4. Draw same pattern
5. Compare visually for differences
6. Take screenshots for regression testing

### Tool-Specific Notes

**Pencil (`js/tools/pencil.js`):**
- Free-form drawing with line segments
- Uses `moveTo` and `lineTo`
- Line width affected by modifier keys
- Has texture function for customization

**Line (`js/tools/line.js`):**
- Click-and-drag for start/end points
- Preview on mousemove
- Final line on mouseup
- Multiple line modes (single, double, triple)

**Rectangle (`js/tools/rectangle.js`):**
- Click-and-drag for corners
- Preview during drag
- Fill/stroke/both modes
- Modifier key for square constraint

**Oval (`js/tools/oval.js`):**
- Similar to rectangle
- Uses ellipse or arc drawing
- Fill/stroke/both modes
- Modifier key for circle constraint

**Eraser (`js/tools/eraser.js`):**
- Uses `globalCompositeOperation = 'destination-out'`
- Multiple eraser modes (normal, wide, animated)
- Sound sequences (doorbell: ding-dong, creak, wow)
- Brush size variations

### Phase 3 Deliverables

1. ✅ 5-10 simple tools fully migrated
2. ✅ Tool hook pattern established and documented
3. ✅ Submenu system working for all migrated tools
4. ✅ All tool E2E tests passing
5. ✅ Visual regression tests created
6. ✅ Tool migration guide documented

### Phase 3 Success Criteria

- [ ] All migrated tools work identically to vanilla JS
- [ ] Pixel-perfect rendering matches original
- [ ] All tool-specific E2E tests pass
- [ ] Visual regression tests show no differences
- [ ] Performance benchmarks meet targets
- [ ] Tool switching works smoothly
- [ ] Submenus render correctly

### Phase 3 Testing

```bash
# Run tool-specific E2E tests
yarn test:e2e tests/e2e/pencil.spec.ts
yarn test:e2e tests/e2e/line.spec.ts
yarn test:e2e tests/e2e/rectangle.spec.ts
yarn test:e2e tests/e2e/oval.spec.ts
yarn test:e2e tests/e2e/eraser.spec.ts

# Run all E2E tests
yarn test:e2e

# Unit tests for tools
yarn test:unit src/hooks/tools/
```

---

## Phase 4: Complex Tools

**Timeline:** 3-4 weeks
**Risk Level:** Medium-High
**Goal:** Migrate brushes, textures, effects, and stamps

### Overview

Phase 4 tackles the most complex tools in the application: the brush system with 20 variants, texture generators, animated effects, and the stamp system. These tools have complex state, animations, and interactions.

### Task 4.1: Brush System (7-10 days)

**Source Files:**
- `js/tools/brush.js` - Main brush tool
- `js/brushes/*.js` - 20 brush generators
- `js/textures/*.js` - Texture generators
- `js/submenus/brush.js` - Brush submenu (20 options)

#### Brush Types to Migrate

1. Basic brushes: circle, square, spray
2. Pattern brushes: splatter, speckles, hearts, stars
3. Animated brushes: rainbowball, ribbon, confetti
4. Complex brushes: fur, chalk, calligraphy
5. Special brushes: drips, bubbles, sparkle

#### Implementation

**Create:** `src/hooks/tools/useBrushTool.ts`

Main brush tool with texture selection.

**Create:** `src/utils/brushGenerators.ts`

```typescript
export const brushGenerators: Record<string, BrushGenerator> = {
  circle: (size: number) => { /* generate circle brush canvas */ },
  splatter: (size: number) => { /* generate splatter brush canvas */ },
  // ... 20 total generators
};
```

**Create:** `src/utils/textureGenerators.ts`

```typescript
export const textureGenerators: Record<string, TextureGenerator> = {
  solid: () => { /* return solid color pattern */ },
  stripes: () => { /* return striped pattern */ },
  speckles: () => { /* return speckled pattern */ },
  // ... texture generators
};
```

**Create:** `src/hooks/useBrushAnimation.ts`

For animated brushes (rainbowball, ribbon, confetti).

#### Testing

- Test each brush generates correct pattern
- Test texture application
- Test animations frame-by-frame
- Visual comparison with vanilla JS
- Performance: ensure no slowdown with animated brushes

**Deliverable:** Complete brush system with 20 variants

### Task 4.2: Effect Tools (5-7 days)

**Source Files:**
- `js/tools/mixer.js` - Electric mixer (smudge/blend effect)
- `js/tools/firecracker.js` - Explosive pixel effect
- `js/tools/grassbuilder.js` - Grass pattern builder
- `js/tools/leakypen.js` - Dripping ink effect

#### Implementation

**Create:** `src/hooks/tools/useMixerTool.ts`

Complex pixel manipulation:
- Read pixels around cursor
- Blend/smudge algorithm
- Write back to canvas
- Performance-critical (affects many pixels)

**Create:** `src/hooks/tools/useFirecrackerTool.ts`

Animated explosion:
- Particle system
- RequestAnimationFrame for animation
- Canvas compositing
- Sound synchronization

#### Testing

- Test pixel manipulation algorithms
- Test animation timing
- Performance benchmarks
- Visual comparison

**Deliverable:** All effect tools working

### Task 4.3: Stamp System (5-7 days)

**Source Files:**
- `js/stamps/stamps.js` - Stamp loading and rendering
- `js/stamps/stampnames.js` - Stamp metadata
- `js/stamps/text.js` - Text/letter stamps
- `js/tools/stamps.js` - Stamp tool

#### Requirements

- 200+ stamps organized in 9 spritesheets
- Stamp metadata (name, position, size)
- Random rotation option
- Stamp picker UI
- Letter/number stamps for text tool

#### Implementation

**Create:** `src/hooks/useStampLibrary.ts`

```typescript
interface Stamp {
  name: string;
  spritesheet: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useStampLibrary() {
  const [stamps, setStamps] = useState<Stamp[]>([]);

  // Load stamp metadata
  // Load spritesheets
  // Provide stamp rendering function
}
```

**Create:** `src/components/StampPicker.tsx`

Visual stamp picker UI with categories.

**Create:** `src/hooks/tools/useStampTool.ts`

Stamp placement with rotation.

**Create:** `src/hooks/tools/useTextTool.ts`

Letter stamp placement for typing.

#### Testing

- Test stamp loading from spritesheets
- Test stamp rendering at correct size
- Test rotation
- Test text tool letter placement
- E2E test: `tests/e2e/stamps.spec.ts`

**Deliverable:** Complete stamp system with picker UI

### Task 4.4: Builder Tools (3-4 days)

**Source Files:**
- `js/builders/arrow.js` - Arrow builder
- `js/builders/road.js` - Road pattern builder
- `js/builders/rail.js` - Railroad track builder
- `js/builders/prints.js` - Footprint trail builder

#### Implementation

**Create:** `src/hooks/tools/useBuilderTool.ts`

Generic builder pattern, then specialize for each type.

#### Testing

- Test pattern generation
- Test path following
- Visual comparison

**Deliverable:** All builder tools working

### Phase 4 Deliverables

1. ✅ Brush system with 20 brush variants
2. ✅ Texture generators for all patterns
3. ✅ All effect tools (mixer, firecracker, grass, leaky pen)
4. ✅ Complete stamp system with 200+ stamps
5. ✅ Stamp picker UI
6. ✅ Text tool with letter stamps
7. ✅ All builder tools (arrow, road, rail, prints)
8. ✅ All E2E tests passing

### Phase 4 Success Criteria

- [ ] All 49 tools migrated and working
- [ ] Brushes render identically to vanilla JS
- [ ] Animated effects maintain timing and appearance
- [ ] Stamp system loads all 200+ stamps
- [ ] Text tool works for typing
- [ ] Performance meets or exceeds vanilla JS
- [ ] All E2E tests pass
- [ ] Visual regression tests show pixel-perfect match

### Phase 4 Testing

```bash
# Brush tests
yarn test:e2e tests/e2e/wacky-brush.spec.ts

# Effect tests
yarn test:e2e tests/e2e/electric-mixer.spec.ts

# Stamp tests
yarn test:e2e tests/e2e/stamps.spec.ts
yarn test:e2e tests/e2e/text.spec.ts

# All tools
yarn test:e2e

# Performance benchmarks
yarn test:performance
```

---

## Phase 5: UI & Polish

**Timeline:** 1-2 weeks
**Risk Level:** Low
**Goal:** Complete feature parity and polish for production

### Task 5.1: Color Palette (2-3 days)

**Source:** `js/util/colors.js`, color palette section of `index.html`

#### Implementation

**Create:** `src/components/UI/ColorPalette.tsx` (complete implementation)

- Main color, alt color, tertiary color
- Color swatches (default palette)
- Color picker for custom colors
- Click for main color, shift+click for alt color
- Visual indication of selected colors

#### Testing

- Test color selection
- Test modifier key for alt color
- Test custom color picker
- E2E test: `tests/e2e/color-picker.spec.ts`

**Deliverable:** Complete color palette

### Task 5.2: Toolbar (2-3 days)

**Source:** `index.html` (toolbar section)

#### Implementation

**Update:** `src/components/UI/Toolbar.tsx`

- All 49 tool buttons with icons
- Tool highlighting on selection
- Keyboard shortcuts (1-9, a-z)
- Tooltips with tool names
- Submenu triggering

#### Testing

- Test tool selection via click
- Test keyboard shortcuts
- Test visual highlighting
- E2E test: tool switching

**Deliverable:** Complete toolbar

### Task 5.3: Submenu System (3-4 days)

**Source:** `js/init/submenus.js`, `js/submenus/*.js`

#### Implementation

**Create:** `src/components/Submenus/SubmenuContainer.tsx`

Dynamic submenu rendering based on current tool.

**Create submenu components for each tool:**
- `BrushSubmenu.tsx` (20 options)
- `LineSubmenu.tsx` (line modes)
- `RectangleSubmenu.tsx` (fill modes)
- `OvalSubmenu.tsx` (fill modes)
- `EraserSubmenu.tsx` (eraser modes)
- ... 13 total submenus

#### Testing

- Test submenu switching on tool change
- Test submenu options
- Test button highlighting
- Visual comparison with vanilla JS

**Deliverable:** All 13 submenus working

### Task 5.4: Keyboard Shortcuts (1-2 days)

**Source:** `js/init/kiddopaint.js` (keyboard handlers)

#### Implementation

**Create:** `src/hooks/useKeyboardShortcuts.ts`

```typescript
export function useKeyboardShortcuts() {
  const { dispatch } = useKidPix();
  const { undo, redo } = useUndoRedo();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // 1-9: tool selection
      // a-z: various shortcuts
      // Ctrl+Z: undo
      // Ctrl+Shift+Z: redo
      // Delete/Backspace: clear canvas
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [dispatch, undo, redo]);
}
```

**Create:** `src/components/UI/KeyboardShortcutsHelp.tsx`

Help dialog showing all keyboard shortcuts.

#### Testing

- Test all keyboard shortcuts
- Test modifier key combinations
- E2E test: `tests/e2e/keyboard-shortcuts-help.spec.ts`

**Deliverable:** Complete keyboard shortcut system

### Task 5.5: Polish & Styling (2-3 days)

#### Tasks

1. **Match Exact Styling:**
   - Copy CSS from vanilla JS version
   - Ensure pixel-perfect UI match
   - Responsive layout (if applicable)

2. **Performance Optimization:**
   - React.memo for components that don't need frequent re-renders
   - useMemo for expensive calculations
   - useCallback for event handlers
   - Canvas operation batching

3. **Error Handling:**
   - Graceful degradation for missing sounds/images
   - localStorage quota exceeded handling
   - Canvas context loss recovery

4. **Accessibility:**
   - Keyboard navigation
   - ARIA labels
   - Focus management

#### Testing

- Performance benchmarks
- Accessibility audit
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Visual regression testing

**Deliverable:** Production-ready, polished application

### Task 5.6: Cutover Preparation (1-2 days)

#### Implementation

1. **Make React version default:**
   - Remove `?react` parameter requirement
   - Vanilla JS accessible via `?vanilla` parameter

2. **Feature flag system:**
   - Allow gradual rollout
   - Easy rollback if needed

3. **Analytics/Monitoring:**
   - Track usage of React vs vanilla JS
   - Monitor for errors
   - Performance metrics

4. **Documentation updates:**
   - Update README.md
   - Update CLAUDE.md
   - Add migration notes

#### Rollback Plan

If issues discovered after cutover:
1. Switch default back to vanilla JS
2. Fix issues in React version
3. Re-test thoroughly
4. Cutover again when ready

**Deliverable:** Cutover-ready application with rollback plan

### Phase 5 Deliverables

1. ✅ Complete color palette with picker
2. ✅ Complete toolbar with all 49 tools
3. ✅ All 13 submenus working
4. ✅ Keyboard shortcuts system
5. ✅ Keyboard shortcuts help dialog
6. ✅ Pixel-perfect styling match
7. ✅ Performance optimizations
8. ✅ Error handling
9. ✅ Accessibility improvements
10. ✅ Production-ready build
11. ✅ Cutover plan executed

### Phase 5 Success Criteria

- [ ] All UI components match vanilla JS exactly
- [ ] All keyboard shortcuts work
- [ ] All 13 submenus render correctly
- [ ] Performance equals or exceeds vanilla JS
- [ ] All 16 E2E tests pass
- [ ] Cross-browser testing complete
- [ ] Accessibility audit complete
- [ ] React version is production-ready
- [ ] Documentation updated
- [ ] Cutover executed successfully

---

## Testing Strategy

### Unit Testing

**Framework:** Vitest 3.2.3 with jsdom

**Coverage Targets:**
- Utilities: 100%
- Hooks: 80%
- Components: 70%
- Overall: 70% lines, 70% functions, 60% branches

**Test Files:**
- `src/utils/__tests__/*.test.ts` - Utility function tests
- `src/hooks/__tests__/*.test.ts` - Hook tests
- `src/components/__tests__/*.test.tsx` - Component tests

**Running Tests:**
```bash
yarn test:unit              # Run all unit tests
yarn test:unit --watch      # Watch mode
yarn test:coverage          # Coverage report
yarn test:ui                # Vitest UI
```

### E2E Testing

**Framework:** Playwright 1.56.1

**Existing Tests (16 files):**
- Canvas functionality
- Keyboard shortcuts help
- Color picker
- Tool tests: pencil, line, rectangle, oval, eraser, paint-can, text, stamps
- Brush tests: wacky-brush, electric-mixer, moving-van
- Tool switching

**Running Tests:**
```bash
yarn test:e2e                           # All E2E tests
yarn test:e2e tests/e2e/pencil.spec.ts  # Single test
yarn test:e2e:headed                    # With visible browser
```

**Test Strategy:**
1. Run E2E tests at each phase boundary
2. Compare React version (`?react`) with vanilla JS
3. Visual regression testing with screenshots
4. Cross-browser testing (Chromium, Firefox, WebKit)

### Visual Regression Testing

**Approach:**
1. Capture screenshots of vanilla JS version (baseline)
2. Capture screenshots of React version (comparison)
3. Pixel-by-pixel comparison
4. Flag differences above threshold
5. Manual review of flagged differences

**Tools:**
- Playwright built-in screenshot comparison
- Custom visual diff tool (if needed)

**Test Cases:**
- Each tool drawing sample pattern
- Each submenu rendering
- Color palette interaction
- Toolbar states

### Performance Testing

**Benchmarks:**
1. **Canvas Operations:**
   - Drawing 1000 pencil strokes
   - Brush rendering with animated brushes
   - Undo/redo operations
   - Canvas clear/save operations

2. **Memory:**
   - Undo/redo stack size
   - Canvas memory usage
   - Component re-render counts

3. **Load Time:**
   - Initial page load
   - Tool switching latency
   - Submenu rendering time

**Target:** React version should be ≤ 105% of vanilla JS performance

**Tools:**
- Chrome DevTools Performance
- React DevTools Profiler
- Custom performance marks/measures

### Integration Testing

**Test Scenarios:**
1. Complete drawing workflow (multiple tools)
2. Undo/redo across multiple operations
3. Sound system with multiple tool changes
4. localStorage persistence across reload
5. Modifier key interactions

### Manual Testing Checklist

**Phase 1:**
- [ ] Canvas renders at 1300x650
- [ ] All 5 layers visible in correct z-order
- [ ] Pixel-perfect rendering (no blurriness)
- [ ] Undo/redo persists across reload
- [ ] localStorage quota handling works

**Phase 2:**
- [ ] Sound system plays all sounds
- [ ] Randomization works
- [ ] Events route to tools correctly
- [ ] Modifier keys track accurately

**Phase 3:**
- [ ] Each tool draws correctly
- [ ] Tool switching works smoothly
- [ ] Submenus render correctly
- [ ] Visual match with vanilla JS

**Phase 4:**
- [ ] All brushes render correctly
- [ ] Animated effects work
- [ ] Stamps load and render
- [ ] Text tool works

**Phase 5:**
- [ ] Color palette works
- [ ] Toolbar complete
- [ ] All submenus working
- [ ] Keyboard shortcuts work

### Continuous Integration

**GitHub Actions:**
- Run unit tests on every push
- Run E2E tests on every PR
- Generate coverage reports
- Post coverage to Codecov
- Block merge if tests fail

---

## Risk Assessment & Mitigation

### High Risk Areas

#### 1. Tool Behavior Differences

**Risk:** 49 tools with complex interactions may behave differently in React

**Impact:** High - breaks core functionality

**Mitigation:**
- Start with simplest tools, establish pattern
- Pixel-perfect visual comparison for each tool
- E2E tests for each tool
- Side-by-side A/B testing
- Gradual rollout with feature flags

**Contingency:** Keep vanilla JS version active until React version proven

#### 2. Canvas Rendering Differences

**Risk:** Canvas operations may render differently across browsers or due to React lifecycle

**Impact:** High - user artwork affected

**Mitigation:**
- Maintain pixel-perfect rendering settings
- Test across all browsers (Chrome, Firefox, Safari, Edge)
- Visual regression testing
- Performance benchmarks
- Careful useState/useRef usage to avoid unnecessary re-renders

**Contingency:** Extensive testing before cutover, rollback plan ready

#### 3. Performance Regressions

**Risk:** React re-renders may slow down drawing operations

**Impact:** Medium - poor user experience

**Mitigation:**
- React.memo for components
- useMemo/useCallback for expensive operations
- Canvas refs to avoid context lookups
- Performance benchmarks at each phase
- Profiling with React DevTools

**Contingency:** Optimize before advancing to next phase

#### 4. State Management Complexity

**Risk:** Converting global mutable state to React patterns may introduce bugs

**Impact:** Medium - state inconsistencies

**Mitigation:**
- Careful reducer design matching vanilla JS state
- TypeScript for type safety
- Extensive unit tests for state transitions
- Integration tests for complex workflows

**Contingency:** Simplify state structure if too complex

#### 5. Sound Timing

**Risk:** Audio timing may be affected by React lifecycle

**Impact:** Low - reduced polish, not critical

**Mitigation:**
- Keep Audio objects outside React component tree
- Use refs for Audio object storage
- Test multi-part sequences carefully

**Contingency:** Disable sound if timing issues unfixable

### Medium Risk Areas

#### 6. localStorage Quota

**Risk:** Undo/redo persistence may hit quota limits

**Impact:** Medium - undo/redo stops working

**Mitigation:**
- Already implemented quota handling in vanilla JS
- Port quota handling carefully
- Test with large canvases
- JPEG fallback for quota exceeded

**Contingency:** Clear undo/redo from localStorage, continue without persistence

#### 7. Browser Compatibility

**Risk:** Different browsers may handle canvas/React differently

**Impact:** Medium - some users affected

**Mitigation:**
- Cross-browser testing at each phase
- Playwright tests in Chromium, Firefox, WebKit
- Manual testing in Safari, Edge
- Polyfills if needed

**Contingency:** Document browser requirements, graceful degradation

#### 8. Build/Bundle Size

**Risk:** React version may have larger bundle size

**Impact:** Low - slightly slower initial load

**Mitigation:**
- Code splitting for tools
- Lazy loading for stamps/sounds
- Bundle analysis
- Tree shaking

**Contingency:** Optimize bundle if size becomes issue

### Low Risk Areas

#### 9. TypeScript Compilation Errors

**Risk:** Type errors may block development

**Impact:** Low - development inconvenience

**Mitigation:**
- Gradual typing with JSDoc first
- Comprehensive type definitions upfront
- Regular type checking

**Contingency:** Use `any` sparingly when needed

#### 10. Test Maintenance

**Risk:** Tests may break frequently during migration

**Impact:** Low - development slowdown

**Mitigation:**
- Keep tests simple and focused
- Use test utilities to reduce duplication
- Update tests incrementally

**Contingency:** Disable flaky tests temporarily, fix later

---

## Timeline & Resources

### Overall Timeline

**Total Duration:** 9-14 weeks

- **Phase 1:** 1-2 weeks
- **Phase 2:** 2-3 weeks
- **Phase 3:** 2-3 weeks
- **Phase 4:** 3-4 weeks
- **Phase 5:** 1-2 weeks

**Buffer:** 2-3 weeks for unexpected issues

### Phase Breakdown

#### Phase 1: Foundation (Weeks 1-2)
- Week 1: Type definitions, color utilities, math utilities
- Week 2: Canvas infrastructure, undo/redo, persistence

#### Phase 2: Core Systems (Weeks 3-5)
- Week 3: Sound system
- Week 4: Event handling, velocity tracking
- Week 5: Modifier keys, integration testing

#### Phase 3: Simple Tools (Weeks 6-8)
- Week 6: Pencil, line, rectangle, oval
- Week 7: Eraser, paint can, text
- Week 8: Moving van, testing, polish

#### Phase 4: Complex Tools (Weeks 9-12)
- Week 9-10: Brush system (20 variants)
- Week 11: Effect tools, builders
- Week 12: Stamp system, integration

#### Phase 5: UI & Polish (Weeks 13-14)
- Week 13: Color palette, toolbar, submenus
- Week 14: Keyboard shortcuts, polish, cutover

### Resource Requirements

**Developer Time:**
- 1 full-time developer: 14 weeks
- 2 part-time developers (50% each): 14 weeks
- 2 full-time developers: 7 weeks (with coordination overhead)

**Skills Required:**
- TypeScript
- React (hooks, context, refs)
- HTML5 Canvas
- Testing (Vitest, Playwright)
- Git/GitHub

**Testing Time:**
- Unit tests: built-in to each task
- E2E tests: 1-2 hours per phase
- Visual regression: 2-3 hours per phase
- Performance testing: 2-3 hours per phase

### Milestones

1. **Week 2:** Phase 1 complete, foundation ready
2. **Week 5:** Phase 2 complete, core systems ready
3. **Week 8:** Phase 3 complete, simple tools proven
4. **Week 12:** Phase 4 complete, all 49 tools migrated
5. **Week 14:** Phase 5 complete, production cutover

### Dependencies

**External:**
- No external dependencies (all tools already available)

**Internal:**
- Each phase depends on previous phase
- Tools depend on core systems (Phase 2)
- UI depends on tools (Phase 3-4)

**Blockers:**
- None anticipated (all infrastructure in place)

---

## Success Criteria

### Functional Requirements

- [ ] All 49 tools work identically to vanilla JS version
- [ ] Five-layer canvas system renders correctly (1300x650)
- [ ] Pixel-perfect rendering (no image smoothing)
- [ ] Undo/redo with localStorage persistence (30 in memory, 10 persisted)
- [ ] Sound system plays all 45+ sound effects correctly
- [ ] 200+ stamps load and render correctly
- [ ] Color palette with custom color picker
- [ ] All 13 submenus render and function correctly
- [ ] Keyboard shortcuts for all tools and operations
- [ ] Modifier keys affect tool behavior (Shift, Alt, Ctrl, Meta)

### Technical Requirements

- [ ] TypeScript compilation with no errors
- [ ] All unit tests pass
- [ ] Test coverage ≥ 70% lines, 70% functions, 60% branches
- [ ] All 16 E2E tests pass
- [ ] Visual regression tests show pixel-perfect match
- [ ] Performance ≤ 105% of vanilla JS version
- [ ] Bundle size acceptable (< 2MB)
- [ ] No console errors or warnings

### Quality Requirements

- [ ] Code follows TypeScript best practices
- [ ] React hooks used correctly (no rule violations)
- [ ] Components properly memoized where needed
- [ ] Accessibility standards met
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Mobile/touch support (if applicable)
- [ ] Error handling for edge cases
- [ ] Documentation complete and accurate

### User Experience Requirements

- [ ] Drawing feels responsive and smooth
- [ ] Tool switching is instantaneous
- [ ] No visual glitches or flickering
- [ ] Sounds play at correct times
- [ ] Undo/redo works intuitively
- [ ] UI matches vanilla JS exactly
- [ ] Keyboard shortcuts work as expected
- [ ] Canvas saves to localStorage reliably

### Operational Requirements

- [ ] React version deployed to production
- [ ] Vanilla JS version available as fallback
- [ ] Rollback plan tested and ready
- [ ] Monitoring/analytics in place
- [ ] Performance metrics collected
- [ ] User feedback mechanism available
- [ ] Documentation updated (README, CLAUDE.md)
- [ ] Migration notes documented

### Acceptance Criteria

**Phase 1:** Foundation ready, utilities tested, canvas infrastructure complete

**Phase 2:** Core systems working, sound/events/modifiers integrated

**Phase 3:** 5-10 simple tools migrated, pattern proven, E2E tests passing

**Phase 4:** All 49 tools migrated, all features working

**Phase 5:** Production-ready, cutover complete, vanilla JS retired

---

## Migration Execution Checklist

### Pre-Migration

- [ ] Review and approve migration plan
- [ ] Set up development environment
- [ ] Create migration tracking board (GitHub Projects)
- [ ] Establish testing protocols
- [ ] Set up CI/CD for React version

### Phase 1 Execution

- [ ] Create type definitions
- [ ] Migrate color utilities
- [ ] Migrate math utilities
- [ ] Create canvas utilities
- [ ] Fix canvas dimensions
- [ ] Implement display utilities
- [ ] Implement undo/redo with localStorage
- [ ] Implement canvas persistence
- [ ] Run Phase 1 tests
- [ ] Git commit: "feat(migration): complete Phase 1 foundation"

### Phase 2 Execution

- [ ] Implement sound system
- [ ] Port event handling framework
- [ ] Implement velocity tracking
- [ ] Implement modifier key system
- [ ] Integration testing
- [ ] Run Phase 2 tests
- [ ] Git commit: "feat(migration): complete Phase 2 core systems"

### Phase 3 Execution

- [ ] Migrate pencil tool
- [ ] Migrate line tool
- [ ] Migrate rectangle tool
- [ ] Migrate oval tool
- [ ] Migrate eraser tool
- [ ] Migrate paint can tool
- [ ] Migrate text tool
- [ ] Migrate moving van tool
- [ ] Create submenus for migrated tools
- [ ] Run Phase 3 tests
- [ ] Git commit: "feat(migration): complete Phase 3 simple tools"

### Phase 4 Execution

- [ ] Migrate brush system (20 variants)
- [ ] Migrate texture generators
- [ ] Migrate effect tools (mixer, firecracker, etc.)
- [ ] Migrate stamp system (200+ stamps)
- [ ] Migrate text/letter stamps
- [ ] Migrate builder tools (arrow, road, rail, prints)
- [ ] Create all remaining submenus
- [ ] Run Phase 4 tests
- [ ] Git commit: "feat(migration): complete Phase 4 complex tools"

### Phase 5 Execution

- [ ] Complete color palette
- [ ] Complete toolbar
- [ ] Complete all submenus
- [ ] Implement keyboard shortcuts
- [ ] Create keyboard shortcuts help
- [ ] Polish styling
- [ ] Performance optimization
- [ ] Error handling
- [ ] Accessibility improvements
- [ ] Cross-browser testing
- [ ] Update documentation
- [ ] Run Phase 5 tests
- [ ] Git commit: "feat(migration): complete Phase 5 UI and polish"

### Cutover

- [ ] Final testing round (all tests)
- [ ] Performance benchmarks meet targets
- [ ] Visual regression tests pass
- [ ] Make React version default
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Collect user feedback
- [ ] Fix any critical issues
- [ ] Git commit: "feat(migration): cutover to React version as default"

### Post-Migration

- [ ] Monitor performance metrics
- [ ] Address user feedback
- [ ] Fix any bugs discovered
- [ ] Optimize if needed
- [ ] Remove vanilla JS code (after confidence period)
- [ ] Update CLAUDE.md for React version
- [ ] Celebrate! 🎉

---

## Appendix

### Key Files Reference

**Vanilla JS Files:**
- `js/init/kiddopaint.js` (907 lines) - Main initialization, event routing
- `js/util/display.js` (284 lines) - Canvas management, undo/redo
- `js/sounds/sounds.js` (448 lines) - Sound system
- `js/util/colors.js` (220 lines) - Color utilities
- `js/tools/*.js` (49 files) - All drawing tools
- `js/brushes/*.js` (20 files) - Brush generators
- `js/submenus/*.js` (13 files) - Submenu definitions

**React Target Files:**
- `src/types/kiddopaint.ts` - Type definitions
- `src/contexts/KidPixContext.tsx` - State management
- `src/hooks/useDisplayUtils.ts` - Display operations
- `src/hooks/useUndoRedo.ts` - Undo/redo system
- `src/hooks/useTool.ts` - Tool registration
- `src/hooks/tools/*.ts` - Individual tool hooks
- `src/utils/*.ts` - Utility functions
- `src/components/Canvas/CanvasContainer.tsx` - Canvas system

### Testing Commands

```bash
# Development
yarn dev-app                # Start dev server

# Unit Tests
yarn test:unit              # Run all unit tests
yarn test:unit --watch      # Watch mode
yarn test:coverage          # Coverage report
yarn test:ui                # Vitest UI

# E2E Tests
yarn test:e2e               # All E2E tests
yarn test:e2e --headed      # With visible browser
yarn test:e2e tests/e2e/pencil.spec.ts  # Single test

# Build
yarn build                  # Production build
yarn preview-release        # Preview local build
yarn preview-github-pages   # Preview GitHub Pages build

# Type Checking
yarn tsc --noEmit           # Type check without emitting files
```

### Useful Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

### Contact & Support

- **GitHub Issues:** https://github.com/justinpearson/kidpix/issues
- **Discussions:** GitHub Discussions
- **Documentation:** README.md, CLAUDE.md

---

**Last Updated:** 2025-01-16
**Version:** 1.0
**Status:** Planning Phase
