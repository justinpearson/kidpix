class ContoursTool implements KiddoPaintTool {
  isDown = false;
  size = 2;
  x = 0;
  y = 0;

  stroke: () => string | CanvasGradient | CanvasPattern = () =>
    KiddoPaint.Textures.Solid(
      KiddoPaint.Current.modified
        ? KiddoPaint.Colors.randomColor()
        : KiddoPaint.Current.color,
    );

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.x = ev._x;
    this.y = ev._y;
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      KiddoPaint.Sounds.brushnorthern();
      KiddoPaint.Display.context.beginPath();
      KiddoPaint.Display.context.strokeStyle = this.stroke();
      KiddoPaint.Display.context.lineWidth = this.size;
      if (KiddoPaint.Current.modifiedAlt) {
        KiddoPaint.Display.context.moveTo(this.x, ev._y);
      } else {
        KiddoPaint.Display.context.moveTo(ev._x, this.y);
      }
      KiddoPaint.Display.context.lineTo(ev._x, ev._y);
      KiddoPaint.Display.context.stroke();
      KiddoPaint.Display.context.closePath();
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
KiddoPaint.Tools.Toolbox.Contours = ContoursTool;
KiddoPaint.Tools.Contours = new ContoursTool();
