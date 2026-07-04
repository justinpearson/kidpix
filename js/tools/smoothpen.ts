/** Bezier segment endpoints/controls plus the rainbow color for this line. */
type SmoothPenSegment = [number[], number[], number[], number[], string];

function offsetPoints(
  bezPoints: number[][],
  xoffsetAmount: number,
  yoffsetAmount: number,
  index: number,
): SmoothPenSegment {
  const colors = KiddoPaint.Colors.rainbowPalette();
  const startPt = bezPoints[0];
  const ctrl1 = bezPoints[1];
  const ctrl2 = bezPoints[2];
  const stopPt = bezPoints[3];

  return [
    [startPt[0] + xoffsetAmount, startPt[1] + yoffsetAmount],
    [ctrl1[0] + xoffsetAmount, ctrl1[1] + yoffsetAmount],
    [ctrl2[0] + xoffsetAmount, ctrl2[1] + yoffsetAmount],
    [stopPt[0] + xoffsetAmount, stopPt[1] + yoffsetAmount],
    colors[index],
  ];
}

class SmoothPenTool implements KiddoPaintTool {
  isDown = false;
  previousEv: KidPixPointerEvent | null = null;
  spacing = 25;
  points: number[][] = [];
  rainbowMode = false;

  size = () => {
    return KiddoPaint.Tools.Pencil.size;
  };

  texture = () => {
    this.rainbowMode = KiddoPaint.Tools.Pencil.texture
      .toString()
      .includes("RSolid");
    return KiddoPaint.Tools.Pencil.texture();
  };

  mousedown = () => {
    this.isDown = true;
    this.points = [];
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      if (
        this.previousEv == null ||
        window.distanceBetween(this.previousEv, ev) > this.spacing
      ) {
        this.points.push([ev._x, ev._y]);
        this.previousEv = ev;
      }
      this.renderFitLine(KiddoPaint.Display.previewContext);
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.isDown = false;
      this.points.push([ev._x, ev._y]);
      KiddoPaint.Display.clearPreview();
      this.renderFitLine(KiddoPaint.Display.context);
      KiddoPaint.Display.saveMain();
    }
  };

  renderFitLine = (ctx: CanvasRenderingContext2D) => {
    const fitted = window.fitCurve(this.points, 75);
    if (fitted) {
      ctx.strokeStyle = this.texture();
      ctx.lineWidth = this.size();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const lines = this.rainbowMode ? 7 : 1;

      fitted.forEach((element) => {
        for (let i = 0; i < lines; i++) {
          const offsetElement = offsetPoints(element, 0, 11 * i, i);

          const startPt = offsetElement[0];
          const ctrl1 = offsetElement[1];
          const ctrl2 = offsetElement[2];
          const stopPt = offsetElement[3];
          const rainbowColor = this.rainbowMode ? offsetElement[4] : null;

          ctx.beginPath();
          if (rainbowColor) {
            ctx.strokeStyle = rainbowColor;
          }
          ctx.moveTo(startPt[0], startPt[1]);
          ctx.bezierCurveTo(
            ctrl1[0],
            ctrl1[1],
            ctrl2[0],
            ctrl2[1],
            stopPt[0],
            stopPt[1],
          );
          ctx.stroke();
          ctx.closePath();
        }
      });
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    SmoothPen: typeof SmoothPenTool;
  }
  interface KiddoPaintToolsRegistry {
    SmoothPen: SmoothPenTool;
  }
}

KiddoPaint.Tools.Toolbox.SmoothPen = SmoothPenTool;
KiddoPaint.Tools.SmoothPen = new SmoothPenTool();
