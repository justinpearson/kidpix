// Kiddo Paint Applications
// Use global KiddoPaint object initialized in main entry file

window.init_kiddo_paint = function init_kiddo_paint() {
  document.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault();
    },
    false,
  );

  const canvas = document.getElementById("kiddopaint") as HTMLCanvasElement;
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    // sets proper offset due to css canvas positioning and kiddopaint buttons
    canvas.width = canvas.width;
    canvas.height = canvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    const container = canvas.parentNode!;

    const bnimCanvas = document.createElement("canvas");
    window.bnimCanvas = bnimCanvas;
    bnimCanvas.id = "bnimCanvas";
    bnimCanvas.width = canvas.width;
    bnimCanvas.height = canvas.height;
    bnimCanvas.className = "pixelated";
    container.appendChild(bnimCanvas);
    const bnimContext = bnimCanvas.getContext("2d")!;
    window.bnimContext = bnimContext;
    bnimContext.imageSmoothingEnabled = false;
    bnimContext.clearRect(0, 0, canvas.width, canvas.height);

    const animCanvas = document.createElement("canvas");
    window.animCanvas = animCanvas;
    animCanvas.id = "animCanvas";
    animCanvas.width = canvas.width;
    animCanvas.height = canvas.height;
    animCanvas.className = "pixelated";
    container.appendChild(animCanvas);
    const animContext = animCanvas.getContext("2d")!;
    window.animContext = animContext;
    animContext.imageSmoothingEnabled = false;
    animContext.clearRect(0, 0, canvas.width, canvas.height);

    const previewCanvas = document.createElement("canvas");
    window.previewCanvas = previewCanvas;
    previewCanvas.id = "previewCanvas";
    previewCanvas.width = canvas.width;
    previewCanvas.height = canvas.height;
    previewCanvas.className = "pixelated";
    container.appendChild(previewCanvas);
    const previewContext = previewCanvas.getContext("2d")!;
    window.previewContext = previewContext;
    previewContext.imageSmoothingEnabled = false;
    previewContext.clearRect(0, 0, canvas.width, canvas.height);

    const tmpCanvas = document.createElement("canvas");
    window.tmpCanvas = tmpCanvas;
    tmpCanvas.id = "tmpCanvas";
    tmpCanvas.width = canvas.width;
    tmpCanvas.height = canvas.height;
    tmpCanvas.className = "pixelated";
    container.appendChild(tmpCanvas);
    const tmpContext = tmpCanvas.getContext("2d")!;
    window.tmpContext = tmpContext;
    tmpContext.imageSmoothingEnabled = false;
    tmpContext.clearRect(0, 0, canvas.width, canvas.height);

    KiddoPaint.Display.canvas = tmpCanvas;
    KiddoPaint.Display.context = tmpContext;
    KiddoPaint.Display.context.globalAlpha = 1.0;

    KiddoPaint.Display.previewCanvas = previewCanvas;
    KiddoPaint.Display.previewContext = previewContext;
    KiddoPaint.Display.previewContext.globalAlpha = 1.0;

    KiddoPaint.Display.bnimCanvas = bnimCanvas;
    KiddoPaint.Display.bnimContext = bnimContext;
    KiddoPaint.Display.bnimContext.globalAlpha = 1.0;

    KiddoPaint.Display.animCanvas = animCanvas;
    KiddoPaint.Display.animContext = animContext;
    KiddoPaint.Display.animContext.globalAlpha = 1.0;

    KiddoPaint.Display.main_canvas = canvas;
    KiddoPaint.Display.main_context = ctx;

    KiddoPaint.Display.loadFromLocalStorage();

    // Load undo/redo state from localStorage (persistent across page reloads)
    KiddoPaint.Display.loadUndoRedoFromLocalStorage();

    // Add beforeunload listener for lazy persistence backup
    window.addEventListener("beforeunload", function () {
      KiddoPaint.Display.saveUndoRedoToLocalStorage();
    });

    init_kiddo_defaults();
    init_listeners(tmpCanvas);
    init_tool_bar();
    init_subtool_bars();
    init_color_selector();
  }
};

function init_kiddo_defaults() {
  KiddoPaint.Current.color = KiddoPaint.Colors.currentPalette()[0];
  KiddoPaint.Current.altColor = KiddoPaint.Colors.currentPalette()[0];
  KiddoPaint.Current.terColor = KiddoPaint.Colors.currentPalette()[0];
  KiddoPaint.Current.tool = KiddoPaint.Tools.Pencil;

  // Highlight the initially selected tool
  highlightSelectedTool("pencil");

  KiddoPaint.Current.globalAlpha = 1.0;
  KiddoPaint.Current.scaling = 1;
  KiddoPaint.Display.step = 0;
  KiddoPaint.Current.modified = false;
  KiddoPaint.Current.modifiedAlt = false;
  KiddoPaint.Current.modifiedCtrl = false;
  KiddoPaint.Current.modifiedToggle = false;
  KiddoPaint.Current.modifiedMeta = false;
  KiddoPaint.Current.modifiedTilde = false;
  KiddoPaint.Current.velToggle = false;
  KiddoPaint.Text.page = 1;
  KiddoPaint.Stamps.page = 0;
  KiddoPaint.Sprite.page = 0;
  KiddoPaint.Current.multiplier = 1;
  KiddoPaint.Current.prevEv = null;
  KiddoPaint.Current.prevEvTs = Date.now();
  KiddoPaint.Current.velocity = 0;
  KiddoPaint.Current.velocityMultiplier = 1;
  window.reset_ranges();
}

window.reset_ranges = function reset_ranges() {
  KiddoPaint.Current.multiplier = 1;
  KiddoPaint.Current.modifiedRange = 0;
  KiddoPaint.Current.modifiedAltRange = 0;
  KiddoPaint.Current.modifiedCtrlRange = 0;
  KiddoPaint.Current.modifiedToggle = false;
  KiddoPaint.Current.velToggle = false;
  KiddoPaint.Current.modifiedMeta = false;
  KiddoPaint.Current.modifiedTilde = false;
};

function init_listeners(canvas: HTMLCanvasElement) {
  canvas.addEventListener("mousedown", ev_canvas);
  canvas.addEventListener("mousemove", ev_canvas);
  canvas.addEventListener("mouseup", ev_canvas);

  // Set up touch events for mobile, etc
  canvas.addEventListener(
    "touchstart",
    function (e) {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(mouseEvent);
      e.preventDefault();
    },
    false,
  );
  canvas.addEventListener(
    "touchend",
    function (e) {
      const touch = e.changedTouches[0];
      const mouseEvent = new MouseEvent("mouseup", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(mouseEvent);
      e.preventDefault();
    },
    false,
  );
  canvas.addEventListener(
    "touchmove",
    function (e) {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(mouseEvent);
      e.preventDefault();
    },
    false,
  );

  canvas.addEventListener("mouseleave", function () {
    // we force a mouse up - this fixes a bug with some effects in which a clearPrev wipes the whole canvas
    KiddoPaint.Current.tool.mouseup?.(KiddoPaint.Current.ev);
    KiddoPaint.Display.clearPreview();
    KiddoPaint.Display.clearAnim();
    KiddoPaint.Display.clearBnim();
  });
  // "mousewheel" is the legacy event name; its handler signature predates
  // the standard WheelEvent typing, hence the cast.
  canvas.addEventListener("mousewheel", mouse_wheel as unknown as EventListener);
  canvas.addEventListener(
    "dragover",
    function (ev) {
      if (ev.preventDefault) {
        ev.preventDefault();
      }
      ev.returnValue = false;
      return false;
    },
    false,
  );
  canvas.addEventListener("drop", image_upload);

  // Keyboard shortcuts - modifier keys always work, single-key shortcuts only when enabled
  document.onkeydown = function checkKey(e) {
    // Modifier keys ALWAYS work regardless of keyboard shortcuts setting
    if (e.keyCode == 16) {
      // Shift key
      KiddoPaint.Current.scaling = 2;
      KiddoPaint.Current.modified = true;
      return;
    } else if (e.keyCode == 91 || e.keyCode == 93) {
      // Left/Right Command key (⌘) on Mac
      KiddoPaint.Current.modifiedCtrl = true;
      return;
    } else if (e.keyCode == 18) {
      // Alt/Option key
      KiddoPaint.Current.modifiedAlt = true;
      return;
    } else if (e.keyCode == 17) {
      // Control key (actual Ctrl)
      KiddoPaint.Current.modifiedMeta = true;
      return;
    } else if (e.keyCode == 192) {
      // Tilde key (~)
      KiddoPaint.Current.modifiedTilde = true;
      return;
    }

    // '?' key - Show keyboard shortcuts help (always works, even when shortcuts disabled)
    if (e.keyCode === 191 && e.shiftKey) {
      // '?' is Shift + '/' (keyCode 191)
      e.preventDefault();
      KiddoPaint.KeyboardHelp.toggle();
      return;
    }

    // Single-key shortcuts - only work when enabled
    if (!KiddoPaint.Settings.isKeyboardShortcutsEnabled()) {
      return; // Exit early if shortcuts disabled
    }

    if (e.keyCode == 78) {
      // 'n' key - cycle to next color
      const c = KiddoPaint.Colors.nextAllColor();
      // keep them in sync
      KiddoPaint.Current.color = c;
      KiddoPaint.Current.altColor = c;
      KiddoPaint.Current.terColor = c;
      document.getElementById("currentColor")!.style.cssText =
        "background-color: " + c;
    } else if (e.keyCode == 67) {
      // 'c' key - cycle to next color palette
      KiddoPaint.Colors.nextPalette();
      set_colors_to_current_palette();
    } else if (e.keyCode == 82) {
      // 'r' key - randomize colors
      const c = KiddoPaint.Colors.randomAllColor();
      KiddoPaint.Current.color = c;
      document.getElementById("currentColor")!.style.cssText =
        "background-color: " + c;
      KiddoPaint.Current.altColor = KiddoPaint.Colors.randomAllColor();
      KiddoPaint.Current.terColor = KiddoPaint.Colors.randomAllColor();
    } else if (e.keyCode == 83) {
      // 's' key - save to file
      save_to_file();
    } else if (e.keyCode > 48 && e.keyCode < 58) {
      // Number keys 1-9 - set multiplier
      KiddoPaint.Current.multiplier = e.keyCode - 48;
    } else if (e.keyCode == 32) {
      // Spacebar - toggle modified state
      e.stopPropagation();
      e.preventDefault();
      KiddoPaint.Current.modifiedToggle = !KiddoPaint.Current.modifiedToggle;
    } else if (e.keyCode == 86) {
      // 'v' key - toggle velocity state
      KiddoPaint.Current.velToggle = !KiddoPaint.Current.velToggle;
    } else if (e.ctrlKey && e.key === "z") {
      // Ctrl+Z or Cmd+Z - undo
      KiddoPaint.Sounds.mainmenu();
      KiddoPaint.Sounds.oops();
      KiddoPaint.Display.undo();
    }
  };

  // Modifier key release handlers - always work
  document.onkeyup = function checkKey(e) {
    if (e.keyCode == 16) {
      // Shift key released - reset scaling and modified state
      KiddoPaint.Current.scaling = 1;
      KiddoPaint.Current.modified = false;
    } else if (e.keyCode == 91 || e.keyCode == 93) {
      // Left/Right Command key (⌘) released on Mac
      KiddoPaint.Current.modifiedCtrl = false;
    } else if (e.keyCode == 17) {
      // Control key (actual Ctrl) released
      KiddoPaint.Current.modifiedMeta = false;
    } else if (e.keyCode == 192) {
      // Tilde key (~) released
      KiddoPaint.Current.modifiedTilde = false;
    } else if (e.keyCode == 18) {
      // Alt/Option key released
      KiddoPaint.Current.modifiedAlt = false;
    }
  };
}

function colorSelect(e: MouseEvent) {
  KiddoPaint.Sounds.submenucolor();
  const src = (e.srcElement || e.target) as HTMLElement;
  const colorId = src.id;
  const colorSelected = KiddoPaint.Colors.currentPalette()[Number(colorId)];
  if (e.which == 1) {
    KiddoPaint.Current.color = colorSelected;
    document.getElementById("currentColor")!.style.cssText =
      "background-color:" + colorSelected;
  } else if (e.which == 3) {
    KiddoPaint.Current.altColor = colorSelected;
  } else if (e.which == 2) {
    KiddoPaint.Current.terColor = colorSelected;
  }
}

function set_colors_to_current_palette() {
  const pal = KiddoPaint.Colors.currentPalette();
  const buttons = document.getElementById("colorselector")!.children;
  for (let i = 0, len = buttons.length; i < len; i++) {
    const button = buttons[i] as HTMLElement;
    const buttonid = button.id;
    const color = pal[Number(buttonid)];
    button.style.cssText = "background-color:" + color;
  }

  // Update palette name display
  const paletteNameElement = document.getElementById("palette-name");
  if (paletteNameElement) {
    paletteNameElement.textContent = KiddoPaint.Colors.currentPaletteName();
  }
}

function init_color_selector() {
  const buttons = document.getElementById("colorselector")!.children;
  for (let i = 0, len = buttons.length; i < len; i++) {
    const button = buttons[i] as HTMLElement;
    button.id = String(i);
    button.addEventListener("mousedown", colorSelect);
  }
  set_colors_to_current_palette();
  document.getElementById("currentColor")!.style.cssText =
    "background-color:" + KiddoPaint.Current.color;
  init_color_paging();
}

function init_color_paging() {
  document
    .getElementById("colorprev")!
    .addEventListener("mousedown", function () {
      KiddoPaint.Sounds.submenucolor();
      KiddoPaint.Colors.prevPalette();
      set_colors_to_current_palette();
    });
  document
    .getElementById("colornext")!
    .addEventListener("mousedown", function () {
      KiddoPaint.Sounds.submenucolor();
      KiddoPaint.Colors.nextPalette();
      set_colors_to_current_palette();
    });
}

function show_sub_toolbar(subtoolbar: string) {
  window.reset_ranges();
  const subtoolbars = document.getElementById("subtoolbars")!.children;
  for (let i = 0, len = subtoolbars.length; i < len; i++) {
    const div = subtoolbars[i];
    if (div.id === subtoolbar) {
      div.className = "subtoolbar";
    } else {
      div.className = "hidden";
    }
  }
}

function highlightSelectedTool(selectedToolId: string) {
  // Clear all tool highlights
  document.getElementById("pencil")!.style.cssText = "";
  document.getElementById("line")!.style.cssText = "";
  document.getElementById("square")!.style.cssText = "";
  document.getElementById("circle")!.style.cssText = "";
  document.getElementById("brush")!.style.cssText = "";
  document.getElementById("stamp")!.style.cssText = "";
  document.getElementById("text")!.style.cssText = "";
  document.getElementById("paintcan")!.style.cssText = "";
  document.getElementById("eraser")!.style.cssText = "";
  document.getElementById("truck")!.style.cssText = "";
  document.getElementById("jumble")!.style.cssText = "";
  document.getElementById("colorpicker")!.style.cssText = "";
  // Highlight selected tool
  document.getElementById(selectedToolId)!.style.cssText =
    "border-color:red; border-width: 5px";
}

/**
 * Highlights the default subtool buttons once the submenu has rendered.
 * Replaces the identical setTimeout blocks each tool-button listener carried.
 */
function highlightDefaultSubtools(indices: number[]) {
  setTimeout(function () {
    const buttons = document
      .getElementById("genericsubmenu")!
      .getElementsByTagName("button");
    for (const index of indices) {
      if (buttons[index]) {
        buttons[index].style.cssText = "border-color:red; border-width: 5px";
      }
    }
  }, 0);
}

function init_tool_bar() {
  document.getElementById("save")!.addEventListener("mousedown", function () {
    KiddoPaint.Sounds.mainmenu();
    save_to_file();
  });

  document.getElementById("pencil")!.addEventListener("mousedown", function () {
    highlightSelectedTool("pencil");
    KiddoPaint.Sounds.mainmenu();
    window.show_generic_submenu("pencil");
    KiddoPaint.Current.tool = KiddoPaint.Tools.Pencil;
    KiddoPaint.Display.canvas.className = "";
    KiddoPaint.Display.canvas.classList.add("cursor-pencil");

    // Highlight first size button (Size 1) and the Solid texture button
    // (after the spacer, so around index 7)
    highlightDefaultSubtools([0, 7]);
  });

  document.getElementById("line")!.addEventListener("mousedown", function () {
    highlightSelectedTool("line");
    KiddoPaint.Sounds.mainmenu();
    window.show_generic_submenu("line");
    KiddoPaint.Current.tool = KiddoPaint.Tools.Line;
    KiddoPaint.Display.canvas.className = "";
    KiddoPaint.Display.canvas.classList.add("cursor-crosshair");

    // Highlight default size (Size 5, index 1) and default texture
    // (Solid, index 7 - first after spacer)
    highlightDefaultSubtools([1, 7]);
  });

  document.getElementById("square")!.addEventListener("mousedown", function () {
    highlightSelectedTool("square");
    KiddoPaint.Sounds.mainmenu();
    window.show_generic_submenu("rectangle");
    KiddoPaint.Current.tool = KiddoPaint.Tools.Rectangle;
    KiddoPaint.Display.canvas.className = "";
    KiddoPaint.Display.canvas.classList.add("cursor-crosshair");

    // Highlight default thickness (index 1) and default texture
    // (None, index 7 after thickness controls)
    highlightDefaultSubtools([1, 7]);
  });

  document.getElementById("circle")!.addEventListener("mousedown", function () {
    highlightSelectedTool("circle");
    KiddoPaint.Sounds.mainmenu();
    window.show_generic_submenu("oval");
    KiddoPaint.Current.tool = KiddoPaint.Tools.Oval;
    KiddoPaint.Display.canvas.className = "";
    KiddoPaint.Display.canvas.classList.add("cursor-crosshair");

    // Highlight default thickness (index 1) and default texture
    // (None, index 7 after thickness controls)
    highlightDefaultSubtools([1, 7]);
  });

  document.getElementById("brush")!.addEventListener("mousedown", function () {
    highlightSelectedTool("brush");
    KiddoPaint.Sounds.mainmenu();
    window.reset_ranges();
    window.show_generic_submenu("brush");
    KiddoPaint.Submenu.brush[0].handler();

    // Highlight first brush (index 0)
    highlightDefaultSubtools([0]);
  });

  document.getElementById("stamp")!.addEventListener("mousedown", function () {
    highlightSelectedTool("stamp");
    KiddoPaint.Sounds.mainmenu();
    window.reset_ranges();
    KiddoPaint.Display.canvas.className = "";
    KiddoPaint.Display.canvas.classList.add("cursor-none");
    if (KiddoPaint.Current.modifiedCtrl) {
      window.show_generic_submenu("stickers");
    } else {
      window.init_sprites_submenu(); // automatically does for current page
      window.show_generic_submenu("sprites");
      KiddoPaint.Tools.Stamp.useColor = false;
      KiddoPaint.Submenu.sprites[0].handler();
    }
  });

  document.getElementById("text")!.addEventListener("mousedown", function () {
    highlightSelectedTool("text");
    KiddoPaint.Sounds.mainmenu();
    init_text_bar("character" + KiddoPaint.Text.page);
    show_sub_toolbar("texttoolbar");
    KiddoPaint.Tools.Stamp.useColor = true;
    KiddoPaint.Current.tool = KiddoPaint.Tools.Stamp;
    KiddoPaint.Stamps.currentFace = KiddoPaint.Text.english.face;
    KiddoPaint.Display.canvas.className = "";
    KiddoPaint.Display.canvas.classList.add("cursor-none");
  });

  document
    .getElementById("paintcan")!
    .addEventListener("mousedown", function () {
      highlightSelectedTool("paintcan");
      KiddoPaint.Sounds.mainmenu();
      window.show_generic_submenu("paintcan");
      KiddoPaint.Current.tool = KiddoPaint.Tools.PaintCan;
      KiddoPaint.Display.canvas.className = "";
      KiddoPaint.Display.canvas.classList.add("cursor-bucket");

      // Highlight default texture (Solid, index 0)
      highlightDefaultSubtools([0]);
    });

  document.getElementById("eraser")!.addEventListener("mousedown", function () {
    highlightSelectedTool("eraser");
    KiddoPaint.Sounds.mainmenu();
    KiddoPaint.Current.tool = KiddoPaint.Tools.Eraser;
    KiddoPaint.Display.canvas.className = "";
    KiddoPaint.Display.canvas.classList.add("cursor-crosshair");
    window.show_generic_submenu("eraser");

    // Highlight first size (index 0)
    highlightDefaultSubtools([0]);
  });

  document.getElementById("truck")!.addEventListener("mousedown", function () {
    highlightSelectedTool("truck");
    KiddoPaint.Sounds.mainmenu();
    window.show_generic_submenu("truck");
    KiddoPaint.Current.tool = KiddoPaint.Tools.Cut;
    KiddoPaint.Display.canvas.className = "";
    KiddoPaint.Display.canvas.classList.add("cursor-crosshair");

    // Highlight first size (index 0)
    highlightDefaultSubtools([0]);
  });

  document
    .getElementById("colorpicker")!
    .addEventListener("mousedown", function () {
      highlightSelectedTool("colorpicker");
      KiddoPaint.Sounds.mainmenu();
      window.show_generic_submenu("colorpicker");
      KiddoPaint.Current.tool = KiddoPaint.Tools.ColorPicker;
      KiddoPaint.Display.canvas.className = "";
      KiddoPaint.Display.canvas.classList.add("cursor-crosshair");

      // Highlight the single eyedropper subtool (index 0)
      highlightDefaultSubtools([0]);
    });

  document.getElementById("undo")!.addEventListener("mousedown", function () {
    KiddoPaint.Sounds.mainmenu();
    KiddoPaint.Sounds.oops();
    KiddoPaint.Display.undo(); // holding opt makes undo button not work; remove modifier
  });
  document.getElementById("redo")!.addEventListener("mousedown", function () {
    KiddoPaint.Sounds.mainmenu();
    KiddoPaint.Sounds.oops();
    KiddoPaint.Display.redo();
  });

  document.getElementById("alnext")!.addEventListener("mousedown", function () {
    KiddoPaint.Sounds.submenuoption();
    KiddoPaint.Text.nextPage();
    init_text_bar("character" + KiddoPaint.Text.page);
  });

  //    document.getElementById('stnext').addEventListener('mousedown', function(e) {
  //        KiddoPaint.Sounds.submenuoption();
  //        (e.which == 1) ? KiddoPaint.Stamps.nextPage(): KiddoPaint.Stamps.prevPage(); // left click is 1, right click is 3
  //        init_stamp_bar('stamp' + KiddoPaint.Stamps.page);
  //    });

  document.getElementById("jumble")!.addEventListener("mousedown", function () {
    highlightSelectedTool("jumble");
    KiddoPaint.Sounds.mainmenu();
    window.show_generic_submenu("jumble");
    KiddoPaint.Display.canvas.className = "";
    KiddoPaint.Display.canvas.classList.add("cursor-guy-smile");
    KiddoPaint.Tools.WholeCanvasEffect.effect = window.JumbleFx.INVERT;
    KiddoPaint.Current.tool = KiddoPaint.Tools.WholeCanvasEffect;

    // Highlight first effect (index 0)
    highlightDefaultSubtools([0]);
  });
}

function init_text_bar(textgroup: string) {
  const texttoolbar = KiddoPaint.Text.english[textgroup].letters;
  // first letter / number / symbol is selected when the bar is created:
  KiddoPaint.Tools.Stamp.stamp = texttoolbar[0];
  // clear out old buttons and hide all initially:
  const alphaselect = document.querySelectorAll<HTMLElement>('*[id^="xal"]');
  for (let i = 0; i < alphaselect.length; i++) {
    const b = alphaselect[i];
    b.style.cssText = "display: none;"; // Hide all buttons initially
    b.removeAllChildren();
  }
  // add new buttons and show only the ones we need:
  for (let i = 0; i < texttoolbar.length; i++) {
    const buttonValue = "<h1>" + texttoolbar[i] + "</h1>";
    const button = document.getElementById("xal" + i)!;
    button.innerHTML = buttonValue;
    // Show this button and apply appropriate styling
    if (i == 0) {
      button.style.cssText =
        "display: block; border-color:red; border-width: 5px";
    } else {
      button.style.cssText = "display: block;";
    }
  }
}

function init_subtool_bars() {
  init_pencil_subtoolbar();
  init_text_subtoolbar();
}

function init_pencil_subtoolbar() {
  // this is the default, so we show show it
  window.show_generic_submenu("pencil");
  KiddoPaint.Display.canvas.className = "";
  KiddoPaint.Display.canvas.classList.add("cursor-pencil");

  // Highlight first size button (Size 1) and the Solid texture button
  // (after the spacer, so around index 7) with red outline
  highlightDefaultSubtools([0, 7]);
}

function init_text_subtoolbar() {
  const alphaselect = document.querySelectorAll<HTMLElement>('*[id^="xal"]');
  for (let i = 0; i < alphaselect.length; i++) {
    const alphaButton = alphaselect[i];
    alphaButton.addEventListener("mousedown", function (ev) {
      window.reset_ranges();
      const src = (ev.srcElement || ev.target) as HTMLElement;
      // if button has no child, it's a blank button -> do nothing.
      if (src.firstChild == null) {
        console.log("empty button, no-op.");
        return;
      }
      KiddoPaint.Tools.Stamp.stamp = src.firstChild.nodeValue;
      KiddoPaint.Sounds.Library.playKey(KiddoPaint.Tools.Stamp.stamp);
      const alphaselect2 =
        document.querySelectorAll<HTMLElement>('*[id^="xal"]');
      for (let j = 0; j < alphaselect2.length; j++) {
        const b = alphaselect2[j];
        // Only reset styling for visible buttons (those with content)
        if (b.firstChild != null) {
          b.style.cssText = "display: block;";
        }
      }
      (src.parentNode as HTMLElement).style.cssText =
        "border-color:red; border-width: 5px";
    });
  }
}

function ev_canvas(ev: MouseEvent) {
  if (!ev) {
    return;
  }
  // pre event
  KiddoPaint.Display.step += 1;
  KiddoPaint.Display.clearPreview();

  const kev = ev as KidPixPointerEvent;
  KiddoPaint.Current.ev = kev;

  kev._x = ev.offsetX;
  kev._y = ev.offsetY;

  // handle event. (Legacy touch normalization: touch events are converted to
  // synthetic MouseEvents in init_listeners before reaching here, so these
  // branches are only a safety net for any direct touch dispatch.)
  const mutableType = kev as unknown as { type: string };
  if (kev.type === "touchstart") {
    mutableType.type = "mousedown";
  }
  if (kev.type === "touchmove") {
    mutableType.type = "mousemove";
  }
  if (kev.type === "touchend") {
    mutableType.type = "mouseup";
  }

  // duck-typed dispatch, checked against the three tool handler names
  const type = kev.type;
  const func =
    type === "mousedown" || type === "mousemove" || type === "mouseup"
      ? KiddoPaint.Current.tool[type]
      : undefined;
  if (func) {
    func(kev);
  }

  // common ev processing
  common_ev_proc(kev);

  KiddoPaint.Current.prevEv = kev;
  KiddoPaint.Current.prevEvTs = Date.now();
}

function common_ev_proc(ev: KidPixPointerEvent) {
  if (!KiddoPaint.Current.prevEv) return;

  const dist = window.distanceBetween(KiddoPaint.Current.prevEv, ev);
  const tsdelta = Date.now() - KiddoPaint.Current.prevEvTs + 1;
  const velocity = ((1.0 * dist) / tsdelta) * 1000.0;
  KiddoPaint.Current.velocity = velocity;
  KiddoPaint.Current.velocityMultiplier =
    velocity > 1000 ? velocity / 1000 : 1.0;
  if (KiddoPaint.Current.velToggle) {
    KiddoPaint.Current.scaling = KiddoPaint.Current.velocityMultiplier;
  }
}

function mouse_wheel(ev: WheelEvent & { wheelDelta?: number }) {
  const delta = Math.max(-1, Math.min(1, ev.wheelDelta || -ev.detail));
  if (KiddoPaint.Current.modified) {
    KiddoPaint.Current.modifiedRange += delta;
    if (KiddoPaint.Current.modifiedRange > 100) {
      KiddoPaint.Current.modifiedRange = -100;
    } else if (KiddoPaint.Current.modifiedRange < -100) {
      KiddoPaint.Current.modifiedRange = 100;
    }
  } else if (KiddoPaint.Current.modifiedAlt) {
    KiddoPaint.Current.modifiedAltRange += delta;
    if (KiddoPaint.Current.modifiedAltRange > 100) {
      KiddoPaint.Current.modifiedAltRange = -100;
    } else if (KiddoPaint.Current.modifiedAltRange < -100) {
      KiddoPaint.Current.modifiedAltRange = 100;
    }
  } else if (KiddoPaint.Current.modifiedCtrl) {
    KiddoPaint.Current.modifiedCtrlRange += delta;
    if (KiddoPaint.Current.modifiedCtrlRange > 100) {
      KiddoPaint.Current.modifiedCtrlRange = -100;
    } else if (KiddoPaint.Current.modifiedCtrlRange < -100) {
      KiddoPaint.Current.modifiedCtrlRange = 100;
    }
  }
  // kick off a redraw of preview
  if (KiddoPaint.Current.ev) {
    ev_canvas(KiddoPaint.Current.ev);
  }
  if (ev.preventDefault) {
    ev.preventDefault();
  }
  ev.returnValue = false;
  return false;
}

function save_to_file() {
  // jpp - always crop saved png, and remove its transparency.
  const canvasToSave = window.trimAndFlattenCanvas(
    KiddoPaint.Display.main_canvas,
  );
  // orig:
  // var canvasToSave = KiddoPaint.Current.modifiedAlt ? trimAndFlattenCanvas(KiddoPaint.Display.main_canvas) : KiddoPaint.Display.main_canvas;

  const image = canvasToSave.toDataURL("image/png");

  // nice format for timestamp in filename
  // https://chat.openai.com/c/926c6bbf-c626-456e-9832-08e5088ecf2b
  const d = new Date();
  const formattedDate = [
    d.getFullYear(),
    (d.getMonth() + 1).toString().padStart(2, "0"),
    d.getDate().toString().padStart(2, "0"),
    d.getHours().toString().padStart(2, "0"),
    d.getMinutes().toString().padStart(2, "0"),
    d.getSeconds().toString().padStart(2, "0"),
  ].join("-");
  // old:
  // const formattedDate = Date.now();

  const a = document.createElement("a");
  a.href = image;
  a.download = "kidpix-" + formattedDate + ".png";
  a.click();
}

function image_upload(ev: DragEvent) {
  const files = ev.dataTransfer ? ev.dataTransfer.files : null;
  if (files && files.length > 0) {
    const file = files[0];
    if (typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onload = function (evt) {
        const img = new Image();
        img.onload = function () {
          if (KiddoPaint.Current.modifiedAlt) {
            KiddoPaint.Display.context.drawImage(img, 0, 0);
            KiddoPaint.Display.saveMain();
          } else {
            KiddoPaint.Tools.Placer.image = img;
            KiddoPaint.Tools.Placer.size = {
              width: img.width,
              height: img.height,
            };
            KiddoPaint.Tools.Placer.prevTool = KiddoPaint.Current.tool;
            KiddoPaint.Current.tool = KiddoPaint.Tools.Placer;
          }
        };
        // readAsDataURL guarantees a string result
        img.src = evt.target!.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  if (ev.preventDefault) {
    ev.preventDefault();
  }
  ev.returnValue = false;
  return false;
}
