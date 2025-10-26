# Sub-Issue 1: Enable/Disable Setting for Keyboard Shortcuts

**Type:** Enhancement
**Labels:** `enhancement`, `user-experience`
**Parent Issue:** Add Keyboard Shortcuts Feature

---

## Description

Implement a user setting to enable/disable keyboard shortcuts globally. Keyboard shortcuts are currently disabled (commit 4c1c60f) to avoid confusion for young children, but older users want this functionality.

## Acceptance Criteria

- [ ] Add setting to enable/disable keyboard shortcuts (stored in browser localStorage)
- [ ] When disabled, keyboard shortcuts do not trigger (`n`, `c`, `r`, `s`, `v` keys)
- [ ] Setting persists across page reloads
- [ ] Default state: **disabled** (maintains current behavior)
- [ ] Modifier keys (SHIFT/CMD/CTRL/ALT) should still work regardless of this setting
- [ ] No console errors or warnings

## Technical Implementation

### Code Location
- File: `js/init/kiddopaint.js`
- Function: `checkKey` (document.onkeydown handler)

### Storage Format
```javascript
// Suggested localStorage key and format
localStorage.setItem('kiddopaint.settings.keyboardShortcutsEnabled', 'true'); // or 'false'
```

### Implementation Pattern
```javascript
function checkKey(e) {
  // Check if keyboard shortcuts are enabled
  const shortcutsEnabled = localStorage.getItem('kiddopaint.settings.keyboardShortcutsEnabled') === 'true';

  if (!shortcutsEnabled) {
    return; // Exit early if shortcuts disabled
  }

  // Existing shortcut handling code...
  if (e.keyCode === 78) { // 'n' key
    // cycle to next color
  }
  // etc...
}
```

### Helper Functions
Consider adding utility functions:
```javascript
KiddoPaint.Settings = {
  isKeyboardShortcutsEnabled: function() {
    return localStorage.getItem('kiddopaint.settings.keyboardShortcutsEnabled') === 'true';
  },
  setKeyboardShortcutsEnabled: function(enabled) {
    localStorage.setItem('kiddopaint.settings.keyboardShortcutsEnabled', enabled ? 'true' : 'false');
  }
};
```

## Testing Plan

### Manual Testing
1. Start app with default state (shortcuts disabled)
2. Verify pressing 'n', 'c', 'r', 's', 'v' does nothing
3. Enable shortcuts (via console for now, or Settings page if available)
4. Verify shortcuts work
5. Reload page, verify setting persists
6. Test that modifier keys (SHIFT, CMD, etc.) still work when shortcuts are disabled

### Edge Cases
- First-time user (no localStorage value set yet)
- Invalid localStorage values (malformed data)
- Browser with localStorage disabled/unavailable

## Dependencies

### Blocks
- None - this can be implemented standalone

### Blocked By
- None - can be implemented independently

### Nice to Have
- Settings page UI to toggle this setting (separate feature)
- Without Settings page, could use:
  - Browser console: `KiddoPaint.Settings.setKeyboardShortcutsEnabled(true)`
  - Or temporary button in the UI

## Related Files

- `js/init/kiddopaint.js` - Main implementation
- `prompts-TODO/backlog.txt` - Original feature request (lines 55-127)

## Notes

- Modifier keys should **always** work (SHIFT for size, CMD for effects, etc.) even when keyboard shortcuts are disabled
- This is specifically for single-key shortcuts like 'n', 'c', 'r', 's', 'v'
- Default to disabled to maintain current child-friendly behavior
