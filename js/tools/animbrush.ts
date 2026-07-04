class AnimBrushTool implements KiddoPaintTool {
  isDown = false;
  previousEv: KidPixPointerEvent | null = null;
  currentEv: KidPixPointerEvent | null = null;
  distanceFromPrev: number | null = null;
  // Replaced by submenu handlers; drawing with the default no-op throws,
  // exactly as it did before typing (the submenu always wires it first).
  texture: (
    step: number,
    distanceFromPrev: number | null,
  ) => KidPixBrushFill | undefined = () => undefined;
  preprocess: () => void = () => {};
  postprocess: () => void = () => {};
  step = 0;
  animInterval = 30;
  timeout: ReturnType<typeof setTimeout> | null = null;

  reset = () => {
    this.isDown = false;
    this.currentEv = null;
    this.previousEv = null;
    this.distanceFromPrev = null;
    this.texture = () => undefined;
    this.preprocess = () => {};
    this.postprocess = () => {};
    this.step = 0;
    this.animInterval = 30;
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  };

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.preprocess();
    this.currentEv = ev;
    const tool = this;
    const interval = this.animInterval;
    this.timeout = setTimeout(function draw() {
      tool.toolDraw();
      if (!tool.timeout) return;
      tool.timeout = setTimeout(draw, interval);
    }, interval);
    this.toolDraw();
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.distanceFromPrev = this.previousEv
        ? window.distanceBetween(this.previousEv, ev)
        : Number.MAX_VALUE;
      this.previousEv = this.currentEv;
      this.currentEv = ev;
      this.toolDraw();
    }
  };

  mouseup = () => {
    if (this.isDown) {
      this.postprocess();
      this.isDown = false;
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.currentEv = null;
      this.previousEv = null;
      this.distanceFromPrev = null;
      this.step = 0;
      KiddoPaint.Display.saveMain();
    }
  };

  toolDraw = () => {
    if (this.isDown && this.currentEv) {
      const ev = this.currentEv;
      const brushFill = this.texture(this.step, this.distanceFromPrev)!;
      let lx = ev._x;
      let ly = ev._y;
      if (brushFill.offset) {
        lx = lx - brushFill.offset;
        ly = ly - brushFill.offset;
      } else if (brushFill.abspos) {
        lx = brushFill.abspos.x;
        ly = brushFill.abspos.y;
      }
      KiddoPaint.Display.context.drawImage(brushFill.brush, lx, ly);
      this.step += 1;
    }
  };
}
KiddoPaint.Tools.Toolbox.AnimBrush = AnimBrushTool;
KiddoPaint.Tools.AnimBrush = new AnimBrushTool();
