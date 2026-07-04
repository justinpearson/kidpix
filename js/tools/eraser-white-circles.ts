class EraserWhiteCirclesTool implements KiddoPaintTool {
  isDown = false;
  size = 10;

  reset = () => {
    this.size = 25;
  };

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.mousemove(ev);
  };

  mousemove = (_ev: KidPixPointerEvent) => {
    if (this.isDown) {
      KiddoPaint.Sounds.bubblepops();
      const currentSize = this.size * KiddoPaint.Current.scaling;
      const ctx = KiddoPaint.Display.context;
      ctx.fillStyle = "white";
      ctx.beginPath();
      const rx = window.getRandomFloat(0, KiddoPaint.Display.canvas.width);
      const ry = window.getRandomFloat(0, KiddoPaint.Display.canvas.height);
      ctx.arc(rx, ry, currentSize, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
      if (this.size < 200) this.size += 1;
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.mousemove(ev);
      this.isDown = false;
      KiddoPaint.Display.saveMainGco("destination-out");
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    EraserWhiteCircles: typeof EraserWhiteCirclesTool;
  }
  interface KiddoPaintToolsRegistry {
    EraserWhiteCircles: EraserWhiteCirclesTool;
  }
}

KiddoPaint.Tools.Toolbox.EraserWhiteCircles = EraserWhiteCirclesTool;
KiddoPaint.Tools.EraserWhiteCircles = new EraserWhiteCirclesTool();
