KiddoPaint.Display.undoData = [];
KiddoPaint.Display.redoData = [];
KiddoPaint.Display.undoOn = true;
KiddoPaint.Display.allowClearTmp = true;

KiddoPaint.Display.clearAll = function () {
  // clearing anim is resp of callers
  KiddoPaint.Display.saveUndo();
  KiddoPaint.Display.clearPreview();
  KiddoPaint.Display.clearTmp();
  KiddoPaint.Display.clearMain();
  KiddoPaint.Display.clearLocalStorage();
};

KiddoPaint.Display.clearMain = function () {
  KiddoPaint.Display.main_context.clearRect(
    0,
    0,
    KiddoPaint.Display.main_canvas.width,
    KiddoPaint.Display.main_canvas.height,
  );
};

KiddoPaint.Display.clearTmp = function () {
  if (KiddoPaint.Display.allowClearTmp) {
    KiddoPaint.Display.context.clearRect(
      0,
      0,
      KiddoPaint.Display.canvas.width,
      KiddoPaint.Display.canvas.height,
    );
  }
};

KiddoPaint.Display.clearPreview = function () {
  KiddoPaint.Display.previewContext.clearRect(
    0,
    0,
    KiddoPaint.Display.canvas.width,
    KiddoPaint.Display.canvas.height,
  );
};

KiddoPaint.Display.clearAnim = function () {
  KiddoPaint.Display.animContext.clearRect(
    0,
    0,
    KiddoPaint.Display.canvas.width,
    KiddoPaint.Display.canvas.height,
  );
};

KiddoPaint.Display.clearBnim = function () {
  KiddoPaint.Display.bnimContext.clearRect(
    0,
    0,
    KiddoPaint.Display.canvas.width,
    KiddoPaint.Display.canvas.height,
  );
};

KiddoPaint.Display.clearBeforeSaveMain = function () {
  if (KiddoPaint.Display.saveUndo()) {
    KiddoPaint.Display.clearMain();
    KiddoPaint.Display.main_context.drawImage(KiddoPaint.Display.canvas, 0, 0);
    KiddoPaint.Display.clearTmp();
    KiddoPaint.Display.saveToLocalStorage();
  }
};

KiddoPaint.Display.saveMainGco = function (op) {
  if (KiddoPaint.Display.saveUndo()) {
    const prevGco = KiddoPaint.Display.main_context.globalCompositeOperation;
    KiddoPaint.Display.main_context.globalCompositeOperation = op;
    KiddoPaint.Display.main_context.drawImage(KiddoPaint.Display.canvas, 0, 0);
    KiddoPaint.Display.main_context.globalCompositeOperation = prevGco;
    KiddoPaint.Display.clearTmp();
    KiddoPaint.Display.saveToLocalStorage();
  }
};

KiddoPaint.Display.saveMainGcoSkipUndo = function (op) {
  const prevGco = KiddoPaint.Display.main_context.globalCompositeOperation;
  KiddoPaint.Display.main_context.globalCompositeOperation = op;
  KiddoPaint.Display.main_context.drawImage(KiddoPaint.Display.canvas, 0, 0);
  KiddoPaint.Display.main_context.globalCompositeOperation = prevGco;
  KiddoPaint.Display.clearTmp();
  KiddoPaint.Display.saveToLocalStorage();
};

KiddoPaint.Display.saveMain = function () {
  if (KiddoPaint.Display.saveUndo()) {
    KiddoPaint.Display.main_context.drawImage(KiddoPaint.Display.canvas, 0, 0);
    KiddoPaint.Display.clearTmp();
    KiddoPaint.Display.saveToLocalStorage();
  }
};

KiddoPaint.Display.saveMainSkipUndo = function () {
  KiddoPaint.Display.main_context.drawImage(KiddoPaint.Display.canvas, 0, 0);
  KiddoPaint.Display.clearTmp();
  KiddoPaint.Display.saveToLocalStorage();
};

KiddoPaint.Display.pauseUndo = function () {
  KiddoPaint.Display.undoOn = false;
};

KiddoPaint.Display.resumeUndo = function () {
  KiddoPaint.Display.undoOn = true;
};

KiddoPaint.Display.toggleUndo = function () {
  KiddoPaint.Display.undoOn = !KiddoPaint.Display.undoOn;
};

KiddoPaint.Display.saveUndo = function () {
  if (KiddoPaint.Display.undoOn) {
    KiddoPaint.Display.undoData.push(
      KiddoPaint.Display.main_canvas.toDataURL(),
    );
    if (KiddoPaint.Display.undoData.length > 30) {
      console.log("undo buffer full, removing oldest...");
      KiddoPaint.Display.undoData.shift();
    }
    KiddoPaint.Display.redoData = [];
  }
  return KiddoPaint.Display.undoOn;
};

// Note: a key non-obvious part of this undo / redo implementation is the fact
// that elsewhere in the app, the drawing tools only save the canvas immediately
// BEFORE they draw to the canvas. So the current state of the canvas is not actually
// saved in the undo or redo buffers; it is essentially a 3rd state that needs to be
// accounted for in the undo / redo logic. That's why the first step of a undo/redo
// operation is to push the canvas onto the opposite buffer, to save it.

KiddoPaint.Display.popAndLoad = function (stack) {
  var img = new Image();
  img.src = stack.pop();
  img.onload = function () {
    KiddoPaint.Display.clearMain();
    KiddoPaint.Display.main_context.drawImage(img, 0, 0);
  };
};

KiddoPaint.Display.undo = function () {
  if (KiddoPaint.Display.undoData.length > 0) {
    KiddoPaint.Display.redoData.push(
      KiddoPaint.Display.main_canvas.toDataURL(),
    );
    KiddoPaint.Display.popAndLoad(KiddoPaint.Display.undoData);
  } else {
    console.log("undo buffer empty, nothing to do");
  }
};

KiddoPaint.Display.redo = function () {
  if (KiddoPaint.Display.redoData.length > 0) {
    KiddoPaint.Display.undoData.push(
      KiddoPaint.Display.main_canvas.toDataURL(),
    );
    KiddoPaint.Display.popAndLoad(KiddoPaint.Display.redoData);
  } else {
    console.log("redo buffer empty, nothing to do");
  }
};

KiddoPaint.Display.clearLocalStorage = function () {
  if (typeof Storage != "undefined") {
    localStorage.removeItem("kiddopaint");
  }
};

KiddoPaint.Display.saveToLocalStorage = function () {
  if (typeof Storage != "undefined") {
    try {
      localStorage.setItem(
        "kiddopaint",
        KiddoPaint.Display.main_canvas.toDataURL(),
      );
    } catch (e) {
      try {
        localStorage.setItem(
          "kiddopaint",
          KiddoPaint.Display.main_canvas.toDataURL("image/jpeg", 0.87),
        );
      } catch (e2) {
        console.log(e2);
      }
    }
  }
};

KiddoPaint.Display.loadFromLocalStorage = function () {
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function () {
    KiddoPaint.Display.clearMain();
    KiddoPaint.Display.main_context.drawImage(img, 0, 0);
  };
  if (typeof Storage != "undefined" && localStorage.getItem("kiddopaint")) {
    img.src = localStorage.getItem("kiddopaint");
  } else {
    img.src = "./src/assets/static/splash.png";
  }
};

KiddoPaint.Display.canvasToImageData = function (canvas) {
  return canvas
    .getContext("2d")
    .getImageData(0, 0, canvas.width, canvas.height);
};

KiddoPaint.Display.imageTypeToCanvas = function (imageData, doDraw) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  if (doDraw) {
    ctx.drawImage(imageData, 0, 0);
  } else {
    ctx.putImageData(imageData, 0, 0);
  }
  return canvas;
};
