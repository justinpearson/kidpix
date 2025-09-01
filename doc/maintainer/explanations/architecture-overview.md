# Architecture Overview

## Table of Contents

- [Overview](#overview)
- [Core Design Philosophy](#core-design-philosophy)
- [Global Namespace Structure](#global-namespace-structure)
- [Multi-Layer Canvas System](#multi-layer-canvas-system)
- [Tool Architecture](#tool-architecture)
- [Event System](#event-system)
- [Audio System](#audio-system)
- [State Management](#state-management)
- [Performance Considerations](#performance-considerations)
- [Extension Points](#extension-points)

## Overview

This document provides a comprehensive overview of Kid Pix's JavaScript architecture, designed for maintainers who need to understand the system's design decisions and component interactions.

## Core Design Philosophy

Kid Pix follows a **modular, namespace-based architecture** that prioritizes:

- **Separation of concerns** - Each module has a clear, single responsibility
- **Extensibility** - New tools, brushes, and effects can be added easily
- **Performance** - Multi-layer canvas system optimizes rendering
- **Compatibility** - Works across different browsers without frameworks

## Global Namespace Structure

Everything is organized under the `KiddoPaint` global object:

```javascript
var KiddoPaint = {
  Tools: {
    Toolbox: {}, // Tool constructors
    [ToolName]: {}, // Tool instances
  },
  Textures: {}, // Pattern generators
  Brushes: {}, // Brush generators
  Builders: {}, // Shape construction
  Stamps: {}, // Sprite/stamp system
  Sounds: {}, // Audio management
  Display: {}, // Canvas layer management
  Colors: {}, // Color palette system
  Current: {}, // Application state
  Cache: {}, // Performance caching
  Alphabet: {}, // Text/letter system
  Sprite: {}, // Sprite system
  Submenu: {}, // UI submenu definitions
};
```

## Multi-Layer Canvas System

The rendering system uses multiple HTML5 canvas elements for performance and flexibility:

### Canvas Layers (Z-order, bottom to top)

1. **Main Canvas** (`#kiddopaint`) - Final artwork, persistent
2. **Background Animation Canvas** (`bnimCanvas`) - Background effects
3. **Animation Canvas** (`animCanvas`) - Foreground animations
4. **Temporary Canvas** (`tmp_canvas`) - Current drawing operations
5. **Preview Canvas** (`prev_canvas`) - Tool previews

### Layer Management Benefits

- **Performance**: Only redraw layers that change
- **Separation**: Different types of content isolated
- **Undo**: Easy to revert temporary operations
- **Effects**: Complex animations don't interfere with artwork

## Tool Architecture

### Tool Interface Contract

Every tool must implement the three-method interface:

```javascript
KiddoPaint.Tools.Toolbox.ToolName = function () {
  this.mousedown = function (ev) {
    /* start interaction */
  };
  this.mousemove = function (ev) {
    /* continue interaction */
  };
  this.mouseup = function (ev) {
    /* finish interaction */
  };
};
```

### Event Flow

1. **User Input** → Canvas event listeners capture mouse/touch
2. **Event Routing** → Central dispatcher calls current tool's method
3. **Tool Execution** → Tool manipulates canvas layers
4. **State Update** → Application state and undo history updated

### Tool Categories

**Basic Drawing Tools**

- Direct canvas manipulation (Pencil, Line, Square, Circle)
- Simple geometric operations
- Immediate visual feedback

**Brush Tools**

- Use `KiddoPaint.Brushes` generators
- Create complex patterns via canvas stamping
- Support velocity and modifier key variations

**Effect Tools**

- Manipulate existing canvas content (Inverter, Kaleidoscope)
- Use pixel-level operations or WebGL shaders
- Often operate on entire canvas regions

**Special Tools**

- Complex interactions (Truck, Eraser variants)
- Multi-step operations with state management
- Custom UI behaviors

## Component Systems

### Brush System

Brushes are **generator functions** that return canvas elements:

```javascript
KiddoPaint.Brushes.BrushName = (function () {
  return function (color1, color2, options) {
    var canvas = document.createElement("canvas");
    // Generate pattern on canvas
    return {
      brush: canvas,
      offset: centerOffset,
    };
  };
})();
```

**Key Characteristics:**

- Pure functions - same inputs produce same outputs
- Return canvas objects for stamping
- Support parameterization (colors, sizes, options)
- Can be cached for performance

### Texture System

Textures create **repeatable patterns** for fill operations:

```javascript
KiddoPaint.Textures.TextureName = function (color1, color2) {
  var canvas = document.createElement("canvas");
  // Create pattern tile
  return context.createPattern(canvas, "repeat");
};
```

**Design Goals:**

- Seamless tiling patterns
- Color parameterization
- Integration with HTML5 Canvas pattern system
- Support for both simple and complex patterns

### Sound System

Audio feedback enhances the tactile experience:

```javascript
KiddoPaint.Sounds.Library = {
  playSingle: function (soundName) {
    /* play once */
  },
  playRand: function (soundArray) {
    /* random from set */
  },
  playLoop: function (soundName) {
    /* continuous */
  },
};
```

**Sound Categories:**

- **Tool sounds** - Immediate feedback for actions
- **Sequence sounds** - Multi-part audio (start/during/end)
- **UI sounds** - Menu clicks and selections
- **Alphabet sounds** - Letter pronunciation

### Color Management

Sophisticated palette system supporting multiple color schemes:

```javascript
KiddoPaint.Colors = {
    All: [PaletteArray1, PaletteArray2, ...],
    currentPalette: 0,
    getColor: function(index) { /* color lookup */ },
    randomColor: function() { /* random selection */ }
};
```

## State Management

### Current State Object

`KiddoPaint.Current` holds all active application state:

```javascript
KiddoPaint.Current = {
  tool: null, // Active tool instance
  color: "#000000", // Selected color
  scaling: 1, // UI scaling factor
  multiplier: 1, // Effect intensity
  velocity: 0, // Mouse movement speed
  alpha: 1.0, // Global transparency
  // ... modifier key states, etc.
};
```

### Undo System

Simple single-level undo via canvas state capture:

- Save canvas state before each operation
- Restore previous state on undo
- Memory-efficient for typical usage patterns

## Build System Architecture

### Module Concatenation Order

The build system processes files in dependency order:

1. **init/** - Application bootstrapping and globals
2. **util/** - Core utilities and helper functions
3. **tools/** - All drawing tools
4. **textures/** - Pattern generators
5. **submenus/** - UI definitions
6. **brushes/** - Brush generators
7. **builders/** - Shape construction tools
8. **stamps/** - Sprite and stamp systems
9. **sounds/** - Audio system

### Why This Order Matters

- **Dependencies**: Later modules depend on earlier ones
- **Initialization**: Core systems available when tools load
- **Performance**: Utilities loaded before heavy tool code

## Performance Considerations

### Canvas Optimization

- **Layer separation** reduces full-canvas redraws
- **Image smoothing disabled** for pixel-perfect rendering
- **Temporary canvas** prevents flickering during drawing

### Memory Management

- **Brush caching** prevents repeated pattern generation
- **Canvas reuse** where possible
- **Garbage collection** friendly patterns

### Event Handling

- **Throttled mousemove** events prevent overwhelming slower devices
- **Touch event normalization** for mobile compatibility
- **Modifier key state** cached to avoid repeated queries

## Browser Compatibility Strategy

### Canvas Support

- Feature detection for HTML5 Canvas
- Graceful degradation for unsupported browsers
- Vendor prefix handling for experimental features

### Audio Support

- Multiple format support (WAV + MP3)
- Fallback for browsers without audio support
- User interaction requirement compliance

### Touch Device Support

- Touch event mapping to mouse events
- Viewport meta tag for mobile browsers
- Responsive scaling considerations

## Extension Points

The architecture supports extension through:

1. **New Tools** - Follow tool interface contract
2. **New Brushes** - Implement brush generator pattern
3. **New Textures** - Create pattern generator functions
4. **New Effects** - Pixel manipulation or shader-based
5. **New Sounds** - Add to sound library with consistent naming
6. **New UI Elements** - Extend submenu system

This modular design ensures that new features integrate seamlessly with existing functionality while maintaining the performance and compatibility characteristics that make Kid Pix accessible to all users.
