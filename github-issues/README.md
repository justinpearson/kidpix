# GitHub Issues for KidPix

This directory contains markdown templates for creating GitHub issues.

## Current Issues Ready to Create

### Keyboard Shortcuts Feature (Feature 3 from backlog.txt)

This feature is split into 1 parent issue and 3 sub-issues:

1. **Parent Issue**: `parent-keyboard-shortcuts-feature.md`
   - Overview of the entire keyboard shortcuts feature
   - Links to 3 sub-issues

2. **Sub-Issue 1**: `sub1-enable-disable-setting.md`
   - Implement enable/disable toggle for keyboard shortcuts
   - Store setting in localStorage

3. **Sub-Issue 2**: `sub2-help-popup.md`
   - Create help popup triggered by '?' key
   - Display all available shortcuts

4. **Sub-Issue 3**: `sub3-document-modifier-keys.md`
   - Research and document SHIFT, ALT, CTRL, CMD key behaviors
   - Create comprehensive reference documentation

## How to Create Issues on GitHub

### Option 1: Manual Creation (GitHub Web UI)

1. Go to https://github.com/justinpearson/kidpix/issues/new
2. Copy content from the markdown files
3. Create issues in this order:
   - First: Create the parent issue
   - Note the issue number (e.g., #42)
   - Then: Create the 3 sub-issues
   - Update cross-references in each issue:
     - In sub-issues: Replace `[PARENT-ISSUE]` with actual number (e.g., #42)
     - In parent issue: Replace `[SUB-ISSUE-1]`, etc. with actual numbers

### Option 2: GitHub CLI (Automated)

```bash
# Create parent issue
gh issue create \
  --title "Add keyboard shortcuts with enable/disable setting and help popup" \
  --label "enhancement,user-experience,accessibility" \
  --body-file github-issues/parent-keyboard-shortcuts-feature.md

# Note the issue number, then create sub-issues
gh issue create \
  --title "Add enable/disable setting for keyboard shortcuts" \
  --label "enhancement,user-experience" \
  --body-file github-issues/sub1-enable-disable-setting.md

gh issue create \
  --title "Create keyboard shortcuts help popup (? key)" \
  --label "enhancement,documentation,ui" \
  --body-file github-issues/sub2-help-popup.md

gh issue create \
  --title "Document modifier key behaviors for all tools" \
  --label "documentation,enhancement,research" \
  --body-file github-issues/sub3-document-modifier-keys.md
```

After creating, update cross-references manually or with:
```bash
# Edit issues to add proper cross-references
gh issue edit <number> --body "updated content with proper issue numbers"
```

## Labels to Create (if not already present)

Ensure these labels exist in your repository:
- `enhancement`
- `user-experience`
- `accessibility`
- `documentation`
- `ui`
- `research`

Create labels via GitHub UI or CLI:
```bash
gh label create "user-experience" --color "0366d6" --description "Improvements to user experience"
gh label create "research" --color "fbca04" --description "Research and investigation needed"
```

## After Creating Issues

Once all issues are created on GitHub:
1. Update cross-references between issues (replace placeholders with actual #numbers)
2. Consider moving `prompts-TODO/backlog.txt` Feature 3 content to `prompts-DONE/` (or archive it)
3. Track progress using GitHub's Projects feature (optional)
4. Link issues to pull requests when implementing

## File Manifest

- `README.md` - This file
- `parent-keyboard-shortcuts-feature.md` - Parent issue for keyboard shortcuts feature
- `sub1-enable-disable-setting.md` - Sub-issue: Enable/disable setting
- `sub2-help-popup.md` - Sub-issue: Help popup UI
- `sub3-document-modifier-keys.md` - Sub-issue: Modifier key documentation
