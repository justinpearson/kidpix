class BrushTool implements KiddoPaintTool {
  isDown = false;
  didMove = false;
  previousEv: KidPixPointerEvent | null = null;
  minDistance = 0;

  // Replaced by submenu handlers; drawing with the default no-op throws,
  // exactly as it did before typing (the submenu always wires it first).
  texture: (angle: number) => HTMLCanvasElement | undefined = () => undefined;
  soundduring: (() => void) | null = null;

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;

    this.didMove = true; // put first click
    this.mousemove(ev);
    this.didMove = false; // clear first click if need be

    this.previousEv = ev;
  };

  reset = () => {
    this.soundduring = null;
    this.texture = () => undefined;
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      if (!this.didMove) {
        // just kidding! we're moving, so clear the first builder mark and ...
        KiddoPaint.Display.clearTmp();
        this.didMove = true;
        this.previousEv = ev;
        // ... start drawing the new builder as soon as possible.
        this.minDistance = 0;
      } else if (
        this.previousEv == null ||
        window.distanceBetween(this.previousEv, ev) > this.minDistance
      ) {
        const angle =
          this.previousEv == null
            ? 0
            : window.angleBetween(this.previousEv, ev) + 0.5 * Math.PI;
        const brushFill = this.texture(angle)!;
        if (this.soundduring) this.soundduring();
        KiddoPaint.Display.context.drawImage(
          brushFill,
          Math.round(ev._x),
          Math.round(ev._y),
        );
        this.previousEv = ev;
        // next builder should be spaced out
        this.minDistance = 25 * KiddoPaint.Current.scaling;
      }
    }
  };

  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
      this.previousEv = null;
      this.minDistance = 0;
      KiddoPaint.Display.saveMain();
    }
  };
}
KiddoPaint.Tools.Toolbox.Brush = BrushTool;
KiddoPaint.Tools.Brush = new BrushTool();
