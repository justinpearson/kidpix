class InverterTool implements KiddoPaintTool {
  isDown = false;
  size = 25;
  hiddenPattern: CanvasPattern | null = null;

  mousedown = () => {
    this.isDown = true;
    this.hiddenPattern = KiddoPaint.Display.context.createPattern(
      window.Filters.gcoInvert(
        KiddoPaint.Display.main_context.getImageData(
          0,
          0,
          KiddoPaint.Display.canvas.width,
          KiddoPaint.Display.canvas.height,
        ),
      ),
      "no-repeat",
    );
  };

  mousemove = (ev: KidPixPointerEvent) => {
    const currentSize = this.size * KiddoPaint.Current.scaling;
    if (this.isDown) {
      KiddoPaint.Sounds.brushinvert();
      const ctx = KiddoPaint.Display.context;
      if (this.hiddenPattern) {
        ctx.fillStyle = this.hiddenPattern;
      }
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
      this.hiddenPattern = null;
      KiddoPaint.Display.saveMain();
    }
  };
}
KiddoPaint.Tools.Toolbox.Inverter = InverterTool;
KiddoPaint.Tools.Inverter = new InverterTool();
