class PlainBrushTool implements KiddoPaintTool {
  isDown = false;
  previousEv: KidPixPointerEvent | null = null;
  // Replaced by submenu handlers; drawing with the default no-op throws,
  // exactly as it did before typing (the submenu always wires it first).
  texture: (step: number, pstep: number) => KidPixBrushFill | undefined = () =>
    undefined;
  preprocess: () => void = () => {};
  postprocess: () => void = () => {};
  soundduring: () => void = () => {};
  spacing = 5;
  step = 0; // local tool step which resets on mouse up
  pstep = 0; // local persistent step which resets when invoker chooses; used in connect the dots
  alwaysGapFill = false;

  reset = () => {
    this.isDown = false;
    this.previousEv = null;
    this.texture = () => undefined;
    this.preprocess = () => {};
    this.postprocess = () => {};
    this.soundduring = () => {};
    this.step = 0;
    this.pstep = 0;
    this.alwaysGapFill = false;
  };

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.mousemove(ev);
    this.previousEv = ev;
    this.preprocess();
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      if (
        this.previousEv == null ||
        window.distanceBetween(this.previousEv, ev) > this.spacing
      ) {
        if (KiddoPaint.Current.modifiedTilde) {
          // alpha decay
          KiddoPaint.Display.context.globalAlpha *= 0.95;
          KiddoPaint.Display.previewContext.globalAlpha *= 0.95;
        }
        // gap fill
        if (
          (KiddoPaint.Current.modifiedAlt || this.alwaysGapFill) &&
          this.previousEv != null
        ) {
          const dist = window.distanceBetween(this.previousEv, ev);
          const angle = window.angleBetweenRad(this.previousEv, ev);
          for (let i = 0; i < dist; i += 5) {
            const x = this.previousEv._x + Math.sin(angle) * i;
            const y = this.previousEv._y + Math.cos(angle) * i;
            const brushFill = this.texture(this.step, this.pstep)!;
            KiddoPaint.Display.context.drawImage(
              brushFill.brush,
              Math.round(x - brushFill.offset!),
              Math.round(y - brushFill.offset!),
            );
            this.step += 1;
            this.pstep += 1;
            if (KiddoPaint.Current.modifiedTilde) {
              // alpha decay
              KiddoPaint.Display.context.globalAlpha *= 0.99;
              KiddoPaint.Display.previewContext.globalAlpha *= 0.99;
            }
          }
        }
        const brushFill = this.texture(this.step, this.pstep)!;
        this.soundduring();
        KiddoPaint.Display.context.drawImage(
          brushFill.brush,
          Math.round(ev._x - brushFill.offset!),
          Math.round(ev._y - brushFill.offset!),
        );
        this.previousEv = ev;
        this.step += 1;
        this.pstep += 1;
      }
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.mousemove(ev);
      this.isDown = false;
      this.previousEv = null;
      this.step = 0; // only reset local step, not pstep. caller invokes reset() if need be
      this.postprocess();
      KiddoPaint.Display.saveMain();
      KiddoPaint.Display.context.globalAlpha = KiddoPaint.Current.globalAlpha;
      KiddoPaint.Display.previewContext.globalAlpha =
        KiddoPaint.Current.globalAlpha;
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    PlainBrush: typeof PlainBrushTool;
  }
  interface KiddoPaintToolsRegistry {
    PlainBrush: PlainBrushTool;
  }
}

KiddoPaint.Tools.Toolbox.PlainBrush = PlainBrushTool;
KiddoPaint.Tools.PlainBrush = new PlainBrushTool();
