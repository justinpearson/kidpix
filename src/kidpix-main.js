// Main entry point for KidPix JavaScript modules
// This file imports all the modular JS files in the correct order
// The global KiddoPaint object is initialized in index.html before this module loads

// Import all modules in the correct dependency order
// js/util/* (load utilities first since they are dependencies)
import '../js/util/array.js';
import '../js/util/cache.js';
import '../js/util/colors.js';
import '../js/util/display.js';
import '../js/util/dither.js';
import '../js/util/douglas-peucker.js';
import '../js/util/filters.js';
import '../js/util/fit-curve.js';
import '../js/util/glfx.js';
import '../js/util/html.js';
import '../js/util/kdtree.js';
import '../js/util/smoke.js';
import '../js/util/smooth.js';
import '../js/util/trim-canvas.js';
import '../js/util/utils.js';

// js/init/* (load after utilities since they depend on them)
import '../js/init/submenus.js';
import '../js/init/kiddopaint.js';

// js/tools/*
import '../js/tools/animbrush.js';
import '../js/tools/astroid.js';
import '../js/tools/bezfollow.js';
import '../js/tools/brush.js';
import '../js/tools/circle.js';
import '../js/tools/composite.js';
import '../js/tools/contours.js';
import '../js/tools/cut.js';
import '../js/tools/eraser-doorbell.js';
import '../js/tools/eraser-fade-away.js';
import '../js/tools/eraser-hidden-pictures.js';
import '../js/tools/eraser-letters.js';
import '../js/tools/eraser-white-circles.js';
import '../js/tools/eraser.js';
import '../js/tools/flood.js';
import '../js/tools/fuzzer.js';
import '../js/tools/guilloche.js';
import '../js/tools/inverter.js';
import '../js/tools/kaleidoscope.js';
import '../js/tools/lanczosbrush.js';
import '../js/tools/line.js';
import '../js/tools/looper.js';
import '../js/tools/magnify.js';
import '../js/tools/maze.js';
import '../js/tools/partialfx.js';
import '../js/tools/pines.js';
import '../js/tools/pixelpencil.js';
import '../js/tools/placer.js';
import '../js/tools/plainbrush.js';
import '../js/tools/scribble.js';
import '../js/tools/smoke.js';
import '../js/tools/smoothpen.js';
import '../js/tools/smudge.js';
import '../js/tools/spiral.js';
import '../js/tools/spriteplacer.js';
import '../js/tools/square.js';
import '../js/tools/stamp.js';
import '../js/tools/three3d.js';
import '../js/tools/tnt.js';
import '../js/tools/trees.js';
import '../js/tools/wacky-mixer-checkerboard.js';
import '../js/tools/wacky-mixer-inverter.js';
import '../js/tools/wacky-mixer-pattern.js';
import '../js/tools/wacky-mixer-pip.js';
import '../js/tools/wacky-mixer-shadow-boxes.js';
import '../js/tools/wacky-mixer-venetian-blinds.js';
import '../js/tools/wacky-mixer-wallpaper.js';
import '../js/tools/wholefx.js';

// js/textures/*
import '../js/textures/gco.js';
import '../js/textures/textures.js';

// js/submenus/*
import '../js/submenus/brush.js';
import '../js/submenus/circle.js';
import '../js/submenus/eraser.js';
import '../js/submenus/flood.js';
import '../js/submenus/jumble.js';
import '../js/submenus/line.js';
import '../js/submenus/pencil.js';
import '../js/submenus/spray.js';
import '../js/submenus/sprites.js';
import '../js/submenus/square.js';
import '../js/submenus/stickers.js';
import '../js/submenus/truck.js';

// js/brushes/*
import '../js/brushes/bubbles.js';
import '../js/brushes/circles.js';
import '../js/brushes/concen.js';
import '../js/brushes/connectthedots.js';
import '../js/brushes/dumbbell.js';
import '../js/brushes/fsine.js';
import '../js/brushes/icy.js';
import '../js/brushes/leakypen.js';
import '../js/brushes/meanstreak.js';
import '../js/brushes/pies.js';
import '../js/brushes/rainbowball.js';
import '../js/brushes/rainbowbar.js';
import '../js/brushes/rainbowdoughnut.js';
import '../js/brushes/raindrops.js';
import '../js/brushes/rose.js';
import '../js/brushes/rpent.js';
import '../js/brushes/splatter.js';
import '../js/brushes/spray.js';
import '../js/brushes/triangles.js';
import '../js/brushes/twirly.js';

// js/builders/*
import '../js/builders/arrow.js';
import '../js/builders/prints.js';
import '../js/builders/rail.js';
import '../js/builders/road.js';

// js/stamps/*
import '../js/stamps/alphabet.js';
import '../js/stamps/stamps.js';

// js/sounds/*
import '../js/sounds/sounds.js';

// Initialize the application after all modules are loaded
document.addEventListener('DOMContentLoaded', function() {
  if (typeof init_kiddo_paint === 'function') {
    init_kiddo_paint();
  }
});

// Export the global object for potential future use
export default window.KiddoPaint;