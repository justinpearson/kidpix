# Work with Documentation

Guide for maintainers on editing, building, and managing the KidPix documentation site.

## Quick Commands

```bash
# Serve docs locally for development
yarn docs:dev
# or: mkdocs serve

# Build static site
yarn docs:build
# or: mkdocs build

# View locally at: http://127.0.0.1:8000/kidpix/
```

## Documentation Structure

### File Organization

```
doc/                           # Documentation source files
├── index.md                   # Homepage
├── doc-philosophy.md          # Project philosophy
├── user/                      # User-facing documentation
│   ├── quick-start.md
│   ├── use-cases.md
│   └── how-to/
│       ├── save-your-artwork.md
│       ├── use-wacky-brushes.md
│       └── view-documentation.md
└── maintainer/                # Developer documentation
    ├── quick-start.md
    ├── how-to/
    │   ├── add-new-tool.md
    │   ├── development-tasks.md
    │   ├── troubleshooting.md
    │   └── work-with-documentation.md
    └── explanations/
        ├── architecture-overview.md
        ├── technology-decisions.md
        └── js-to-react-ts-migration/
            ├── overview.md
            └── phase-*.md

mkdocs.yml                     # MkDocs configuration
site/                          # Generated static site (gitignored)
```

### Navigation Structure

The site navigation mirrors the directory structure and is defined in `mkdocs.yml`:

- **Home** - Main landing page
- **User Guide** - Documentation for end users
- **Maintainer Guide** - Technical documentation for developers
- **Philosophy** - Project principles and approach

## Editing Documentation

### Adding New Pages

1. **Create the markdown file** in the appropriate directory:

```bash
# User documentation
touch doc/user/how-to/new-feature.md

# Maintainer documentation
touch doc/maintainer/explanations/new-concept.md
```

2. **Add to navigation** in `mkdocs.yml`:

```yaml
nav:
  - User Guide:
      - How To:
          - New Feature: user/how-to/new-feature.md
```

3. **Write content** using standard Markdown with:
   - Clear headings (`#`, `##`, `###`)
   - Code blocks with language specification
   - Internal links to other documentation pages
   - External links where helpful

### Writing Guidelines

- **Use descriptive headings** - They become the table of contents
- **Link between related pages** - Help users navigate
- **Include code examples** - Especially for technical content
- **Keep user and maintainer docs separate** - Different audiences
- **Test all links** - MkDocs will warn about broken internal links

### Markdown Features

Basic Markdown plus table of contents generation:

````markdown
# Page Title

## Section

### Subsection

- Bulleted lists
- Work great

1. Numbered lists
2. Also supported

`inline code` and:

```javascript
// Code blocks with syntax highlighting
function example() {
  return "hello world";
}
```
````

[Link to other page](../quick-start.md)
[External link](https://example.com)

````

## Building and Testing

### Local Development

```bash
# Start development server
yarn docs:dev

# Access at: http://127.0.0.1:8000/kidpix/
# Auto-reloads when files change
````

### Build Testing

```bash
# Build static site
yarn docs:build

# Check for errors:
# - Broken internal links
# - Missing pages in navigation
# - Markdown parsing issues
```

### Link Validation

MkDocs will warn about:

- Broken internal links (`[text](missing-page.md)`)
- Missing anchors (`[text](#nonexistent-section)`)
- Unrecognized relative links

Fix these warnings before committing.

## Deployment

### Automatic Deployment

Documentation deploys automatically via GitHub Actions:

1. **Push changes** to any branch
2. **GitHub Actions** runs on doc changes
3. **Builds and tests** documentation
4. **Deploys to GitHub Pages** (main branch only)
5. **Available at**: [https://justinpearson.github.io/kidpix/](https://justinpearson.github.io/kidpix/)

### Manual Deployment

If needed, you can deploy manually:

```bash
# Build the site
mkdocs build

# Deploy to GitHub Pages
mkdocs gh-deploy
```

## Configuration

See [MkDocs Structure and Configuration](../explanations/mkdocs-setup.md) for detailed information about:

- MkDocs configuration file (`mkdocs.yml`)
- Theme and styling options
- GitHub Actions workflow
- Advanced customization options

## Troubleshooting

### Common Issues

**Build fails with "unrecognized relative link"**

- Fix broken internal links in markdown files
- Use relative paths from current file location

**Navigation doesn't show new page**

- Add the page to `nav:` section in `mkdocs.yml`
- Restart development server

**Changes not visible locally**

- Check for syntax errors in markdown
- Restart `mkdocs serve` if needed
- Clear browser cache

**GitHub Pages not updating**

- Check GitHub Actions status in repository
- Verify changes are pushed to main branch
- Allow 5-10 minutes for deployment

### Getting Help

- **MkDocs Documentation**: [mkdocs.org](https://www.mkdocs.org/)
- **GitHub Actions**: Check workflow status in repository Actions tab
- **Internal Issues**: Create GitHub issue with "documentation" label
