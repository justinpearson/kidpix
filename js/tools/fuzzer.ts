class FuzzerTool implements KiddoPaintTool {
  isDown = false;
  timeout: ReturnType<typeof setTimeout> | null = null;
  currentEv: KidPixPointerEvent | null = null;

  size = () => {
    return 13 * KiddoPaint.Current.scaling;
  };

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.currentEv = ev;

    const tool = this;
    const interval = 37;
    this.timeout = setTimeout(function draw() {
      tool.toolDraw();
      if (!tool.timeout) return;
      tool.timeout = setTimeout(draw, interval);
    }, interval);
  };

  mousemove = (ev: KidPixPointerEvent) => {
    this.currentEv = ev;
    // just preview
    if (!this.isDown) {
      this.toolDraw();
    }
  };

  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
      KiddoPaint.Display.saveMain();
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
    }
  };

  // kidpix implements this as a circle tool not rect
  toolDraw = () => {
    if (!this.currentEv) return;
    const target = KiddoPaint.Display.main_context.getImageData(
      this.currentEv._x - this.size(),
      this.currentEv._y - this.size(),
      2 * this.size(),
      2 * this.size(),
    );
    const ctx = this.isDown
      ? KiddoPaint.Display.context
      : KiddoPaint.Display.previewContext;
    const jitterx = window.getRandomFloat(-7, 7);
    const jittery = window.getRandomFloat(-7, 7);

    // XXX TODO FIXME this ought to delete the underlying main_context too... it's duping and w/ alpha looks wrong
    /* ought to clear-rect the underlying pixels to better handle transparency
            ctx.strokeStyle = 'transparent';
            ctx.fillStyle = 'white';
                ctx.fillRect((ev._x - tool.size()) + jitterx, (ev._y - tool.size()) + jittery, 2 * tool.size() - 1, 2 * tool.size() - 1);
        */
    if (this.isDown) KiddoPaint.Sounds.brushfuzzer();
    ctx.putImageData(
      target,
      this.currentEv._x - this.size() + jitterx,
      this.currentEv._y - this.size() + jittery,
    );
  };
}
declare global {
  interface KiddoPaintToolbox {
    Fuzzer: typeof FuzzerTool;
  }
  interface KiddoPaintToolsRegistry {
    Fuzzer: FuzzerTool;
  }
}

KiddoPaint.Tools.Toolbox.Fuzzer = FuzzerTool;
KiddoPaint.Tools.Fuzzer = new FuzzerTool();
