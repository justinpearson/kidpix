# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

- **Live App**: https://justinpearson.github.io/kidpix/
- **Main Branch**: `main`
- **Tech Stack**: TypeScript (strict) + Vite + Vitest + Playwright; no framework
- **Dev Server**: `yarn dev` → http://localhost:5173/
- **Verify before pushing**: `yarn type-check && yarn test && yarn build` (+ Playwright for risky changes)
- **TypeScript Migration**: COMPLETE (July 2026) — see `TS_MIGRATION_PLAN.md`
- **Feature Requests**: files in `prompts-TODO/` (move to `prompts-DONE/` when shipped)
- **No Linting**: ESLint/Prettier deliberately removed

## Project Overview

A web implementation of the classic 1989 Kid Pix drawing application, forked from Vikrum's kidpix.app. The code lives in `js/` as small modular TypeScript files that populate a global `KiddoPaint` namespace, loaded as ES modules by `src/kidpix-main.ts`.

The codebase was migrated file-by-file to TypeScript in July 2026 — **no framework**. A React migration was attempted twice and deliberately abandoned (see issue #62); the app is five stacked canvases plus a toolbar, and the drawing tools write pixels imperatively.

## TypeScript (migrated July 2026)

`TS_MIGRATION_PLAN.md` documents how the migration was done (per-file recipe, conversion order). The essentials:

- Files keep the `KiddoPaint.X = ...` global-namespace style; ambient declarations in `types/` (`kiddopaint.d.ts`, `window.d.ts`, `vendor.d.ts`) make everything type-check under `strict: true`.
- Registry interfaces are **closed** (no loose index signatures): each tool/brush/texture/builder/sound module merges its own precise entry via `declare global { interface KiddoPaintToolsRegistry {...} }` next to its registry assignment. When adding a module, add its merge block too — tsc then checks both the assignment and every cross-file access.
- Tools are ES6 classes with **arrow-function fields** (`mousedown = (ev: KidPixPointerEvent) => {...}`), which reproduce the old `var tool = this` closure semantics. Registry assignments stay: `KiddoPaint.Tools.Toolbox.X = XTool; KiddoPaint.Tools.X = new XTool();`
- Behavior preservation is the rule: pixel-perfect rendering (`imageSmoothingEnabled = false`), same sounds, same tool behavior.
- Eight vendored third-party files in `js/util/` stay `.js` forever: glfx, fit-curve, kdtree, smooth, dither, douglas-peucker, smoke, filters. Type them only via `types/vendor.d.ts`. (fit-curve carries a small marked local patch attaching `window.fitCurve`.)

### THE ES-module scoping rule (source of many past bugs)

Every file is an ES module, so top-level `function foo()` declarations are **module-scoped, not global**. A cross-file call like `ziggurat()` from a brush only works if the defining file explicitly does `window.ziggurat = ziggurat` (and `types/window.d.ts` declares it). Converted files call such helpers explicitly as `window.ziggurat(...)`. Several tools/brushes were silently broken in production for months because of missing attachments — when adding a helper used across files, always attach it to `window` and declare it.

### Migration workflow exception (owner-authorized, July 2026)

For TypeScript-migration work, commits go **directly to `main`** — no feature branches or PRs — provided local verification passes first (`yarn type-check`, `yarn test`, `yarn build`, and Playwright chromium for risky changes). Note that `test.yml` CI runs only on pull requests, and every push to `main` deploys to GitHub Pages, so local verification is the real gate. Non-migration feature work still follows the branch-and-PR workflow below.

## Commit Workflow

- Commit after each logical step (never batch unrelated work), using conventional commit format (`feat:`, `fix:`, `test:`, `chore:`, `docs:` ...).
- Document Claude settings changes in commit messages when any file under `.claude/` is modified.
- Feature work (non-migration): branch per feature, first commit adds the `prompts-TODO/` request file, PR via `gh pr create`, verify CI, `git mv` the prompt file to `prompts-DONE/` before merging, merge via GitHub UI, then sync local main.
- When fixing a bug or adding a feature, prefer TDD: write the failing test first.

## Development Commands

```bash
yarn dev                    # dev server at http://localhost:5173/ (hot reload)
yarn build                  # build dist/ (base /) AND dist-gh/ (base /kidpix/)
yarn type-check             # tsc --noEmit on app + node tsconfigs
yarn test                   # unit tests, single run (vitest)
yarn test:unit              # unit tests, watch mode
yarn test:coverage          # unit tests with coverage
yarn test:e2e               # full Playwright suite (all browsers configured)
yarn test:e2e:single        # one spec, chromium only
yarn preview-release        # serve dist/ at localhost:8080 (python http.server)
yarn preview-github-pages   # serve dist-gh/ at localhost:8080/kidpix/
yarn screenshot             # capture app screenshots (scripts/screenshot-capture.js)
yarn release:patch|minor|major  # bump version, push tag (triggers release.yml)
```

Preferred E2E invocation during development (chromium, serial, no browser download):

```bash
yarn exec playwright test -- --project=chromium --workers=1 --no-deps --reporter=line
yarn exec playwright test tests/e2e/pencil.spec.ts -- --project=chromium --workers=1 --no-deps --reporter=line
```

Playwright starts its own dev server (`webServer: yarn dev`) or reuses one already running on port 5173.

## CI/CD (GitHub Actions)

| Workflow | Status | Triggers | Does |
| --- | --- | --- | --- |
| `build-and-deploy-all.yml` | active | push to main, manual | builds and deploys to GitHub Pages |
| `test.yml` | active | pull requests to main, manual | type-check, unit tests + coverage (Codecov), Playwright chromium E2E |
| `release.yml` | active | tag push `v*` | builds, tarballs `dist/`, publishes a GitHub Release |
| `deploy.yml` | disabled (triggers commented out) | — | alternative deploy with tests |
| `claude.yml` | disabled (triggers commented out) | — | Claude Code GitHub action |

Because `test.yml` only runs on PRs, direct pushes to main are gated by local verification only — and they deploy immediately.

## Architecture

### Global namespace

`js/init/namespace.ts` creates `window.KiddoPaint` with its sub-namespaces (Tools, Brushes, Textures, Builders, Stamps, Sounds, Display, Colors, Current, Cache, Text, Sprite); it is the first import of `src/kidpix-main.ts`, which then side-effect-imports every `js/` file in dependency order (util → init → tools → textures → submenus → brushes → builders → stamps → sounds) and calls `init_kiddo_paint()`. Vendored files keep their `.js` extension in imports (with sibling `export {}` type stubs).

Ambient types for all of this live in `types/kiddopaint.d.ts` — including the accurate 23-property `KiddoPaint.Current`. Watch the naming trap: `Current.modifiedCtrl` is set by the **Command** key, `Current.modifiedMeta` by the **actual Control** key.

### Five-canvas layer system

- **main** (`#kiddopaint`): committed artwork
- **tmp** (`#tmpCanvas`): active drawing + primary event target — `KiddoPaint.Display.canvas/context`
- **preview** (`#previewCanvas`): tool previews, cleared every event
- **anim** (`#animCanvas`): animated effects
- **bnim** (`#bnimCanvas`): background image manipulation

`KiddoPaint.Display` (js/util/display.ts) manages layers, tmp→main compositing (`saveMain*`), multi-level undo/redo (30 in memory, 10 persisted to localStorage, survives reloads), and drawing persistence.

### Tools

`ev_canvas` (js/init/kiddopaint.ts) injects `_x`/`_y` canvas coordinates into the event and dispatches `KiddoPaint.Current.tool[type]` for `mousedown`/`mousemove`/`mouseup` (mouseleave forces a mouseup). Tools are classes implementing the three-handler `KiddoPaintTool` interface:

```ts
class ExampleTool implements KiddoPaintTool {
  isDown = false;
  size = 7;
  // dynamic fields (texture, soundduring, ...) are replaced by submenu handlers
  texture: (color: string) => string | CanvasGradient | CanvasPattern = (c) =>
    KiddoPaint.Textures.Solid(c);

  mousedown = (ev: KidPixPointerEvent) => { /* start */ };
  mousemove = (ev: KidPixPointerEvent) => { /* draw */ };
  mouseup = (ev: KidPixPointerEvent) => { /* commit: KiddoPaint.Display.saveMain() */ };
}
KiddoPaint.Tools.Toolbox.Example = ExampleTool;
KiddoPaint.Tools.Example = new ExampleTool();
```

Adding a tool: create the class file in `js/tools/`, add a submenu definition in `js/submenus/` if needed, wire sounds in `js/sounds/sounds.js`, add the toolbar button in `index.html`, and add the side-effect import to `src/kidpix-main.js` in the tools block.

### Submenus

Arrays of `KiddoPaintSubmenuEntry` (`{name, imgSrc|imgJs|text|emoji|spriteSheet, handler}`) under `KiddoPaint.Submenu`, rendered by `js/init/submenus.ts` into `#genericsubmenu`. Handlers typically set `KiddoPaint.Current.tool` and configure tool fields. Invisible spacer entries separate multi-select sections (e.g. pencil size vs texture). The text tool uses its own `#texttoolbar` instead.

### Brushes and textures

Brush factories (`KiddoPaint.Brushes.X`) return `KidPixBrushFill` objects (`{brush: canvas, offset, inplace?, abspos?}`) consumed by the PlainBrush/AnimBrush/Brush tools. Texture factories (`KiddoPaint.Textures.X`) return fill styles (usually `CanvasPattern`). Modifier keys (Shift/Alt/Cmd/Ctrl/~, mouse wheel ranges) alter behavior throughout.

## Testing

- **Unit (Vitest, jsdom)**: co-located `*.test.ts` files in `js/`; canvas/ImageData mocks in `src/test-setup.ts` (context mock is memoized per canvas). Tests seed `global.KiddoPaint` then side-effect-import the module under test, or use named ESM imports (utils).
- **E2E (Playwright)**: `tests/e2e/*.spec.ts` with shared helpers in `tests/e2e/shared/` (`tool-helpers.ts`, `test-fixtures.ts` tool definitions, `playwright-fixtures.ts` which mutes app audio). Suite status: 102 passed / 17 skipped — all remaining skips blocked on feature #52 (issue #84).
- Coverage thresholds in `vitest.config.ts` are intentionally low (1% lines); raise them as tests accumulate.

## File Organization

- `js/` — the app (~23k lines of TypeScript + 8 vendored .js libraries)
  - `js/tools/` — ~48 drawing tools · `js/brushes/` — 20 brush factories · `js/textures/` — fill patterns
  - `js/builders/` — shape builders · `js/submenus/` — submenu definitions · `js/stamps/` — stamp/text systems
  - `js/sounds/` — audio library · `js/util/` — display, colors, utils + the 8 vendored libs · `js/init/` — bootstrap, event dispatch, toolbar
- `types/` — ambient TypeScript declarations (the namespace, window globals, vendored libs)
- `src/` — `kidpix-main.ts` (entry), `test-setup.ts`, `assets/` (Vite `publicDir`: images, sounds, css)
- `index.html` — toolbar/canvas DOM and the entry module tag
- `tests/e2e/` — Playwright specs · `util/` — stamp spritesheets + metadata + verification page
- `prompts-TODO/`, `prompts-DONE/` — feature request lifecycle
- `scripts/` — dev utilities · `.github/workflows/` — CI/CD

## Releases

`yarn release:patch|minor|major` bumps the version and pushes a tag; `release.yml` builds, tarballs `dist/`, and publishes a GitHub Release (runnable locally with `python3 -m http.server`).
