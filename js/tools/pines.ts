class PinesTool implements KiddoPaintTool {
  isDown = false;
  previousEv: KidPixPointerEvent | null = null;
  spacing = 3;
  strokeSize = 1;
  boundingBox = 25;

  texture: () => string | CanvasGradient | CanvasPattern = () =>
    KiddoPaint.Textures.Solid(KiddoPaint.Current.color);

  jitter = () => {
    return window.getRandomFloat(-this.boundingBox, this.boundingBox);
  };

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.previousEv = ev;
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      if (
        this.previousEv == null ||
        window.distanceBetween(this.previousEv, ev) > this.spacing
      ) {
        KiddoPaint.Sounds.brushpines();
        const jitterx = this.jitter();
        const jittery = this.jitter();
        // previousEv is always set while isDown (mousedown assigns it)
        const prev = this.previousEv!;
        for (let i = 0; i < 7; i++) {
          KiddoPaint.Display.context.beginPath();
          KiddoPaint.Display.context.moveTo(ev._x, ev._y);
          KiddoPaint.Display.context.lineTo(
            prev._x + jitterx,
            prev._y + jittery,
          );
          KiddoPaint.Display.context.strokeStyle = this.texture();
          KiddoPaint.Display.context.lineWidth = this.strokeSize;
          KiddoPaint.Display.context.stroke();
          KiddoPaint.Display.context.closePath();
        }
        this.previousEv = ev;
      }
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.mousemove(ev);
      this.isDown = false;
      this.previousEv = null;
      KiddoPaint.Display.saveMain();
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    Pines: typeof PinesTool;
  }
  interface KiddoPaintToolsRegistry {
    Pines: PinesTool;
  }
}

KiddoPaint.Tools.Toolbox.Pines = PinesTool;
KiddoPaint.Tools.Pines = new PinesTool();
