# Phase 2: Add TypeScript Declarations (Weeks 3-4)

## Table of Contents

1. [Overview](#overview)
2. [Implementation Steps](#implementation-steps)
3. [Background & Context](#background--context)
4. [Practical Examples](#practical-examples)
5. [Verification & Testing](#verification--testing)
6. [Troubleshooting](#troubleshooting)
7. [Next Steps](#next-steps)

## Overview

Phase 2 introduces TypeScript's type system to our existing JavaScript codebase without changing any runtime behavior. This gradual approach allows us to gain type safety benefits while maintaining full backward compatibility.

**Learning Focus**: TypeScript fundamentals, declaration files, interfaces, and gradual typing strategies.

**Duration**: 2 weeks  
**Difficulty**: Intermediate  
**Prerequisites**: Completed Phase 1, basic JavaScript knowledge

## Implementation Steps

### Step 2.1: Set Up TypeScript Configuration

**Goal**: Configure TypeScript to work alongside JavaScript files.

```bash
# Install TypeScript
yarn add --dev typescript @types/node

# Create TypeScript configuration
npx tsc --init
```

**Update `tsconfig.json`**:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowJs": true, // Allow JavaScript files
    "checkJs": false, // Don't type-check JS files yet
    "declaration": true, // Generate .d.ts files
    "declarationMap": true, // Generate source maps for declarations
    "outDir": "./dist",
    "strict": true,
    "noEmit": true, // Don't output JS files (Vite handles this)
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "js/**/*", // Include our JavaScript files
    "src/**/*",
    "**/*.d.ts" // Include declaration files
  ],
  "exclude": ["node_modules", "dist"]
}
```

### Step 2.2: Create Global Type Declarations

**Goal**: Define types for the KiddoPaint namespace and global variables.

**Create `types/global.d.ts`**:

```typescript
// types/global.d.ts
declare global {
  interface Window {
    KiddoPaint: typeof KiddoPaint;
  }
}

declare namespace KiddoPaint {
  // Application state
  interface CurrentState {
    tool: Tool;
    color: string;
    size: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
  }

  // Tool interface - all tools must implement these methods
  interface Tool {
    mousedown?(event: MouseEvent): void;
    mousemove?(event: MouseEvent): void;
    mouseup?(event: MouseEvent): void;
  }

  // Canvas layers
  interface CanvasLayers {
    main: HTMLCanvasElement;
    tmp: HTMLCanvasElement;
    preview: HTMLCanvasElement;
    anim: HTMLCanvasElement;
    bnim: HTMLCanvasElement;
  }

  // Submenu button configuration
  interface SubmenuButton {
    name: string;
    imgSrc: string;
    handler: () => void;
    selected?: boolean;
  }
}

// Make KiddoPaint globally available
declare const KiddoPaint: {
  Tools: Record<string, any>;
  Brushes: Record<string, any>;
  Textures: Record<string, any>;
  Current: KiddoPaint.CurrentState;
  Display: {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    layers: KiddoPaint.CanvasLayers;
  };
  // Add more as needed
};

export {}; // Make this a module
```

### Step 2.3: Create Declaration Files for Utility Modules

**Goal**: Create `.d.ts` files for existing utility functions.

**Example: `js/util/utils.d.ts`**:

```typescript
// js/util/utils.d.ts

/**
 * Calculate distance between two points
 */
export declare function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number;

/**
 * Get random integer between min and max (inclusive)
 */
export declare function getRandomInt(min: number, max: number): number;

/**
 * Clamp value between min and max
 */
export declare function clamp(value: number, min: number, max: number): number;

/**
 * Convert degrees to radians
 */
export declare function degToRad(degrees: number): number;

/**
 * Check if point is inside rectangle
 */
export declare function pointInRect(
  px: number,
  py: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): boolean;
```

### Step 2.4: Create Declaration Files for Tool Modules

**Goal**: Define types for the drawing tools interface.

**Example: `js/tools/pencil.d.ts`**:

```typescript
// js/tools/pencil.d.ts

declare namespace KiddoPaint.Tools.Toolbox {
  class Pencil implements KiddoPaint.Tool {
    constructor();

    /**
     * Start drawing when mouse is pressed
     */
    mousedown(event: MouseEvent): void;

    /**
     * Continue drawing as mouse moves
     */
    mousemove(event: MouseEvent): void;

    /**
     * Stop drawing when mouse is released
     */
    mouseup(event: MouseEvent): void;

    /**
     * Get current pencil size based on modifiers
     */
    private getSize(event: MouseEvent): number;

    /**
     * Draw a line segment
     */
    private drawLine(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      size: number,
    ): void;
  }
}
```

### Step 2.5: Create Interface Definitions for Complex Objects

**Goal**: Define interfaces for data structures used throughout the application.

**Create `types/interfaces.d.ts`**:

```typescript
// types/interfaces.d.ts

export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number; // Alpha channel (optional)
}

export interface BrushSettings {
  size: number;
  opacity: number;
  pattern?: string;
  texture?: string;
}

export interface SoundEffect {
  src: string;
  volume?: number;
  loop?: boolean;
}

export interface ToolConfig {
  name: string;
  icon: string;
  cursor?: string;
  submenu?: KiddoPaint.SubmenuButton[];
  sounds?: {
    start?: SoundEffect;
    during?: SoundEffect;
    end?: SoundEffect;
  };
}
```

### Step 2.6: Set Up Type Checking Scripts

**Goal**: Add scripts to verify type correctness without affecting build.

**Update `package.json`**:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "types:generate": "tsc --declaration --emitDeclarationOnly --outDir types/generated"
  }
}
```

### Step 2.7: Gradually Enable Type Checking

**Goal**: Enable TypeScript checking on select JavaScript files.

**Method 1: JSDoc Comments**:

```javascript
// js/util/utils.js

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
```

**Method 2: TypeScript Check Comments**:

```javascript
// @ts-check
// js/util/utils.js

// TypeScript will now check this file
function calculateDistance(x1, y1, x2, y2) {
  // TypeScript will infer types and catch errors
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
```

## Background & Context

### What is TypeScript?

**TypeScript** is a superset of JavaScript that adds static type definitions. It's developed by Microsoft and compiles to plain JavaScript that runs anywhere JavaScript runs.

**Key Benefits**:

- **Early Error Detection**: Catch type-related errors at compile time
- **Better IDE Support**: Autocomplete, refactoring, navigation
- **Self-Documenting Code**: Types serve as inline documentation
- **Refactoring Safety**: Confident large-scale code changes

**TypeScript vs JavaScript**:

```javascript
// JavaScript - no type information
function add(a, b) {
  return a + b;
}

add(5, 3); // Returns 8
add("5", "3"); // Returns "53" - might be unexpected!
```

```typescript
// TypeScript - with type information
function add(a: number, b: number): number {
  return a + b;
}

add(5, 3); // Returns 8 ✅
add("5", "3"); // TypeScript error: Argument of type 'string' is not assignable to parameter of type 'number'
```

**Learn More**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### What are Declaration Files (.d.ts)?

**Declaration files** (`.d.ts`) contain only type information - no runtime code. They describe the "shape" of existing JavaScript code so TypeScript can understand it.

**Purpose**:

- Add types to JavaScript libraries without modifying them
- Provide type information for existing JavaScript code
- Enable gradual migration from JavaScript to TypeScript

**Structure Example**:

```typescript
// Original JavaScript file: math.js
function add(a, b) {
  return a + b;
}
function multiply(a, b) {
  return a * b;
}

// Declaration file: math.d.ts
export declare function add(a: number, b: number): number;
export declare function multiply(a: number, b: number): number;
```

**How They Work**:

1. TypeScript compiler reads `.d.ts` files
2. Uses type information for error checking and IDE support
3. `.d.ts` files are not included in final JavaScript output
4. Runtime behavior remains identical

**Learn More**: [Declaration Files Guide](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)

### What are Interfaces?

**Interfaces** define the structure that objects should have. They're contracts that describe what properties and methods an object must contain.

**Basic Interface**:

```typescript
interface User {
  name: string;
  age: number;
  email?: string; // Optional property (?)
}

// Valid objects
const user1: User = { name: "Alice", age: 30 };
const user2: User = { name: "Bob", age: 25, email: "bob@example.com" };

// Invalid - missing required properties
const user3: User = { name: "Charlie" }; // Error: age is required
```

**Function Interfaces**:

```typescript
interface Tool {
  mousedown(event: MouseEvent): void;
  mousemove?(event: MouseEvent): void; // Optional method
  mouseup(event: MouseEvent): void;
}

// Class implementing interface
class PencilTool implements Tool {
  mousedown(event: MouseEvent) {
    // Start drawing
  }

  mouseup(event: MouseEvent) {
    // Stop drawing
  }

  // mousemove is optional, so we can skip it
}
```

**Interface Extension**:

```typescript
interface BasicTool {
  name: string;
}

interface DrawingTool extends BasicTool {
  mousedown(event: MouseEvent): void;
  color: string;
}

// DrawingTool includes both name and tool-specific properties
```

**Learn More**: [Interfaces Documentation](https://www.typescriptlang.org/docs/handbook/interfaces.html)

### What is Gradual Typing?

**Gradual typing** allows you to add types incrementally to an existing codebase. You can mix typed and untyped code, adding types as you go.

**Benefits**:

- **No Big Bang**: Don't need to convert everything at once
- **Immediate Value**: Get benefits for typed parts immediately
- **Risk Reduction**: Test and validate types before full migration
- **Team Learning**: Learn TypeScript gradually

**Strategies**:

1. **Start with Declarations**: Add `.d.ts` files for existing code
2. **Enable Checking Selectively**: Use `@ts-check` on specific files
3. **Convert Utilities First**: Type pure functions first (easiest)
4. **Add JSDoc Types**: Use comments to add type hints
5. **Convert to .ts Gradually**: Rename files when ready

**Example Progression**:

```javascript
// Stage 1: Plain JavaScript
function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Stage 2: JSDoc types
/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Stage 3: TypeScript
function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
```

### What are Namespaces in TypeScript?

**Namespaces** organize related functionality under a single name. They're similar to modules but work well for global libraries like KiddoPaint.

**Declaration Example**:

```typescript
declare namespace KiddoPaint {
  namespace Tools {
    namespace Toolbox {
      class Pencil {
        mousedown(event: MouseEvent): void;
        mousemove(event: MouseEvent): void;
        mouseup(event: MouseEvent): void;
      }
    }
  }

  namespace Current {
    let tool: Tools.Toolbox.Pencil;
    let color: string;
  }
}
```

**Usage**:

```javascript
// JavaScript usage remains the same
KiddoPaint.Current.tool = new KiddoPaint.Tools.Toolbox.Pencil();
```

**Benefits for KidPix**:

- Matches existing JavaScript structure
- Provides type safety for nested objects
- Maintains global namespace pattern
- Easy to understand for JavaScript developers

### How Type Checking Works

**TypeScript Compiler Process**:

1. **Parse**: Read TypeScript/JavaScript files
2. **Check**: Verify types match declared interfaces
3. **Emit**: Generate JavaScript output (optional)
4. **Report**: Show type errors and warnings

**Common Type Errors**:

```typescript
interface Point {
  x: number;
  y: number;
}

// Type error examples
const point: Point = { x: 10 }; // Error: missing 'y'
const point2: Point = { x: "10", y: 5 }; // Error: 'x' should be number
const point3: Point = { x: 10, y: 5, z: 3 }; // Error: 'z' doesn't exist on Point

// Correct usage
const point4: Point = { x: 10, y: 5 }; // ✅ Valid
```

**Type Inference**:

```typescript
// TypeScript can infer types
let name = "Alice"; // Inferred as string
let age = 30; // Inferred as number
let isActive = true; // Inferred as boolean

// Function return type inference
function double(n: number) {
  return n * 2; // Return type inferred as number
}
```

## Practical Examples

### Example 1: Converting a Utility Function

**Original JavaScript** (`js/util/colors.js`):

```javascript
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
```

**Declaration File** (`js/util/colors.d.ts`):

```typescript
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert hex color string to RGB object
 * @param hex - Hex color string (e.g., "#FF0000" or "FF0000")
 * @returns RGB object or null if invalid hex
 */
export declare function hexToRgb(hex: string): RGB | null;

/**
 * Convert RGB object to hex string
 */
export declare function rgbToHex(rgb: RGB): string;

/**
 * Blend two colors with given ratio
 * @param color1 - First color
 * @param color2 - Second color
 * @param ratio - Blend ratio (0 = all color1, 1 = all color2)
 */
export declare function blendColors(
  color1: RGB,
  color2: RGB,
  ratio: number,
): RGB;
```

### Example 2: Tool Interface Implementation

**Tool Declaration** (`js/tools/brush.d.ts`):

```typescript
declare namespace KiddoPaint.Tools.Toolbox {
  interface BrushOptions {
    size: number;
    opacity: number;
    pattern?: "solid" | "texture" | "gradient";
  }

  class Brush implements KiddoPaint.Tool {
    private options: BrushOptions;
    private isDrawing: boolean;
    private lastPoint: { x: number; y: number } | null;

    constructor(options?: Partial<BrushOptions>);

    mousedown(event: MouseEvent): void;
    mousemove(event: MouseEvent): void;
    mouseup(event: MouseEvent): void;

    /**
     * Set brush options
     */
    setOptions(options: Partial<BrushOptions>): void;

    /**
     * Get current brush settings
     */
    getOptions(): BrushOptions;

    /**
     * Apply brush stroke at given position
     */
    private applyBrush(x: number, y: number, pressure: number): void;
  }
}
```

### Example 3: Canvas Layer Management

**Canvas Types** (`types/canvas.d.ts`):

```typescript
export interface CanvasLayer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  name: string;
  visible: boolean;
  opacity: number;
}

export interface LayeredCanvas {
  layers: {
    main: CanvasLayer;
    tmp: CanvasLayer;
    preview: CanvasLayer;
    anim: CanvasLayer;
    bnim: CanvasLayer;
  };

  /**
   * Get layer by name
   */
  getLayer(name: keyof LayeredCanvas["layers"]): CanvasLayer;

  /**
   * Clear specific layer
   */
  clearLayer(name: keyof LayeredCanvas["layers"]): void;

  /**
   * Composite all layers to main canvas
   */
  composite(): void;
}
```

## Verification & Testing

### Verify TypeScript Configuration

```bash
# Check TypeScript configuration
yarn type-check

# Should output any type errors found
# No output means no errors (success!)
```

### Test Declaration Files

```bash
# Create test file to verify declarations work
cat > test-types.ts << EOF
// Test our type declarations
const tool: KiddoPaint.Tool = {
  mousedown(event: MouseEvent) {
    console.log('Mouse down at', event.clientX, event.clientY);
  },
  mouseup(event: MouseEvent) {
    console.log('Mouse up');
  }
};

// Test utility types
import { RGB } from './js/util/colors';
const red: RGB = { r: 255, g: 0, b: 0 };
EOF

# Type check the test file
npx tsc --noEmit test-types.ts
```

### Validate Interface Implementations

```bash
# Enable checking on a simple JavaScript file
echo "// @ts-check" > js/util/simple-test.js
echo "/** @type {number} */ let x = 'string';" >> js/util/simple-test.js

# This should show a type error
yarn type-check
```

### Test IDE Integration

1. **Open a JavaScript file** in VS Code
2. **Add `// @ts-check`** at the top
3. **Hover over variables** - should show inferred types
4. **Try calling a function** with wrong parameters - should show error

### Generate Type Documentation

```bash
# Generate declaration files from JSDoc
yarn types:generate

# Check generated files
ls types/generated/
```

## Troubleshooting

### Common TypeScript Configuration Issues

**Problem**: TypeScript doesn't find declaration files

```json
// Solution: Update tsconfig.json include paths
{
  "include": ["js/**/*", "types/**/*", "**/*.d.ts"]
}
```

**Problem**: Conflicting type definitions

```typescript
// Solution: Use module augmentation
declare module "existing-module" {
  interface ExistingInterface {
    newProperty: string;
  }
}
```

### Declaration File Issues

**Problem**: Can't declare global namespace

```typescript
// Wrong
declare namespace MyNamespace {}

// Right - in global scope
declare global {
  namespace MyNamespace {}
}
export {}; // Make it a module
```

**Problem**: Interface vs Type Aliases

```typescript
// Use interfaces for object shapes (can be extended)
interface User {
  name: string;
}

// Use type aliases for unions, primitives, computed types
type Status = "loading" | "success" | "error";
type UserWithId = User & { id: number };
```

### JSDoc Type Issues

**Problem**: Complex types in JSDoc comments

```javascript
// Complex union types
/** @type {'pencil' | 'brush' | 'eraser'} */
let toolType;

// Object types
/** @type {{ x: number, y: number }} */
let point;

// Function types
/** @type {(event: MouseEvent) => void} */
let handler;
```

### IDE-Related Issues

**Problem**: VS Code doesn't recognize types

```bash
# Restart TypeScript server
# Command Palette: "TypeScript: Restart TS Server"

# Or check workspace TypeScript version
# Command Palette: "TypeScript: Select TypeScript Version"
```

## Phase 2 Completion Status ✅

**Completed Steps**:

1. ✅ **TypeScript Configuration**: Set up `tsconfig.json` with proper compiler options
   - [7fea2f3](https://github.com/justinpearson/kidpix/commit/7fea2f3) - Initial migration phase 2 setup

2. ✅ **Type Declarations**: Created comprehensive `.d.ts` files for KiddoPaint JavaScript modules
   - [6864802](https://github.com/justinpearson/kidpix/commit/6864802) - Add TypeScript declarations for KiddoPaint JavaScript modules

3. ✅ **Type Checking Scripts**: Added `type-check` and related scripts to `package.json`
   - [add6743](https://github.com/justinpearson/kidpix/commit/add6743) - Add TypeScript type checking scripts and specify tsconfig project

4. ✅ **Gradual Typing**: Enabled TypeScript checking on `utils.js` with JSDoc comments
   - [b6775f5](https://github.com/justinpearson/kidpix/commit/b6775f5) - Enable TypeScript checking on utils.js with JSDoc comments

5. ✅ **Feature Request Management**: Moved completed phase 2 request to `prompts-DONE/`
   - [d52586f](https://github.com/justinpearson/kidpix/commit/d52586f) - Move completed migration phase 2 feature request to DONE

**Key Achievements**:

- All major KiddoPaint namespaces now have TypeScript declarations
- Type checking infrastructure is fully operational
- JSDoc comments provide gradual typing benefits
- No runtime behavior changes - full backward compatibility maintained

## Next Steps

Ready to proceed to **Phase 3: Core Architecture**:

- Study React basics and component lifecycle
- Understand hooks (useState, useEffect, useContext)
- Plan canvas integration with React
- Design React component architecture for tools system

**Continue to**: [Phase 3: Core Architecture](./phase-3-core-architecture.md)

---

**Related Documentation**:

- [Overview](./overview.md) - Migration plan overview
- [Phase 1](./phase-1-foundation-and-tooling.md) - Development tooling setup
- [Phase 3](./phase-3-core-architecture.md) - React architecture design
