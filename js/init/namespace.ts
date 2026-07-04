// Creates the global KiddoPaint namespace skeleton. This module MUST be the
// first import in src/kidpix-main.ts: ES module evaluation order guarantees
// it runs before every other module mutates the namespace. (It replaces the
// former inline <script> bootstrap in index.html.)
//
// The cast is deliberate: the skeleton starts empty and is populated by the
// side-effect imports that follow (colors.ts fills Colors, display.ts fills
// Display, init_kiddo_paint() fills Current, submenus.ts creates Submenu,
// settings.ts creates Settings, ...).
window.KiddoPaint = {
  Tools: { Toolbox: {} },
  Textures: {},
  Brushes: {},
  Builders: {},
  Stamps: {},
  Sounds: {},
  Display: {},
  Colors: {},
  Current: {},
  Cache: {},
  Text: {},
  Sprite: {},
} as unknown as KiddoPaintNamespace;
