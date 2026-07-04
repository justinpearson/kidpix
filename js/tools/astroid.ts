class AstroidTool implements KiddoPaintTool {
  size = 1;
  points: { x: number; y: number }[] = [];

  stroke: () => string | CanvasGradient | CanvasPattern = () =>
    KiddoPaint.Current.color;

  // http://mathworld.wolfram.com/Astroid.html
  drawAstroid = (
    pt1: { x: number; y: number },
    pt2: { x: number; y: number },
    pt3: { x: number; y: number },
  ) => {
    const interval = 37 * KiddoPaint.Current.scaling;

    const seg1deltax = (pt2.x - pt1.x) / interval;
    const seg1deltay = (pt2.y - pt1.y) / interval;

    const seg2deltax = (pt3.x - pt2.x) / interval;
    const seg2deltay = (pt3.y - pt2.y) / interval;

    for (let i = 0; i <= interval; i++) {
      const a1 = {
        x: pt1.x + seg1deltax * i,
        y: pt1.y + seg1deltay * i,
      };
      const a2 = {
        x: pt2.x + seg2deltax * i,
        y: pt2.y + seg2deltay * i,
      };
      KiddoPaint.Display.context.beginPath();
      KiddoPaint.Display.context.lineWidth = this.size;
      KiddoPaint.Display.context.moveTo(Math.round(a1.x), Math.round(a1.y));
      KiddoPaint.Display.context.lineTo(Math.round(a2.x), Math.round(a2.y));
      if (KiddoPaint.Current.modifiedMeta) {
        KiddoPaint.Display.context.strokeStyle =
          KiddoPaint.Colors.randomColor();
      } else if (KiddoPaint.Current.modifiedCtrl) {
        KiddoPaint.Display.context.strokeStyle =
          i % 2 ? KiddoPaint.Current.color : KiddoPaint.Current.altColor;
      } else {
        KiddoPaint.Display.context.strokeStyle = KiddoPaint.Current.color;
      }
      KiddoPaint.Display.context.stroke();
      KiddoPaint.Display.context.closePath();
    }
  };

  mousedown = (ev: KidPixPointerEvent) => {
    KiddoPaint.Sounds.xyStart();
    this.points.push({
      x: ev._x,
      y: ev._y,
    });
  };

  mousemove = (ev: KidPixPointerEvent) => {
    KiddoPaint.Display.clearTmp();
    if (this.points.length == 1) {
      KiddoPaint.Sounds.xyDuring();
      KiddoPaint.Display.context.beginPath();
      KiddoPaint.Display.context.moveTo(
        Math.round(this.points[0].x),
        Math.round(this.points[0].y),
      );
      KiddoPaint.Display.context.lineTo(ev._x, ev._y);
      KiddoPaint.Display.context.strokeStyle = this.stroke();
      KiddoPaint.Display.context.lineWidth = this.size;
      KiddoPaint.Display.context.stroke();
      KiddoPaint.Display.context.closePath();
    } else if (this.points.length == 2) {
      KiddoPaint.Sounds.xyDuring();
      this.drawAstroid(this.points[0], this.points[1], {
        x: ev._x,
        y: ev._y,
      });
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.points.length == 3) {
      KiddoPaint.Sounds.xyEnd();
      KiddoPaint.Display.clearTmp();
      this.drawAstroid(this.points[0], this.points[1], {
        x: ev._x,
        y: ev._y,
      });
      this.points = [];
      KiddoPaint.Display.saveMain();
    }
  };
}
KiddoPaint.Tools.Toolbox.Astroid = AstroidTool;
KiddoPaint.Tools.Astroid = new AstroidTool();
