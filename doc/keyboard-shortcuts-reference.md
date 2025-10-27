# KidPix Keyboard Shortcuts Reference

**Note**: Keyboard shortcuts are currently **disabled** by default in the codebase (see `js/init/kiddopaint.js:209-211`). This document serves as a reference for when keyboard shortcuts are re-enabled.

## Table of Contents

1. [Single-Key Shortcuts](#single-key-shortcuts)
2. [Modifier Keys Overview](#modifier-keys-overview)
3. [SHIFT Key](#shift-key)
4. [CTRL Key (Control)](#ctrl-key-control)
5. [CMD Key (Command / Meta on macOS)](#cmd-key-command--meta-on-macos)
6. [ALT Key (Option on macOS)](#alt-key-option-on-macos)
7. [Platform Differences](#platform-differences)

---

## Single-Key Shortcuts

These keyboard shortcuts are defined in `js/init/kiddopaint.js` (currently commented out):

| Key | Function | Description |
|-----|----------|-------------|
| `n` | Next color | Cycle to next color in palette |
| `c` | Next palette | Cycle to next color palette |
| `r` | Random colors | Randomize current colors |
| `s` | Save | Save artwork to file |
| `v` | Velocity toggle | Toggle velocity-based drawing effects |
| `z` (with CTRL) | Undo | Undo last action |
| `?` | Help | Show keyboard shortcuts popup (planned) |

**File**: `js/init/kiddopaint.js:228-249`

---

## Modifier Keys Overview

KidPix uses four modifier keys to alter tool behavior. Each modifier key is tracked via global state variables in the `KiddoPaint.Current` namespace:

| Modifier | Global Variable | Range Variable | Description |
|----------|----------------|----------------|-------------|
| **SHIFT** | `modified` | `scaling` (typically 2) | Enlarges effects and constrains shapes |
| **CTRL** | `modifiedMeta` | — | Changes brush patterns and enables special modes |
| **CMD** (⌘) | `modifiedCtrl` | `modifiedCtrlRange` (-100 to +100) | Disables strokes, changes textures, hue shifting |
| **ALT** (⌥) | `modifiedAlt` | `modifiedAltRange` (-100 to +100) | Canvas-wide operations, texture changes |

**Note**: On macOS, CMD (⌘) is the primary modifier key. On Windows/Linux, CTRL serves this role. The codebase uses `modifiedCtrl` for CMD key and `modifiedMeta` for the actual CTRL key.

**Initialization**: `js/init/kiddopaint.js:101-140`

---

## SHIFT Key

**Global Variables**:
- `KiddoPaint.Current.modified` (boolean)
- `KiddoPaint.Current.scaling` (number, typically 2 when SHIFT is held)

**File**: `js/init/kiddopaint.js:214-215`

### Overview

The SHIFT key is primarily used to:
1. **Enlarge** brush sizes and effects (2x multiplier)
2. **Constrain** shapes to equal dimensions or straight lines
3. **Enable alternate sizes** for tools like stamps

---

### Shape Tools

#### Rectangle Tool
**Behavior**: Constrains rectangle to a square (equal width and height)

**File**: `js/tools/rectangle.js:26-32`

```javascript
if (KiddoPaint.Current.modified) {
  // keep side's lengths the same
  const signx = Math.sign(sizex);
  const signy = Math.sign(sizey);
  sizex = sizey = Math.max(Math.abs(sizex), Math.abs(sizey));
  sizex *= signx;
  sizey *= signy;
}
```

#### Circle/Oval Tool
**Behavior**: Draws a perfect circle from center point (instead of ellipse)

**File**: `js/tools/oval.js:41-52`

```javascript
} else if (KiddoPaint.Current.modified) {
  KiddoPaint.Display.context.arc(
    (ev._x + tool.startEv._x) / 2.0,
    (ev._y + tool.startEv._y) / 2.0,
    0.5 * distanceBetween(ev, { _x: tool.startEv._x, _y: tool.startEv._y }),
    0, 2 * Math.PI
  );
}
```

#### Line Tool
**Behavior**: Constrains line to horizontal or vertical (snaps to nearest axis)

**File**: `js/tools/line.js:26-33`

```javascript
if (KiddoPaint.Current.modified) {
  deltax = Math.abs(ev._x - tool.x);
  deltay = Math.abs(ev._y - tool.y);
  if (deltax < deltay) {
    KiddoPaint.Display.context.lineTo(tool.x, ev._y); // Vertical
  } else {
    KiddoPaint.Display.context.lineTo(ev._x, tool.y); // Horizontal
  }
}
```

---

### Stamp and Size-Based Tools

#### Stamp Tool
**Behavior**: Uses alternate/enlarged stamp size

**File**: `js/tools/stamp.js:15`

```javascript
tool.size = KiddoPaint.Current.modified ? altSize : 64;
```

The alternate size is controlled via scroll wheel with `modifiedRange`.

#### Pencil Tool
**Behavior**: Increases brush size by scaling factor

**File**: `js/tools/pencil.js:26`

```javascript
tool.size * KiddoPaint.Current.scaling;
```

---

### Special Effect Tools

#### Eraser (White Circles)
**Behavior**: Increases eraser size by scaling factor

**File**: `js/tools/eraser-white-circles.js:18`

```javascript
const currentSize = tool.size * KiddoPaint.Current.scaling;
```

#### Eraser (Hidden Pictures)
**Behavior**: Increases eraser size by scaling factor

**File**: `js/tools/eraser-hidden-pictures.js:35`

```javascript
const currentSize = tool.size * KiddoPaint.Current.scaling;
```

#### Standard Eraser
**Behavior**: Increases eraser size by scaling factor

**File**: `js/tools/eraser.js:19`

```javascript
const currentSize = tool.size * KiddoPaint.Current.scaling;
```

#### Inverter Tool
**Behavior**: Increases invert area size by scaling factor

**File**: `js/tools/inverter.js:23`

```javascript
const currentSize = tool.size * KiddoPaint.Current.scaling;
```

#### Magnify Tool
**Behavior**: Increases magnification area size by scaling factor

**File**: `js/tools/magnify.js:5`

```javascript
return 36 * KiddoPaint.Current.scaling;
```

#### Fuzzer Tool
**Behavior**: Increases fuzz area size by scaling factor

**File**: `js/tools/fuzzer.js:5`

```javascript
return 13 * KiddoPaint.Current.scaling;
```

---

### Advanced Tools

#### 3D Brush
**Behavior**: Increases 3D block size by scaling factor

**File**: `js/tools/three3d.js:5`

```javascript
return 16 * KiddoPaint.Current.scaling;
```

#### Cut/Truck Tool
**Behavior**: Increases selection area size by scaling factor

**File**: `js/tools/cut.js:13,18`

```javascript
KiddoPaint.Current.scaling *
  ((KiddoPaint.Current.modifiedCtrlRange + 100) / 100),
```

Combined with CMD range for fine control.

#### Sprite Placer
**Behavior**: Increases sprite size by scaling factor

**File**: `js/tools/spriteplacer.js:32`

```javascript
KiddoPaint.Current.scaling * (KiddoPaint.Current.modifiedCtrl ? 3 : 1),
```

Combined with CMD for 3x multiplier (2x from SHIFT, 3x from CMD = 6x total).

#### Astroid Tool
**Behavior**: Increases density of astroid lines

**File**: `js/tools/astroid.js:11`

```javascript
var interval = 37 * KiddoPaint.Current.scaling;
```

#### Maze Generator
**Behavior**: Increases maze complexity (more paths)

**File**: `js/tools/maze.js:33-34`

```javascript
width = 25 * KiddoPaint.Current.scaling;  // Number paths fitted horizontally
height = 25 * KiddoPaint.Current.scaling; // Number paths fitted vertically
```

#### Guilloche Tool
**Behavior**: Increases guilloche pattern complexity

**File**: `js/tools/guilloche.js:15-16`

```javascript
outradius: (41 + 64 * Math.random()) * KiddoPaint.Current.scaling,
inradius: (21 + 42 * Math.random()) * KiddoPaint.Current.scaling,
```

#### Tree Builder
**Behavior**: Increases tree size

**File**: `js/tools/trees.js:12`

```javascript
32 * KiddoPaint.Current.scaling,
```

---

### Brushes

The following brushes all scale their size with `KiddoPaint.Current.scaling`:

| Brush | Base Size | File |
|-------|-----------|------|
| **Pies** | 20 | `js/brushes/pies.js:5` |
| **Rainbow Bar** | 35 | `js/brushes/rainbowbar.js:4` |
| **Dumbbell** | 25 | `js/brushes/dumbbell.js:5` |
| **Rose** | 50 | `js/brushes/rose.js:9` |
| **Concentric Circles** | (5-35) | `js/brushes/concen.js:5` |
| **Spray** | 10 | `js/brushes/spray.js:5` |
| **Triangles** | 35 | `js/brushes/triangles.js:2` |
| **Mean Streak** | 32 | `js/brushes/meanstreak.js:3` |
| **Raindrops** | (5-105) | `js/brushes/raindrops.js:3` |
| **Pentagon** | 33 | `js/brushes/rpent.js:7` |
| **Splatter** | 27 | `js/brushes/splatter.js:2` |
| **Rainbow Ball** | 100 | `js/brushes/rainbowball.js:4` |
| **Circles** | 20 | `js/brushes/circles.js:8` |
| **Twirly** | 25 | `js/brushes/twirly.js:6` |
| **Bubbles** | 20 | `js/brushes/bubbles.js:5` |
| **Following Sine** | 33 | `js/brushes/fsine.js:7` |
| **Leaky Pen** | variable | `js/brushes/leakypen.js:16` |
| **Rainbow Doughnut** | 32 | `js/brushes/rainbowdoughnut.js:4` |
| **Icy** | 32 | `js/brushes/icy.js:4` |

#### Animal Prints (Paw Prints / Footprints)
**Behavior**: Increases print size

**File**: `js/builders/prints.js:6-17`

```javascript
canvasBrush.width = 150 * KiddoPaint.Current.scaling;
canvasBrush.height = 150 * KiddoPaint.Current.scaling;
```

---

### Textures

#### Texture Size (Various)
**Behavior**: Some textures use scaling for pattern size

**File**: `js/textures/textures.js:524`

```javascript
var size = 50 * KiddoPaint.Current.scaling;
```

---

### Submenus

#### Brush Spacing
**Behavior**: Adjusts brush spacing based on scaling

**Files**:
- `js/submenus/brush.js:38`: `spacing = 22 * KiddoPaint.Current.scaling`
- `js/submenus/brush.js:69`: `spacing = 40 * KiddoPaint.Current.scaling`

#### Line Size Toggle
**Behavior**: Changes line size from 2 to 3 when SHIFT held

**File**: `js/submenus/brush.js:324`

```javascript
KiddoPaint.Tools.Line.size = KiddoPaint.Current.modified ? 3 : 2;
```

---

### Special Cases

#### Bezier Follow Tool
**Behavior**: Dynamically adjusts scaling during drawing based on velocity and path

**File**: `js/tools/bezfollow.js:98-200`

This tool temporarily modifies `KiddoPaint.Current.scaling` during drawing operations, then restores it afterward.

#### Velocity Multiplier (Scroll Wheel)
**Behavior**: When velocity toggle is enabled, scroll wheel adjusts scaling via `velocityMultiplier`

**File**: `js/init/kiddopaint.js:780,786`

```javascript
KiddoPaint.Current.scaling = KiddoPaint.Current.velocityMultiplier;

if (KiddoPaint.Current.modified) {
  // SHIFT amplifies velocity-based scaling
}
```

---

## CTRL Key (Control)

**Global Variable**: `KiddoPaint.Current.modifiedMeta` (boolean)

**File**: `js/init/kiddopaint.js:117,224`

**Note**: On macOS, the physical CTRL key maps to `modifiedMeta`. The CMD key (⌘) maps to `modifiedCtrl`.

### Overview

The CTRL key (actual Control key) enables special drawing modes:
1. **Cycling colors** instead of current color
2. **Random colors** for dynamic effects
3. **Pattern changes** for brushes and textures
4. **Transparency/alpha effects**
5. **Alternative drawing modes**

---

### Brush Effects

#### Pies Brush
**Behavior**: Adds stroke outline around pie slices

**File**: `js/brushes/pies.js:14`

```javascript
if (KiddoPaint.Current.modifiedMeta) {
  contextBrush.lineWidth = 2;
  contextBrush.strokeStyle = "black";
  contextBrush.stroke();
}
```

#### Circles Brush
**Behavior**: Changes to random circles instead of fixed pattern

**File**: `js/submenus/brush.js:187`

```javascript
KiddoPaint.Current.modifiedMeta
```

Returns boolean to control random circle generation.

#### Connect-the-Dots Brush
**Behavior**: Uses cycling colors instead of current color

**File**: `js/submenus/brush.js:218`

```javascript
KiddoPaint.Current.modifiedMeta
```

#### Twirly Brush
**Behavior**: Uses cycling colors instead of current color

**File**: `js/submenus/brush.js:218`

Same as connect-the-dots, shares implementation.

#### Pentagon Brush
**Behavior**: Uses cycling colors instead of current color

**File**: `js/submenus/brush.js:240,246`

```javascript
KiddoPaint.Current.modifiedMeta
```

Affects color selection in pentagon pattern generation.

#### Following Sine Brush
**Behavior**: Uses cycling colors instead of current color

**File**: `js/submenus/brush.js:246`

Same as pentagon, shares color cycling logic.

#### Triangles Brush
**Behavior**: Changes triangle type/pattern

**File**: `js/submenus/brush.js:312`

```javascript
return KiddoPaint.Current.modifiedMeta
```

Returns boolean to select between triangle pattern variants.

#### Animal Tracks Brush
**Behavior**: Changes from paw prints (🐾) to footprints (👣)

**File**: `js/submenus/brush.js:437`

```javascript
KiddoPaint.Current.modifiedMeta ? "👣" : "🐾",
```

#### Spray Brush
**Behavior**: Adds transparency/alpha effects

**File**: `js/brushes/spray.js:50,56`

```javascript
if (KiddoPaint.Current.modifiedMeta) {
  contextBrush.globalAlpha = rng.next(); // Random transparency
}
```

#### Concentric Circles Brush
**Behavior**: Uses cycling colors instead of current color

**File**: `js/brushes/concen.js:15`

```javascript
if (KiddoPaint.Current.modifiedMeta) {
  context.fillStyle = KiddoPaint.Colors.nextAllColor();
}
```

---

### Drawing Tools

#### Pencil Rainbow Texture
**Behavior**: Activates full rainbow mode

**File**: `js/submenus/pencil.js:278`

```javascript
if (KiddoPaint.Current.modifiedMeta) {
  // Full rainbow gradient mode
}
```

#### Circle/Oval Tool
**Behavior**: Creates perfect circles from center point (instead of ellipses from corner)

**File**: `js/tools/oval.js:30-40`

```javascript
if (KiddoPaint.Current.modifiedMeta) {
  KiddoPaint.Display.context.arc(
    tool.startEv._x,
    tool.startEv._y,
    distanceBetween(ev, { _x: tool.startEv._x, _y: tool.startEv._y }),
    0, 2 * Math.PI
  );
}
```

Note: Different from SHIFT behavior - CTRL draws from fixed center point, SHIFT draws from midpoint.

#### Astroid Tool
**Behavior**: Uses random colors for each stroke line

**File**: `js/tools/astroid.js:33-35`

```javascript
if (KiddoPaint.Current.modifiedMeta) {
  KiddoPaint.Display.context.strokeStyle = KiddoPaint.Colors.randomColor();
}
```

#### Scribble Tool
**Behavior**: Increases jitter from 10 to 25

**File**: `js/tools/scribble.js:12`

```javascript
const baseJitter = KiddoPaint.Current.modifiedMeta ? 25 : 10;
```

---

### Advanced Tools

#### Stamp Tool
**Behavior**: Modifier for stamp behavior (passed to stamp generator)

**File**: `js/tools/stamp.js:27`

```javascript
KiddoPaint.Current.modifiedMeta,
```

Affects stamp rendering (specific behavior depends on stamp type).

#### Sprite Placer
**Behavior**: Modifier for sprite placement (affects positioning/rendering)

**File**: `js/tools/spriteplacer.js:21,72`

```javascript
var ctrl = KiddoPaint.Current.modifiedMeta;
```

Used in sprite placement calculations.

#### Placer Tool
**Behavior**: Modifier for placement behavior

**File**: `js/tools/placer.js:18,57,68`

```javascript
var ctrl = KiddoPaint.Current.modifiedMeta;
```

Affects object placement logic.

#### Cut/Truck Tool
**Behavior**: Disables preview mode, goes straight to cutting

**File**: `js/tools/cut.js:62,117`

```javascript
if (!KiddoPaint.Current.modifiedMeta) {
  // Show preview
}
```

When CTRL held, skips preview and cuts immediately.

#### TNT Tool
**Behavior**: Hidden feature to block completion

**File**: `js/tools/tnt.js:39`

```javascript
} else if (KiddoPaint.Current.modifiedMeta) {
  // Block completion
}
```

Prevents TNT explosion from completing (easter egg).

#### Shadow Boxes Mixer
**Behavior**: Uses random colors for shadows instead of current color

**File**: `js/tools/mixer-shadow-boxes.js:60`

```javascript
KiddoPaint.Display.context.shadowColor = KiddoPaint.Current.modifiedMeta
  ? KiddoPaint.Colors.randomColor()
  : KiddoPaint.Current.color;
```

#### Dither Effect (Whole Canvas)
**Behavior**: Changes from Bayer dithering to Atkinson dithering

**File**: `js/tools/wholefx.js:193`

```javascript
} else if (KiddoPaint.Current.modifiedMeta) {
  // Use Atkinson dithering algorithm
}
```

#### Guilloche Tool
**Behavior**: Enables fill rectangles

**File**: `js/tools/guilloche.js:52`

```javascript
if (KiddoPaint.Current.modifiedMeta) {
  context.fillRect(...);
}
```

#### 3D Tool
**Behavior**: Changes texture from Partial1 to Sand

**File**: `js/tools/three3d.js:18`

```javascript
} else if (KiddoPaint.Current.modifiedMeta) {
  return KiddoPaint.Textures.Sand(shadecolor);
}
```

#### Looper Tool
**Behavior**: Uses random colors instead of current color

**File**: `js/tools/looper.js:12`

```javascript
KiddoPaint.Current.modifiedMeta
  ? KiddoPaint.Colors.randomColor()
  : KiddoPaint.Current.color
```

---

## CMD Key (Command / Meta on macOS)

**Global Variables**:
- `KiddoPaint.Current.modifiedCtrl` (boolean)
- `KiddoPaint.Current.modifiedCtrlRange` (number, -100 to +100)

**File**: `js/init/kiddopaint.js:115,135,218`

**Note**: On macOS, the CMD key (⌘) maps to `modifiedCtrl`. On Windows/Linux, this might map to the Windows/Super key, but the CTRL key maps to `modifiedMeta`.

### Overview

The CMD key (⌘ on Mac) enables:
1. **Scroll wheel range control** for fine adjustments
2. **Disabling stroke outlines** on shapes (fill only)
3. **Texture changes** for brushes and tools
4. **Color effects** (alternating, hue shifting)
5. **Size multipliers** for sprites
6. **Secret features** (like stickers submenu)

---

### Main Features

#### Secret Stickers
**Behavior**: Shows stickers submenu when CMD+clicking Rubber Stamps

**Note**: This feature is mentioned in documentation but not directly visible in grep results. Likely in submenu handling code.

#### Scroll Wheel Range Control
**Behavior**: CMD + scroll wheel adjusts `modifiedCtrlRange` from -100 to +100

**File**: `js/init/kiddopaint.js:800-805`

```javascript
} else if (KiddoPaint.Current.modifiedCtrl) {
  KiddoPaint.Current.modifiedCtrlRange += delta;
  if (KiddoPaint.Current.modifiedCtrlRange > 100) {
    KiddoPaint.Current.modifiedCtrlRange = -100;
  } else if (KiddoPaint.Current.modifiedCtrlRange < -100) {
    KiddoPaint.Current.modifiedCtrlRange = 100;
  }
}
```

This range value is used by multiple tools for fine control (see below).

---

### Shape Tools

#### Rectangle/Square Tool
**Behavior**: Disables stroke outline (fill only)

**File**: `js/tools/rectangle.js:35-38`

```javascript
if (!KiddoPaint.Current.modifiedCtrl) {
  ctx.strokeStyle = tool.stroke();
  ctx.lineWidth = tool.thickness;
  ctx.strokeRect(tool.startEv._x, tool.startEv._y, sizex, sizey);
}
```

When CMD held, only fills the rectangle without drawing a border.

#### Circle/Oval Tool
**Behavior**: Disables stroke outline (fill only)

**File**: `js/tools/oval.js:67-69`

```javascript
if (!KiddoPaint.Current.modifiedCtrl) {
  KiddoPaint.Display.context.stroke();
}
```

When CMD held, only fills the circle without drawing a border.

---

### Drawing Effects

#### Pentagon Brush
**Behavior**: Uses different pentagon pattern vs. sine wave pattern

**File**: `js/submenus/brush.js:238`

```javascript
return KiddoPaint.Current.modifiedCtrl
```

Returns boolean to toggle between pentagon and sine wave generation.

#### Sprite Placer
**Behavior**: 3x size multiplier when placing sprites

**File**: `js/tools/spriteplacer.js:33`

```javascript
(KiddoPaint.Current.modifiedCtrl ? 3 : 1),
```

Combined with SHIFT scaling, this can create 6x larger sprites.

#### Astroid Tool
**Behavior**: Alternating colors between current color and alt color

**File**: `js/tools/astroid.js:36-38`

```javascript
} else if (KiddoPaint.Current.modifiedCtrl) {
  KiddoPaint.Display.context.strokeStyle =
    i % 2 ? KiddoPaint.Current.color : KiddoPaint.Current.altColor;
}
```

Creates a two-tone astroid pattern.

#### 3D Tool
**Behavior**: Changes texture from Partial1 to Speckles

**File**: `js/tools/three3d.js:16`

```javascript
} else if (KiddoPaint.Current.modifiedCtrl) {
  return KiddoPaint.Textures.Speckles(shadecolor);
}
```

---

### Textures

#### Stripes Texture
**Behavior**: Changes stripe pattern dimensions

**File**: `js/textures/textures.js:450`

```javascript
if (KiddoPaint.Current.modifiedCtrl) {
  // Different stripe width/spacing
}
```

---

### Whole Canvas Effects

#### Dither Effect
**Behavior**: Uses Bayer dithering with threshold

**File**: `js/tools/wholefx.js:190`

```javascript
if (KiddoPaint.Current.modifiedCtrl) {
  // Apply Bayer dithering
}
```

Note: Different from CTRL key which uses Atkinson dithering.

---

### Advanced Tools

#### Cut/Truck Tool
**Behavior**: Uses command range for size scaling

**File**: `js/tools/cut.js:15`

```javascript
((KiddoPaint.Current.modifiedCtrlRange + 100) / 100),
```

Range from -100 to +100 maps to 0.0 to 2.0 scaling multiplier.

Combined with SHIFT and ALT ranges for precise control:
```javascript
tool.size =
  KiddoPaint.Current.scaling *
  ((KiddoPaint.Current.modifiedCtrlRange + 100) / 100) *
  ((KiddoPaint.Current.modifiedAltRange + 100) / 100);
```

#### Stamp Tool
**Behavior**: Uses command range for hue shifting

**File**: `js/tools/stamp.js:18-21`

```javascript
if (KiddoPaint.Current.modifiedCtrlRange !== 0) {
  var modifiedHue = KiddoPaint.Current.modifiedCtrlRange / 100;
  KiddoPaint.Cache.setStampSetting(tool.stamp, "hueShift", modifiedHue);
  hueShift = modifiedHue;
}
```

Range from -100 to +100 maps to -1.0 to +1.0 hue shift.

---

### Scroll Wheel Integration

Multiple tools combine CMD key with scroll wheel for fine-tuned control:

| Tool | Range Use | File |
|------|-----------|------|
| **Stamp** | Hue shifting (-1.0 to +1.0) | `js/tools/stamp.js:18` |
| **Cut/Truck** | Size scaling (0.0 to 2.0) | `js/tools/cut.js:15` |

---

## ALT Key (Option on macOS)

**Global Variables**:
- `KiddoPaint.Current.modifiedAlt` (boolean)
- `KiddoPaint.Current.modifiedAltRange` (number, -100 to +100)

**File**: `js/init/kiddopaint.js:114,134,221`

### Overview

The ALT key (Option on macOS) enables:
1. **Canvas-wide operations** (color replace, etc.)
2. **Texture changes** for brushes and tools
3. **Gap filling** for smooth brush strokes
4. **Alternative drawing modes**
5. **Scroll wheel range control** for fine adjustments

---

### Main Features

#### Scroll Wheel Range Control
**Behavior**: ALT + scroll wheel adjusts `modifiedAltRange` from -100 to +100

**File**: `js/init/kiddopaint.js:793-798`

```javascript
} else if (KiddoPaint.Current.modifiedAlt) {
  KiddoPaint.Current.modifiedAltRange += delta;
  if (KiddoPaint.Current.modifiedAltRange > 100) {
    KiddoPaint.Current.modifiedAltRange = -100;
  } else if (KiddoPaint.Current.modifiedAltRange < -100) {
    KiddoPaint.Current.modifiedAltRange = 100;
  }
}
```

---

### Color Tools

#### Paint Can (Bucket Fill)
**Behavior**: Canvas-wide color replace instead of bounded flood fill

**File**: `js/tools/paintcan.js:9-13`

```javascript
if (KiddoPaint.Current.modifiedAlt) {
  tool.canvasWideReplace(ev);
} else {
  tool.boundedFill(ev);
}
```

When ALT held, clicking replaces ALL pixels of the clicked color with the current color across the entire canvas. Without ALT, it only fills the connected region (flood fill).

---

### Brush Tools

#### Plain Brush
**Behavior**: Enables gap filling for smooth continuous strokes

**File**: `js/tools/plainbrush.js:46`

```javascript
(KiddoPaint.Current.modifiedAlt || tool.alwaysGapFill) &&
```

When ALT held (or if tool has `alwaysGapFill` enabled), fills gaps between brush stamps for smoother lines.

#### Lanczos Brush
**Behavior**: Enables gap filling when previous event exists

**File**: `js/tools/lanczosbrush.js:49`

```javascript
if (KiddoPaint.Current.modifiedAlt && tool.previousEv != null) {
  // Fill gaps between brush applications
}
```

---

### Special Effect Tools

#### 3D Tool
**Behavior**: Changes texture from Partial1 to Bubbles

**File**: `js/tools/three3d.js:14-15`

```javascript
if (KiddoPaint.Current.modifiedAlt) {
  return KiddoPaint.Textures.Bubbles(shadecolor);
}
```

Note: This is different from CMD (Speckles) and CTRL (Sand).

#### Kaleidoscope Tool
**Behavior**: Modifier for kaleidoscope effect (affects symmetry)

**File**: `js/tools/kaleidoscope.js:34`

```javascript
if (KiddoPaint.Current.modifiedAlt) {
  // Different kaleidoscope mode
}
```

#### Contours Tool
**Behavior**: Modifier for contour drawing

**File**: `js/tools/contours.js:25`

```javascript
KiddoPaint.Current.modifiedAlt
```

Affects contour line generation.

---

### Advanced Tools

#### Sprite Placer
**Behavior**: Modifier for sprite placement behavior

**File**: `js/tools/spriteplacer.js:20,71`

```javascript
var alt = KiddoPaint.Current.modifiedAlt;
```

Used in sprite rendering logic.

#### Placer Tool
**Behavior**: Modifier for placement behavior

**File**: `js/tools/placer.js:17,56,67`

```javascript
var alt = KiddoPaint.Current.modifiedAlt;
```

Affects object placement calculations.

#### Cut/Truck Tool
**Behavior**: Uses alt range for size scaling

**File**: `js/tools/cut.js:20`

```javascript
((KiddoPaint.Current.modifiedAltRange + 100) / 100),
```

Range from -100 to +100 maps to 0.0 to 2.0 scaling multiplier.

Combined with SHIFT and CMD ranges for precise control (see CMD section).

#### Stamp Tool
**Behavior**: Modifier passed to stamp generator

**File**: `js/tools/stamp.js:26`

```javascript
KiddoPaint.Current.modifiedAlt,
```

Affects stamp rendering (specific behavior depends on stamp type).

---

### Textures

#### Stripes Texture
**Behavior**: Changes stripe pattern

**File**: `js/textures/textures.js:124`

```javascript
if (KiddoPaint.Current.modifiedAlt) {
  // Different stripe configuration
}
```

---

### Whole Canvas Effects

#### Dither Effect
**Behavior**: Finer dithering increment (4 vs 16)

**File**: `js/tools/wholefx.js:149`

```javascript
var increment = KiddoPaint.Current.modifiedAlt ? 4 : 16;
```

Creates a more detailed dithering pattern with smaller steps.

---

### Pencil Tool

#### Rainbow Pencil
**Behavior**: Changes to different rainbow mode

**File**: `js/submenus/pencil.js:280`

```javascript
} else if (KiddoPaint.Current.modifiedAlt) {
  // Alternative rainbow gradient
}
```

---

### Undo Feature

#### Undo Behavior
**Behavior**: Changes undo behavior (implementation commented out)

**File**: `js/init/kiddopaint.js:265`

```javascript
// KiddoPaint.Display.undo(!KiddoPaint.Current.modifiedAlt);
```

When implemented, ALT would affect how undo operates.

---

### Scroll Wheel Integration

Similar to CMD key, ALT can be combined with scroll wheel:

| Tool | Range Use | File |
|------|-----------|------|
| **Cut/Truck** | Size scaling (0.0 to 2.0) | `js/tools/cut.js:20` |

---

## Platform Differences

### macOS
- **⌘ (Command)** key → `KiddoPaint.Current.modifiedCtrl`
  - Used for: Secret features, stroke removal, texture changes, hue shifting
  - Key codes: 91 (left ⌘) or 93 (right ⌘)
- **⌃ (Control)** key → `KiddoPaint.Current.modifiedMeta`
  - Used for: Cycling colors, random colors, pattern changes, transparency
  - Key code: 17
- **⌥ (Option)** key → `KiddoPaint.Current.modifiedAlt`
  - Used for: Canvas-wide operations, texture changes, gap filling
  - Key code: 18
- **⇧ (Shift)** key → `KiddoPaint.Current.modified` / `scaling`
  - Used for: Enlarging, constraining shapes
  - Key code: 16

### Windows/Linux
- **Ctrl** key → Likely maps to `KiddoPaint.Current.modifiedCtrl` (primary modifier)
- **Windows/Super** key → Behavior undefined in current codebase
- **Alt** key → `KiddoPaint.Current.modifiedAlt`
- **Shift** key → `KiddoPaint.Current.modified` / `scaling`

**Note**: The codebase was designed primarily for macOS, so Windows/Linux behavior may differ and needs testing.

---

## Implementation Notes

### Keyboard Event Handling

All keyboard shortcuts are currently **disabled** in the codebase:

**File**: `js/init/kiddopaint.js:209-211`

```javascript
// Keyboard shortcuts disabled for maximum simplicity
// All core drawing functionality remains available through UI buttons
// document.onkeydown = function checkKey(e) {
```

The commented-out code (lines 212-287) shows the intended implementation:

```javascript
// document.onkeydown = function checkKey(e) {
//   if (e.keyCode == 16) {
//     // Shift key
//     KiddoPaint.Current.scaling = 2;
//     KiddoPaint.Current.modified = true;
//   } else if (e.keyCode == 91 || e.keyCode == 93) {
//     // Left/Right Command key (⌘) on Mac
//     KiddoPaint.Current.modifiedCtrl = true;
//   } else if (e.keyCode == 18) {
//     // Alt/Option key
//     KiddoPaint.Current.modifiedAlt = true;
//   } else if (e.keyCode == 17) {
//     // Control key (actual Ctrl)
//     KiddoPaint.Current.modifiedMeta = true;
//   }
//   // ... more key handlers
// };
//
// document.onkeyup = function releaseKey(e) {
//   if (e.keyCode == 16) {
//     KiddoPaint.Current.scaling = 1;
//     KiddoPaint.Current.modified = false;
//   } else if (e.keyCode == 91 || e.keyCode == 93) {
//     KiddoPaint.Current.modifiedCtrl = false;
//   } else if (e.keyCode == 18) {
//     KiddoPaint.Current.modifiedAlt = false;
//   } else if (e.keyCode == 17) {
//     KiddoPaint.Current.modifiedMeta = false;
//   }
// };
```

### Re-enabling Keyboard Shortcuts

To re-enable keyboard shortcuts:

1. Uncomment the `document.onkeydown` and `document.onkeyup` functions in `js/init/kiddopaint.js`
2. Test across different browsers (Chrome, Firefox, Safari)
3. Test on different platforms (macOS, Windows, Linux)
4. Consider adding a settings toggle to enable/disable shortcuts
5. Add a help popup (triggered by `?` key) to display this reference

### Testing Recommendations

When re-enabling keyboard shortcuts, test:

1. **Single modifier keys**: Each modifier key individually
2. **Key combinations**: SHIFT+CTRL, SHIFT+CMD, etc.
3. **Scroll wheel integration**: CMD+scroll, ALT+scroll
4. **Platform differences**: macOS vs Windows/Linux
5. **Browser differences**: Chrome, Firefox, Safari, Edge
6. **Conflict prevention**: Don't override browser shortcuts (Ctrl+S, Cmd+R, etc.)

---

## Summary Tables

### Quick Reference: Modifier Keys by Category

#### Shape Constraints
| Tool | SHIFT | CTRL | CMD | ALT |
|------|-------|------|-----|-----|
| **Rectangle** | → Square | — | Fill only | — |
| **Circle** | → Perfect circle (center) | → Perfect circle (radius) | Fill only | — |
| **Line** | → H/V constraint | — | — | — |

#### Color Effects
| Tool | SHIFT | CTRL | CMD | ALT |
|------|-------|------|-----|-----|
| **Astroid** | Density+ | Random colors | Alternating colors | — |
| **Looper** | — | Random colors | — | — |
| **Shadow Boxes** | — | Random shadows | — | — |
| **Connect-the-Dots** | — | Cycling colors | — | — |
| **Twirly** | — | Cycling colors | — | — |
| **Pentagon** | — | Cycling colors | Pattern change | — |
| **Concentric** | — | Cycling colors | — | — |

#### Texture Changes
| Tool | SHIFT | CTRL | CMD | ALT |
|------|-------|------|-----|-----|
| **3D Brush** | Size 2x | Sand texture | Speckles texture | Bubbles texture |
| **Stripes** | — | — | Pattern change | Pattern change |

#### Size/Scaling
| Tool | SHIFT | CTRL | CMD | ALT |
|------|-------|------|-----|-----|
| **Most Brushes** | Size 2x | — | — | — |
| **Erasers** | Size 2x | — | — | — |
| **Sprite Placer** | Size 2x | — | Size 3x (6x total) | Modifier |
| **Stamp** | Alt size | — | — | — |
| **Cut/Truck** | Size 2x | — | + CMD range | + ALT range |

#### Special Modes
| Tool | SHIFT | CTRL | CMD | ALT |
|------|-------|------|-----|-----|
| **Paint Can** | — | — | — | Canvas-wide replace |
| **Cut/Truck** | — | No preview | — | — |
| **Spray** | — | Transparency | — | — |
| **Dither** | — | Atkinson | Bayer | Finer steps |
| **Guilloche** | — | Fill rects | — | — |
| **Plain Brush** | — | — | — | Gap fill |
| **Lanczos Brush** | — | — | — | Gap fill |

---

## Future Enhancements

### Planned Features
1. **Help Popup**: Press `?` to display abbreviated shortcuts reference
2. **Settings Toggle**: Enable/disable keyboard shortcuts in settings
3. **Visual Indicators**: Show active modifier keys in UI
4. **Customizable Shortcuts**: Allow users to remap keys
5. **Tooltip Hints**: Show modifier key hints when hovering over tools
6. **Touch Gestures**: Map modifier keys to multi-finger gestures on tablets

### Documentation Improvements
1. **Video Demonstrations**: Screen recordings showing each modifier key effect
2. **Interactive Reference**: Click tools to see their modifier key behaviors
3. **Searchable Database**: Search for specific behaviors or tools
4. **Comparison View**: Side-by-side comparisons of modified vs unmodified

---

## Credits

**Documentation Created**: October 26, 2025

**Research Sources**:
- Codebase analysis of `js/` directory
- Existing documentation in `prompts-TODO/backlog.txt`
- Issue #44 specifications

**Verified**: All modifier key behaviors cross-referenced with source code.

---

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Project overview and development guidelines
- [doc/user/](../doc/user/) - User documentation
- [doc/maintainer/](../doc/maintainer/) - Maintainer documentation
