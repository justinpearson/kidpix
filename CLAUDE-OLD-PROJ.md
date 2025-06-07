# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **jskidpix** - an HTML/JavaScript reimplementation of the classic 1989 Kid Pix painting application. It's a browser-based paint program with creative tools, sound effects, and whimsical interactions that captures the spirit of the original.

## Build System

### Building the Application
```bash
./build.sh
```

The build script:
- Formats JavaScript and CSS files using js-beautify
- Concatenates all JavaScript modules into a single `js/app.js` file using uglify-es
- Processes files in this order: init → util → tools → textures → submenus → brushes → builders → stamps → sounds

### Development Dependencies
- `uglify-es`: JavaScript minification and concatenation
- `js-beautify`: Code formatting

## Architecture Overview

### Core Structure
The application is built around a modular JavaScript architecture with the central `KiddoPaint` namespace:

```javascript
var KiddoPaint = {};
KiddoPaint.Tools = {};        // Drawing tools
KiddoPaint.Textures = {};     // Pattern generators  
KiddoPaint.Brushes = {};      // Brush generators
KiddoPaint.Sounds = {};       // Audio system
KiddoPaint.Display = {};      // Multi-layer canvas management
KiddoPaint.Colors = {};       // Color palette system
KiddoPaint.Current = {};      // Application state
```

### Multi-Layer Canvas System
The application uses multiple HTML5 canvas layers:
- **Main Canvas**: Final rendered artwork
- **Tmp Canvas**: Current drawing operations
- **Preview Canvas**: Tool previews
- **Animation Canvases**: Animated effects and background animations

### Tool Architecture
All tools follow a consistent interface pattern with three mouse event handlers:
```javascript
KiddoPaint.Tools.Toolbox.ToolName = function() {
    this.mousedown = function(ev) { /* start drawing */ };
    this.mousemove = function(ev) { /* continue drawing */ };
    this.mouseup = function(ev) { /* finish drawing */ };
};
```

### Key Directories
- `js/tools/`: Drawing tools (pencil, brush, eraser, effects)
- `js/brushes/`: Brush pattern generators (circles, splatters, animations)
- `js/textures/`: Fill pattern generators (stripes, speckles, gradients)
- `js/submenus/`: UI submenu definitions for tool options
- `js/sounds/`: Audio system and sound library
- `js/util/`: Core utilities (display, colors, caching, filters)
- `js/init/`: Application initialization and setup

## Key Systems

### Event Handling
Central event dispatcher routes mouse/touch events to the current tool:
```javascript
function ev_canvas(ev) {
    var func = KiddoPaint.Current.tool[ev.type];
    if (func) func(ev);
}
```

### Modifier Keys
Extensive use of modifier keys (Shift, Alt, Ctrl, Meta) to alter tool behavior. Many tools support Shift to enlarge their effect.

### Submenu System
Submenus are defined as arrays of button configurations that are dynamically rendered:
```javascript
KiddoPaint.Submenu.toolname = [{
    name: 'Option Name',
    imgSrc: 'img/icon.png',
    handler: function() { /* configure tool */ }
}];
```

### Sound Integration
Each tool can have associated sounds (start, during, end) with support for random sound selection and multi-part audio sequences.

### Canvas Management
The `KiddoPaint.Display` system handles:
- Canvas clearing and saving operations
- Undo functionality (single-level)
- Local storage persistence
- Layer compositing

## File Organization Notes

- **No build tools for CSS**: CSS is served directly from `css/kidpix.css`
- **Image assets**: All UI icons and brushes are pre-generated PNG files in `img/`
- **Audio assets**: Sounds in both `snd/` (WAV) and `sndmp3/` (MP3) for browser compatibility
- **Single HTML file**: `index.html` bootstraps the entire application

## Development Patterns

### Adding New Tools
1. Create tool file in `js/tools/` following the three-method pattern
2. Add submenu definition in `js/submenus/` if needed
3. Add associated sounds in `js/sounds/sounds.js`
4. Update HTML toolbar in `index.html` with tool button
5. Rebuild with `./build.sh`

### Adding New Brushes/Textures
1. Create generator function in respective directory
2. Return canvas element or pattern for use by tools
3. Follow naming convention: `KiddoPaint.Brushes.BrushName` or `KiddoPaint.Textures.TextureName`

### Canvas Operations
Always use `KiddoPaint.Display` methods for canvas operations to maintain proper layer management and undo functionality.