# MkDocs Structure and Configuration

Technical overview of the MkDocs documentation system setup for KidPix.

## Overview

The KidPix documentation uses [MkDocs](https://www.mkdocs.org/) to generate a static website from Markdown files. The setup includes automatic deployment via GitHub Actions and follows a clean, organized structure.

## Configuration File: `mkdocs.yml`

The main configuration file defines the site structure, theme, and build settings:

```yaml
site_name: KidPix Documentation
site_description: Documentation for the KidPix drawing application
site_author: KidPix Project
site_url: https://justinpearson.github.io/kidpix

repo_name: justinpearson/kidpix
repo_url: https://github.com/justinpearson/kidpix

docs_dir: doc # Source directory for documentation
site_dir: site # Output directory for built site

nav: # Left navigation structure
  - Home: index.md
  - User Guide:
      - Quick Start: user/quick-start.md
    # ... more pages
  - Maintainer Guide:
      - Quick Start: maintainer/quick-start.md
    # ... more pages

markdown_extensions: # Markdown processing features
  - toc:
      permalink: true # Add permanent links to headings
```

### Key Configuration Sections

**Site Metadata**

- `site_name`: Appears in browser title and header
- `site_description`: Used for SEO and social sharing
- `site_url`: Canonical URL for the documentation site
- `repo_url`: Links to GitHub repository

**Directory Structure**

- `docs_dir: doc`: Source files are in the `doc/` directory
- `site_dir: site`: Built site goes in `site/` directory (gitignored)

**Navigation**

- Defines the left sidebar navigation structure
- Maps display names to file paths
- Supports nested sections and hierarchical organization
- Must be manually maintained when adding new pages

**Markdown Extensions**

- `toc`: Generates table of contents for right sidebar
- `permalink: true`: Adds anchor links to headings

## Theme and Styling

Currently using the default MkDocs theme, which provides:

- **Left Navigation**: Collapsible sections following the `nav:` structure
- **Right Table of Contents**: Auto-generated from page headings
- **Search**: Built-in search functionality
- **Responsive Design**: Works on desktop and mobile
- **Clean Typography**: Readable fonts and spacing

### Theme Customization Options

The setup can be enhanced with themes like Material for MkDocs:

```yaml
theme:
  name: material
  features:
    - navigation.sections
    - navigation.expand
    - toc.follow
    - search.highlight
```

Benefits would include:

- Enhanced visual design
- Better mobile experience
- Advanced navigation features
- Color customization
- Dark mode support

## Build System

### Local Development

```bash
# Install MkDocs (if not already installed)
pip install mkdocs

# Start development server
mkdocs serve
# or: yarn docs:dev

# Access at: http://127.0.0.1:8000/kidpix/
```

Features during development:

- **Auto-reload**: Changes to markdown files trigger browser refresh
- **Link validation**: Warns about broken internal links
- **Live preview**: See changes immediately

### Production Build

```bash
# Build static site
mkdocs build
# or: yarn docs:build

# Output goes to site/ directory
# Contains all HTML, CSS, JS, and assets
```

Build process:

1. **Parse configuration** (`mkdocs.yml`)
2. **Process markdown files** with extensions
3. **Generate navigation** structure
4. **Apply theme** and styling
5. **Create static HTML** files
6. **Copy assets** and generate search index

## GitHub Actions Deployment

### Workflow File: `.github/workflows/docs.yml`

```yaml
name: Deploy MkDocs Documentation

on:
  push:
    branches: [main]
    paths: # Only run when docs change
      - "doc/**"
      - "mkdocs.yml"
      - ".github/workflows/docs.yml"

permissions:
  contents: read
  pages: write # Required for GitHub Pages
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.x"

      - name: Install MkDocs
        run: pip install mkdocs

      - name: Build documentation
        run: mkdocs build --strict # Fail on warnings

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: site/

  deploy:
    if: github.ref == 'refs/heads/main'
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Deployment Process

1. **Trigger**: Push to main branch with doc changes
2. **Build Job**:
   - Install Python and MkDocs
   - Run `mkdocs build --strict` (fails on warnings)
   - Upload built site as artifact
3. **Deploy Job**:
   - Deploy artifact to GitHub Pages
   - Update live site at `https://justinpearson.github.io/kidpix/`

### GitHub Pages Configuration

Repository Settings → Pages:

- **Source**: GitHub Actions (not legacy branch-based)
- **Custom domain**: Optional
- **HTTPS**: Enforced by default

## File Structure

```
├── doc/                          # Documentation source
│   ├── index.md                  # Homepage
│   ├── user/                     # User documentation
│   │   ├── quick-start.md
│   │   └── how-to/
│   │       └── *.md
│   └── maintainer/               # Developer documentation
│       ├── quick-start.md
│       ├── how-to/
│       │   └── *.md
│       └── explanations/
│           └── *.md
├── mkdocs.yml                    # Main configuration
├── .github/workflows/docs.yml    # Deployment automation
└── site/                         # Built site (gitignored)
    ├── index.html
    ├── user/
    └── assets/
```

## Best Practices

### Content Organization

- **Separate user and maintainer docs** - Different audiences
- **Use descriptive filenames** - They become URLs
- **Organize by type** - how-to, explanations, reference
- **Cross-link related content** - Help users navigate

### Technical Maintenance

- **Keep navigation updated** - Add new pages to `mkdocs.yml`
- **Fix link warnings** - MkDocs validates internal links
- **Test builds locally** - Catch issues before deployment
- **Monitor GitHub Actions** - Ensure deployments succeed

### Performance Considerations

- **Minimize large files** - Keep images reasonably sized
- **Use relative links** - Better for local development
- **Organize assets** - Keep images with related documentation

## Extending the Setup

### Advanced Features

Potential enhancements:

- **Material theme** for better visual design
- **Search plugins** for enhanced search capabilities
- **PDF generation** for offline documentation
- **Internationalization** for multiple languages
- **Custom CSS/JS** for branding and functionality

### Integration Options

- **API documentation** generation from code comments
- **Changelog** automation from git history
- **Code examples** testing and validation
- **Analytics** integration for usage tracking

## Troubleshooting

### Common Build Issues

**"unrecognized relative link"**

- Check file paths in markdown links
- Ensure linked files exist
- Use relative paths from current file

**Navigation not updating**

- Verify `nav:` section in `mkdocs.yml`
- Restart development server
- Check file paths match navigation entries

**GitHub Actions failing**

- Check workflow status in Actions tab
- Verify MkDocs dependencies
- Review build logs for specific errors

### Performance Issues

**Slow builds**

- Minimize large image files
- Reduce number of markdown extensions
- Check for recursive link structures

**Memory issues**

- Consider splitting very large documents
- Optimize image sizes and formats
- Review markdown processing complexity
