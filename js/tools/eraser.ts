class EraserTool implements KiddoPaintTool {
  isDown = false;
  size = 10;
  isSquareEraser = true;

  texture: () => string | CanvasGradient | CanvasPattern = () =>
    KiddoPaint.Textures.Solid("rgb(240, 180, 180)");

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.mousemove(ev);
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      KiddoPaint.Sounds.eraser();
    }
    const currentSize = this.size * KiddoPaint.Current.scaling;
    const ctx = this.isDown
      ? KiddoPaint.Display.context
      : KiddoPaint.Display.previewContext;
    ctx.fillStyle = this.texture();
    if (this.isSquareEraser) {
      ctx.fillRect(
        Math.round(ev._x) - currentSize / 2.0,
        Math.round(ev._y) - currentSize / 2.0,
        currentSize,
        currentSize,
      );
    } else {
      ctx.beginPath();
      ctx.arc(ev._x, ev._y, currentSize, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.mousemove(ev);
      this.isDown = false;
      KiddoPaint.Display.saveMainGco("destination-out");
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    Eraser: typeof EraserTool;
  }
  interface KiddoPaintToolsRegistry {
    Eraser: EraserTool;
  }
}

KiddoPaint.Tools.Toolbox.Eraser = EraserTool;
KiddoPaint.Tools.Eraser = new EraserTool();
