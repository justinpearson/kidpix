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

  // Canvas layers created by init_kiddo_paint(); undefined before init.
  tmpCanvas: HTMLCanvasElement;
  tmpContext: CanvasRenderingContext2D;
  previewCanvas: HTMLCanvasElement;
  previewContext: CanvasRenderingContext2D;
  animCanvas: HTMLCanvasElement;
  animContext: CanvasRenderingContext2D;
  bnimCanvas: HTMLCanvasElement;
  bnimContext: CanvasRenderingContext2D;
}
