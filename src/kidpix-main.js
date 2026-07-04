// Main entry point for KidPix JavaScript modules
// This file imports all the modular JS files in the correct order
// The global KiddoPaint object is initialized in index.html before this module loads

// Import all modules in the correct dependency order
// js/util/* (load utilities first since they are dependencies)
import "../js/util/array";
import "../js/util/cache";
import "../js/util/colors";
import "../js/util/display";
import "../js/util/dither.js";
import "../js/util/douglas-peucker.js";
import "../js/util/filters.js";
import "../js/util/fit-curve.js";
import "../js/util/glfx.js";
import "../js/util/html";
import "../js/util/kdtree.js";
import "../js/util/settings";
import "../js/util/keyboard-help";
import "../js/util/smoke.js";
import "../js/util/smooth.js";
import "../js/util/trim-canvas";
import "../js/util/utils";

// js/init/* (load after utilities since they depend on them)
import "../js/init/submenus";
import "../js/init/kiddopaint";

// js/tools/*
import "../js/tools/animbrush";
import "../js/tools/astroid";
import "../js/tools/bezfollow.js";
import "../js/tools/brush";
import "../js/tools/oval";
import "../js/tools/composite";
import "../js/tools/contours";
import "../js/tools/cut.js";
import "../js/tools/eraser-doorbell";
import "../js/tools/eraser-fade-away";
import "../js/tools/eraser-hidden-pictures";
import "../js/tools/eraser-letters";
import "../js/tools/eraser-white-circles";
import "../js/tools/eraser";
import "../js/tools/paintcan.js";
import "../js/tools/fuzzer";
import "../js/tools/guilloche";
import "../js/tools/inverter";
import "../js/tools/kaleidoscope";
import "../js/tools/line";
import "../js/tools/looper";
import "../js/tools/magnify";
import "../js/tools/maze.js";
import "../js/tools/partialfx";
import "../js/tools/pines";
import "../js/tools/pencil";
import "../js/tools/colorpicker";
import "../js/tools/placer.js";
import "../js/tools/plainbrush";
import "../js/tools/scribble";
import "../js/tools/smoke";
import "../js/tools/smoothpen";
import "../js/tools/smudge.js";
import "../js/tools/spiral.js";
import "../js/tools/spriteplacer.js";
import "../js/tools/rectangle";
import "../js/tools/stamp.js";
import "../js/tools/three3d";
import "../js/tools/tnt";
import "../js/tools/trees.js";
import "../js/tools/mixer-checkerboard";
import "../js/tools/mixer-inverter";
import "../js/tools/mixer-pattern";
import "../js/tools/mixer-pip";
import "../js/tools/mixer-shadow-boxes";
import "../js/tools/mixer-venetian-blinds";
import "../js/tools/mixer-wallpaper";
import "../js/tools/wholefx.js";

// js/textures/*
import "../js/textures/gco";
import "../js/textures/textures";

// js/submenus/*
import "../js/submenus/brush.js";
import "../js/submenus/oval.js";
import "../js/submenus/eraser.js";
import "../js/submenus/paintcan.js";
import "../js/submenus/jumble.js";
import "../js/submenus/line.js";
import "../js/submenus/pencil.js";
import "../js/submenus/colorpicker.js";
import "../js/submenus/spray.js";
import "../js/submenus/sprites.js";
import "../js/submenus/rectangle.js";
import "../js/submenus/stickers.js";
import "../js/submenus/truck.js";

// js/brushes/*
import "../js/brushes/bubbles";
import "../js/brushes/circles";
import "../js/brushes/concen";
import "../js/brushes/connectthedots";
import "../js/brushes/dumbbell";
import "../js/brushes/fsine";
import "../js/brushes/icy";
import "../js/brushes/leakypen";
import "../js/brushes/meanstreak";
import "../js/brushes/pies";
import "../js/brushes/rainbowball";
import "../js/brushes/rainbowbar";
import "../js/brushes/rainbowdoughnut";
import "../js/brushes/raindrops";
import "../js/brushes/rose";
import "../js/brushes/rpent";
import "../js/brushes/splatter";
import "../js/brushes/spray";
import "../js/brushes/triangles";
import "../js/brushes/twirly";

// js/builders/*
import "../js/builders/arrow";
import "../js/builders/prints";
import "../js/builders/rail";
import "../js/builders/road";

// js/stamps/*
import "../js/stamps/stamp-names-data.js"; // Load stamp names first
import "../js/stamps/text.js";
import "../js/stamps/stamps.js";

// js/sounds/*
import "../js/sounds/sounds.js";

// Initialize the application after all modules are loaded.
// With Vite's dev server processing 100+ module imports, DOMContentLoaded
// may fire before this module finishes evaluating. Handle both cases.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof init_kiddo_paint === "function") {
      init_kiddo_paint();
    }
  });
} else {
  // DOMContentLoaded already fired — init immediately
  if (typeof init_kiddo_paint === "function") {
    init_kiddo_paint();
  }
}

// Export the global object for potential future use
export default window.KiddoPaint;
