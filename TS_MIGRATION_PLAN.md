# TypeScript Migration Plan

**Tracking issue:** [#62](https://github.com/justinpearson/kidpix/issues/62) · **Started:** July 2026 · **Decision: TypeScript only, no React.**

## Why TypeScript, why no framework

The codebase's fragility is exactly what TypeScript catches: everything flows through a mutable global (`KiddoPaint`), tools implement an unchecked three-method convention (`mousedown`/`mousemove`/`mouseup`), and events dispatch via `KiddoPaint.Current.tool[ev.type]`. None of that is verified today. Typed contracts also make the code legible to AI coding agents, which is a stated goal of #62.

Two React migration attempts (June 2025 and November 2025) stalled at the "port 50 tools to components" phase. This app is five stacked canvases plus a toolbar; the tools write pixels imperatively and gain nothing from a render cycle. TypeScript delivers the goals without a parallel implementation — every commit ships the same, single app.

## Ground rules

1. **Behavior preservation.** Pixel-identical rendering, same sounds, same tool behavior. `imageSmoothingEnabled = false` stays.
2. **One codebase.** Converted files keep the `KiddoPaint.X = ...` global-mutation style; ambient declarations in `types/` make it type-check. Restructuring to an import/export dependency graph is a possible *post-migration* follow-up, not this migration.
3. **Honest strict mode.** `strict: true` with no blanket `any`, no bare `@ts-ignore`. Uncertain spots get a specific `// TODO(ts): ...` comment. A strict error that reveals a genuine bug gets its own commit (with a test) before or after the conversion commit — never silently folded in.
4. **Verify before push.** `yarn test`, `yarn type-check`, `yarn build`, and Playwright chromium (full run for risky changes, single-spec smoke for mechanical batches). Pushes to `main` deploy to GitHub Pages, so local verification is the gate.

## How type-checking works during the transition

`tsconfig.app.json` has `strict: true` and **no `allowJs`** — plain `.js` files are invisible to `tsc`. Each file converted to `.ts` automatically joins strict checking; nothing else needs configuring per file. `yarn type-check` runs `tsc --noEmit` on both the app and node tsconfigs, and CI runs it in `test.yml`.

Ambient declarations live in `types/`:

- `types/kiddopaint.d.ts` — the `KiddoPaint` namespace: `KiddoPaintTool` (the three optional handlers plus known optional per-tool fields), `KiddoPaintCurrent` (all 23 runtime properties, derived from `init_kiddo_defaults()` in `js/init/kiddopaint.js`), `KiddoPaintDisplay` (the real `js/util/display.js` surface), submenu entry shape, and the registry sub-namespaces. Registry types start permissive and are tightened as each milestone completes.
- `types/window.d.ts` — free functions that files attach to `window` (`distanceBetween`, `clamp`, `srng`, `makeIcon`, `init_kiddo_paint`, ...).
- `types/vendor.d.ts` — globals exposed by vendored libraries (`fx`, `Smooth`, `Filters`, `fitCurve`, kd-tree, ...), grown as needed.

Beware two traps captured in the declarations: `KiddoPaint.Current.modifiedCtrl` is set by the **Command** key and `modifiedMeta` by the **actual Control** key (see keyCode handling in `js/init/kiddopaint.js`), and tool dispatch passes a `MouseEvent` augmented with `_x`/`_y` (`KidPixPointerEvent`).

## Vendored files — never convert

These eight files in `js/util/` are third-party libraries. They stay `.js` forever and are typed only via `types/vendor.d.ts` (plus sibling `export {}` stubs when the entry point converts):

| File | Lines | Origin |
| --- | --- | --- |
| `glfx.js` | 1123 | Evan Wallace's glfx.js (WebGL effects, MIT) |
| `fit-curve.js` | 663 | soswow/fit-curves (Schneider curve fitting, MIT) |
| `smooth.js` | 477 | Smooth.js 0.1.7 (MIT) |
| `kdtree.js` | 474 | ubilabs/kd-tree-javascript (MIT) |
| `filters.js` | 216 | html5rocks image-filters sample |
| `smoke.js` | 189 | bijection/smoke.js (MIT) |
| `dither.js` | 167 | NielsLeenheer/CanvasDither |
| `douglas-peucker.js` | 62 | mattdesl/simplify-path |

## The per-file conversion recipe

1. `git mv js/<dir>/<file>.js js/<dir>/<file>.ts` (preserves history).
2. In `src/kidpix-main.js`, change the import to **extensionless**: `import "../js/util/colors"`. (Vite and `moduleResolution: "Bundler"` both resolve extensionless to `.ts`; extensionless paths survive unchanged when the entry point itself converts. Vendored imports keep their explicit `.js`.)
3. Keep `KiddoPaint.X = ...` assignments as-is. Do not introduce cross-file imports.
4. **Module-scope audit.** `moduleDetection: "force"` makes every `.ts` file a module, so bare top-level `function foo()` / `var bar` declarations stop being implicit globals. Grep each such name across `js/`, `index.html`, and `tests/` — if anything else references it, add an explicit `window.foo = foo` and an entry in `types/window.d.ts`. (`js/util/utils.js` already does this explicitly; `js/init/kiddopaint.js` is where it bites hardest.)
5. **Test-export tails.** Replace the dead-in-browser CommonJS guard (`if (typeof module !== "undefined") { module.exports = {...} }`) with real `export { ... }` named exports. Rename the co-located `.test.js` to `.test.ts` in the same commit and update its imports.
6. Fix strict errors honestly (rule 3 above).
7. Verify (rule 4 above), commit with a conventional message, push.

### Tool classes

Tools convert from constructor functions with `var tool = this` closures to ES6 classes with **arrow-function class fields**, which reproduce the closure-capture semantics exactly (handlers passed to `setTimeout`/sound callbacks keep working):

```ts
class PencilTool implements KiddoPaintTool {
  isDown = false;
  size = 1;

  mousedown = (ev: KidPixPointerEvent) => { /* ... */ };
  mousemove = (ev: KidPixPointerEvent) => { /* ... */ };
  mouseup = (ev: KidPixPointerEvent) => { /* ... */ };
}

KiddoPaint.Tools.Toolbox.Pencil = PencilTool; // cross-file `new Toolbox.X()` calls exist
KiddoPaint.Tools.Pencil = new PencilTool();
```

Escape hatch for a gnarly tool: keep the function form with an explicit `this:` parameter and flag it `// TODO(ts): class-ify`.

## Conversion order and milestones

Bottom-up: highest-fan-in leaves first so typing benefit propagates. `js/util/display.js` is referenced ~515 times from `js/tools/` alone; `colors.js` and `utils.js` have unit tests that prove the recipe end-to-end. Submenus go last — they wire tools, brushes, textures, and sounds together.

Checklist mirrors issue #62 (M-numbers match):

- **M5 — Foundation**: accurate ambient declarations, `yarn type-check`, CI step. Delete the 8 stale aspirational `.d.ts` files from the abandoned 2025 attempt (`types/global.d.ts`, `types/interfaces.d.ts`, per-file stubs in `js/tools/` and `js/util/`).
- **M6 — `js/util/`** (9 convertible files + 3 co-located tests): `colors` → `utils` → small leaves (`array`, `cache`, `html`, `settings`, `trim-canvas`, `keyboard-help`) → **`display` last and alone**, with a new `display.test.ts` (undo/redo stacks, `canvasToImageData` round-trip) written *before* converting. Full E2E plus a manual app run after `display`.
- **M7 — `js/init/`** (2 files): `submenus.js` (406 lines), then `kiddopaint.js` (907 lines) alone — the hardest file: bare script-scope helpers need `window.` assignments, and `ev_canvas` dispatch gets typed as a checked lookup on the three handler names. Full E2E + manual run after each.
- **M8 — `js/textures/` (2), `js/brushes/` (20), `js/builders/` (4)**: batches of ~6–8 files; tighten the `Brushes`/`Textures` registry types when done.
- **M9 — `js/tools/`** (49 files): class conversion, batched thematically (erasers, mixers, geometry, stamps/text/cut, remainder). Tighten `Toolbox` to `Record<string, new () => KiddoPaintTool>` at the end.
- **M10 — `js/submenus/` (13), `js/stamps/` (3 + test), `js/sounds/` (1)**.
- **M11 — Finale**: `src/kidpix-main.js` → `.ts` (vendored side-effect imports get sibling `export {}` `.d.ts` stubs to satisfy `noUncheckedSideEffectImports`; update the `<script>` src in `index.html`). Then move the inline namespace bootstrap script from `index.html` into a typed `js/init/namespace.ts` imported first — ES module evaluation order guarantees it runs before every consumer. Docs sync; move the prompt file to `prompts-DONE/`; close #62.

## Definition of done

- Zero `.js` under `js/` except the 8 vendored files; `src/kidpix-main.ts`.
- `yarn type-check` strict-green, enforced in CI.
- All unit tests migrated to `.ts` and passing; E2E suite green (remaining skips all blocked on #52).
- No bare `any` or `@ts-ignore` without a specific `TODO(ts)` and rationale.
- Issue #62 closed.

## Workflow note

Migration work commits **directly to `main`** (owner-authorized, July 2026) after local verification — see CLAUDE.md "Migration workflow exception". Small conventional commits per logical step still apply.
