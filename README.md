# Summary

My fork of vikrum's kidpixjs (Kid Pix 1.0 HTML/JS implementation, https://github.com/vikrum/kidpix) to react + typescript + vite.

See below for vikrum's original readme and vite's template readme.

# Quick-start (NEW)

- install
  - install brew, yarn, vite
  - git clone
- run
  - yarn dev
  - open http://localhost:5173/
- build
  - ??

# One-time Install (OLD)

Required for both playing and changing code.

Instructions for Mac.

- install npm:
    - install homebrew from https://brew.sh/
    - restart terminal
    - `brew install node` -- to get npm
- install my kidpix fork:
    - option 1: git clone https://github.com/justinpearson/kidpix.git
    - option 2: download zipfile from https://github.com/justinpearson/kidpix
        - if zipfile: you'll also be able to make code local code changes, but not push them to back to the git repo.
    - cd kidpix (or kidpix-main if used zipfile)
    - `./build.sh`
        - if error: `js-beautify.js - "No such file or directory"` - need to 'npm install' :
        - npm install
            - if error message `Run install -g npm@10.5.2`, ok to do it.
        - now should have package-lock.json.
    - now should be able to run locally, see below.

# How to Play (OLD)

(On local laptop -- no internet connection required!)

- cd into kidpix dir
- python3 -m http.server
- open localhost:8000 in browser


# How to Change Code (OLD)
- cd into kidpix dir
- change code as desired
- run ./build.sh
- HARD-REFRESH BROWSER
- important: if changed assets (like png stamp packs) may need to clear browser cache:
    - can tell if you hover over an asset in Elements inspector pane to get a preview, and you'll see it's the old one
    - chrome settings > search for cache > delete browing history & files from last hour
- should see code changes reflected!


---

# ORIGINAL README:

---

# jskidpix ✨ https://kidpix.app/
In 1989 Kid Pix 1.0 was released into the public domain and this is an HTML/JS reimplementation.

![ghsplash](https://user-images.githubusercontent.com/291215/129511916-b22bb209-4967-4a4c-9077-22e762950a1b.jpg)

### Guide
Just like the original Kid Pix, there's no guide—have fun!  Most of the tools support Shift (^) to enlarge. There are a handful of hidden tool features behind various modifier keys (⌘, ⌥, ⇧). The modifier keys can also be combined. Enjoy! :) 

### Mirrors

Please let me know if you mirror the site elsewhere and I'll add it here:
- https://kidpix.app/
- https://kidpix.neocities.org/
- https://kidpix.web.app/
- https://vikrum.github.io/kidpix/
- https://kidpix.glitch.me/

### Questions & Hints

- Leave a note if you have a question or find a bug: https://github.com/vikrum/kidpix/issues
- Check out the hints wiki to get the grownup info: https://github.com/vikrum/kidpix/wiki


---

# VITE README:

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

---