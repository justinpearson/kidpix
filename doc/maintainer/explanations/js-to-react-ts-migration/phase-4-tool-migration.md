# Phase 4: Tool Migration (Weeks 9-16)

## Table of Contents

1. [Overview](#overview)
2. [Implementation Steps](#implementation-steps)
3. [Background & Context](#background--context)
4. [Practical Examples](#practical-examples)
5. [Verification & Testing](#verification--testing)
6. [Troubleshooting](#troubleshooting)
7. [Next Steps](#next-steps)

## Overview

Phase 4 focuses on converting the 28 drawing tools from the JavaScript namespace pattern to React components and TypeScript. This phase implements a systematic approach to tool migration while maintaining exact behavioral parity with the original tools.

**Learning Focus**: Advanced React patterns, testing strategies, component design, performance optimization, and maintaining complex state.

**Duration**: 8 weeks  
**Difficulty**: Advanced  
**Prerequisites**: Completed Phases 1-3, solid understanding of React hooks and TypeScript

## Implementation Steps

### Step 4.1: Design Tool Architecture Pattern

**Goal**: Create a consistent pattern for converting JavaScript tools to React components.

**Create `src/tools/ToolBase.ts`**:

```typescript
import { MouseEvent, TouchEvent } from "react";
import { KidPixState } from "../contexts/KidPixContext";

export interface ToolConfig {
  name: string;
  icon: string;
  cursor?: string;
  category: "basic" | "brush" | "effect" | "shape" | "special";
  submenu?: SubmenuConfig[];
  sounds?: {
    start?: string;
    during?: string;
    end?: string;
  };
}

export interface SubmenuConfig {
  name: string;
  icon: string;
  value: string | number;
  type: "size" | "pattern" | "mode" | "toggle";
}

export abstract class ToolBase {
  protected config: ToolConfig;
  protected state: KidPixState;
  protected dispatch: React.Dispatch<KidPixAction>;

  constructor(
    config: ToolConfig,
    state: KidPixState,
    dispatch: React.Dispatch<KidPixAction>,
  ) {
    this.config = config;
    this.state = state;
    this.dispatch = dispatch;
  }

  // Abstract methods that each tool must implement
  abstract onMouseDown(
    event: MouseEvent | TouchEvent,
    canvas: HTMLCanvasElement,
  ): void;
  abstract onMouseMove(
    event: MouseEvent | TouchEvent,
    canvas: HTMLCanvasElement,
  ): void;
  abstract onMouseUp(
    event: MouseEvent | TouchEvent,
    canvas: HTMLCanvasElement,
  ): void;

  // Optional methods with default implementations
  onKeyDown?(event: KeyboardEvent): void;
  onKeyUp?(event: KeyboardEvent): void;
  onToolSelect?(): void;
  onToolDeselect?(): void;

  // Utility methods available to all tools
  protected getMousePosition(
    event: MouseEvent | TouchEvent,
    canvas: HTMLCanvasElement,
  ) {
    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in event ? (event.touches[0]?.clientX ?? 0) : event.clientX;
    const clientY =
      "touches" in event ? (event.touches[0]?.clientY ?? 0) : event.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  protected getModifierKeys(event: MouseEvent | TouchEvent | KeyboardEvent) {
    return {
      shift: event.shiftKey,
      ctrl: event.ctrlKey,
      alt: event.altKey,
      meta: event.metaKey,
    };
  }

  protected saveUndo(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.dispatch({ type: "PUSH_UNDO", payload: imageData });
    }
  }

  protected playSound(soundType: "start" | "during" | "end") {
    const soundPath = this.config.sounds?.[soundType];
    if (soundPath) {
      // Sound playing logic (will be implemented in Phase 5)
      console.log(`Playing sound: ${soundPath}`);
    }
  }
}
```

### Step 4.2: Create Tool Registry System

**Goal**: Centralized tool management and registration.

**Create `src/tools/ToolRegistry.ts`**:

```typescript
import { ToolBase, ToolConfig } from "./ToolBase";
import { KidPixState, KidPixAction } from "../contexts/KidPixContext";

export class ToolRegistry {
  private static tools = new Map<
    string,
    new (state: KidPixState, dispatch: React.Dispatch<KidPixAction>) => ToolBase
  >();
  private static configs = new Map<string, ToolConfig>();

  static register(
    id: string,
    toolClass: new (
      state: KidPixState,
      dispatch: React.Dispatch<KidPixAction>,
    ) => ToolBase,
    config: ToolConfig,
  ) {
    this.tools.set(id, toolClass);
    this.configs.set(id, config);
  }

  static getTool(
    id: string,
    state: KidPixState,
    dispatch: React.Dispatch<KidPixAction>,
  ): ToolBase | null {
    const ToolClass = this.tools.get(id);
    return ToolClass ? new ToolClass(state, dispatch) : null;
  }

  static getConfig(id: string): ToolConfig | null {
    return this.configs.get(id) || null;
  }

  static getAllTools(): Array<{ id: string; config: ToolConfig }> {
    return Array.from(this.configs.entries()).map(([id, config]) => ({
      id,
      config,
    }));
  }

  static getToolsByCategory(
    category: ToolConfig["category"],
  ): Array<{ id: string; config: ToolConfig }> {
    return this.getAllTools().filter(
      (tool) => tool.config.category === category,
    );
  }
}
```

### Step 4.3: Convert Pencil Tool (Template)

**Goal**: Create the first converted tool as a template for others.

**Create `src/tools/PencilTool.ts`**:

```typescript
import { MouseEvent, TouchEvent } from "react";
import { ToolBase, ToolConfig } from "./ToolBase";
import { ToolRegistry } from "./ToolRegistry";
import { KidPixState, KidPixAction } from "../contexts/KidPixContext";

export class PencilTool extends ToolBase {
  private isDrawing = false;
  private lastPoint: { x: number; y: number } | null = null;

  constructor(state: KidPixState, dispatch: React.Dispatch<KidPixAction>) {
    const config: ToolConfig = {
      name: "Pencil",
      icon: "✏️",
      cursor: "crosshair",
      category: "basic",
      submenu: [
        { name: "Small", icon: "●", value: 1, type: "size" },
        { name: "Medium", icon: "●", value: 3, type: "size" },
        { name: "Large", icon: "●", value: 5, type: "size" },
        { name: "Extra Large", icon: "●", value: 8, type: "size" },
      ],
      sounds: {
        start: "kidpix-tool-pencil.wav",
      },
    };

    super(config, state, dispatch);
  }

  onMouseDown(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    this.saveUndo(canvas);
    this.isDrawing = true;

    const position = this.getMousePosition(event, canvas);
    const modifiers = this.getModifierKeys(event);

    this.lastPoint = position;

    // Get tool size (shift makes it larger)
    const baseSize = this.state.brushSize;
    const size = modifiers.shift ? baseSize * 2 : baseSize;

    // Draw initial point
    this.drawPoint(canvas, position.x, position.y, size);
    this.playSound("start");

    this.dispatch({ type: "SET_DRAWING_STATE", payload: true });
  }

  onMouseMove(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    if (!this.isDrawing || !this.lastPoint) return;

    const position = this.getMousePosition(event, canvas);
    const modifiers = this.getModifierKeys(event);
    const baseSize = this.state.brushSize;
    const size = modifiers.shift ? baseSize * 2 : baseSize;

    // Draw line from last point to current point
    this.drawLine(
      canvas,
      this.lastPoint.x,
      this.lastPoint.y,
      position.x,
      position.y,
      size,
    );
    this.lastPoint = position;
  }

  onMouseUp(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    this.isDrawing = false;
    this.lastPoint = null;
    this.dispatch({ type: "SET_DRAWING_STATE", payload: false });
  }

  private drawPoint(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    size: number,
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = this.state.currentColor;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawLine(
    canvas: HTMLCanvasElement,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    size: number,
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = this.state.currentColor;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

// Register the tool
ToolRegistry.register(
  "pencil",
  PencilTool,
  new PencilTool({} as KidPixState, (() => {}) as any).config,
);
```

### Step 4.4: Create Tool Hook for React Integration

**Goal**: Integrate tools with React component lifecycle.

**Create `src/hooks/useTool.ts`**:

```typescript
import { useCallback, useEffect, useRef } from "react";
import { useKidPix } from "../contexts/KidPixContext";
import { ToolRegistry } from "../tools/ToolRegistry";
import { ToolBase } from "../tools/ToolBase";

export const useTool = (canvas: HTMLCanvasElement | null) => {
  const { state, dispatch } = useKidPix();
  const currentToolRef = useRef<ToolBase | null>(null);
  const previousToolRef = useRef<string | null>(null);

  // Update current tool when tool changes
  useEffect(() => {
    if (state.currentTool !== previousToolRef.current) {
      // Deselect previous tool
      if (currentToolRef.current && previousToolRef.current) {
        currentToolRef.current.onToolDeselect?.();
      }

      // Create new tool instance
      currentToolRef.current = ToolRegistry.getTool(
        state.currentTool,
        state,
        dispatch,
      );

      // Select new tool
      if (currentToolRef.current) {
        currentToolRef.current.onToolSelect?.();
      }

      previousToolRef.current = state.currentTool;
    }
  }, [state.currentTool, state, dispatch]);

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!canvas || !currentToolRef.current) return;
      currentToolRef.current.onMouseDown(event, canvas);
    },
    [canvas],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!canvas || !currentToolRef.current) return;
      currentToolRef.current.onMouseMove(event, canvas);
    },
    [canvas],
  );

  const handleMouseUp = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!canvas || !currentToolRef.current) return;
      currentToolRef.current.onMouseUp(event, canvas);
    },
    [canvas],
  );

  // Keyboard event handlers
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!currentToolRef.current) return;
    currentToolRef.current.onKeyDown?.(event);
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (!currentToolRef.current) return;
    currentToolRef.current.onKeyUp?.(event);
  }, []);

  // Set up keyboard event listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    currentTool: currentToolRef.current,
    toolConfig: currentToolRef.current
      ? ToolRegistry.getConfig(state.currentTool)
      : null,
  };
};
```

### Step 4.5: Update Canvas Component to Use Tools

**Goal**: Integrate the tool system with the canvas component.

**Update `src/components/Canvas/CanvasLayer.tsx`**:

```typescript
import React, { useRef, useEffect, forwardRef } from 'react';
import { useKidPix } from '../../contexts/KidPixContext';
import { useTool } from '../../hooks/useTool';

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
    const { handleMouseDown, handleMouseMove, handleMouseUp, toolConfig } = useTool(
      interactive ? canvasRef.current : null
    );

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
        ctx.imageSmoothingEnabled = false;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }, [name, dispatch]);

    // Update cursor based on current tool
    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas && interactive && toolConfig) {
        canvas.style.cursor = toolConfig.cursor || 'crosshair';
      }
    }, [interactive, toolConfig]);

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
          imageRendering: 'pixelated'
        }}
        onMouseDown={interactive ? handleMouseDown : undefined}
        onMouseMove={interactive ? handleMouseMove : undefined}
        onMouseUp={interactive ? handleMouseUp : undefined}
        onTouchStart={interactive ? handleMouseDown : undefined}
        onTouchMove={interactive ? handleMouseMove : undefined}
        onTouchEnd={interactive ? handleMouseUp : undefined}
      />
    );
  }
);

CanvasLayer.displayName = 'CanvasLayer';
```

### Step 4.6: Convert Basic Tools (Week 9-10)

**Goal**: Convert the simplest tools first to establish patterns.

**Tools to Convert**:

1. Pencil Tool ✅ (already done as template)
2. Eraser Tool
3. Line Tool
4. Circle Tool
5. Square Tool

**Create `src/tools/EraserTool.ts`**:

```typescript
import { MouseEvent, TouchEvent } from "react";
import { ToolBase, ToolConfig } from "./ToolBase";
import { ToolRegistry } from "./ToolRegistry";
import { KidPixState, KidPixAction } from "../contexts/KidPixContext";

export class EraserTool extends ToolBase {
  private isErasing = false;
  private lastPoint: { x: number; y: number } | null = null;

  constructor(state: KidPixState, dispatch: React.Dispatch<KidPixAction>) {
    const config: ToolConfig = {
      name: "Eraser",
      icon: "🧽",
      cursor: "crosshair",
      category: "basic",
      submenu: [
        { name: "Small", icon: "⬜", value: 5, type: "size" },
        { name: "Medium", icon: "⬜", value: 10, type: "size" },
        { name: "Large", icon: "⬜", value: 20, type: "size" },
        { name: "Extra Large", icon: "⬜", value: 40, type: "size" },
      ],
    };

    super(config, state, dispatch);
  }

  onMouseDown(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    this.saveUndo(canvas);
    this.isErasing = true;

    const position = this.getMousePosition(event, canvas);
    const modifiers = this.getModifierKeys(event);

    this.lastPoint = position;

    const baseSize = this.state.brushSize;
    const size = modifiers.shift ? baseSize * 2 : baseSize;

    this.erase(canvas, position.x, position.y, size);
    this.dispatch({ type: "SET_DRAWING_STATE", payload: true });
  }

  onMouseMove(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    if (!this.isErasing || !this.lastPoint) return;

    const position = this.getMousePosition(event, canvas);
    const modifiers = this.getModifierKeys(event);
    const baseSize = this.state.brushSize;
    const size = modifiers.shift ? baseSize * 2 : baseSize;

    // Erase along the path
    this.eraseLine(
      canvas,
      this.lastPoint.x,
      this.lastPoint.y,
      position.x,
      position.y,
      size,
    );
    this.lastPoint = position;
  }

  onMouseUp(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    this.isErasing = false;
    this.lastPoint = null;
    this.dispatch({ type: "SET_DRAWING_STATE", payload: false });
  }

  private erase(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    size: number,
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over"; // Reset blend mode
  }

  private eraseLine(
    canvas: HTMLCanvasElement,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    size: number,
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
  }
}

ToolRegistry.register(
  "eraser",
  EraserTool,
  new EraserTool({} as KidPixState, (() => {}) as any).config,
);
```

### Step 4.7: Convert Shape Tools (Week 11-12)

**Goal**: Convert tools that draw geometric shapes.

**Create `src/tools/LineTool.ts`**:

```typescript
import { MouseEvent, TouchEvent } from "react";
import { ToolBase, ToolConfig } from "./ToolBase";
import { ToolRegistry } from "./ToolRegistry";
import { KidPixState, KidPixAction } from "../contexts/KidPixContext";

export class LineTool extends ToolBase {
  private isDrawing = false;
  private startPoint: { x: number; y: number } | null = null;
  private previewCanvas: HTMLCanvasElement | null = null;

  constructor(state: KidPixState, dispatch: React.Dispatch<KidPixAction>) {
    const config: ToolConfig = {
      name: "Line",
      icon: "📏",
      cursor: "crosshair",
      category: "shape",
      submenu: [
        { name: "Thin", icon: "─", value: 1, type: "size" },
        { name: "Medium", icon: "─", value: 3, type: "size" },
        { name: "Thick", icon: "─", value: 5, type: "size" },
        { name: "Extra Thick", icon: "─", value: 8, type: "size" },
      ],
      sounds: {
        start: "kidpix-tool-line-start.wav",
        end: "kidpix-tool-line-end.wav",
        during: "kidpix-tool-line-during.wav",
      },
    };

    super(config, state, dispatch);
  }

  onMouseDown(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    this.saveUndo(canvas);
    this.isDrawing = true;

    const position = this.getMousePosition(event, canvas);
    this.startPoint = position;

    // Get preview canvas for live line preview
    this.previewCanvas = this.state.canvasLayers.preview;

    this.playSound("start");
    this.dispatch({ type: "SET_DRAWING_STATE", payload: true });
  }

  onMouseMove(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    if (!this.isDrawing || !this.startPoint || !this.previewCanvas) return;

    const position = this.getMousePosition(event, canvas);
    const modifiers = this.getModifierKeys(event);

    // Clear preview canvas
    const previewCtx = this.previewCanvas.getContext("2d");
    if (previewCtx) {
      previewCtx.clearRect(
        0,
        0,
        this.previewCanvas.width,
        this.previewCanvas.height,
      );

      // Calculate line end point (snap to angles if shift is held)
      let endX = position.x;
      let endY = position.y;

      if (modifiers.shift) {
        // Snap to 45-degree angles
        const deltaX = endX - this.startPoint.x;
        const deltaY = endY - this.startPoint.y;
        const angle = Math.atan2(deltaY, deltaX);
        const snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        endX = this.startPoint.x + Math.cos(snappedAngle) * distance;
        endY = this.startPoint.y + Math.sin(snappedAngle) * distance;
      }

      // Draw preview line
      this.drawLine(
        this.previewCanvas,
        this.startPoint.x,
        this.startPoint.y,
        endX,
        endY,
      );
    }
  }

  onMouseUp(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    if (!this.isDrawing || !this.startPoint) return;

    const position = this.getMousePosition(event, canvas);
    const modifiers = this.getModifierKeys(event);

    // Calculate final line end point
    let endX = position.x;
    let endY = position.y;

    if (modifiers.shift) {
      const deltaX = endX - this.startPoint.x;
      const deltaY = endY - this.startPoint.y;
      const angle = Math.atan2(deltaY, deltaX);
      const snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      endX = this.startPoint.x + Math.cos(snappedAngle) * distance;
      endY = this.startPoint.y + Math.sin(snappedAngle) * distance;
    }

    // Draw final line on main canvas
    this.drawLine(canvas, this.startPoint.x, this.startPoint.y, endX, endY);

    // Clear preview canvas
    if (this.previewCanvas) {
      const previewCtx = this.previewCanvas.getContext("2d");
      previewCtx?.clearRect(
        0,
        0,
        this.previewCanvas.width,
        this.previewCanvas.height,
      );
    }

    this.isDrawing = false;
    this.startPoint = null;
    this.previewCanvas = null;

    this.playSound("end");
    this.dispatch({ type: "SET_DRAWING_STATE", payload: false });
  }

  private drawLine(
    canvas: HTMLCanvasElement,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const modifiers = this.getModifierKeys(event as any);
    const baseSize = this.state.brushSize;
    const size = modifiers.shift ? baseSize * 2 : baseSize;

    ctx.strokeStyle = this.state.currentColor;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

ToolRegistry.register(
  "line",
  LineTool,
  new LineTool({} as KidPixState, (() => {}) as any).config,
);
```

### Step 4.8: Create Comprehensive Testing Suite

**Goal**: Establish testing patterns for all tools.

**Create `src/tools/__tests__/ToolBase.test.ts`**:

```typescript
import { ToolBase, ToolConfig } from "../ToolBase";
import { KidPixState, KidPixAction } from "../../contexts/KidPixContext";

// Mock tool for testing
class MockTool extends ToolBase {
  onMouseDown = jest.fn();
  onMouseMove = jest.fn();
  onMouseUp = jest.fn();
}

const mockConfig: ToolConfig = {
  name: "Mock Tool",
  icon: "🔧",
  category: "basic",
};

const mockState: KidPixState = {
  currentTool: "mock",
  currentColor: "#ff0000",
  brushSize: 5,
  isDrawing: false,
  canvasLayers: {
    main: null,
    tmp: null,
    preview: null,
    anim: null,
    bnim: null,
  },
  undoStack: [],
  redoStack: [],
};

const mockDispatch = jest.fn();

describe("ToolBase", () => {
  let tool: MockTool;
  let canvas: HTMLCanvasElement;
  let mockEvent: Partial<MouseEvent>;

  beforeEach(() => {
    tool = new MockTool(mockConfig, mockState, mockDispatch);
    canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;

    mockEvent = {
      clientX: 100,
      clientY: 50,
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      metaKey: false,
    };

    // Mock getBoundingClientRect
    canvas.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 640,
      bottom: 480,
      width: 640,
      height: 480,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
  });

  test("getMousePosition calculates correct position", () => {
    const position = tool["getMousePosition"](mockEvent as MouseEvent, canvas);
    expect(position).toEqual({ x: 100, y: 50 });
  });

  test("getModifierKeys returns correct modifier state", () => {
    const modifiers = tool["getModifierKeys"](mockEvent as MouseEvent);
    expect(modifiers).toEqual({
      shift: false,
      ctrl: false,
      alt: false,
      meta: false,
    });
  });

  test("getModifierKeys detects shift key", () => {
    mockEvent.shiftKey = true;
    const modifiers = tool["getModifierKeys"](mockEvent as MouseEvent);
    expect(modifiers.shift).toBe(true);
  });
});
```

**Create `src/tools/__tests__/PencilTool.test.ts`**:

```typescript
import { PencilTool } from "../PencilTool";
import { KidPixState } from "../../contexts/KidPixContext";

const mockState: KidPixState = {
  currentTool: "pencil",
  currentColor: "#000000",
  brushSize: 3,
  isDrawing: false,
  canvasLayers: {
    main: null,
    tmp: null,
    preview: null,
    anim: null,
    bnim: null,
  },
  undoStack: [],
  redoStack: [],
};

const mockDispatch = jest.fn();

describe("PencilTool", () => {
  let tool: PencilTool;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    tool = new PencilTool(mockState, mockDispatch);
    canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    ctx = canvas.getContext("2d")!;

    // Mock canvas methods
    ctx.fillRect = jest.fn();
    ctx.arc = jest.fn();
    ctx.fill = jest.fn();
    ctx.stroke = jest.fn();
    ctx.beginPath = jest.fn();
    ctx.moveTo = jest.fn();
    ctx.lineTo = jest.fn();

    canvas.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      right: 640,
      bottom: 480,
      width: 640,
      height: 480,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    jest.clearAllMocks();
  });

  test("onMouseDown starts drawing and draws initial point", () => {
    const event = {
      clientX: 100,
      clientY: 50,
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      metaKey: false,
    } as MouseEvent;

    tool.onMouseDown(event, canvas);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_DRAWING_STATE",
      payload: true,
    });
    expect(ctx.arc).toHaveBeenCalledWith(100, 50, 1.5, 0, Math.PI * 2);
    expect(ctx.fill).toHaveBeenCalled();
  });

  test("onMouseDown with shift key doubles brush size", () => {
    const event = {
      clientX: 100,
      clientY: 50,
      shiftKey: true,
      ctrlKey: false,
      altKey: false,
      metaKey: false,
    } as MouseEvent;

    tool.onMouseDown(event, canvas);

    expect(ctx.arc).toHaveBeenCalledWith(100, 50, 3, 0, Math.PI * 2); // size 6 / 2 = 3
  });

  test("onMouseMove draws line when drawing", () => {
    // Start drawing
    const startEvent = {
      clientX: 100,
      clientY: 50,
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      metaKey: false,
    } as MouseEvent;

    tool.onMouseDown(startEvent, canvas);
    jest.clearAllMocks();

    // Move mouse
    const moveEvent = {
      clientX: 150,
      clientY: 75,
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      metaKey: false,
    } as MouseEvent;

    tool.onMouseMove(moveEvent, canvas);

    expect(ctx.moveTo).toHaveBeenCalledWith(100, 50);
    expect(ctx.lineTo).toHaveBeenCalledWith(150, 75);
    expect(ctx.stroke).toHaveBeenCalled();
  });

  test("onMouseUp stops drawing", () => {
    // Start drawing
    const startEvent = {
      clientX: 100,
      clientY: 50,
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      metaKey: false,
    } as MouseEvent;

    tool.onMouseDown(startEvent, canvas);

    // Stop drawing
    const endEvent = {
      clientX: 150,
      clientY: 75,
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      metaKey: false,
    } as MouseEvent;

    tool.onMouseUp(endEvent, canvas);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_DRAWING_STATE",
      payload: false,
    });
  });
});
```

### Step 4.9: Performance Optimization

**Goal**: Ensure tools perform well with high-frequency events.

**Create `src/utils/performance.ts`**:

```typescript
// Throttle function for mouse move events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Debounce function for expensive operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Request animation frame helper
export function requestAnimationFrameThrottle<
  T extends (...args: any[]) => any,
>(func: T): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      func.apply(this, args);
      rafId = null;
    });
  };
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private measurements: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasurement(name: string): void {
    performance.mark(`${name}-start`);
  }

  endMeasurement(name: string): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const measure = performance.getEntriesByName(name, "measure")[0];
    const duration = measure.duration;

    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
    this.measurements.get(name)!.push(duration);

    // Keep only last 100 measurements
    const measurements = this.measurements.get(name)!;
    if (measurements.length > 100) {
      measurements.shift();
    }

    return duration;
  }

  getAverageTime(name: string): number {
    const measurements = this.measurements.get(name);
    if (!measurements || measurements.length === 0) return 0;

    const sum = measurements.reduce((a, b) => a + b, 0);
    return sum / measurements.length;
  }

  getReport(): Record<
    string,
    { average: number; count: number; latest: number }
  > {
    const report: Record<
      string,
      { average: number; count: number; latest: number }
    > = {};

    for (const [name, measurements] of this.measurements) {
      const sum = measurements.reduce((a, b) => a + b, 0);
      report[name] = {
        average: sum / measurements.length,
        count: measurements.length,
        latest: measurements[measurements.length - 1] || 0,
      };
    }

    return report;
  }
}
```

## Background & Context

### Component Design Patterns

**Higher-Order Components (HOCs) vs Hooks**:

Before hooks, React used HOCs for sharing logic:

```typescript
// Old HOC pattern
function withMouseTracking(Component) {
  return function MouseTrackingComponent(props) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    // ... mouse tracking logic
    return <Component {...props} mousePos={mousePos} />;
  };
}

// Usage
const MyComponentWithMouse = withMouseTracking(MyComponent);
```

With hooks, we can share logic more elegantly:

```typescript
// Modern hook pattern
function useMouseTracking() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // ... mouse tracking logic
  return mousePos;
}

// Usage in component
function MyComponent() {
  const mousePos = useMouseTracking();
  return <div>Mouse at {mousePos.x}, {mousePos.y}</div>;
}
```

**Compound Components Pattern**:

```typescript
// Components that work together
<Tabs defaultTab="first">
  <Tabs.List>
    <Tabs.Tab id="first">First Tab</Tabs.Tab>
    <Tabs.Tab id="second">Second Tab</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panels>
    <Tabs.Panel id="first">First Content</Tabs.Panel>
    <Tabs.Panel id="second">Second Content</Tabs.Panel>
  </Tabs.Panels>
</Tabs>
```

### Testing Strategies

**Unit Testing Tools**:

- **Vitest**: Fast unit test runner
- **React Testing Library**: Focus on testing user interactions
- **Jest DOM**: Additional matchers for DOM testing

**Testing Philosophy**:

```typescript
// ❌ Testing implementation details
test("tool sets isDrawing to true", () => {
  expect(tool.isDrawing).toBe(true);
});

// ✅ Testing behavior
test("tool draws when mouse is dragged", () => {
  fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
  fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });

  // Verify canvas was drawn on
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  expect(imageData.data.some((pixel) => pixel !== 0)).toBe(true);
});
```

**Mocking Strategies**:

```typescript
// Mock Canvas API
beforeEach(() => {
  const mockCtx = {
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(),
    putImageData: jest.fn(),
    drawImage: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    arc: jest.fn(),
  };

  HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCtx);
});
```

### Performance Considerations

**Event Handling Optimization**:

```typescript
// ❌ Creating new functions on every render
const Component = () => {
  return (
    <canvas
      onMouseMove={(e) => handleMouseMove(e)}
      onMouseDown={(e) => handleMouseDown(e)}
    />
  );
};

// ✅ Using useCallback to prevent recreation
const Component = () => {
  const handleMouseMove = useCallback((e) => {
    // Handle mouse move
  }, [dependencies]);

  const handleMouseDown = useCallback((e) => {
    // Handle mouse down
  }, [dependencies]);

  return (
    <canvas
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
    />
  );
};
```

**Canvas Performance**:

```typescript
// ❌ Clearing entire canvas on every draw
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawEverything();

// ✅ Only redraw changed areas
const dirtyRect = calculateDirtyRect(lastDraw, currentDraw);
ctx.clearRect(dirtyRect.x, dirtyRect.y, dirtyRect.width, dirtyRect.height);
drawChangedAreas(dirtyRect);
```

**Memory Management**:

```typescript
// ❌ Memory leak - event listeners not cleaned up
useEffect(() => {
  document.addEventListener("mousemove", handleMouseMove);
}, []);

// ✅ Proper cleanup
useEffect(() => {
  document.addEventListener("mousemove", handleMouseMove);
  return () => {
    document.removeEventListener("mousemove", handleMouseMove);
  };
}, [handleMouseMove]);
```

### State Management Patterns

**Local vs Global State**:

```typescript
// Local state - component-specific
function ToolSettings() {
  const [isOpen, setIsOpen] = useState(false);
  // This state only affects this component
}

// Global state - shared across app
function useKidPix() {
  const { state, dispatch } = useContext(KidPixContext);
  // This state affects entire application
}
```

**State Normalization**:

```typescript
// ❌ Nested state structure
const state = {
  tools: {
    pencil: { size: 5, color: "red" },
    brush: { size: 10, color: "blue" },
  },
};

// ✅ Normalized state structure
const state = {
  currentTool: "pencil",
  toolSettings: {
    pencil: { size: 5 },
    brush: { size: 10 },
  },
  currentColor: "red",
};
```

### Code Organization

**Feature-Based vs Type-Based Organization**:

```typescript
// Type-based (traditional)
src / components / Toolbar.tsx;
Canvas.tsx;
hooks / useTool.ts;
useCanvas.ts;
utils / performance.ts;

// Feature-based (modern)
src / features / drawing / components / Canvas.tsx;
hooks / useDrawing.ts;
utils / drawingUtils.ts;
toolbar / components / Toolbar.tsx;
hooks / useToolbar.ts;
```

## Practical Examples

### Example 1: Advanced Tool with Preview

```typescript
// Circle tool with live preview
export class CircleTool extends ToolBase {
  private isDrawing = false;
  private startPoint: { x: number; y: number } | null = null;
  private previewImageData: ImageData | null = null;

  onMouseDown(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    this.saveUndo(canvas);
    this.isDrawing = true;
    this.startPoint = this.getMousePosition(event, canvas);

    // Save preview canvas state
    const previewCanvas = this.state.canvasLayers.preview;
    if (previewCanvas) {
      const ctx = previewCanvas.getContext("2d");
      this.previewImageData =
        ctx?.getImageData(0, 0, previewCanvas.width, previewCanvas.height) ||
        null;
    }
  }

  onMouseMove(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    if (!this.isDrawing || !this.startPoint) return;

    const currentPoint = this.getMousePosition(event, canvas);
    const radius = Math.sqrt(
      Math.pow(currentPoint.x - this.startPoint.x, 2) +
        Math.pow(currentPoint.y - this.startPoint.y, 2),
    );

    // Update preview
    this.updatePreview(this.startPoint, radius);
  }

  onMouseUp(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    if (!this.isDrawing || !this.startPoint) return;

    const currentPoint = this.getMousePosition(event, canvas);
    const radius = Math.sqrt(
      Math.pow(currentPoint.x - this.startPoint.x, 2) +
        Math.pow(currentPoint.y - this.startPoint.y, 2),
    );

    // Draw final circle
    this.drawCircle(canvas, this.startPoint, radius);

    // Clear preview
    this.clearPreview();

    this.isDrawing = false;
    this.startPoint = null;
  }

  private updatePreview(
    center: { x: number; y: number },
    radius: number,
  ): void {
    const previewCanvas = this.state.canvasLayers.preview;
    if (!previewCanvas) return;

    const ctx = previewCanvas.getContext("2d");
    if (!ctx) return;

    // Restore previous state
    if (this.previewImageData) {
      ctx.putImageData(this.previewImageData, 0, 0);
    }

    // Draw preview circle
    ctx.strokeStyle = this.state.currentColor;
    ctx.lineWidth = this.state.brushSize;
    ctx.setLineDash([5, 5]); // Dashed line for preview
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash
  }

  private drawCircle(
    canvas: HTMLCanvasElement,
    center: { x: number; y: number },
    radius: number,
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = this.state.currentColor;
    ctx.lineWidth = this.state.brushSize;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  private clearPreview(): void {
    const previewCanvas = this.state.canvasLayers.preview;
    if (previewCanvas && this.previewImageData) {
      const ctx = previewCanvas.getContext("2d");
      ctx?.putImageData(this.previewImageData, 0, 0);
    }
  }
}
```

### Example 2: Tool with Complex State

```typescript
// Brush tool with pattern support
export class BrushTool extends ToolBase {
  private brushPath: { x: number; y: number; pressure: number }[] = [];
  private pattern: CanvasPattern | null = null;

  constructor(state: KidPixState, dispatch: React.Dispatch<KidPixAction>) {
    super(
      {
        name: "Brush",
        icon: "🖌️",
        category: "brush",
        submenu: [
          { name: "Round", icon: "●", value: "round", type: "pattern" },
          { name: "Square", icon: "■", value: "square", type: "pattern" },
          { name: "Texture", icon: "▦", value: "texture", type: "pattern" },
        ],
      },
      state,
      dispatch,
    );
  }

  onToolSelect(): void {
    this.updatePattern();
  }

  onMouseDown(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    this.saveUndo(canvas);
    this.brushPath = [];

    const position = this.getMousePosition(event, canvas);
    const pressure = this.getPressure(event);

    this.brushPath.push({ ...position, pressure });
    this.applyBrushStroke(canvas, position, pressure);
  }

  onMouseMove(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    const position = this.getMousePosition(event, canvas);
    const pressure = this.getPressure(event);

    this.brushPath.push({ ...position, pressure });

    // Draw stroke segment
    if (this.brushPath.length > 1) {
      const prevPoint = this.brushPath[this.brushPath.length - 2];
      this.drawBrushSegment(canvas, prevPoint, { ...position, pressure });
    }
  }

  onMouseUp(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    // Apply final smoothing to the brush path
    this.smoothBrushPath(canvas);
    this.brushPath = [];
  }

  private getPressure(event: MouseEvent | TouchEvent): number {
    if ("touches" in event && event.touches[0]) {
      // @ts-ignore - force property may not exist
      return event.touches[0].force || 0.5;
    }
    return 0.5; // Default pressure for mouse
  }

  private updatePattern(): void {
    // Create pattern based on current submenu selection
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = 20;
    patternCanvas.height = 20;
    const patternCtx = patternCanvas.getContext("2d");

    if (patternCtx) {
      // Draw pattern based on selected type
      // This would be more complex in real implementation
      patternCtx.fillStyle = this.state.currentColor;
      patternCtx.fillRect(0, 0, 20, 20);

      const canvas = this.state.canvasLayers.main;
      const ctx = canvas?.getContext("2d");
      this.pattern = ctx?.createPattern(patternCanvas, "repeat") || null;
    }
  }

  private applyBrushStroke(
    canvas: HTMLCanvasElement,
    position: { x: number; y: number },
    pressure: number,
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = this.state.brushSize * pressure;

    if (this.pattern) {
      ctx.fillStyle = this.pattern;
    } else {
      ctx.fillStyle = this.state.currentColor;
    }

    ctx.beginPath();
    ctx.arc(position.x, position.y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawBrushSegment(
    canvas: HTMLCanvasElement,
    start: { x: number; y: number; pressure: number },
    end: { x: number; y: number; pressure: number },
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate variable line width based on pressure
    const startSize = this.state.brushSize * start.pressure;
    const endSize = this.state.brushSize * end.pressure;

    // Draw gradient stroke
    const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    gradient.addColorStop(0, this.state.currentColor);
    gradient.addColorStop(1, this.state.currentColor);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = (startSize + endSize) / 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  private smoothBrushPath(canvas: HTMLCanvasElement): void {
    // Implement path smoothing algorithm
    // This would use techniques like Bezier curve fitting
  }
}
```

## Verification & Testing

### Test Tool Registration

```bash
# Create comprehensive tool registry test
cat > src/tools/__tests__/ToolRegistry.test.ts << 'EOF'
import { ToolRegistry } from '../ToolRegistry';
import { PencilTool } from '../PencilTool';
import { mockState, mockDispatch } from './testUtils';

describe('ToolRegistry', () => {
  beforeEach(() => {
    // Clear registry before each test
    ToolRegistry['tools'].clear();
    ToolRegistry['configs'].clear();
  });

  test('registers and retrieves tools correctly', () => {
    const tool = ToolRegistry.getTool('pencil', mockState, mockDispatch);
    expect(tool).toBeInstanceOf(PencilTool);
  });

  test('returns null for unregistered tools', () => {
    const tool = ToolRegistry.getTool('nonexistent', mockState, mockDispatch);
    expect(tool).toBeNull();
  });

  test('getAllTools returns all registered tools', () => {
    const allTools = ToolRegistry.getAllTools();
    expect(allTools).toContainEqual({
      id: 'pencil',
      config: expect.objectContaining({
        name: 'Pencil',
        category: 'basic'
      })
    });
  });
});
EOF
```

### Performance Testing

```bash
# Create performance test
cat > src/tools/__tests__/performance.test.ts << 'EOF'
import { PencilTool } from '../PencilTool';
import { PerformanceMonitor } from '../../utils/performance';
import { mockState, mockDispatch, createMockCanvas } from './testUtils';

describe('Tool Performance', () => {
  test('pencil tool performs within time limits', () => {
    const tool = new PencilTool(mockState, mockDispatch);
    const canvas = createMockCanvas();
    const monitor = PerformanceMonitor.getInstance();

    const startEvent = {
      clientX: 100,
      clientY: 100,
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      metaKey: false
    } as MouseEvent;

    // Test mousedown performance
    monitor.startMeasurement('pencil-mousedown');
    tool.onMouseDown(startEvent, canvas);
    const mousedownTime = monitor.endMeasurement('pencil-mousedown');

    expect(mousedownTime).toBeLessThan(16); // Should be faster than 1 frame (60fps)

    // Test mousemove performance with many events
    const moveEvents = Array.from({ length: 100 }, (_, i) => ({
      clientX: 100 + i,
      clientY: 100 + i,
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      metaKey: false
    } as MouseEvent));

    monitor.startMeasurement('pencil-mousemove-batch');
    moveEvents.forEach(event => tool.onMouseMove(event, canvas));
    const batchTime = monitor.endMeasurement('pencil-mousemove-batch');

    const averageTime = batchTime / moveEvents.length;
    expect(averageTime).toBeLessThan(1); // Average should be under 1ms per event
  });
});
EOF
```

### Integration Testing

```bash
# Create integration test
cat > src/components/__tests__/CanvasToolIntegration.test.tsx << 'EOF'
import { render, fireEvent, screen } from '@testing-library/react';
import { KidPixProvider } from '../../contexts/KidPixContext';
import { CanvasContainer } from '../Canvas/CanvasContainer';

test('canvas responds to tool interactions', async () => {
  render(
    <KidPixProvider>
      <CanvasContainer />
    </KidPixProvider>
  );

  const canvas = screen.getByRole('img'); // Canvas has img role

  // Simulate drawing gesture
  fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
  fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
  fireEvent.mouseUp(canvas, { clientX: 150, clientY: 150 });

  // Verify canvas context methods were called
  // (This would require proper mocking of canvas context)
});
EOF
```

### E2E Testing with Playwright

```bash
# Create E2E test for tool interactions
cat > tests/e2e/tools.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test('user can draw with different tools', async ({ page }) => {
  await page.goto('/?react');

  // Wait for canvas to be ready
  await page.waitForSelector('canvas');

  // Select pencil tool
  await page.click('[data-testid="tool-pencil"]');

  // Draw on canvas
  const canvas = page.locator('canvas[style*="z-index: 5"]'); // Top layer
  await canvas.click({ position: { x: 100, y: 100 } });
  await canvas.dragTo(canvas, {
    sourcePosition: { x: 100, y: 100 },
    targetPosition: { x: 200, y: 200 }
  });

  // Take screenshot to verify drawing
  await expect(page).toHaveScreenshot('pencil-drawing.png');

  // Test undo functionality
  await page.keyboard.press('Control+Z');
  await expect(page).toHaveScreenshot('after-undo.png');
});
EOF
```

## Troubleshooting

### Canvas Context Issues

**Problem**: Canvas context not available

```typescript
// Solution: Add null checks and fallbacks
const ctx = canvas.getContext("2d");
if (!ctx) {
  console.warn("Canvas context not available");
  return;
}
```

**Problem**: Canvas operations not visible

```typescript
// Check canvas layer order and visibility
useEffect(() => {
  const canvas = canvasRef.current;
  if (canvas) {
    console.log("Canvas style:", {
      zIndex: canvas.style.zIndex,
      pointerEvents: canvas.style.pointerEvents,
      display: canvas.style.display,
    });
  }
}, []);
```

### Event Handling Issues

**Problem**: Mouse events not firing

```typescript
// Ensure canvas has proper event listeners
useEffect(() => {
  if (!canvas || !interactive) return;

  const handleMouseDown = (e: MouseEvent) => {
    console.log("Native mouse down:", e.clientX, e.clientY);
    // Your handler logic
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  return () => canvas.removeEventListener("mousedown", handleMouseDown);
}, [canvas, interactive]);
```

**Problem**: Touch events not working on mobile

```typescript
// Add touch event support
<canvas
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
  style={{ touchAction: 'none' }} // Prevent default touch behaviors
/>
```

### Performance Issues

**Problem**: Drawing lags on mousemove

```typescript
// Use requestAnimationFrame throttling
const throttledMouseMove = useCallback(
  requestAnimationFrameThrottle((event: MouseEvent) => {
    // Your mousemove logic
  }),
  [dependencies],
);
```

**Problem**: Memory leaks from event listeners

```typescript
// Ensure all listeners are cleaned up
useEffect(() => {
  const cleanup: (() => void)[] = [];

  if (canvas) {
    const handlers = {
      mousedown: handleMouseDown,
      mousemove: handleMouseMove,
      mouseup: handleMouseUp,
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      canvas.addEventListener(event, handler);
      cleanup.push(() => canvas.removeEventListener(event, handler));
    });
  }

  return () => cleanup.forEach((fn) => fn());
}, [canvas, handleMouseDown, handleMouseMove, handleMouseUp]);
```

## Next Steps

1. **Commit completed basic tools**:

```bash
git add src/tools/ src/hooks/useTool.ts
git commit -m "feat(tools): implement basic drawing tools with React architecture"
```

2. **Set up tool testing pipeline**:

```bash
# Run all tool tests
yarn test src/tools/

# Run performance tests
yarn test --testNamePattern="performance"
```

3. **Continue with advanced tools**:
    - Wacky brushes (Phase 5)
    - Special effects tools
    - Complex shape builders

**Continue to**: [Phase 5: Advanced Features](./phase-5-advanced-features.md)

---

**Related Documentation**:

- [Overview](./overview.md) - Migration plan overview
- [Phase 3](./phase-3-core-architecture.md) - React foundation
- [Phase 5](./phase-5-advanced-features.md) - Advanced features and optimization
