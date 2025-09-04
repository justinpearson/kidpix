# Common Development Tasks

## Table of Contents

- [Setting Up Development Environment](#setting-up-development-environment)
  - [First-Time Setup](#first-time-setup)
  - [VS Code Recommended Extensions](#vs-code-recommended-extensions)
  - [IDE Configuration](#ide-configuration)
- [Working with Components](#working-with-components)
  - [Creating a New React Component](#creating-a-new-react-component)
  - [Creating Custom Hooks](#creating-custom-hooks)
- [Working with Canvas](#working-with-canvas)
  - [Setting Up Canvas Component](#setting-up-canvas-component)
  - [Adding Touch Support](#adding-touch-support)
- [Testing](#testing)
  - [Writing Unit Tests](#writing-unit-tests)
  - [Writing E2E Tests](#writing-e2e-tests)
  - [Testing Canvas Operations](#testing-canvas-operations)
- [State Management](#state-management)
  - [Using Context for Global State](#using-context-for-global-state)
  - [Using the Context](#using-the-context)
- [Adding Audio](#adding-audio)
  - [Setting Up Audio Manager](#setting-up-audio-manager)
  - [Using Audio in Components](#using-audio-in-components)
- [Deployment and Release](#deployment-and-release)
  - [Manual Build Testing](#manual-build-testing)
  - [Creating a Release](#creating-a-release)
  - [Monitoring Deployment](#monitoring-deployment)
- [Performance Optimization](#performance-optimization)
  - [Bundle Analysis](#bundle-analysis)
  - [Code Splitting](#code-splitting)
  - [Canvas Performance](#canvas-performance)
- [Claude Code Development Workflow](#claude-code-development-workflow)
  - [Browser Error Monitoring](#browser-error-monitoring)
  - [Error Monitoring Setup](#error-monitoring-setup)
  - [Usage and Best Practices](#usage-and-best-practices)

## Setting Up Development Environment

### First-Time Setup

```bash
# 1. Clone and install
git clone https://github.com/justinpearson/kidpix.git
cd kidpix
yarn install

# 2. Verify environment
yarn build && yarn test && yarn lint

# 3. Start developing
yarn dev
# Access points:
# - http://localhost:5173/ - React/TypeScript version
# - http://localhost:5173/kidpix.html - Original app (monolithic)
# - http://localhost:5173/kidpix-orig.html - Original app (modular)
```

### VS Code Recommended Extensions

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-playwright.playwright",
    "ms-vscode.vscode-typescript-next",
    "vitest.explorer"
  ]
}
```

### IDE Configuration

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Working with Components

### Creating a New React Component

```bash
# 1. Create component file
touch src/components/MyComponent.tsx

# 2. Component template
```

```typescript
// src/components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction
}) => {
  return (
    <div>
      <h2>{title}</h2>
      {onAction && (
        <button onClick={onAction}>
          Click me
        </button>
      )}
    </div>
  );
};
```

```bash
# 3. Create test file
touch src/components/__tests__/MyComponent.test.tsx
```

```typescript
// src/components/__tests__/MyComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onAction when button clicked', () => {
    const mockAction = vi.fn();
    render(<MyComponent title="Test" onAction={mockAction} />);

    fireEvent.click(screen.getByText('Click me'));
    expect(mockAction).toHaveBeenCalledOnce();
  });
});
```

### Creating Custom Hooks

```typescript
// src/hooks/useCanvas.ts
import { useRef, useEffect, useCallback } from "react";

interface UseCanvasOptions {
  width: number;
  height: number;
}

export const useCanvas = ({ width, height }: UseCanvasOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.imageSmoothingEnabled = false;
    contextRef.current = context;
  }, [width, height]);

  const draw = useCallback((x: number, y: number) => {
    const context = contextRef.current;
    if (!context) return;

    context.fillStyle = "#000";
    context.fillRect(x, y, 1, 1);
  }, []);

  return { canvasRef, draw };
};
```

## Working with Legacy JavaScript

### Modifying Individual JS Files

The project now supports both monolithic and modular approaches for the legacy JavaScript code:

```bash
# Edit individual JS files in their respective directories
js/
├── init/kiddopaint.js      # Core initialization
├── util/colors.js          # Color utilities
├── tools/pencil.js         # Pencil tool
├── brushes/bubbles.js      # Bubble brush
└── ...
```

**Development Workflow:**

1. Edit the specific JS file you need to change
2. Test using `kidpix-orig.html` (loads modular files)
3. Verify behavior matches `kidpix.html` (loads concatenated `app.js`)
4. Files are loaded in dependency order automatically

**Load Order (matches original build.sh):**

1. `js/init/*` - Core setup and namespaces
2. `js/util/*` - Utility functions and helpers
3. `js/tools/*` - Drawing tools
4. `js/textures/*` - Pattern generators
5. `js/submenus/*` - UI submenu definitions
6. `js/brushes/*` - Brush generators
7. `js/builders/*` - Complex shape builders
8. `js/stamps/*` - Stamp and text systems
9. `js/sounds/*` - Audio system

### Example: Adding a New Tool

```javascript
// js/tools/newtool.js
KiddoPaint.Tools.NewTool = function () {
  this.mousedown = function (ev) {
    // Tool initialization
    KiddoPaint.Display.saveUndo();
  };

  this.mousemove = function (ev) {
    // Drawing logic
    if (KiddoPaint.Current.modified) {
      // Shift key behavior
    }
  };

  this.mouseup = function (ev) {
    // Finish drawing
    KiddoPaint.Display.saveMain();
  };
};
```

```javascript
// js/submenus/newtool.js
KiddoPaint.Submenu.newtool = [
  {
    name: "Option 1",
    imgSrc: "src/assets/img/tool-option-1.png",
    handler: function () {
      // Configure tool option
    },
  },
];
```

## Working with Canvas

### Setting Up Canvas Component

```typescript
// src/components/DrawingCanvas.tsx
import React, { useCallback } from 'react';
import { useCanvas } from '../hooks/useCanvas';

interface DrawingCanvasProps {
  width: number;
  height: number;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width,
  height
}) => {
  const { canvasRef, draw } = useCanvas({ width, height });

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (event.buttons !== 1) return; // Only draw when left button pressed

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    draw(x, y);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      style={{ border: '1px solid #ccc' }}
    />
  );
};
```

### Adding Touch Support

```typescript
const handleTouchMove = useCallback((event: React.TouchEvent) => {
  event.preventDefault();

  const canvas = canvasRef.current;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const touch = event.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  draw(x, y);
}, [draw]);

return (
  <canvas
    ref={canvasRef}
    onMouseMove={handleMouseMove}
    onTouchMove={handleTouchMove}
    style={{ touchAction: 'none' }} // Prevent scrolling
  />
);
```

## Testing

### Writing Unit Tests

```typescript
// src/utils/__tests__/colorUtils.test.ts
import { describe, it, expect } from "vitest";
import { hexToRgb, rgbToHex } from "../colorUtils";

describe("colorUtils", () => {
  describe("hexToRgb", () => {
    it("converts hex to RGB", () => {
      expect(hexToRgb("#FF0000")).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb("#00FF00")).toEqual({ r: 0, g: 255, b: 0 });
    });

    it("handles invalid input", () => {
      expect(hexToRgb("invalid")).toBeNull();
    });
  });
});
```

### Writing E2E Tests

```typescript
// tests/e2e/drawing.spec.ts
import { test, expect } from "@playwright/test";

test("user can draw on canvas", async ({ page }) => {
  await page.goto("/");

  // Wait for canvas to load
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();

  // Draw a line
  await canvas.hover({ position: { x: 100, y: 100 } });
  await page.mouse.down();
  await canvas.hover({ position: { x: 200, y: 200 } });
  await page.mouse.up();

  // Verify drawing occurred (canvas should have changed)
  const canvasData = await canvas.screenshot();
  expect(canvasData).toBeTruthy();
});

test("color picker changes drawing color", async ({ page }) => {
  await page.goto("/");

  // Click red color
  await page.click('[data-testid="color-red"]');

  // Draw something
  const canvas = page.locator("canvas");
  await canvas.click({ position: { x: 100, y: 100 } });

  // Verify color was applied (implementation specific)
});
```

### Testing Canvas Operations

```typescript
// src/components/__tests__/DrawingCanvas.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DrawingCanvas } from '../DrawingCanvas';

// Mock canvas context
const mockContext = {
  fillRect: vi.fn(),
  fillStyle: '',
  imageSmoothingEnabled: false,
};

const mockGetContext = vi.fn(() => mockContext);

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: mockGetContext,
});

describe('DrawingCanvas', () => {
  it('draws when mouse moves with button pressed', () => {
    render(<DrawingCanvas width={400} height={300} />);

    const canvas = screen.getByRole('img');

    fireEvent.mouseMove(canvas, {
      clientX: 100,
      clientY: 100,
      buttons: 1, // Left button pressed
    });

    expect(mockContext.fillRect).toHaveBeenCalled();
  });
});
```

## State Management

### Using Context for Global State

```typescript
// src/context/AppContext.tsx
import React, { createContext, useContext, useReducer } from 'react';

interface AppState {
  currentTool: string;
  currentColor: string;
  isDrawing: boolean;
}

type AppAction =
  | { type: 'SET_TOOL'; payload: string }
  | { type: 'SET_COLOR'; payload: string }
  | { type: 'SET_DRAWING'; payload: boolean };

const initialState: AppState = {
  currentTool: 'pencil',
  currentColor: '#000000',
  isDrawing: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_TOOL':
      return { ...state, currentTool: action.payload };
    case 'SET_COLOR':
      return { ...state, currentColor: action.payload };
    case 'SET_DRAWING':
      return { ...state, isDrawing: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
```

### Using the Context

```typescript
// src/components/ColorPicker.tsx
import React from 'react';
import { useAppContext } from '../context/AppContext';

const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF'];

export const ColorPicker: React.FC = () => {
  const { state, dispatch } = useAppContext();

  return (
    <div className="color-picker">
      {colors.map(color => (
        <button
          key={color}
          data-testid={`color-${color.slice(1)}`}
          style={{ backgroundColor: color }}
          className={state.currentColor === color ? 'active' : ''}
          onClick={() => dispatch({ type: 'SET_COLOR', payload: color })}
        />
      ))}
    </div>
  );
};
```

## Adding Audio

### Setting Up Audio Manager

```typescript
// src/utils/audioManager.ts
class AudioManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();

  async initialize() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn("Audio not supported:", error);
    }
  }

  async loadSound(name: string, url: string) {
    if (!this.audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds.set(name, audioBuffer);
    } catch (error) {
      console.warn(`Failed to load sound ${name}:`, error);
    }
  }

  playSound(name: string) {
    if (!this.audioContext || !this.sounds.has(name)) return;

    const audioBuffer = this.sounds.get(name)!;
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    source.start();
  }
}

export const audioManager = new AudioManager();
```

### Using Audio in Components

```typescript
// src/hooks/useAudio.ts
import { useEffect, useCallback } from "react";
import { audioManager } from "../utils/audioManager";

export const useAudio = () => {
  useEffect(() => {
    const initAudio = async () => {
      await audioManager.initialize();
      await audioManager.loadSound("click", "/sounds/click.wav");
      await audioManager.loadSound("draw", "/sounds/draw.wav");
    };

    // Only initialize after user interaction
    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  const playSound = useCallback((soundName: string) => {
    audioManager.playSound(soundName);
  }, []);

  return { playSound };
};
```

## Deployment and Release

### Manual Build Testing

```bash
# Test production build locally
yarn build
yarn preview

# Check bundle size
yarn build --analyze

# Test with different base paths
yarn build --base=/kidpix/
yarn preview --base=/kidpix/
```

### Creating a Release

```bash
# 1. Ensure clean working directory
git status

# 2. Update version (if needed)
# Edit package.json version

# 3. Create release branch
git checkout -b release/v1.2.0

# 4. Run full test suite
yarn test && yarn test:e2e && yarn build

# 5. Commit and tag
git add package.json
git commit -m "chore: bump version to 1.2.0"
git tag v1.2.0

# 6. Push and create PR
git push origin release/v1.2.0
gh pr create --title "Release v1.2.0"
```

### Monitoring Deployment

```bash
# Check GitHub Actions status
gh run list

# View specific run
gh run view <run-id>

# Check deployment status
curl -I https://justinpearson.github.io/kidpix/
```

## Performance Optimization

### Bundle Analysis

```bash
# Install analyzer
yarn add --dev rollup-plugin-analyzer

# Update vite.config.ts
import { analyzer } from 'rollup-plugin-analyzer';

export default defineConfig({
  plugins: [
    // ... other plugins
    analyzer({ summaryOnly: true })
  ]
});
```

### Code Splitting

```typescript
// Lazy load components
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

// Use in component
<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>

// Lazy load utilities
const heavyUtils = await import('./utils/heavyUtils');
```

### Canvas Performance

```typescript
// Use requestAnimationFrame for smooth drawing
const useAnimation = () => {
  const frameRef = useRef<number>();

  const startAnimation = useCallback((callback: () => void) => {
    const animate = () => {
      callback();
      frameRef.current = requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const stopAnimation = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  }, []);

  return { startAnimation, stopAnimation };
};
```

## Claude Code Development Workflow

### Browser Error Monitoring

This project includes a sophisticated error monitoring setup specifically designed for Claude Code AI-assisted development. Browser runtime errors are automatically captured and displayed in the Vite dev server terminal with timestamps and full stack traces. If Claude Code is running `yarn dev`, then it will be able to automatically detect browser console errors, report them, and hopefully fix them :).

**⚠️ CRITICAL: Claude Code must run the dev server (`yarn dev`) in its own background bash shell. Human developers should NOT run `yarn dev` in their own terminal because then Claude Code won't be able to view the browser console errors.**

### Error Monitoring Setup

#### Technology Stack

- **Plugin**: `vite-plugin-terminal@1.3.0`
- **Configuration**: Dual output to browser console and terminal
- **Error Handlers**: Custom JavaScript error handlers in `index.html`
- **Timestamps**: Local time format for human readability

#### Implementation Details

```typescript
// vite.config.ts
import Terminal from "vite-plugin-terminal";

export default defineConfig({
  plugins: [
    Terminal({
      output: ["terminal", "console"], // Show in both places
    }),
  ],
});
```

```javascript
// index.html - Error handling script
import { terminal } from "virtual:terminal";

// Capture uncaught exceptions
window.addEventListener("error", function (event) {
  const timestamp = new Date().toLocaleString();
  const errorMsg = `🚨 [${timestamp}] Runtime Error: ${event.message}...`;
  terminal.error(errorMsg);
});

// Capture promise rejections
window.addEventListener("unhandledrejection", function (event) {
  const timestamp = new Date().toLocaleString();
  const errorMsg = `🚨 [${timestamp}] Unhandled Promise Rejection: ${event.reason}...`;
  terminal.error(errorMsg);
});

// Override console.error
console.error = function (...args) {
  originalConsoleError.apply(console, arguments);
  if (!args[0]?.toString().includes("🚨")) {
    const timestamp = new Date().toLocaleString();
    terminal.error(`🚨 [${timestamp}] Console Error:`, ...args);
  }
};
```

#### Version Compatibility

⚠️ **Important**: This project uses Vite 6.3.5 instead of the latest 7.x for compatibility reasons:

- **Security**: Vite 6.3.5 was chosen to address esbuild security vulnerabilities
- **Plugin Compatibility**: `vite-plugin-terminal` has [known issues](https://github.com/patak-dev/vite-plugin-terminal/issues/34) with Vite 7.x
- **Workaround**: If Vite 7.x is required, implement a custom WebSocket-based error reporting solution

### Usage and Best Practices

#### Starting Claude Code Session

**✅ CORRECT: Claude Code starts the dev server**

```bash
# Claude Code runs this in background bash shell
yarn dev

# Expected output in Claude's terminal:
# VITE v6.3.5  ready in 75 ms
# ➜  Local:   http://localhost:5173/
# » 🧪 Terminal plugin test - this should appear in the terminal
```

**❌ INCORRECT: Human runs their own dev server**

```bash
# DON'T DO THIS - breaks error monitoring
# Human in their own terminal:
yarn dev  # <- This prevents Claude from seeing errors
```

**Why this matters:**

- Claude Code needs to run `yarn dev` in its own background bash shell
- Claude uses the `BashOutput` tool to read terminal output from its own shell
- If human runs the dev server separately, Claude cannot access that terminal output
- Error monitoring completely fails if Claude doesn't control the dev server process

#### Error Monitoring Workflow

1. **Claude Code**: Starts `yarn dev` in background bash shell
2. **Human Developer**: Opens browser to http://localhost:5173/ and interacts with application
3. **Browser**: Generates runtime errors during interaction
4. **Error Handlers**: Capture errors and send to Claude's terminal via plugin
5. **Claude Code**: Uses `BashOutput` tool to read new terminal output from its own shell
6. **Coordination**: Both parties reference timestamps for debugging

#### Example Error Output

```
🚨 [8/14/2025, 6:09:37 AM] Runtime Error: Uncaught ReferenceError: distanceBetween is not defined
   at http://localhost:5173/js/init/kiddopaint.js:586:14
   Stack: ReferenceError: distanceBetween is not defined
    at common_ev_proc (http://localhost:5173/js/init/kiddopaint.js:586:14)
    at HTMLCanvasElement.ev_canvas (http://localhost:5173/js/init/kiddopaint.js:577:3)
```

#### Critical Limitations and Pitfalls

⚠️ **BashOutput Tool Behavior**: Claude Code's `BashOutput` tool has important limitations:

**How It Works:**

- Only shows **NEW** output since last check
- Once checked, previous output is "consumed" and unavailable
- Output timestamps help identify fresh vs cached errors

**Potential Issues:**

- **Wrong Dev Server**: Human running their own `yarn dev` breaks everything
- **Timing Problems**: Claude checking before errors occur misses them
- **Premature Clearing**: Accidental checks can clear error history
- **Sync Issues**: Claude may see old cached errors instead of current ones
- **Lost Context**: Previous error context disappears after each `BashOutput` call

**Best Practices:**

1. **Claude Controls Dev Server**: Claude must run `yarn dev` in background - humans should never run it
2. **Coordinate Timing**: Human should signal when new errors are triggered
3. **Check Systematically**: Claude should only check output when expecting new errors
4. **Use Timestamps**: Compare error timestamps to check timing in terminal output
5. **Communicate Status**: Both parties should be explicit about which errors are being discussed
6. **Browser Backup**: Human can reference browser console for complete error history
7. **Sequential Workflow**: Process one set of errors at a time to avoid confusion

#### Debugging Session Example

```bash
# ✅ CORRECT workflow:
Claude: [starts yarn dev in background]
Human: "I'm going to trigger some errors now"
Human: [moves mouse in app]
Human: "Ok, I triggered some errors at 6:09:37 AM"
Claude: [calls BashOutput to see errors from that time]
Claude: "I can see the distanceBetween error at 6:09:37 AM. Let me examine..."

# ❌ INCORRECT workflow:
Human: [runs own yarn dev in separate terminal]
Human: "I'm seeing errors in my terminal"
Claude: [calls BashOutput on its own shell]
Claude: "I don't see any errors" # <- Problem: Claude can't see human's terminal
```

#### Benefits of This Setup

- **Real-time Debugging**: Immediate visibility into runtime errors
- **Detailed Stack Traces**: Complete error context with file locations
- **Timestamped History**: Coordinate debugging sessions effectively
- **AI-Human Collaboration**: Seamless workflow for AI-assisted development
- **No Manual Checking**: Eliminates need to manually check browser console
