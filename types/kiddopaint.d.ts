// Ambient declarations for the global KiddoPaint namespace.
//
// These are derived from the REAL runtime shape (js/init/kiddopaint.js,
// js/util/display.js) — see TS_MIGRATION_PLAN.md. The namespace skeleton is
// created by an inline script in index.html before any module runs; each js/
// file then mutates its sub-namespace (`KiddoPaint.Tools.Pencil = ...`).
//
// Registry interfaces marked TODO(ts) are deliberately loose; they get
// tightened when the milestone that converts their owning files completes.

/**
 * A point in canvas coordinates, using the app's underscore convention.
 * Plain {_x,_y} objects are passed interchangeably with pointer events
 * (e.g. bezfollow's synthetic events, test fixtures).
 */
interface KidPixPoint {
  _x: number;
  _y: number;
}

/**
 * MouseEvent as seen by tools: ev_canvas (js/init/kiddopaint.js) injects
 * canvas-relative coordinates before dispatching to the current tool.
 */
interface KidPixPointerEvent extends MouseEvent, KidPixPoint {}

/** An rgba color unpacked to channel values 0-255 (see color2json). */
interface KidPixRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * The stamp object returned by brush factory functions
 * (js/brushes/*, consumed by the PlainBrush/AnimBrush tools).
 */
interface KidPixBrushFill {
  brush: HTMLCanvasElement;
  offset: number;
  /** Draw only at the cursor position instead of stamping along the path. */
  inplace?: boolean;
  /** Absolute position override (e.g. the Raindrops brush). */
  abspos?: { x: number; y: number };
}

/**
 * The duck-typed tool contract. ev_canvas dispatches via
 * `KiddoPaint.Current.tool[ev.type]` for mousedown/mousemove/mouseup, and the
 * canvas mouseleave listener calls `tool.mouseup`. All handlers are optional —
 * dispatch is guarded with `if (func)`. Tools carry arbitrary extra instance
 * state (size, isDown, texture, ...) declared per-class, not here.
 */
interface KiddoPaintTool {
  mousedown?: (ev: KidPixPointerEvent) => void;
  mousemove?: (ev: KidPixPointerEvent) => void;
  mouseup?: (ev: KidPixPointerEvent) => void;
}

/**
 * Application state. Defaults are set by init_kiddo_defaults() and
 * reset_ranges() in js/init/kiddopaint.js.
 *
 * NAMING TRAP (macOS): `modifiedCtrl` is set by the COMMAND key
 * (keyCodes 91/93) and `modifiedMeta` by the ACTUAL CONTROL key (keyCode 17).
 * See the keydown/keyup handlers in js/init/kiddopaint.js.
 */
interface KiddoPaintCurrent {
  /** The active drawing tool; dispatch target of ev_canvas. */
  tool: KiddoPaintTool;
  /** Primary color (left click). CSS color string. */
  color: string;
  /** Alternate color (right click). */
  altColor: string;
  /** Tertiary color (middle click). */
  terColor: string;
  /** Global alpha applied by some tools; default 1.0. */
  globalAlpha: number;
  /** Size multiplier (Shift/velocity); default 1. */
  scaling: number;
  /** Multiplier selected via number keys 1-9; default 1. */
  multiplier: number;
  /** Shift key held. */
  modified: boolean;
  /** Alt/Option key held. */
  modifiedAlt: boolean;
  /** COMMAND key held (see naming trap above). */
  modifiedCtrl: boolean;
  /** ACTUAL CONTROL key held (see naming trap above). */
  modifiedMeta: boolean;
  /** Tilde (~) key held. */
  modifiedTilde: boolean;
  /** Spacebar toggle state. */
  modifiedToggle: boolean;
  /** 'v' key velocity-mode toggle. */
  velToggle: boolean;
  /** Mouse-wheel range, -100..100; reset by reset_ranges(). */
  modifiedRange: number;
  /** Alt + mouse-wheel range, -100..100. */
  modifiedAltRange: number;
  /** Command + mouse-wheel range, -100..100. */
  modifiedCtrlRange: number;
  /**
   * The most recent pointer event, set by ev_canvas before any tool handler
   * runs (undefined only before the first pointer event).
   */
  ev: KidPixPointerEvent;
  /** The previous pointer event; null until the second event. */
  prevEv: KidPixPointerEvent | null;
  /** Timestamp (ms) of the previous pointer event. */
  prevEvTs: number;
  /** Pointer velocity in px/s, computed in common_ev_proc. */
  velocity: number;
  /** Velocity-derived size multiplier. */
  velocityMultiplier: number;
  /** Ephemeral kd-tree used only by the Spiral tool (js/tools/spiral.ts). */
  kdspiral?: KidPixKdTree;
}

/**
 * Multi-layer canvas manager (js/util/display.js). Canvas/context handles are
 * assigned by init_kiddo_paint() before any tool can run.
 *
 * Layer roles: `canvas`/`context` is the TMP layer (active drawing);
 * `main_canvas`/`main_context` is the committed artwork; preview/anim/bnim are
 * tool previews, animations, and background-image manipulation respectively.
 */
interface KiddoPaintDisplay {
  // -- canvases and contexts --
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  previewCanvas: HTMLCanvasElement;
  previewContext: CanvasRenderingContext2D;
  animCanvas: HTMLCanvasElement;
  animContext: CanvasRenderingContext2D;
  bnimCanvas: HTMLCanvasElement;
  bnimContext: CanvasRenderingContext2D;
  main_canvas: HTMLCanvasElement;
  main_context: CanvasRenderingContext2D;

  // -- state --
  /** Animation step counter used by animated tools; reset to 0 at init. */
  step: number;
  /** Undo stack of main-canvas dataURLs (capped at 30 in memory, 10 persisted). */
  undoData: string[];
  /** Redo stack of main-canvas dataURLs. */
  redoData: string[];
  undoOn: boolean;
  allowClearTmp: boolean;

  // -- clearing --
  clearAll(): void;
  clearMain(): void;
  clearTmp(): void;
  clearPreview(): void;
  clearAnim(): void;
  clearBnim(): void;
  clearBeforeSaveMain(): void;

  // -- committing tmp -> main --
  saveMain(): void;
  saveMainSkipUndo(): void;
  saveMainGco(op: GlobalCompositeOperation): void;
  saveMainGcoSkipUndo(op: GlobalCompositeOperation): void;

  // -- undo/redo --
  /** Pushes main canvas onto the undo stack; returns whether undo is enabled. */
  saveUndo(): boolean;
  undo(): void;
  redo(): void;
  popAndLoad(stack: string[]): void;
  pauseUndo(): void;
  resumeUndo(): void;
  toggleUndo(): void;

  // -- persistence (localStorage) --
  saveToLocalStorage(): void;
  loadFromLocalStorage(): void;
  clearLocalStorage(): void;
  saveUndoRedoToLocalStorage(): void;
  loadUndoRedoFromLocalStorage(): void;

  // -- conversion helpers --
  canvasToImageData(canvas: HTMLCanvasElement): ImageData;
  imageTypeToCanvas(
    imageData: ImageData | HTMLCanvasElement | HTMLImageElement,
    doDraw?: boolean,
  ): HTMLCanvasElement;
}

/**
 * One button in a submenu definition array (rendered by js/init/submenus.js).
 * Exactly one of imgSrc / imgJs / text / emoji / spriteSheet / invisible
 * determines the button's appearance.
 */
interface KiddoPaintSubmenuEntry {
  name?: string;
  /**
   * Click handler. Invisible spacer entries carry the filler value `true`
   * instead of a function; the submenu click wrapper only dispatches when
   * this is actually callable.
   */
  handler?: ((e: MouseEvent) => void) | boolean;
  imgSrc?: string;
  /** Generates a data-URL for the button image at render time. */
  imgJs?: () => string;
  text?: string;
  emoji?: string;
  /** Invisible spacer button separating subtool categories. */
  invisible?: boolean;
  /** Spritesheet-based button (stamps): image URL plus cell coordinates. */
  spriteSheet?: string;
  spriteRow?: number;
  spriteCol?: number;
}

// ---------------------------------------------------------------------------
// Registry sub-namespaces. Loose by design until their files convert:
// each `any` below is scheduled for tightening in the milestone noted.
// ---------------------------------------------------------------------------

/** TODO(ts): tighten in M9 to Record<string, new () => KiddoPaintTool> & instances. */
interface KiddoPaintToolsRegistry {
  Toolbox: Record<string, any>;
  [toolName: string]: any;
}

/** TODO(ts): tighten in M8 (js/textures/). */
interface KiddoPaintTexturesRegistry {
  [textureName: string]: any;
}

/** TODO(ts): tighten in M8 (js/brushes/). */
interface KiddoPaintBrushesRegistry {
  [brushName: string]: any;
}

/** TODO(ts): tighten in M8 (js/builders/). */
interface KiddoPaintBuildersRegistry {
  [builderName: string]: any;
}

/** TODO(ts): tighten in M10 (js/stamps/). */
interface KiddoPaintStampsRegistry {
  [key: string]: any;
}

/** TODO(ts): tighten in M10 (js/sounds/). */
interface KiddoPaintSoundsRegistry {
  [soundName: string]: any;
}

/** A named 32-color palette (js/util/colors.ts). */
interface KiddoPaintNamedPalette {
  name: string;
  colors: string[];
}

/** Color system (js/util/colors.ts). */
interface KiddoPaintColors {
  Palette: {
    /** Single transparent entry. */
    Blank: string[];
    /** Six bright colors cycled by nextColor()/randomColor(). */
    Bright: string[];
    Basic: KiddoPaintNamedPalette;
    Endesga: KiddoPaintNamedPalette;
    DawnBringer: KiddoPaintNamedPalette;
    Pastels: KiddoPaintNamedPalette;
    Pinks: KiddoPaintNamedPalette;
    Blues: KiddoPaintNamedPalette;
    Greyscale: KiddoPaintNamedPalette;
    CyanMagenta: KiddoPaintNamedPalette;
  };
  Current: {
    /** Index into All; 0 (Basic) by default. */
    PaletteNumber: number;
    /** The current palette's colors; kept in sync by next/prevPalette(). */
    Palette: string[];
    /** Monotonic counter for color-cycling brushes (getAndIncColorStep). */
    colorStep: number;
  };
  /** The palettes cyclable from the UI, in cycle order. */
  All: KiddoPaintNamedPalette[];
  rainbowPalette(): string[];
  currentPalette(): string[];
  currentPaletteName(): string;
  nextPalette(): string[];
  prevPalette(): string[];
  nextColor(): string;
  randomColor(): string;
  getAndIncColorStep(): number;
  nextAllColor(): string;
  randomAllColor(): string;
}

/** Per-stamp settings cached by js/util/cache.ts. */
interface KidPixStampSettings {
  hueShift: number;
  altSize: number;
}

/** Stamp-settings cache (js/util/cache.ts). */
interface KiddoPaintCache {
  StampSettings: Record<string, KidPixStampSettings>;
  Defaults: KidPixStampSettings;
  /** Returns (creating if needed) the settings for a stamp. */
  getStampSettings(stamp: string): KidPixStampSettings;
  setStampSetting(
    stamp: string,
    setting: keyof KidPixStampSettings,
    value: number,
  ): void;
}

/** User settings persisted in localStorage (js/util/settings.ts). */
interface KiddoPaintSettings {
  isKeyboardShortcutsEnabled(): boolean;
  setKeyboardShortcutsEnabled(enabled: boolean): void;
}

/** Keyboard-shortcuts help popup (js/util/keyboard-help.ts). */
interface KiddoPaintKeyboardHelp {
  popup: HTMLElement | null;
  overlay: HTMLElement | null;
  closeBtn: HTMLElement | null;
  enabledContent: HTMLElement | null;
  disabledContent: HTMLElement | null;
  isInitialized: boolean;
  init(): void;
  /** @private */
  _attachEventListeners(): void;
  show(): void;
  hide(): void;
  toggle(): void;
  isVisible(): boolean;
}

/** TODO(ts): tighten in M10 (js/stamps/ text system). */
interface KiddoPaintTextRegistry {
  [key: string]: any;
}

/** TODO(ts): tighten in M10 (js/submenus/sprites.js). */
interface KiddoPaintSpriteRegistry {
  [key: string]: any;
}

/**
 * Submenu definition arrays, keyed by tool name (created lazily by
 * js/init/submenus.js, not by the index.html bootstrap).
 * TODO(ts): tighten values to KiddoPaintSubmenuEntry[] in M10.
 */
interface KiddoPaintSubmenuRegistry {
  [toolName: string]: any;
}

interface KiddoPaintNamespace {
  Tools: KiddoPaintToolsRegistry;
  Textures: KiddoPaintTexturesRegistry;
  Brushes: KiddoPaintBrushesRegistry;
  Builders: KiddoPaintBuildersRegistry;
  Stamps: KiddoPaintStampsRegistry;
  Sounds: KiddoPaintSoundsRegistry;
  Display: KiddoPaintDisplay;
  Colors: KiddoPaintColors;
  Current: KiddoPaintCurrent;
  Cache: KiddoPaintCache;
  Text: KiddoPaintTextRegistry;
  Sprite: KiddoPaintSpriteRegistry;
  Submenu: KiddoPaintSubmenuRegistry;
  /** Created by js/util/settings.ts (not part of the index.html bootstrap). */
  Settings: KiddoPaintSettings;
  /** Created by js/util/keyboard-help.ts (not part of the index.html bootstrap). */
  KeyboardHelp: KiddoPaintKeyboardHelp;
}

// ---------------------------------------------------------------------------
// Prototype extensions (js/util/array.ts, js/util/html.ts)
// ---------------------------------------------------------------------------

interface Array<T> {
  /** Returns a random element (prototype extension from js/util/array.ts). */
  random(): T;
}

interface HTMLElement {
  /** Removes all child nodes (prototype extension from js/util/html.ts). */
  removeAllChildren(): void;
}

declare var KiddoPaint: KiddoPaintNamespace;

interface Window {
  KiddoPaint: KiddoPaintNamespace;
}
