# Quick Start - Kid Pix Maintainer Guide

## Prerequisites

Before you begin, make sure you understand what Kid Pix is by reading the [user quick-start guide](../user/quick-start.md).

## Development Environment Setup

### 1. Get the Code
```bash
git clone https://github.com/vikrum/kidpix.git
cd kidpix
```

### 2. Install Dependencies
```bash
npm install
```

This installs:
- `uglify-es` - JavaScript minification and concatenation
- `js-beautify` - Code formatting

### 3. Set Up Local Development
```bash
# Start a local web server (choose one)
python -m http.server 8000          # Python 3
python -m SimpleHTTPServer 8000     # Python 2  
npx http-server                      # Node.js
php -S localhost:8000                # PHP

# Open in browser
open http://localhost:8000
```

### 4. Make Your First Build
```bash
./build.sh
```

This script:
- Formats all JavaScript and CSS files
- Concatenates JavaScript modules into `js/app.js`
- Processes files in dependency order: init → util → tools → textures → submenus → brushes → builders → stamps → sounds

## Development Workflow

### Code Organization
- **Source files**: Individual modules in `js/` subdirectories
- **Built file**: Combined into `js/app.js` for production
- **Never edit**: `js/app.js` directly (it gets overwritten)

### Making Changes
1. Edit individual source files in appropriate `js/` subdirectories
2. Run `./build.sh` to regenerate `js/app.js`
3. Refresh browser to see changes
4. Test thoroughly before committing

### File Structure
```
js/
├── init/          # Application initialization
├── util/          # Core utilities (display, colors, caching)
├── tools/         # Drawing tools (pencil, brush, eraser, etc.)
├── textures/      # Fill pattern generators
├── submenus/      # UI submenu definitions
├── brushes/       # Brush pattern generators  
├── builders/      # Shape construction tools
├── stamps/        # Stamp/sprite systems
└── sounds/        # Audio system
```

## Testing Your Changes

### Browser Testing
- Test in Chrome, Firefox, Safari, and Edge
- Test on both desktop and mobile devices
- Verify audio works (many browsers require user interaction first)

### Canvas Testing
- Draw with various tools and verify output
- Test saving functionality
- Check that undo works properly
- Verify modifier keys (Shift, Alt, Ctrl, Cmd) work as expected

### Performance Testing
- Large drawings should remain responsive
- No memory leaks during extended use
- Smooth animation for animated brushes

## Next Steps

- Read the [maintainer how-to guides](how-to/) for specific development tasks
- Review the [architecture explanations](explanations/) for deeper understanding
- Check the [maintainer how-to guide for adding new tools](how-to/add-new-tool.md)