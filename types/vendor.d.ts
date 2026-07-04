// Globals exposed by the vendored third-party libraries in js/util/, which
// are never converted to TypeScript (see TS_MIGRATION_PLAN.md):
//
//   glfx.js (window.fx), fit-curve.js (fitCurve), kdtree.js (kdTree),
//   smooth.js (Smooth), dither.js (CanvasDither), douglas-peucker.js,
//   smoke.js, filters.js (window.Filters)
//
// Entries are added here with minimal honest types as converted .ts files
// actually consume them — do not add speculative declarations. Keep this file
// ambient (no top-level import/export) so declarations stay global.

/** A running smoke-particle emitter from js/util/smoke.js. */
interface KidPixSmokeMachine {
  start(): void;
  stop(): void;
  addSmoke(x: number, y: number, numParticles: number): void;
  step(dtMs: number): void;
}

interface Window {
  /**
   * js/util/fit-curve.js (Schneider curve fitting). Takes [x,y] points and
   * returns cubic bezier segments [start, ctrl1, ctrl2, end].
   * Exposed via a marked local patch at the end of the vendored file.
   */
  fitCurve(
    points: number[][],
    maxError: number,
    progressCallback?: (bez: number[][], error: number, split: number) => void,
  ): number[][][];

  /** js/util/smoke.js (bijection/smoke.js, UMD). */
  SmokeMachine(
    context: CanvasRenderingContext2D,
    color: [number, number, number],
  ): KidPixSmokeMachine;

  /**
   * js/util/filters.js (html5rocks-derived image filters).
   * Members that converted code uses are typed precisely; the rest are
   * loose (vendored surface).
   */
  Filters: {
    gcoInvert(imageData: ImageData, alpha?: number): HTMLCanvasElement;
  } & Record<string, (...args: any[]) => any>;

  /**
   * js/util/glfx.js (Evan Wallace's WebGL effects). The chainable effect
   * canvas is deliberately untyped — the vendored API surface is large.
   */
  fx: { canvas(): any };
}
