# Add Keyboard Shortcuts Feature

**Type:** Feature / Enhancement
**Labels:** `enhancement`, `user-experience`, `accessibility`
**Git Branch:** `add-keyboard-shortcut-setting`

---

## Overview

Add keyboard shortcuts functionality to KidPix with user control and discoverability features. This was previously disabled in commit 4c1c60f because they were confusing to young children, but should be re-enabled behind a setting.

## Background

KidPix already has keyboard shortcut code in `function checkKey` in `js/init/kiddopaint.js`. Users should be able to:
- Enable/disable keyboard shortcuts via a setting
- View available shortcuts via a help popup (triggered by '?' key)

## Sub-tasks

This feature should be broken into 3 sub-issues:

- [ ] **Sub-issue 1:** Enable/disable keyboard shortcuts setting
- [ ] **Sub-issue 2:** Create keyboard shortcuts help popup (?)
- [ ] **Sub-issue 3:** Document modifier key behaviors

See the corresponding files in this directory for detailed specifications.

## Current Keyboard Shortcuts

The following shortcuts are implemented in `js/init/kiddopaint.js`:

- `n` - cycle to next color
- `c` - cycle to next color palette
- `r` - randomize colors
- `s` - save to file
- `v` - toggle velocity state

## Modifier Keys

Holding SHIFT/CMD/CTRL/ALT/META while clicking or dragging modifies tool behavior (e.g., stamp size/orientation). See sub-issue 3 for comprehensive documentation.

## Dependencies

May depend on "Add Settings page" feature for settings storage/UI.

## Implementation Notes

- Code location: `js/init/kiddopaint.js` - `function checkKey`
- Consider localStorage for persistence
- Ensure modifier keys work independently of keyboard shortcuts setting
- Follow existing KidPix UI patterns for consistency

## Acceptance Criteria

- [ ] All 3 sub-issues completed
- [ ] Keyboard shortcuts can be enabled/disabled
- [ ] Help popup shows all available shortcuts
- [ ] Documentation is comprehensive and accurate
- [ ] Setting persists across page reloads
- [ ] No breaking changes to existing tool behavior
