class PencilTool implements KiddoPaintTool {
  isDown = false;
  lastX = 0;
  lastY = 0;
  size = 7;

  // Replaced by submenu handlers to change the pencil's texture. Some
  // callers (bezfollow, smoothpen) invoke it with no argument.
  texture: (color?: string) => string | CanvasGradient | CanvasPattern = (
    color,
  ) => KiddoPaint.Textures.Solid(color);

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.lastX = ev._x;
    this.lastY = ev._y;
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      KiddoPaint.Sounds.pencil();
      KiddoPaint.Display.context.beginPath();
      KiddoPaint.Display.context.strokeStyle = this.texture(
        KiddoPaint.Current.color,
      );
      KiddoPaint.Display.context.lineWidth =
        this.size * KiddoPaint.Current.scaling;
      KiddoPaint.Display.context.lineCap = "round";
      KiddoPaint.Display.context.lineJoin = "round";
      KiddoPaint.Display.context.moveTo(this.lastX, this.lastY);
      KiddoPaint.Display.context.lineTo(ev._x, ev._y);
      KiddoPaint.Display.context.stroke();
      this.lastX = ev._x;
      this.lastY = ev._y;
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.mousemove(ev);
      KiddoPaint.Display.context.closePath();
      this.isDown = false;
      KiddoPaint.Display.saveMain();
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    Pencil: typeof PencilTool;
  }
  interface KiddoPaintToolsRegistry {
    Pencil: PencilTool;
  }
}

KiddoPaint.Tools.Toolbox.Pencil = PencilTool;
KiddoPaint.Tools.Pencil = new PencilTool();
