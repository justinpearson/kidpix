# Troubleshooting Guide

## Table of Contents

- [Development Environment Issues](#development-environment-issues)
  - [Node.js/Yarn Issues](#nodejsyarn-issues)
  - [TypeScript Compilation Issues](#typescript-compilation-issues)
  - [Vite Development Server Issues](#vite-development-server-issues)
- [Testing Issues](#testing-issues)
  - [Vitest Problems](#vitest-problems)
  - [Playwright Issues](#playwright-issues)
- [Linting and Formatting Issues](#linting-and-formatting-issues)
  - [ESLint Problems](#eslint-problems)
  - [Prettier Conflicts](#prettier-conflicts)
- [Git and Deployment Issues](#git-and-deployment-issues)
  - [Commit Message Problems](#commit-message-problems)
  - [GitHub Actions Issues](#github-actions-issues)
- [Canvas and Drawing Issues](#canvas-and-drawing-issues)
  - [Canvas Rendering Problems](#canvas-rendering-problems)
- [Audio Issues](#audio-issues)
- [Getting Help](#getting-help)
  - [Debug Information to Collect](#debug-information-to-collect)
  - [Useful Resources](#useful-resources)

## Development Environment Issues

### Node.js/Yarn Issues

**Problem: `yarn install` fails with permission errors**

```bash
# Solution: Use node version manager (recommended)
# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or use Homebrew (macOS)
brew install node@18
brew link node@18
```

**Problem: Different Node.js versions between developers**

```bash
# Create .nvmrc file (already exists)
echo "18" > .nvmrc

# Use in project
nvm use  # automatically picks up .nvmrc
```

**Problem: Yarn lockfile conflicts**

```bash
# Delete and reinstall (last resort)
rm yarn.lock node_modules -rf
yarn install

# Or resolve specific conflicts
yarn install --check-files
```

### TypeScript Compilation Issues

**Problem: TypeScript errors in IDE but not in terminal**

```bash
# Restart TypeScript service in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"

# Or check TypeScript version mismatch
yarn tsc --version
# Should match version in package.json
```

**Problem: Cannot find module errors**

```bash
# Check if path mapping is correct in tsconfig
# Verify include/exclude patterns
# Clear TypeScript cache
rm -rf node_modules/.cache
```

**Problem: Build passes but types are wrong at runtime**

```bash
# Enable strict mode checks
yarn tsc --noEmit --strict

# Add type assertions where needed
const element = document.getElementById('canvas') as HTMLCanvasElement;
```

### Vite Development Server Issues

**Problem: Dev server won't start on port 5173**

```bash
# Check what's using the port
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or use different port
yarn dev --port 3000
```

**Problem: Hot reload not working**

```bash
# Check file watcher limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Restart dev server
yarn dev
```

**Problem: Import errors with absolute paths**

```bash
# Check vite.config.ts for alias configuration
# Ensure TypeScript paths match Vite paths
```

## Testing Issues

### Vitest Problems

**Problem: Tests pass locally but fail in CI**

```bash
# Check for timezone differences
export TZ=UTC
yarn test

# Check for file path case sensitivity
# Ensure all imports match exact file names

# Check for missing environment variables
# Add to GitHub Actions if needed
```

**Problem: Jest-DOM matchers not working**

```bash
# Verify test setup file is loaded
# Check vitest.config.ts setupFiles

# Manually import in test file
import '@testing-library/jest-dom';
```

**Problem: Canvas tests fail with jsdom**

```bash
# jsdom has limited canvas support
# Use happy-dom for better canvas support
yarn add --dev happy-dom

# Update vitest.config.ts
environment: 'happy-dom'
```

### Playwright Issues

**Problem: Browser downloads fail**

```bash
# Install browsers manually
yarn playwright install

# With dependencies (Linux)
yarn playwright install --with-deps

# Check browser installation
yarn playwright install --dry-run
```

**Problem: Tests fail in headless mode but pass in headed**

```bash
# Run with headed mode for debugging
yarn playwright test --headed

# Add delays for timing issues
await page.waitForTimeout(1000);

# Use more specific selectors
await page.waitForSelector('[data-testid="canvas"]');
```

**Problem: File upload tests fail**

```bash
# Use setInputFiles for file inputs
await page.setInputFiles('input[type=file]', './test-image.png');

# Or create buffer for dynamic content
const buffer = Buffer.from('fake image data');
await page.setInputFiles('input[type=file]', {
  name: 'test.png',
  mimeType: 'image/png',
  buffer
});
```

## Linting and Formatting Issues

### ESLint Problems

**Problem: ESLint errors in config files**

```bash
# Check if files are included in TypeScript config
# Update tsconfig.node.json include array

# Or exclude from linting
# Update eslint.config.js ignores array
```

**Problem: Import/export errors**

```bash
# Check file extensions in imports
import { Component } from './Component'; // No .tsx needed

# Verify module resolution in tsconfig
"moduleResolution": "Bundler"
```

**Problem: React rules not working**

```bash
# Install React ESLint plugin
yarn add --dev eslint-plugin-react

# Update eslint.config.js
import react from 'eslint-plugin-react';
```

### Prettier Conflicts

**Problem: ESLint and Prettier fighting**

```bash
# Install prettier-eslint config
yarn add --dev eslint-config-prettier

# Add to ESLint extends (last)
extends: ['@typescript-eslint/recommended', 'prettier']
```

**Problem: Pre-commit hooks failing**

```bash
# Check what files are being processed
yarn lint-staged --debug

# Manually run commands that are failing
yarn eslint src/
yarn prettier --check .

# Skip hooks temporarily (emergency only)
git commit --no-verify
```

## Git and Deployment Issues

### Commit Message Problems

**Problem: commitlint blocking commits**

```bash
# Check commit message format
# Must follow: type(scope): description

# Valid examples:
feat: add new drawing tool
fix(canvas): resolve rendering issue
docs(readme): update setup instructions

# Invalid examples:
Fixed bug          # Missing type
feat: Fix stuff    # Inconsistent capitalization
```

**Problem: Husky hooks not running**

```bash
# Reinstall husky
yarn husky install

# Check hook permissions
ls -la .husky/
chmod +x .husky/pre-commit .husky/commit-msg

# Test hook manually
./.husky/pre-commit
```

### GitHub Actions Issues

**Problem: Deployment fails with build errors**

```bash
# Check build locally first
yarn build

# Check exact Node version in CI
# Update .github/workflows/deploy.yml node-version

# Check environment variables
# Add secrets in GitHub repo settings if needed
```

**Problem: Tests fail only in CI**

```bash
# Check browser installation in CI
# Add --with-deps flag for Playwright

# Check for different file system case sensitivity
# Ensure all imports match exact file names

# Add debug logging
console.log('Debug info:', process.env);
```

## Canvas and Drawing Issues

### Canvas Rendering Problems

**Problem: Canvas appears blank**

```bash
# Check canvas element creation
const canvas = useRef<HTMLCanvasElement>(null);

# Verify canvas context
const ctx = canvas.current?.getContext('2d');
if (!ctx) return;

# Check canvas size
canvas.width = container.clientWidth;
canvas.height = container.clientHeight;
```

**Problem: Mouse events not working**

```bash
# Check event listener attachment
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  canvas.addEventListener('mousedown', handleMouseDown);
  return () => canvas.removeEventListener('mousedown', handleMouseDown);
}, []);

# Verify coordinate calculation
const rect = canvas.getBoundingClientRect();
const x = event.clientX - rect.left;
const y = event.clientY - rect.top;
```

**Problem: Performance issues with large drawings**

```bash
# Use requestAnimationFrame for smooth rendering
useEffect(() => {
  let animationId: number;

  const animate = () => {
    // Drawing code here
    animationId = requestAnimationFrame(animate);
  };

  animate();
  return () => cancelAnimationFrame(animationId);
}, []);

# Implement canvas layers for better performance
# Use off-screen canvas for complex operations
```

## Audio Issues

**Problem: Audio won't play**

```bash
# Check browser autoplay policies
// Require user interaction first
button.addEventListener('click', () => {
  audio.play().catch(console.error);
});

# Check audio format support
const audio = new Audio();
const canPlayMp3 = audio.canPlayType('audio/mpeg');
const canPlayWav = audio.canPlayType('audio/wav');
```

**Problem: Audio files not loading**

```bash
# Check file paths in production build
# Use dynamic imports for audio files
const audioFile = await import('./sounds/click.wav');

# Or use public folder
const audio = new Audio('/sounds/click.wav');
```

## Getting Help

### Debug Information to Collect

When reporting issues, include:

```bash
# System information
node --version
yarn --version
git --version

# Project information
yarn list --depth=0  # Dependencies
git status          # Git state
git log --oneline -5 # Recent commits

# Error details
yarn build 2>&1 | tee build.log
yarn test 2>&1 | tee test.log
```

### Useful Resources

- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/) - Browser extension
- [Vite Documentation](https://vitejs.dev/) - Build tool docs
- [Vitest Documentation](https://vitest.dev/) - Testing framework
- [Playwright Documentation](https://playwright.dev/) - E2E testing
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Language reference
