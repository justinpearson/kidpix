/**
 * TypeScript type definitions for the KiddoPaint application.
 * These types mirror the vanilla JavaScript KiddoPaint namespace structure.
 */

// ============================================================================
// Mouse Event Types
// ============================================================================

export interface KiddoPaintMouseEvent extends MouseEvent {
  _x: number;
  _y: number;
  _mx?: number; // Modified x for tools
  _my?: number; // Modified y for tools
}

// ============================================================================
// Tool Interface
// ============================================================================

export interface Tool {
  mousedown: (ev: KiddoPaintMouseEvent) => void;
  mousemove: (ev: KiddoPaintMouseEvent) => void;
  mouseup: (ev: KiddoPaintMouseEvent) => void;

  // Optional tool properties
  isDown?: boolean;
  size?: number;
  stomp?: boolean;
  texture?: () => string | CanvasPattern | CanvasGradient;
  x?: number;
  y?: number;
}

export interface ToolConstructor {
  new (): Tool;
}

// ============================================================================
// Display System Types
// ============================================================================

export interface DisplaySystem {
  // Canvas elements
  main_canvas: HTMLCanvasElement;
  main_context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement; // tmp canvas
  context: CanvasRenderingContext2D; // tmp context
  previewCanvas: HTMLCanvasElement;
  previewContext: CanvasRenderingContext2D;
  animCanvas: HTMLCanvasElement;
  animContext: CanvasRenderingContext2D;
  bnimCanvas: HTMLCanvasElement;
  bnimContext: CanvasRenderingContext2D;

  // Undo/Redo
  undoData: string[]; // Base64 encoded image data
  redoData: string[];
  undoOn: boolean;
  allowClearTmp: boolean;

  // Methods
  clearAll: () => void;
  clearMain: () => void;
  clearTmp: () => void;
  clearPreview: () => void;
  clearAnim: () => void;
  saveUndo: () => void;
  undo: () => void;
  redo: () => void;
  saveMain: () => void;
  loadUndoRedoFromLocalStorage: () => void;
  saveUndoRedoToLocalStorage: () => void;
  clearLocalStorage: () => void;
}

// ============================================================================
// Color System Types
// ============================================================================

export interface ColorPalette {
  name: string;
  colors: string[];
}

export interface ColorSystem {
  Palette: {
    Blank: string[];
    Bright: string[];
    Basic: ColorPalette;
    [key: string]: ColorPalette | string[];
  };
  Current: {
    color?: string;
    bgcolor?: string;
  };
}

// ============================================================================
// Brush and Texture Types
// ============================================================================

export type BrushGenerator = (
  size: number,
  color: string,
  ...args: any[]
) => HTMLCanvasElement;

export type TextureGenerator = (
  color: string,
  bgcolor?: string,
  ...args: any[]
) => string | CanvasPattern | CanvasGradient;

export interface BrushSystem {
  [brushName: string]: BrushGenerator;
}

export interface TextureSystem {
  [textureName: string]: TextureGenerator;
}

// ============================================================================
// Sound System Types
// ============================================================================

export interface SoundEffect {
  play: () => void;
  pause: () => void;
  currentTime: number;
}

export interface SoundSystem {
  [soundName: string]: () => void;
}

// ============================================================================
// Current State Types
// ============================================================================

export interface CurrentState {
  tool: Tool;
  color: string;
  bgcolor?: string;
  size?: number;
  modified?: boolean; // For modifier keys (shift, ctrl, etc)
  modifiedKey?: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
}

// ============================================================================
// Stamp System Types
// ============================================================================

export interface StampData {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  spritesheet?: number;
}

export interface StampSystem {
  stamps: { [stampName: string]: StampData };
  spritesheets: HTMLImageElement[];
  draw: (
    ctx: CanvasRenderingContext2D,
    stampName: string,
    x: number,
    y: number,
    scale?: number
  ) => void;
}

// ============================================================================
// Builder System Types (for complex shapes)
// ============================================================================

export interface BuilderSystem {
  [builderName: string]: (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    ...args: any[]
  ) => void;
}

// ============================================================================
// Cache System Types
// ============================================================================

export interface CacheSystem {
  [cacheName: string]: any;
  clear?: () => void;
}

// ============================================================================
// Sprite System Types
// ============================================================================

export interface SpriteSystem {
  draw: (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ) => void;
}

// ============================================================================
// Main KiddoPaint Namespace Type
// ============================================================================

export interface KiddoPaintNamespace {
  Tools: {
    Toolbox: { [toolName: string]: ToolConstructor };
    [toolName: string]: Tool | { [toolName: string]: ToolConstructor };
  };
  Textures: TextureSystem;
  Brushes: BrushSystem;
  Builders: BuilderSystem;
  Stamps: StampSystem;
  Sounds: SoundSystem;
  Display: DisplaySystem;
  Colors: ColorSystem;
  Current: CurrentState;
  Cache: CacheSystem;
  Text: { [key: string]: any };
  Sprite: SpriteSystem;
}

// ============================================================================
// Global Window Extension
// ============================================================================

declare global {
  interface Window {
    KiddoPaint: KiddoPaintNamespace;
  }

  var KiddoPaint: KiddoPaintNamespace;
}

// ============================================================================
// Canvas Dimensions
// ============================================================================

export const CANVAS_DIMENSIONS = {
  WIDTH: 1300,
  HEIGHT: 650,
} as const;

export type CanvasLayerName = 'main' | 'tmp' | 'preview' | 'anim' | 'bnim';

// ============================================================================
// Undo/Redo Configuration
// ============================================================================

export const UNDO_CONFIG = {
  MEMORY_LIMIT: 30,      // Max undo states kept in memory
  STORAGE_LIMIT: 10,     // Max undo states persisted to localStorage
} as const;
