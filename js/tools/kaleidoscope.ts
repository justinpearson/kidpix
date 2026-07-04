class KaleidoscopeTool implements KiddoPaintTool {
  // bug: undo does one quadrant
  isDown = false;
  size = 2;
  origin: KidPixPointerEvent | null = null;
  previousEv = { x: 0, y: 0 };

  texture: () => string | CanvasGradient | CanvasPattern = () =>
    KiddoPaint.Textures.Solid(KiddoPaint.Current.color);

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.previousEv = {
      x: 0,
      y: 0,
    };
    this.origin = ev;
    KiddoPaint.Display.context.strokeStyle = this.texture();
    KiddoPaint.Display.context.lineWidth = this.size;
    KiddoPaint.Display.context.beginPath();
    KiddoPaint.Display.context.save();
    KiddoPaint.Display.context.lineJoin = KiddoPaint.Display.context.lineCap =
      "round";
    KiddoPaint.Display.context.translate(ev._x + 0.1, ev._y + 0.1);
    KiddoPaint.Display.context.moveTo(0, 0);
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown && this.origin) {
      KiddoPaint.Sounds.brushkaliediscope();
      const x = this.origin._x - ev._x;
      const y = this.origin._y - ev._y;

      if (KiddoPaint.Current.modifiedAlt) {
        KiddoPaint.Display.context.moveTo(this.previousEv.x, this.previousEv.y);
        KiddoPaint.Display.context.lineTo(x, y);

        KiddoPaint.Display.context.moveTo(this.previousEv.y, this.previousEv.x);
        KiddoPaint.Display.context.lineTo(y, x);

        KiddoPaint.Display.context.moveTo(
          -this.previousEv.x,
          -this.previousEv.y,
        );
        KiddoPaint.Display.context.lineTo(-x, -y);

        KiddoPaint.Display.context.moveTo(
          -this.previousEv.y,
          -this.previousEv.x,
        );
        KiddoPaint.Display.context.lineTo(-y, -x);
      } else {
        KiddoPaint.Display.context.moveTo(this.previousEv.x, this.previousEv.y);
        KiddoPaint.Display.context.lineTo(x, y);

        KiddoPaint.Display.context.moveTo(
          -this.previousEv.x,
          this.previousEv.y,
        );
        KiddoPaint.Display.context.lineTo(-x, y);

        KiddoPaint.Display.context.moveTo(
          this.previousEv.x,
          -this.previousEv.y,
        );
        KiddoPaint.Display.context.lineTo(x, -y);

        KiddoPaint.Display.context.moveTo(
          -this.previousEv.x,
          -this.previousEv.y,
        );
        KiddoPaint.Display.context.lineTo(-x, -y);
      }

      KiddoPaint.Display.context.stroke();
      this.previousEv = {
        x: x,
        y: y,
      };
    }
  };

  mouseup = () => {
    if (this.isDown) {
      KiddoPaint.Display.context.restore();
      KiddoPaint.Display.context.closePath();
      this.previousEv = {
        x: 0,
        y: 0,
      };
      this.isDown = false;
      KiddoPaint.Display.saveMain();
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    Kaleidoscope: typeof KaleidoscopeTool;
  }
  interface KiddoPaintToolsRegistry {
    Kaleidoscope: KaleidoscopeTool;
  }
}

KiddoPaint.Tools.Toolbox.Kaleidoscope = KaleidoscopeTool;
KiddoPaint.Tools.Kaleidoscope = new KaleidoscopeTool();
