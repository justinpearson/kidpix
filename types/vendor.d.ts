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
}
