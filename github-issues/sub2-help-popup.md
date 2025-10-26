# Sub-Issue 2: Create Keyboard Shortcuts Help Popup

**Type:** Enhancement
**Labels:** `enhancement`, `documentation`, `ui`
**Parent Issue:** Add Keyboard Shortcuts Feature

---

## Description

Create a popup window that displays available keyboard shortcuts when the user types '?', similar to Gmail, GitHub, and other modern web apps.

## Acceptance Criteria

- [ ] Pressing '?' key opens a help popup showing all keyboard shortcuts
- [ ] Popup displays single-key shortcuts (`n`, `c`, `r`, `s`, `v`)
- [ ] Popup displays modifier keys (SHIFT, CMD/CTRL, ALT, META) with brief descriptions
- [ ] Popup can be dismissed by:
  - Clicking outside the popup
  - Pressing ESC key
  - Pressing '?' again (toggle)
  - Clicking a close button (×)
- [ ] Popup only appears when keyboard shortcuts are enabled
- [ ] If shortcuts are disabled, show message: "Keyboard shortcuts are disabled. Enable them in Settings."
- [ ] Styling matches KidPix aesthetic (retro, colorful, fun)
- [ ] Popup is centered on screen
- [ ] Popup has semi-transparent backdrop
- [ ] Popup is keyboard-accessible (ESC to close, tab navigation)
- [ ] Popup is responsive (works on different screen sizes)

## Content to Display

### Single-Key Shortcuts Section
```
Keyboard Shortcuts
==================

n    Cycle to next color
c    Cycle to next color palette
r    Randomize colors
s    Save drawing to file
v    Toggle velocity state
?    Show/hide this help

```

### Modifier Keys Section
```
Modifier Keys
=============

Hold these keys while using tools for special effects:

SHIFT     Enlarge effect, snap to grid, or constrain proportions
CMD/CTRL  Special effects and alternative behaviors
ALT       Additional variations
META      Advanced features

See full modifier key documentation for details on each tool.
```

## UI/UX Design

### Layout
```
┌─────────────────────────────────────┐
│  Keyboard Shortcuts Help        [×] │
├─────────────────────────────────────┤
│                                     │
│  n    Cycle to next color           │
│  c    Cycle to next color palette   │
│  r    Randomize colors              │
│  s    Save drawing to file          │
│  v    Toggle velocity state         │
│  ?    Show/hide this help           │
│                                     │
│  Modifier Keys                      │
│  ──────────────                     │
│  SHIFT      Enlarge/constrain       │
│  CMD/CTRL   Special effects         │
│  ALT        Variations              │
│                                     │
└─────────────────────────────────────┘
```

### Styling Suggestions
- Background: White or light color with KidPix-style border
- Border: Chunky, possibly with fun pattern or color
- Font: Monospace for key names, regular for descriptions
- Colors: Match KidPix color palette
- Key badges: Display keys in rounded rectangles or "key cap" style
- Animation: Gentle fade-in/fade-out (150-200ms)
- Shadow: Subtle drop shadow for depth

## Technical Implementation

### HTML Structure
```html
<div id="keyboard-shortcuts-popup" class="modal-overlay" style="display: none;">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Keyboard Shortcuts</h2>
      <button class="close-btn" aria-label="Close">&times;</button>
    </div>
    <div class="modal-body">
      <section class="shortcuts-section">
        <h3>Single-Key Shortcuts</h3>
        <dl class="shortcuts-list">
          <dt><kbd>n</kbd></dt>
          <dd>Cycle to next color</dd>
          <!-- etc -->
        </dl>
      </section>
      <section class="modifiers-section">
        <h3>Modifier Keys</h3>
        <dl class="shortcuts-list">
          <dt><kbd>SHIFT</kbd></dt>
          <dd>Enlarge effect or constrain proportions</dd>
          <!-- etc -->
        </dl>
      </section>
    </div>
  </div>
</div>
```

### JavaScript Logic
```javascript
// In js/init/kiddopaint.js or separate js/utils/keyboard-help.js

KiddoPaint.KeyboardHelp = {
  popup: null,

  init: function() {
    // Create popup HTML and append to body
    // Attach event listeners
  },

  show: function() {
    if (!KiddoPaint.Settings.isKeyboardShortcutsEnabled()) {
      this.showDisabledMessage();
      return;
    }
    this.popup.style.display = 'flex';
  },

  hide: function() {
    this.popup.style.display = 'none';
  },

  toggle: function() {
    if (this.popup.style.display === 'none') {
      this.show();
    } else {
      this.hide();
    }
  },

  showDisabledMessage: function() {
    // Show temporary message that shortcuts are disabled
  }
};

// In checkKey function, add:
if (e.keyCode === 191 && e.shiftKey) { // '?' key
  e.preventDefault();
  KiddoPaint.KeyboardHelp.toggle();
}
```

### CSS Styling
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  border: 4px solid #000;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

kbd {
  display: inline-block;
  padding: 3px 8px;
  background: #f4f4f4;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: monospace;
  font-weight: bold;
  min-width: 24px;
  text-align: center;
}

.shortcuts-list dt {
  float: left;
  clear: left;
  width: 80px;
}

.shortcuts-list dd {
  margin-left: 100px;
  margin-bottom: 8px;
}
```

## Testing Plan

### Manual Testing
1. Enable keyboard shortcuts
2. Press '?' → popup appears
3. Press ESC → popup closes
4. Press '?' again → popup appears
5. Click outside popup → popup closes
6. Press '?' with shortcuts disabled → see disabled message
7. Test on different screen sizes
8. Test keyboard navigation (tab through elements)

### Browser Testing
- Chrome/Edge (Chromium)
- Firefox
- Safari (if applicable)

## Dependencies

### Blocks
- None

### Blocked By
- Sub-issue 3 (modifier key documentation) - recommended but not strictly required
  - Can launch with abbreviated modifier key info
  - Update with detailed info once documentation is complete

### Related
- Sub-issue 1 (enable/disable setting) - popup should check this setting

## Files to Create/Modify

- `js/utils/keyboard-help.js` - New file for popup logic
- `css/keyboard-help.css` - New file for popup styles (or add to `css/kidpix.css`)
- `index.html` - Add popup HTML structure
- `js/init/kiddopaint.js` - Add '?' key handler in `checkKey` function

## Accessibility Considerations

- Popup must be keyboard-navigable
- ESC key should close popup
- Focus trap (tab cycles through popup elements only when open)
- ARIA labels for screen readers
- High contrast for readability
- Consider adding to keyboard shortcuts: `ESC - Close this popup`

## Future Enhancements (Out of Scope)

- Link to full documentation page
- Search/filter shortcuts
- Printable version
- Customizable shortcuts
- Show shortcuts relevant to current tool only
