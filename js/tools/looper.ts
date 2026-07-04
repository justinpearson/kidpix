class LooperTool implements KiddoPaintTool {
  isDown = false;
  size = 5;
  radius = 32;
  lstep = 0;
  lincr = 0.15;
  previousCoord: { x: number; y: number } | null = null;
  soundduring: () => void = () => {};

  stroke: () => string | CanvasGradient | CanvasPattern = () =>
    KiddoPaint.Textures.Solid(
      KiddoPaint.Current.modifiedMeta
        ? KiddoPaint.Colors.randomColor()
        : KiddoPaint.Current.color,
    );

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.previousCoord = {
      x: ev._x + this.radius * Math.sin(-this.lstep),
      y: ev._y + this.radius * Math.cos(this.lstep),
    };
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown && this.previousCoord) {
      const x = ev._x + this.radius * Math.sin(-this.lstep);
      const y = ev._y + this.radius * Math.cos(this.lstep);

      KiddoPaint.Display.context.beginPath();
      KiddoPaint.Display.context.strokeStyle = this.stroke();
      KiddoPaint.Display.context.lineWidth = this.size;
      KiddoPaint.Display.context.lineCap = "round";
      KiddoPaint.Display.context.lineJoin = "round";
      KiddoPaint.Display.context.moveTo(
        this.previousCoord.x,
        this.previousCoord.y,
      );
      KiddoPaint.Display.context.lineTo(x, y);
      KiddoPaint.Display.context.stroke();
      KiddoPaint.Display.context.closePath();

      this.soundduring();
      this.lstep += this.lincr;

      this.previousCoord = {
        x: x,
        y: y,
      };
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.mousemove(ev);
      this.isDown = false;
      KiddoPaint.Display.saveMain();
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    Looper: typeof LooperTool;
  }
  interface KiddoPaintToolsRegistry {
    Looper: LooperTool;
  }
}

KiddoPaint.Tools.Toolbox.Looper = LooperTool;
KiddoPaint.Tools.Looper = new LooperTool();
