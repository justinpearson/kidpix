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
