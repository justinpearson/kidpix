# Phase 3: Core Architecture (Weeks 5-8)

## Table of Contents

1. [Overview](#overview)
2. [Implementation Steps](#implementation-steps)
3. [Background & Context](#background--context)
4. [Practical Examples](#practical-examples)
5. [Verification & Testing](#verification--testing)
6. [Troubleshooting](#troubleshooting)
7. [Next Steps](#next-steps)

## Overview

Phase 3 establishes the foundational React architecture for KidPix, focusing on state management, canvas integration, and the component structure. This phase transforms the global JavaScript namespace into a modern React application while preserving all existing functionality.

**Learning Focus**: React fundamentals, hooks, context API, canvas integration, and modern state management patterns.

**Duration**: 4 weeks  
**Difficulty**: Intermediate to Advanced  
**Prerequisites**: Completed Phases 1-2, basic understanding of React concepts

## Implementation Steps

### Step 3.1: Set Up React with TypeScript

**Goal**: Configure React in the existing Vite project alongside JavaScript files.

```bash
# Install React and TypeScript support
yarn add react react-dom
yarn add --dev @types/react @types/react-dom @vitejs/plugin-react

# Update Vite configuration
```

**Update `vite.config.ts`**:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": "/src",
      "@js": "/js",
    },
  },
});
```

### Step 3.2: Create Root Application Component

**Goal**: Set up the main React application structure.

**Create `src/App.tsx`**:

```typescript
import React from 'react';
import { KidPixProvider } from './contexts/KidPixContext';
import { CanvasContainer } from './components/Canvas/CanvasContainer';
import { Toolbar } from './components/UI/Toolbar';
import { ColorPalette } from './components/UI/ColorPalette';
import './App.css';

const App: React.FC = () => {
  return (
    <KidPixProvider>
      <div className="kidpix-app">
        <header className="kidpix-header">
          <h1>KidPix</h1>
        </header>

        <main className="kidpix-main">
          <div className="kidpix-sidebar">
            <Toolbar />
            <ColorPalette />
          </div>

          <div className="kidpix-canvas-area">
            <CanvasContainer />
          </div>
        </main>
      </div>
    </KidPixProvider>
  );
};

export default App;
```

### Step 3.3: Design State Management with Context API

**Goal**: Replace global KiddoPaint namespace with React Context.

**Create `src/contexts/KidPixContext.tsx`**:

```typescript
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// State interface
export interface KidPixState {
  currentTool: string;
  currentColor: string;
  brushSize: number;
  isDrawing: boolean;
  canvasLayers: {
    main: HTMLCanvasElement | null;
    tmp: HTMLCanvasElement | null;
    preview: HTMLCanvasElement | null;
    anim: HTMLCanvasElement | null;
    bnim: HTMLCanvasElement | null;
  };
  undoStack: ImageData[];
  redoStack: ImageData[];
}

// Action types
export type KidPixAction =
  | { type: 'SET_TOOL'; payload: string }
  | { type: 'SET_COLOR'; payload: string }
  | { type: 'SET_BRUSH_SIZE'; payload: number }
  | { type: 'SET_DRAWING_STATE'; payload: boolean }
  | { type: 'SET_CANVAS_LAYER'; payload: { layer: keyof KidPixState['canvasLayers']; canvas: HTMLCanvasElement } }
  | { type: 'PUSH_UNDO'; payload: ImageData }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// Initial state
const initialState: KidPixState = {
  currentTool: 'pencil',
  currentColor: '#000000',
  brushSize: 5,
  isDrawing: false,
  canvasLayers: {
    main: null,
    tmp: null,
    preview: null,
    anim: null,
    bnim: null
  },
  undoStack: [],
  redoStack: []
};

// Reducer function
function kidPixReducer(state: KidPixState, action: KidPixAction): KidPixState {
  switch (action.type) {
    case 'SET_TOOL':
      return { ...state, currentTool: action.payload };

    case 'SET_COLOR':
      return { ...state, currentColor: action.payload };

    case 'SET_BRUSH_SIZE':
      return { ...state, brushSize: action.payload };

    case 'SET_DRAWING_STATE':
      return { ...state, isDrawing: action.payload };

    case 'SET_CANVAS_LAYER':
      return {
        ...state,
        canvasLayers: {
          ...state.canvasLayers,
          [action.payload.layer]: action.payload.canvas
        }
      };

    case 'PUSH_UNDO':
      return {
        ...state,
        undoStack: [...state.undoStack, action.payload].slice(-20), // Keep last 20
        redoStack: [] // Clear redo when new action is performed
      };

    case 'UNDO':
      if (state.undoStack.length === 0) return state;
      const lastState = state.undoStack[state.undoStack.length - 1];
      return {
        ...state,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [lastState, ...state.redoStack]
      };

    case 'REDO':
      if (state.redoStack.length === 0) return state;
      const nextState = state.redoStack[0];
      return {
        ...state,
        undoStack: [...state.undoStack, nextState],
        redoStack: state.redoStack.slice(1)
      };

    default:
      return state;
  }
}

// Context creation
interface KidPixContextType {
  state: KidPixState;
  dispatch: React.Dispatch<KidPixAction>;
}

const KidPixContext = createContext<KidPixContextType | undefined>(undefined);

// Provider component
interface KidPixProviderProps {
  children: ReactNode;
}

export const KidPixProvider: React.FC<KidPixProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(kidPixReducer, initialState);

  return (
    <KidPixContext.Provider value={{ state, dispatch }}>
      {children}
    </KidPixContext.Provider>
  );
};

// Custom hook for using the context
export const useKidPix = () => {
  const context = useContext(KidPixContext);
  if (context === undefined) {
    throw new Error('useKidPix must be used within a KidPixProvider');
  }
  return context;
};
```

### Step 3.4: Create Canvas Layer Management System

**Goal**: Implement the 5-layer canvas system as React components.

**Create `src/components/Canvas/CanvasContainer.tsx`**:

```typescript
import React, { useRef, useEffect } from 'react';
import { useKidPix } from '../../contexts/KidPixContext';
import { CanvasLayer } from './CanvasLayer';
import { useCanvasSetup } from '../../hooks/useCanvasSetup';
import { useDrawingEvents } from '../../hooks/useDrawingEvents';

export const CanvasContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useKidPix();

  // Custom hooks for canvas setup and event handling
  useCanvasSetup(containerRef, dispatch);
  useDrawingEvents(state.canvasLayers.tmp, state);

  return (
    <div
      ref={containerRef}
      className="canvas-container"
      style={{ position: 'relative', width: '640px', height: '480px' }}
    >
      {/* Background/Animation Layer */}
      <CanvasLayer
        name="bnim"
        width={640}
        height={480}
        zIndex={1}
        className="canvas-bnim"
      />

      {/* Animation Layer */}
      <CanvasLayer
        name="anim"
        width={640}
        height={480}
        zIndex={2}
        className="canvas-anim"
      />

      {/* Main Drawing Layer */}
      <CanvasLayer
        name="main"
        width={640}
        height={480}
        zIndex={3}
        className="canvas-main"
      />

      {/* Preview Layer */}
      <CanvasLayer
        name="preview"
        width={640}
        height={480}
        zIndex={4}
        className="canvas-preview"
      />

      {/* Temporary Drawing Layer (top-most, interactive) */}
      <CanvasLayer
        name="tmp"
        width={640}
        height={480}
        zIndex={5}
        className="canvas-tmp"
        interactive={true}
      />
    </div>
  );
};
```

**Create `src/components/Canvas/CanvasLayer.tsx`**:

```typescript
import React, { useRef, useEffect, forwardRef } from 'react';
import { useKidPix } from '../../contexts/KidPixContext';

interface CanvasLayerProps {
  name: keyof KidPixState['canvasLayers'];
  width: number;
  height: number;
  zIndex: number;
  className?: string;
  interactive?: boolean;
}

export const CanvasLayer = forwardRef<HTMLCanvasElement, CanvasLayerProps>(
  ({ name, width, height, zIndex, className, interactive = false }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { dispatch } = useKidPix();

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Register canvas with context
      dispatch({
        type: 'SET_CANVAS_LAYER',
        payload: { layer: name, canvas }
      });

      // Set up canvas properties
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }, [name, dispatch]);

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex,
          pointerEvents: interactive ? 'auto' : 'none',
          imageRendering: 'pixelated' // Maintain crisp pixels
        }}
      />
    );
  }
);

CanvasLayer.displayName = 'CanvasLayer';
```

### Step 3.5: Create Custom Hooks for Canvas Operations

**Goal**: Encapsulate canvas logic in reusable hooks.

**Create `src/hooks/useCanvasSetup.ts`**:

```typescript
import { useEffect, RefObject } from "react";
import { KidPixAction } from "../contexts/KidPixContext";

export const useCanvasSetup = (
  containerRef: RefObject<HTMLDivElement>,
  dispatch: React.Dispatch<KidPixAction>,
) => {
  useEffect(() => {
    if (!containerRef.current) return;

    // Set up container properties
    const container = containerRef.current;
    container.style.cursor = "crosshair";

    // Add any additional setup logic here
    // For example: setting up resize observers, initial canvas state, etc.
  }, [containerRef, dispatch]);
};
```

**Create `src/hooks/useDrawingEvents.ts`**:

```typescript
import { useEffect, useCallback } from "react";
import { KidPixState } from "../contexts/KidPixContext";

export const useDrawingEvents = (
  canvas: HTMLCanvasElement | null,
  state: KidPixState,
) => {
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (!canvas) return;

      // Get current tool and call its mousedown method
      // This will be expanded when we implement tools
      console.log("Mouse down at", event.offsetX, event.offsetY);
    },
    [canvas, state],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!canvas || !state.isDrawing) return;

      // Handle mouse move for current tool
      console.log("Mouse move at", event.offsetX, event.offsetY);
    },
    [canvas, state],
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (!canvas) return;

      // Handle mouse up for current tool
      console.log("Mouse up at", event.offsetX, event.offsetY);
    },
    [canvas, state],
  );

  useEffect(() => {
    if (!canvas) return;

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvas, handleMouseDown, handleMouseMove, handleMouseUp]);
};
```

### Step 3.6: Create UI Components

**Goal**: Build the toolbar and color palette components.

**Create `src/components/UI/Toolbar.tsx`**:

```typescript
import React from 'react';
import { useKidPix } from '../../contexts/KidPixContext';

const TOOLS = [
  { id: 'pencil', name: 'Pencil', icon: '✏️' },
  { id: 'brush', name: 'Brush', icon: '🖌️' },
  { id: 'eraser', name: 'Eraser', icon: '🧽' },
  { id: 'line', name: 'Line', icon: '📏' },
  { id: 'circle', name: 'Circle', icon: '⭕' },
  { id: 'square', name: 'Square', icon: '⬜' },
];

export const Toolbar: React.FC = () => {
  const { state, dispatch } = useKidPix();

  const selectTool = (toolId: string) => {
    dispatch({ type: 'SET_TOOL', payload: toolId });
  };

  return (
    <div className="toolbar">
      <h3>Tools</h3>
      <div className="tool-grid">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            className={`tool-button ${state.currentTool === tool.id ? 'active' : ''}`}
            onClick={() => selectTool(tool.id)}
            title={tool.name}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
```

**Create `src/components/UI/ColorPalette.tsx`**:

```typescript
import React from 'react';
import { useKidPix } from '../../contexts/KidPixContext';

const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#90EE90', '#FFB6C1'
];

export const ColorPalette: React.FC = () => {
  const { state, dispatch } = useKidPix();

  const selectColor = (color: string) => {
    dispatch({ type: 'SET_COLOR', payload: color });
  };

  return (
    <div className="color-palette">
      <h3>Colors</h3>
      <div className="color-grid">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`color-button ${state.currentColor === color ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => selectColor(color)}
            title={color}
          />
        ))}
      </div>

      <div className="current-color">
        <label>Current Color:</label>
        <div
          className="current-color-display"
          style={{ backgroundColor: state.currentColor }}
        />
        <input
          type="color"
          value={state.currentColor}
          onChange={(e) => selectColor(e.target.value)}
        />
      </div>
    </div>
  );
};
```

### Step 3.7: Set Up Dual Entry Points

**Goal**: Allow both JavaScript and React versions to coexist.

**Update `index.html`**:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>KidPix</title>
  </head>
  <body>
    <!-- React version -->
    <div id="react-root" style="display: none;"></div>

    <!-- Original JavaScript version (default for now) -->
    <div id="js-root">
      <!-- Existing KidPix HTML structure -->
      <canvas id="kiddopaint" width="640" height="480"></canvas>
      <!-- ... rest of existing HTML ... -->
    </div>

    <!-- Toggle script -->
    <script>
      // Simple version toggle (temporary)
      const useReact = new URLSearchParams(window.location.search).has("react");
      if (useReact) {
        document.getElementById("js-root").style.display = "none";
        document.getElementById("react-root").style.display = "block";
      }
    </script>

    <!-- React version entry -->
    <script type="module" src="/src/main.tsx"></script>

    <!-- Original JavaScript files (when not using React) -->
    <script src="/js/init/kiddopaint.js"></script>
    <!-- ... other existing scripts ... -->
  </body>
</html>
```

**Create `src/main.tsx`**:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Only mount if React root exists and is visible
const reactRoot = document.getElementById('react-root');
if (reactRoot && reactRoot.style.display !== 'none') {
  const root = ReactDOM.createRoot(reactRoot);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
```

## Background & Context

### What is React?

**React** is a JavaScript library for building user interfaces, particularly web applications. It was created by Facebook and focuses on making UI development predictable and efficient.

**Core Concepts**:

- **Components**: Reusable pieces of UI
- **Props**: Data passed to components
- **State**: Data that changes over time
- **Hooks**: Functions that let you use state and other React features

**Why React for KidPix?**:

- **Component-based**: Perfect for modular tools and UI elements
- **Declarative**: Describe what the UI should look like, React handles how
- **Ecosystem**: Rich ecosystem of tools and libraries
- **Performance**: Virtual DOM and optimization features

**Example Component**:

```typescript
// Functional component with TypeScript
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="my-button"
    >
      {text}
    </button>
  );
};

// Usage
<Button text="Click me" onClick={() => console.log('Clicked!')} />
```

**Learn More**: [React Documentation](https://react.dev/)

### What are React Hooks?

**Hooks** are functions that let you "hook into" React features like state and lifecycle methods from functional components.

**Built-in Hooks**:

**useState** - Manage component state:

```typescript
const [count, setCount] = useState(0);

// Update state
setCount(count + 1);
setCount((prev) => prev + 1); // Using function for safer updates
```

**useEffect** - Side effects (similar to lifecycle methods):

```typescript
useEffect(() => {
  // Runs after every render
  document.title = `Count: ${count}`;
}, [count]); // Dependency array - only run when count changes

useEffect(() => {
  // Runs only once (like componentDidMount)
  const timer = setInterval(() => {
    console.log("Timer tick");
  }, 1000);

  // Cleanup function (like componentWillUnmount)
  return () => clearInterval(timer);
}, []); // Empty dependency array
```

**useRef** - Direct DOM access:

```typescript
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    // Draw on canvas
  }
}, []);

return <canvas ref={canvasRef} />;
```

**useCallback** - Memoize functions:

```typescript
const handleClick = useCallback(
  (event: MouseEvent) => {
    // Handle click
  },
  [dependency1, dependency2],
); // Only recreate if dependencies change
```

**Custom Hooks** - Reusable logic:

```typescript
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return position;
}

// Usage in component
const { x, y } = useMousePosition();
```

**Learn More**: [Hooks Documentation](https://react.dev/reference/react)

### What is Context API?

**Context** provides a way to pass data through the component tree without having to pass props down manually at every level. It's ideal for global application state.

**Problem Context Solves**:

```typescript
// Without Context - "prop drilling"
function App() {
  const [user, setUser] = useState(null);
  return <Header user={user} setUser={setUser} />;
}

function Header({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />;
}

function UserMenu({ user, setUser }) {
  // Finally can use user and setUser
}
```

**With Context**:

```typescript
// Create context
const UserContext = createContext();

// Provider component
function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header />
    </UserContext.Provider>
  );
}

// Use context anywhere in the tree
function UserMenu() {
  const { user, setUser } = useContext(UserContext);
  // Direct access to user and setUser
}
```

**When to Use Context**:

- ✅ Global application state (current user, theme, language)
- ✅ State shared by many components
- ✅ Avoiding prop drilling
- ❌ Local component state
- ❌ Frequently changing values (can cause performance issues)

**Learn More**: [Context Documentation](https://react.dev/reference/react/createContext)

### What is useReducer?

**useReducer** is an alternative to useState for managing complex state logic. It's especially useful when:

- State has multiple sub-values
- Next state depends on previous state
- Complex state transitions

**Comparison**:

```typescript
// useState - simple state
const [count, setCount] = useState(0);
setCount(count + 1);

// useReducer - complex state
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: "INCREMENT" });
```

**Reducer Pattern**:

```typescript
// State interface
interface State {
  count: number;
  user: User | null;
  loading: boolean;
}

// Action types
type Action =
  | { type: "INCREMENT" }
  | { type: "SET_USER"; payload: User }
  | { type: "SET_LOADING"; payload: boolean };

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// Usage
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: "SET_USER", payload: newUser });
```

**Benefits**:

- **Predictable**: All state changes go through reducer
- **Debuggable**: Easy to log and trace actions
- **Testable**: Pure functions are easy to test
- **Scalable**: Handles complex state updates

**Learn More**: [useReducer Documentation](https://react.dev/reference/react/useReducer)

### Canvas Integration with React

**Challenges**:

- Canvas is imperative (direct drawing commands)
- React is declarative (describe what you want)
- Canvas operations need direct DOM access
- Performance considerations for frequent updates

**Solutions**:

**useRef for Direct Access**:

```typescript
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  if (ctx) {
    // Direct canvas operations
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 100, 100);
  }
}, []);
```

**Separating State from Canvas Operations**:

```typescript
// React manages state
const [drawingData, setDrawingData] = useState([]);

// Canvas operations in useEffect
useEffect(() => {
  if (!canvas) return;

  // Clear and redraw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawingData.forEach((operation) => {
    // Apply each drawing operation
  });
}, [drawingData, canvas]);
```

**Event Handling**:

```typescript
const handleMouseDown = useCallback(
  (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Update React state
    setDrawingData((prev) => [...prev, { type: "start", x, y }]);
  },
  [canvas],
);

useEffect(() => {
  if (!canvas) return;

  canvas.addEventListener("mousedown", handleMouseDown);
  return () => canvas.removeEventListener("mousedown", handleMouseDown);
}, [canvas, handleMouseDown]);
```

**Performance Optimization**:

```typescript
// Debounce frequent updates
const debouncedUpdate = useMemo(
  () =>
    debounce((data) => {
      // Update canvas
    }, 16), // ~60fps
  [],
);

// Memoize expensive calculations
const processedDrawingData = useMemo(() => {
  return drawingData.map(processDrawingOperation);
}, [drawingData]);
```

### Component Architecture Patterns

**Container vs Presentational Components**:

```typescript
// Container component - manages state and logic
const CanvasContainer: React.FC = () => {
  const [tool, setTool] = useState('pencil');
  const [isDrawing, setIsDrawing] = useState(false);

  return (
    <Canvas
      tool={tool}
      isDrawing={isDrawing}
      onStartDrawing={() => setIsDrawing(true)}
      onStopDrawing={() => setIsDrawing(false)}
    />
  );
};

// Presentational component - just renders UI
const Canvas: React.FC<CanvasProps> = ({ tool, isDrawing, onStartDrawing }) => {
  return (
    <canvas
      onMouseDown={onStartDrawing}
      className={`canvas tool-${tool}`}
    />
  );
};
```

**Compound Components**:

```typescript
// Components that work together
<CanvasContainer>
  <CanvasLayer name="background" />
  <CanvasLayer name="drawing" />
  <CanvasLayer name="ui" />
</CanvasContainer>
```

**Render Props Pattern**:

```typescript
// Component that provides functionality via function
<MouseTracker>
  {({ x, y }) => (
    <div>Mouse position: {x}, {y}</div>
  )}
</MouseTracker>
```

## Practical Examples

### Example 1: Tool State Management

```typescript
// Advanced tool context with tool-specific state
interface ToolState {
  pencil: { size: number; hardness: number };
  brush: { size: number; opacity: number; pattern: string };
  eraser: { size: number; hardness: number };
}

const toolReducer = (state: ToolState, action: ToolAction) => {
  switch (action.type) {
    case "UPDATE_PENCIL":
      return {
        ...state,
        pencil: { ...state.pencil, ...action.payload },
      };
    case "UPDATE_BRUSH":
      return {
        ...state,
        brush: { ...state.brush, ...action.payload },
      };
    default:
      return state;
  }
};
```

### Example 2: Canvas Layer Management

```typescript
// Hook for managing canvas layers
const useCanvasLayers = () => {
  const layersRef = useRef<Map<string, HTMLCanvasElement>>(new Map());

  const registerLayer = useCallback(
    (name: string, canvas: HTMLCanvasElement) => {
      layersRef.current.set(name, canvas);
    },
    [],
  );

  const getLayer = useCallback((name: string) => {
    return layersRef.current.get(name);
  }, []);

  const clearLayer = useCallback((name: string) => {
    const canvas = layersRef.current.get(name);
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  return { registerLayer, getLayer, clearLayer };
};
```

### Example 3: Drawing Tool Implementation

```typescript
// React-based drawing tool
const usePencilTool = (
  canvas: HTMLCanvasElement | null,
  color: string,
  size: number,
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(
    null,
  );

  const startDrawing = useCallback(
    (event: MouseEvent) => {
      if (!canvas) return;

      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const point = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      setLastPoint(point);

      // Draw initial point
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    [canvas, color, size],
  );

  const continueDrawing = useCallback(
    (event: MouseEvent) => {
      if (!canvas || !isDrawing || !lastPoint) return;

      const rect = canvas.getBoundingClientRect();
      const currentPoint = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      // Draw line from last point to current point
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
      }

      setLastPoint(currentPoint);
    },
    [canvas, isDrawing, lastPoint, color, size],
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  return { startDrawing, continueDrawing, stopDrawing, isDrawing };
};
```

## Verification & Testing

### Test React Setup

```bash
# Start development server with React flag
yarn dev

# Visit localhost:5173?react to see React version
# Visit localhost:5173 to see JavaScript version
```

### Test Context API

```bash
# Create test component
cat > src/components/DebugPanel.tsx << 'EOF'
import React from 'react';
import { useKidPix } from '../contexts/KidPixContext';

export const DebugPanel: React.FC = () => {
  const { state } = useKidPix();

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, background: 'white', padding: '10px' }}>
      <h4>Debug Info</h4>
      <p>Tool: {state.currentTool}</p>
      <p>Color: {state.currentColor}</p>
      <p>Size: {state.brushSize}</p>
      <p>Drawing: {state.isDrawing ? 'Yes' : 'No'}</p>
    </div>
  );
};
EOF

# Add to App.tsx and test state changes
```

### Test Canvas Layers

```bash
# Create canvas test component
cat > src/components/__tests__/CanvasLayer.test.tsx << 'EOF'
import { render, screen } from '@testing-library/react';
import { CanvasLayer } from '../Canvas/CanvasLayer';
import { KidPixProvider } from '../../contexts/KidPixContext';

test('renders canvas layer with correct attributes', () => {
  render(
    <KidPixProvider>
      <CanvasLayer
        name="main"
        width={640}
        height={480}
        zIndex={3}
        className="test-canvas"
      />
    </KidPixProvider>
  );

  const canvas = screen.getByRole('img'); // Canvas has img role
  expect(canvas).toHaveAttribute('width', '640');
  expect(canvas).toHaveAttribute('height', '480');
  expect(canvas).toHaveClass('test-canvas');
});
EOF

# Run test
yarn test CanvasLayer.test.tsx
```

### Test Hook Functionality

```bash
# Test custom hooks
cat > src/hooks/__tests__/useCanvasSetup.test.ts << 'EOF'
import { renderHook } from '@testing-library/react';
import { useCanvasSetup } from '../useCanvasSetup';
import { useRef } from 'react';

test('sets up canvas container correctly', () => {
  const { result } = renderHook(() => {
    const ref = useRef<HTMLDivElement>(null);
    const dispatch = jest.fn();
    useCanvasSetup(ref, dispatch);
    return { ref, dispatch };
  });

  // Add specific assertions based on your setup logic
});
EOF
```

## Troubleshooting

### React + Vite Configuration Issues

**Problem**: React components not hot reloading

```typescript
// Solution: Ensure proper plugin configuration
// vite.config.ts
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      include: "**/*.tsx",
      babel: {
        plugins: ["babel-plugin-styled-components"],
      },
    }),
  ],
});
```

**Problem**: TypeScript paths not resolving

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@js/*": ["js/*"]
    }
  }
}
```

### Context API Issues

**Problem**: "useKidPix must be used within a KidPixProvider"

```typescript
// Solution: Ensure component is wrapped in provider
const TestComponent = () => {
  return (
    <KidPixProvider>
      <ComponentThatUsesContext />
    </KidPixProvider>
  );
};
```

**Problem**: Context causing unnecessary re-renders

```typescript
// Solution: Split context or memoize values
const contextValue = useMemo(
  () => ({ state, dispatch }),
  [state, dispatch]
);

return (
  <KidPixContext.Provider value={contextValue}>
    {children}
  </KidPixContext.Provider>
);
```

### Canvas Integration Issues

**Problem**: Canvas not responding to mouse events

```typescript
// Solution: Ensure proper event binding and ref setup
useEffect(() => {
  if (!canvasRef.current) return;

  const canvas = canvasRef.current;
  const handleMouseDown = (e: MouseEvent) => {
    // Make sure this is properly bound
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  return () => canvas.removeEventListener("mousedown", handleMouseDown);
}, []); // Proper dependency array
```

**Problem**: Canvas drawing not visible

```typescript
// Solution: Check canvas context and drawing commands
useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");

  if (ctx) {
    ctx.imageSmoothingEnabled = false; // Important for pixel art
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, 50, 50); // Test drawing
  }
}, []);
```

## Next Steps

1. **Commit the React foundation**:

```bash
git add src/ package.json vite.config.ts
git commit -m "feat(react): establish React foundation with Context API and canvas system"
```

2. **Test the dual entry system**:
   - Verify both JavaScript and React versions work
   - Test state management and canvas setup
   - Ensure no conflicts between versions

3. **Prepare for Phase 4**:
   - Plan tool conversion strategy
   - Study existing JavaScript tools
   - Design React tool interfaces

**Continue to**: [Phase 4: Tool Migration](./phase-4-tool-migration.md)

---

**Related Documentation**:

- [Overview](./overview.md) - Migration plan overview
- [Phase 2](./phase-2-add-typescript-declarations.md) - TypeScript declarations
- [Phase 4](./phase-4-tool-migration.md) - Converting drawing tools
