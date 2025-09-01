# Quick Start - Kid Pix User Guide

## Table of Contents

- [What is Kid Pix?](#what-is-kid-pix)
- [Getting Started](#getting-started)
  - [Using Kid Pix Online](#using-kid-pix-online)
  - [Using Kid Pix Locally](#using-kid-pix-locally)
- [Basic Drawing](#basic-drawing)
- [Exploring Tools](#exploring-tools)
- [Sound and Audio](#sound-and-audio)
- [Saving Your Work](#saving-your-work)
- [Tips for Fun](#tips-for-fun)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## TODO

- simplify quick-start, and make a more comprehensive User Manual to base e2e tests on

## What is Kid Pix?

Kid Pix is a fun digital painting program from 1989. Due to version 1.0 being generously released to the public domain, it was re-implemented in 2021 in HTML / Javascript by GitHub user vikrum, [here](https://github.com/vikrum/kidpix/) and hosted at <https://kidpix.app>, under the name "JS Kid Pix". I forked this version to make minor customizations for my kids, and also to practice software development

1.0 was released in Nov 1989 into the _(Q: what to call my version of it?)_ is a playful digital painting program that recreates the magic of the classic 1989 Kid Pix software. It's designed for creative expression with whimsical tools, sound effects, and delightful surprises. Whether you're 8 or 80, Kid Pix encourages experimentation and fun over precision.

## Getting Started

The current repo (https://github.com/justinpearson/kidpix) is deployed via Github Pages here:

- Main app: https://justinpearson.github.io/kidpix/app.html
- Documentation: https://justinpearson.github.io/kidpix/docs.html

This project is a fork of Vikrum's Javascript re-implementation of the original 1989 KidPix 1.0, which he hosts at https://kidpix.app .

### Using Kid Pix Locally

1. Download or clone this repository
2. Install dependencies and start the development server:

```bash
yarn install
yarn dev
```

3. Open your browser and go to `http://localhost:5173`
4. Kid Pix will load and you can start creating!

_Note: You need a web server, not just open index.html in a browser, because the app loads JavaScript modules and audio files that browsers block when opening files directly._

## Tools

The main toolbar on the left contains these essential tools:

- ![Save](assets/kp-m_27.png) **Save** - Download your artwork
- ![Pencil](assets/kp-m_28.png) **Pencil** - Draw lines with various pencil sizes
- ![Line](assets/kp-m_29.png) **Line** - Draw straight lines
- ![Rectangle](assets/kp-m_30.png) **Rectangle** - Draw rectangles and squares
- ![Circle](assets/kp-m_31.png) **Circle** - Draw circles and ovals
- ![Brush](assets/kp-m_32.png) **Brush** - Access dozens of creative brushes
- ![Mixer](assets/kp-m_33.png) **Mixer** - Apply wild visual effects
- ![Paint Can](assets/kp-m_34.png) **Paint Can** - Fill areas with color or patterns
- ![Eraser](assets/kp-m_35.png) **Eraser** - Remove parts of your drawing (with fun effects!)
- ![Text](assets/kp-m_36.png) **Text** - Add letters and numbers with sounds
- ![Stamp](assets/kp-m_37.png) **Stamp** - Place pre-made graphics
- ![Truck](assets/kp-m_38.png) **Truck** - Move parts of your drawing around
- ![Undo](assets/kp-m_39.png) **Undo** - Undo your last actions (up to 30 steps)
- ![Redo](assets/kp-m_40.png) **Redo** - Redo your last undone actions

Click a tool to select it; the currently-selected tool is outlined in red (except for Save, Undo, and Redo, which are not "real" tools, in that they perform a single action when clicked, and cannot be selected).

Of the "real" tools (not Save, Undo, or Redo), clicking a tool selects it, and loads its subtools into the subtool bar across the top of the screen. For example, clicking the Pencil reveals subtools for "thickness" and "pattern". Different tools have different subtools. The currently-selected subtool(s) are indicated via a red outline.

For convenience,

## Colors

- Large colored square in the upper-left is the currently-selected color.
- The smaller colored squares are a _color palette_.
- The arrows **← →** change to different color palettes (8 in total).

## Pro Tips

- **Hold Shift** while using most tools to make them bigger.
- **Try modifier keys** (Alt, Ctrl, Cmd) with tools for hidden features.
- **Listen for sounds** - each tool has delightful audio feedback.
- **Experiment freely** - there's no wrong way to use Kid Pix!
