# Sub-Issue 3: Document Modifier Key Behaviors

**Type:** Documentation / Research
**Labels:** `documentation`, `enhancement`, `research`
**Parent Issue:** Add Keyboard Shortcuts Feature

---

## Description

Research and document how SHIFT, ALT/OPTION, CMD, and CTRL modifier keys affect each tool. Some documentation already exists for CMD and CTRL keys (see prompts-TODO/backlog.txt), but SHIFT and ALT need investigation.

## Acceptance Criteria

- [ ] Document SHIFT key behavior for each tool
- [ ] Document ALT/OPTION key behavior for each tool
- [ ] Verify existing CMD key documentation is accurate
- [ ] Verify existing CTRL key documentation is accurate
- [ ] Create comprehensive reference document (markdown file)
- [ ] Document should be suitable for display in help popup
- [ ] Include brief descriptions (1 line) and detailed descriptions (multiple lines)
- [ ] Organize by modifier key, then by tool
- [ ] Include code references (file:line) for each behavior

## Deliverable

Create a new file: `doc/keyboard-shortcuts-reference.md`

### Structure
```markdown
# KidPix Keyboard Shortcuts Reference

## Single-Key Shortcuts
[List from backlog.txt]

## Modifier Keys

### SHIFT Key
[Organized by tool]

### CTRL Key (Control)
[Verified and expanded from backlog.txt]

### CMD Key (Command / Meta on macOS)
[Verified and expanded from backlog.txt]

### ALT Key (Option on macOS)
[Research and document]
```

## Existing Documentation (from backlog.txt)

### Command Key (CMD) on macOS

Main Uses:
1. Secret stickers: Shows stickers submenu when Cmd+clicking Rubber Stamps
2. Scroll wheel range: Command+scroll adjusts modifiedCtrlRange (-100 to +100)

Drawing Effects:
3. Pentagon brush: Uses different pentagon vs. sine wave pattern
4. Sprite placer: 3x size multiplier when placing sprites
5. Square tool: Disables stroke outline (fill only)
6. Circle tool: Disables stroke outline (fill only)
7. Astroid tool: Alternating colors between current and alt color
8. 3D tool: Changes texture to speckles
9. Texture (Stripes): Changes stripe pattern dimensions
10. Whole canvas dither effect: Uses Bayer dithering with threshold
11. Cut/Truck tool: Uses command range for size scaling
12. Stamp tool: Uses command range for hue shifting

### Control Key (CTRL)

Brush Effects:
- Pies brush: Adds stroke outline
- Circles brush: Changes to random circles
- Connect-the-dots & Twirly brushes: Uses cycling colors instead of current color
- Pentagon brush: Uses cycling colors
- Following Sine brush: Uses cycling colors
- Triangles brush: Changes triangle type
- Animal tracks brush: Changes from paw prints (🐾) to footprints (👣)
- Spray brush: Adds transparency/alpha effects

Drawing Tools:
- Pencil Rainbow texture: Activates full rainbow mode
- Circle tool: Creates perfect circles from center point (vs. ellipses from corner)
- Astroid tool: Uses random colors for stroke
- Scribble tool: Increases jitter from 10 to 25

Advanced Tools:
- Stamp tool: Modifier for stamp behavior
- Sprite placer: Modifier for sprite placement
- Cut/Truck tool: Disables preview mode, goes straight to cutting
- TNT tool: Hidden feature to block completion
- Shadow boxes mixer: Uses random colors for shadows
- Dither effect: Changes to Atkinson dithering
- Guilloche tool: Enables fill rectangles
- 3D tool: Changes texture to sand
- Looper tool: Uses random colors instead of current color

## Research Tasks

### 1. Find SHIFT Key Usage
Search codebase for patterns:
```bash
grep -r "shiftKey" js/
grep -r "ev.shift" js/
grep -r "e.shift" js/
```

Expected locations:
- `js/tools/*.js` - Tool implementations
- `js/brushes/*.js` - Brush generators
- `js/init/kiddopaint.js` - Main event handlers

### 2. Find ALT Key Usage
Search codebase for patterns:
```bash
grep -r "altKey" js/
grep -r "ev.alt" js/
grep -r "e.alt" js/
```

### 3. Verify CMD/CTRL Documentation
For each item listed above:
- Find code location
- Verify behavior matches description
- Add file:line reference
- Test manually to confirm

### 4. Test Each Tool
Systematic testing approach:
1. Select tool
2. Try each modifier key (SHIFT, CTRL, CMD, ALT)
3. Try combinations (SHIFT+CTRL, etc.)
4. Document observed behavior
5. Find corresponding code

### Example Test Matrix Template
```
Tool: Circle
- No modifier: Draw ellipse from corner to corner
- SHIFT: Draw square (equal width/height)
- CTRL: Draw from center point
- CMD: Fill only (no stroke)
- ALT: [to be researched]
- SHIFT+CTRL: [to be researched]
Code: js/tools/shapes.js:XXX
```

## Documentation Format

### Brief Format (for Help Popup)
```markdown
## SHIFT Key
- **Most tools**: Enlarge effect or brush size
- **Circle/Square**: Constrain to equal dimensions
- **Line**: Snap to 45-degree angles (if implemented)
```

### Detailed Format (for Reference Doc)
```markdown
## SHIFT Key

### Overview
The SHIFT key is commonly used across tools to enlarge effects, constrain proportions, or snap to grids.

### Tool-Specific Behaviors

#### Circle Tool
**File**: `js/tools/shapes.js:125`
**Behavior**: Constrains circle to be a perfect square (equal width and height)
**Code Pattern**:
\`\`\`javascript
if (ev.shiftKey) {
  // Make width and height equal
}
\`\`\`

#### Pencil Tool
**File**: `js/tools/pencil.js:78`
**Behavior**: Increases brush size by 2x
**Code Pattern**:
\`\`\`javascript
var size = baseSize * (ev.shiftKey ? 2 : 1);
\`\`\`
```

## Tools to Document

### Drawing Tools
- [ ] Pencil
- [ ] Line
- [ ] Rectangle / Square
- [ ] Circle / Ellipse
- [ ] Paint Bucket
- [ ] Eraser

### Brush Tools
- [ ] All brushes in `js/brushes/`

### Special Effects
- [ ] Mixer
- [ ] Eraser (special effects mode)
- [ ] Moving Van / Cut tool
- [ ] Electric Mixer
- [ ] Firecracker / TNT
- [ ] Rubber Stamps
- [ ] Spray Can

### Advanced Tools
- [ ] Wacky Brush
- [ ] Stamp tool
- [ ] All textures
- [ ] All builders

## Code Patterns to Look For

```javascript
// Pattern 1: Direct check
if (ev.shiftKey) { ... }
if (ev.altKey) { ... }
if (ev.ctrlKey) { ... }
if (ev.metaKey) { ... }

// Pattern 2: Via globals
if (shiftKey) { ... }
if (modifiedCtrl) { ... }  // May be CMD or CTRL depending on OS

// Pattern 3: In expressions
var multiplier = ev.shiftKey ? 2 : 1;
```

## Platform Differences to Note

- **macOS**: CMD key (metaKey) is primary, CTRL has different meaning
- **Windows/Linux**: CTRL key is primary
- Code may use `modifiedCtrl` variable to handle both platforms

## Deliverable Checklist

- [ ] Created `doc/keyboard-shortcuts-reference.md`
- [ ] All 4 modifier keys documented (SHIFT, CTRL, CMD, ALT)
- [ ] All tools researched and documented
- [ ] Code references added (file:line)
- [ ] Verified existing documentation from backlog.txt
- [ ] Brief version suitable for help popup
- [ ] Detailed version for reference
- [ ] Tested at least 5 tools manually to verify accuracy

## Dependencies

### Blocks
- Sub-issue 2 (help popup) - needs this documentation for complete content

### Blocked By
- None - can be completed independently

## Time Estimate

- Research: 3-4 hours (systematic testing of all tools)
- Documentation writing: 2-3 hours
- Verification: 1-2 hours
- **Total**: ~6-9 hours

## Notes

- Some modifier key combos may have no effect (document as "no effect")
- Some behaviors may be platform-specific (macOS vs Windows/Linux)
- Hidden/easter egg features should be documented too (like secret stickers)
- Consider creating visual reference (screenshots or diagrams) as future enhancement
