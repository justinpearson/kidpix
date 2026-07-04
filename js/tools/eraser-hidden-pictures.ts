class EraserHiddenPictureTool implements KiddoPaintTool {
  hiddenPictures = [
    "img/hidden-pictures/kp-h-bear.png",
    "img/hidden-pictures/kp-h-bison.png",
    "img/hidden-pictures/kp-h-corn.png",
    "img/hidden-pictures/kp-h-eye.png",
    "img/hidden-pictures/kp-h-fox.png",
    "img/hidden-pictures/kp-h-horse.png",
    "img/hidden-pictures/kp-h-hummingbird.png",
    "img/hidden-pictures/kp-h-ladybug.png",
    "img/hidden-pictures/kp-h-lion.png",
    "img/hidden-pictures/kp-h-magnet.png",
    "img/hidden-pictures/kp-h-moth.png",
    "img/hidden-pictures/kp-h-octopus.png",
  ];
  isDown = false;
  size = 32;
  hiddenPattern: CanvasPattern | null = null;

  reset = () => {
    const tool = this;
    const image = new Image();
    image.src = this.hiddenPictures.random();
    image.crossOrigin = "anonymous";
    image.onload = function () {
      tool.hiddenPattern = window.makePatternFromImage(image);
    };
  };

  mousedown = () => {
    this.isDown = true;
  };

  mousemove = (ev: KidPixPointerEvent) => {
    const currentSize = this.size * KiddoPaint.Current.scaling;
    if (this.isDown) {
      KiddoPaint.Sounds.eraser();
      const ctx = KiddoPaint.Display.context;
      // Until the random image loads, keep the context's previous fillStyle
      // (assigning null was a silent no-op in the untyped version).
      if (this.hiddenPattern) {
        ctx.fillStyle = this.hiddenPattern;
      }
      ctx.fillRect(
        Math.round(ev._x) - currentSize / 2.0,
        Math.round(ev._y) - currentSize / 2.0,
        currentSize,
        currentSize,
      );
    } else {
      const ctx = KiddoPaint.Display.previewContext;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.strokeRect(
        Math.round(ev._x) - currentSize / 2.0,
        Math.round(ev._y) - currentSize / 2.0,
        currentSize,
        currentSize,
      );
      ctx.fillRect(
        Math.round(ev._x) - currentSize / 2.0,
        Math.round(ev._y) - currentSize / 2.0,
        currentSize,
        currentSize,
      );
    }
  };

  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
      KiddoPaint.Display.saveMain();
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    EraserHiddenPicture: typeof EraserHiddenPictureTool;
  }
  interface KiddoPaintToolsRegistry {
    EraserHiddenPicture: EraserHiddenPictureTool;
  }
}

KiddoPaint.Tools.Toolbox.EraserHiddenPicture = EraserHiddenPictureTool;
KiddoPaint.Tools.EraserHiddenPicture = new EraserHiddenPictureTool();
