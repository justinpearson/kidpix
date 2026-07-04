class LineTool implements KiddoPaintTool {
  isDown = false;
  size = 7;
  stomp = true;
  x = 0;
  y = 0;

  // Replaced by submenu handlers to change the line's texture.
  texture: () => string | CanvasGradient | CanvasPattern = () =>
    KiddoPaint.Textures.Solid(KiddoPaint.Current.color);

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.x = ev._x;
    this.y = ev._y;
    KiddoPaint.Sounds.lineStart();
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      if (this.stomp) {
        KiddoPaint.Display.clearTmp();
      }
      KiddoPaint.Sounds.lineDuring();

      KiddoPaint.Display.context.beginPath();
      KiddoPaint.Display.context.moveTo(Math.round(this.x), Math.round(this.y));
      if (KiddoPaint.Current.modified) {
        // deltax/deltay were assigned without declaration — a ReferenceError
        // under module strict mode that broke Shift-constrained lines.
        const deltax = Math.abs(ev._x - this.x);
        const deltay = Math.abs(ev._y - this.y);
        if (deltax < deltay) {
          KiddoPaint.Display.context.lineTo(this.x, ev._y);
        } else {
          KiddoPaint.Display.context.lineTo(ev._x, this.y);
        }
      } else {
        KiddoPaint.Display.context.lineTo(ev._x, ev._y);
      }
      KiddoPaint.Display.context.strokeStyle = this.texture();
      KiddoPaint.Display.context.lineWidth = this.size;
      KiddoPaint.Display.context.stroke();
      KiddoPaint.Display.context.closePath();
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.mousemove(ev);
      this.isDown = false;
      KiddoPaint.Display.saveMain();
      KiddoPaint.Sounds.lineEnd();
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    Line: typeof LineTool;
  }
  interface KiddoPaintToolsRegistry {
    Line: LineTool;
  }
}

KiddoPaint.Tools.Toolbox.Line = LineTool;
KiddoPaint.Tools.Line = new LineTool();
