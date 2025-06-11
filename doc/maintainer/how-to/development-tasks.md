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
8. `js/stamps/*` - Stamp and alphabet systems
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
