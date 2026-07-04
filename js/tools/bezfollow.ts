function offsetBezPoints(bezPoints: number[][], offsetAmount: number) {
  const startPt = bezPoints[0];
  const ctrl1 = bezPoints[1];
  const ctrl2 = bezPoints[2];
  const stopPt = bezPoints[3];

  return [
    [startPt[0] + offsetAmount, startPt[1] + offsetAmount],
    [ctrl1[0] + offsetAmount, ctrl1[1] + offsetAmount],
    [ctrl2[0] + offsetAmount, ctrl2[1] + offsetAmount],
    [stopPt[0] + offsetAmount, stopPt[1] + offsetAmount],
  ];
}

function calculateInterval(
  startPt: number[],
  ctrl1: number[],
  ctrl2: number[],
  stopPt: number[],
) {
  const approxDistance = window.bezierLength(startPt, ctrl1, ctrl2, stopPt);
  return Math.round(approxDistance / 3.5);
}

class BezFollowTool implements KiddoPaintTool {
  isDown = false;
  previousEv: KidPixPointerEvent | null = null;
  spacing = 25;
  // The synthetic tool this tool "drives" along the fitted curve; wired by
  // submenu handlers. {} satisfies the all-optional tool interface.
  synthtool: KiddoPaintTool = {};
  ylimit = {
    min: 5000,
    max: -1,
  };
  points: number[][] = [];

  size = () => {
    return KiddoPaint.Tools.Pencil.size;
  };

  texture = () => {
    return KiddoPaint.Tools.Pencil.texture();
  };

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.points = [];
    this.mousemove(ev);
    this.previousEv = ev;
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      if (ev._y < this.ylimit.min) {
        this.ylimit.min = ev._y;
      }
      if (ev._y > this.ylimit.max) {
        this.ylimit.max = ev._y;
      }

      if (
        this.previousEv == null ||
        window.distanceBetween(this.previousEv, ev) > this.spacing
      ) {
        this.points.push([ev._x, ev._y]);
        this.previousEv = ev;
      }
      this.points.forEach((pt) => {
        KiddoPaint.Display.previewContext.fillStyle = "#0f0";
        KiddoPaint.Display.previewContext.fillRect(pt[0], pt[1], 5, 5);
      });
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.isDown = false;
      this.points.push([ev._x, ev._y]);
      KiddoPaint.Display.clearPreview();

      // calling synthetic tools have their own propagation to main, so pause undo state capture
      KiddoPaint.Display.pauseUndo();
      this.bumpLimits(); // pad sizing and alpha a bit
      this.renderFitLine();
      KiddoPaint.Display.resumeUndo();

      KiddoPaint.Display.saveMain();
      this.ylimit = {
        min: 5000,
        max: -1,
      };
    }
  };

  bumpLimits = () => {
    this.ylimit.min -= 15;
    this.ylimit.max += 15;
  };

  renderFitLine = () => {
    const fitted = window.fitCurve(this.points, 25);
    if (fitted) {
      const oldMultiplier = KiddoPaint.Current.scaling;
      const oldAlpha = KiddoPaint.Display.context.globalAlpha;
      let lastSegmentEv: KidPixPoint | null = null;
      const startScaling = 5; // top heavy when start > end
      const endScaling = 1;
      const startAlpha = 0;
      const endAlpha = oldAlpha;

      const applyLimits = (pt: KidPixPoint) => {
        KiddoPaint.Current.scaling = window.remap(
          this.ylimit.min,
          this.ylimit.max,
          startScaling,
          endScaling,
          pt._y,
        );
        KiddoPaint.Display.context.globalAlpha = window.remap(
          this.ylimit.min,
          this.ylimit.max,
          startAlpha,
          endAlpha,
          pt._y,
        );
      };

      fitted.forEach((element) => {
        for (let i = 0; i < 1; i++) {
          const offsetElement = offsetBezPoints(element, 11 * i);

          const startPt = offsetElement[0];
          const ctrl1 = offsetElement[1];
          const ctrl2 = offsetElement[2];
          const stopPt = offsetElement[3];

          let fakeEv = window.getCubicBezierXYatPercent(
            startPt,
            ctrl1,
            ctrl2,
            stopPt,
            0,
          );
          applyLimits(fakeEv);

          // fake events are plain {_x,_y} points, driven through the
          // duck-typed tool handlers
          if (!lastSegmentEv) {
            this.synthtool.mousedown?.(fakeEv as KidPixPointerEvent);
          } else {
            this.synthtool.mousemove?.(lastSegmentEv as KidPixPointerEvent);
          }

          const interval = calculateInterval(startPt, ctrl1, ctrl2, stopPt);

          for (let n = 0; n <= interval; n++) {
            fakeEv = window.getCubicBezierXYatPercent(
              startPt,
              ctrl1,
              ctrl2,
              stopPt,
              n / (interval * 1.0),
            );
            applyLimits(fakeEv);

            this.synthtool.mousemove?.(fakeEv as KidPixPointerEvent);
            //KiddoPaint.Current.scaling *= 1.002;
          }
          fakeEv = window.getCubicBezierXYatPercent(
            startPt,
            ctrl1,
            ctrl2,
            stopPt,
            1,
          );
          applyLimits(fakeEv);
          this.synthtool.mousemove?.(fakeEv as KidPixPointerEvent);
          lastSegmentEv = fakeEv;
        }
      });
      if (lastSegmentEv) {
        KiddoPaint.Current.scaling = window.remap(
          this.ylimit.min,
          this.ylimit.max,
          startScaling,
          endScaling,
          (lastSegmentEv as KidPixPoint)._y,
        );
        this.synthtool.mouseup?.(lastSegmentEv as KidPixPointerEvent);
      }

      // reset any changed values
      KiddoPaint.Current.scaling = oldMultiplier;
      KiddoPaint.Display.context.globalAlpha = oldAlpha;
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    BezFollow: typeof BezFollowTool;
  }
  interface KiddoPaintToolsRegistry {
    BezFollow: BezFollowTool;
  }
}

KiddoPaint.Tools.Toolbox.BezFollow = BezFollowTool;
KiddoPaint.Tools.BezFollow = new BezFollowTool();
