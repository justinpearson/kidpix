// Window-attached globals.
//
// Converted .ts files are modules (moduleDetection: "force"), so their bare
// top-level declarations are no longer implicit globals. Anything referenced
// across files or from index.html must be attached explicitly
// (`window.foo = foo`) AND declared here. Entries are added with accurate
// signatures in the same commit that converts the owning file — do not add
// speculative signatures for files that are still .js.

interface Window {
  // ---- js/init/kiddopaint.js ----
  /** App entry point, called on DOMContentLoaded by src/kidpix-main. */
  init_kiddo_paint: () => void;
  /** Resets mouse-wheel ranges, multiplier, and toggle modifier state. */
  reset_ranges: () => void;

  // ---- js/init/submenus.ts ----
  /** Renders the submenu buttons for a tool into #genericsubmenu. */
  show_generic_submenu(subtoolbar: string): void;
  /** Rebuilds only the stamp buttons, preserving the search box. */
  update_sprites_stamps(): void;

  // ---- js/submenus/sprites.js ----
  /** (Re)builds KiddoPaint.Submenu.sprites, optionally filtered by search. */
  init_sprites_submenu(searchTerm?: string): void;

  // ---- js/tools/wholefx.js ----
  /** Whole-canvas effect name constants (INVERT, PIXELATE, ...). */
  // TODO(ts): tighten to the literal effect map when wholefx.js converts (M9)
  JumbleFx: Record<string, string>;

  // Canvas layers created by init_kiddo_paint(); undefined before init.
  tmpCanvas: HTMLCanvasElement;
  tmpContext: CanvasRenderingContext2D;
  previewCanvas: HTMLCanvasElement;
  previewContext: CanvasRenderingContext2D;
  animCanvas: HTMLCanvasElement;
  animContext: CanvasRenderingContext2D;
  bnimCanvas: HTMLCanvasElement;
  bnimContext: CanvasRenderingContext2D;

  // ---- js/util/array.ts ----
  /** In-place Fisher-Yates shuffle. */
  fisherYatesArrayShuffle<T>(array: T[]): void;

  // ---- js/util/trim-canvas.ts ----
  /** Returns a copy of the canvas cropped to its non-transparent bounds. */
  trimCanvas3(canvas: HTMLCanvasElement): HTMLCanvasElement;
  /** Like trimCanvas3, but also flattens transparent pixels to white. */
  trimAndFlattenCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement;

  // ---- js/util/utils.ts ----
  distanceBetween(ev1: KidPixPoint, ev2: KidPixPoint): number;
  angleBetween(ev1: KidPixPoint, ev2: KidPixPoint): number;
  angleBetweenRad(ev1: KidPixPoint, ev2: KidPixPoint): number;
  /** Renders a texture swatch into a 50x50 square icon; returns a data URL. */
  makeIcon(texture: () => string | CanvasGradient | CanvasPattern): string;
  /** Renders a texture swatch into a 50x50 circle icon; returns a data URL. */
  makeCircleIcon(
    texture: () => string | CanvasGradient | CanvasPattern,
  ): string;
  /** Seeded pseudo-random number generator. */
  srng(seed?: number): { next(): number };
  color2json(color: string): KidPixRGBA;
  scaleImageDataCanvasAPIPixelated(
    source: HTMLCanvasElement | HTMLImageElement,
    scale: number,
  ): HTMLCanvasElement;
  extractSprite(
    img: HTMLCanvasElement | HTMLImageElement,
    size: number,
    col: number,
    row: number,
    offset: number,
  ): HTMLCanvasElement;
  colorsEqual(color1: KidPixRGBA, color2: KidPixRGBA): boolean;
  makePatternFromImage(
    image: HTMLCanvasElement | HTMLImageElement,
  ): CanvasPattern | null;
  flattenImage(imageData: ImageData): ImageData;
  remap(imin: number, imax: number, omin: number, omax: number, v: number): number;
  getRandomFloat(min: number, max: number): number;
  scaleImageData(imageData: ImageData, scale: number): ImageData;
  colorNearWhite(color: KidPixRGBA): boolean;
  /** Interpolates along a line, invoking callback every few pixels. */
  bresenham(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    callback: (x: number, y: number) => void,
  ): void;
  /** Guilloche curve point (js/brushes + guilloche tool). */
  guil(
    R: number,
    r: number,
    m: number,
    theta: number,
    p: number,
    Q: number,
    m2: number,
    n: number,
  ): { x: number; y: number };
  clamp(value: number, min: number, max: number): number;
  rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number };
  hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number };
  getRandomInt(min: number, max: number): number;
  getRandomLetter(): string;
  /** Hue-shifts a canvas's pixels in place. */
  hueShift(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    shift: number,
  ): void;
  /** Approximate standard normal sample in roughly [-1, 1]. */
  ziggurat(): number;
  /** Box-Muller transform: a pair of standard normal samples. */
  boxmuller(): [number, number];
  /** Skewed normal sample stretched to [min, max]. */
  randn_bm(min: number, max: number, skew: number): number;
  createFeatherGradient(radius: number, hardness: number): CanvasGradient;
  getCubicBezierXYatPercent(
    startPt: number[],
    controlPt1: number[],
    controlPt2: number[],
    endPt: number[],
    percent: number,
  ): KidPixPoint;
  bezierLength(
    startPt: number[],
    controlPt1: number[],
    controlPt2: number[],
    endPt: number[],
  ): number;
  pixelateCanvas(
    source: HTMLCanvasElement | HTMLImageElement,
    block: number,
  ): HTMLCanvasElement;
  scaleImageDataCanvasAPI(
    source: HTMLCanvasElement | HTMLImageElement,
    scale: number,
  ): HTMLCanvasElement;
}
