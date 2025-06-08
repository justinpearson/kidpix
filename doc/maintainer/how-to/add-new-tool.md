# How to Add a New Tool

## Table of Contents

- [Overview](#overview)
- [1. Create the Tool File](#1-create-the-tool-file)
- [2. Add Tool Sprite](#2-add-tool-sprite)
- [3. Register the Tool](#3-register-the-tool)
- [4. Add Sound Effects (Optional)](#4-add-sound-effects-optional)
- [5. Create Submenu (Optional)](#5-create-submenu-optional)
- [6. Test Your Tool](#6-test-your-tool)
- [Tool Development Patterns](#tool-development-patterns)
- [Best Practices](#best-practices)

## Overview

This guide walks through creating a new drawing tool for Kid Pix.

## 1. Create the Tool File

Create a new file in `js/tools/` following the standard tool pattern:

```javascript
// js/tools/mytool.js

KiddoPaint.Tools.Toolbox.MyTool = function () {
  var tool = this;

  // Optional: Tool configuration
  this.size = 5;
  this.color = KiddoPaint.Current.color;

  // Required: Mouse down handler
  this.mousedown = function (ev) {
    // Initialize drawing state
    tool.mouseisdown = true;

    // Get mouse coordinates
    var mx = ev.layerX || ev.offsetX;
    var my = ev.layerY || ev.offsetY;

    // Start drawing logic here
    // Use KiddoPaint.Display.context for main canvas
    // Use KiddoPaint.Display.tmp_context for temporary drawing
  };

  // Required: Mouse move handler
  this.mousemove = function (ev) {
    if (!tool.mouseisdown) return;

    var mx = ev.layerX || ev.offsetX;
    var my = ev.layerY || ev.offsetY;

    // Continue drawing logic here
  };

  // Required: Mouse up handler
  this.mouseup = function (ev) {
    if (!tool.mouseisdown) return;
    tool.mouseisdown = false;

    // Finalize drawing
    // Save to main canvas if needed
    KiddoPaint.Display.saveMain();

    // Optional: Play sound
    KiddoPaint.Sounds.Library.playSingle("toolname-sound");
  };
};

// Create tool instance
KiddoPaint.Tools.MyTool = new KiddoPaint.Tools.Toolbox.MyTool();
```

## 2. Add Tool to HTML Interface

Edit `index.html` to add your tool button to the main toolbar:

```html
<button class="tool" id="mytool" title="My Tool">
  <img src="img/my-tool-icon.png" class="pixelated" width="48" height="48" />
</button>
```

## 3. Create Tool Icon

1. Create a 48x48 pixel PNG icon for your tool
2. Save it as `img/my-tool-icon.png`
3. Use the pixelated, Kid Pix aesthetic style

## 4. Add Tool Sounds (Optional)

Edit `js/sounds/sounds.js` to add sound effects:

```javascript
// Add to appropriate sound library section
KiddoPaint.Sounds.Library.mytool = "snd/my-tool-sound.wav";
```

Place sound files in both `snd/` (WAV) and `sndmp3/` (MP3) directories.

## 5. Create Submenu (Optional)

If your tool needs options, create `js/submenus/mytool.js`:

```javascript
KiddoPaint.Submenu.mytool = [
  {
    name: "Small Size",
    imgSrc: "img/mytool-small.png",
    handler: function () {
      KiddoPaint.Tools.MyTool.size = 3;
    },
  },
  {
    name: "Large Size",
    imgSrc: "img/mytool-large.png",
    handler: function () {
      KiddoPaint.Tools.MyTool.size = 10;
    },
  },
];
```

## 6. Handle Modifier Keys (Optional)

Add modifier key support to your tool handlers:

```javascript
this.mousedown = function (ev) {
  // Check for modifier keys
  var shift = ev.shiftKey;
  var alt = ev.altKey;
  var ctrl = ev.ctrlKey;
  var meta = ev.metaKey;

  // Adjust behavior based on modifiers
  if (shift) {
    tool.size *= 2; // Make bigger with Shift
  }

  // Your drawing logic here
};
```

## 7. Build and Test

```bash
# Rebuild the application
./build.sh

# Test in browser
# - Verify tool appears in toolbar
# - Test all mouse interactions
# - Test with modifier keys
# - Verify sounds play
# - Test submenu if created
```

## 8. Common Patterns

### Drawing with Brushes

```javascript
// Use a brush from KiddoPaint.Brushes
var brush = KiddoPaint.Brushes.Circles();
var canvasBrush = brush.brush;
tool.context.drawImage(canvasBrush, mx - brush.offset, my - brush.offset);
```

### Using Textures

```javascript
// Apply a texture pattern
tool.context.fillStyle = KiddoPaint.Textures.Solid(tool.color);
tool.context.fill();
```

### Velocity-Sensitive Effects

```javascript
// Access mouse velocity
var velocity = KiddoPaint.Current.velocity;
var size = Math.max(1, tool.size * velocity);
```

### Multiple Canvas Layers

```javascript
// Draw to temporary canvas first
KiddoPaint.Display.tmp_context.drawImage(brush, mx, my);

// Then commit to main canvas on mouseup
KiddoPaint.Display.saveMain();
```

## 9. Troubleshooting

**Tool doesn't appear in interface**

- Check that `index.html` was updated with tool button
- Verify `./build.sh` was run after creating tool file

**Drawing doesn't work**

- Ensure all three mouse handlers are implemented
- Check browser console for JavaScript errors
- Verify coordinates are calculated correctly

**Tool doesn't stay selected**

- Check that tool button has correct `id` attribute
- Ensure tool instance is created (last line of tool file)

**Submenu doesn't show**

- Verify submenu file exists and follows naming convention
- Check that submenu items have valid `handler` functions
- Ensure `./build.sh` was run after creating submenu
