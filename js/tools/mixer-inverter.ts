class MixerInverterTool implements KiddoPaintTool {
  isDown = false;
  leftside: ImageData | null = null;
  rightside: ImageData | null = null;

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;

    this.leftside = KiddoPaint.Display.main_context.getImageData(
      0,
      0,
      KiddoPaint.Display.main_canvas.width / 2,
      KiddoPaint.Display.main_canvas.height,
    );
    this.rightside = KiddoPaint.Display.main_context.getImageData(
      KiddoPaint.Display.main_canvas.width / 2,
      0,
      KiddoPaint.Display.main_canvas.width / 2,
      KiddoPaint.Display.main_canvas.height,
    );
    this.animate(ev);
  };

  mousemove = () => {};

  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
      this.leftside = null;
      this.rightside = null;
    }
  };

  animate = (ev: KidPixPointerEvent) => {
    // set by mousedown immediately before animate() is called
    if (!this.leftside || !this.rightside) return;
    let iter = 1;
    const right = window.flattenImage(this.rightside);
    const left = window.flattenImage(this.leftside);

    KiddoPaint.Display.animContext.putImageData(left, 0, 0);
    KiddoPaint.Display.animContext.putImageData(
      right,
      KiddoPaint.Display.main_canvas.width / 2,
      0,
    );

    KiddoPaint.Tools.WholeCanvasEffect.effect = window.JumbleFx.INVERT;
    KiddoPaint.Tools.WholeCanvasEffect.mousedown(ev);
    KiddoPaint.Tools.WholeCanvasEffect.mouseup();

    KiddoPaint.Sounds.mixerinvert(); // estimated duration: 1.393107 sec

    const intervalID = setInterval(drawSlideOut, 20); // 20ms frames
    drawSlideOut();

    function drawSlideOut() {
      const totalIter = 70; // 1393 / 20
      const step = KiddoPaint.Display.main_canvas.width / 2 / totalIter;

      KiddoPaint.Display.clearAnim();
      KiddoPaint.Display.animContext.putImageData(left, 0 - iter * step, 0);
      KiddoPaint.Display.animContext.putImageData(
        right,
        KiddoPaint.Display.main_canvas.width / 2 + iter * step,
        0,
      );
      iter++;
      if (iter > totalIter) {
        clearInterval(intervalID);
        KiddoPaint.Display.clearAnim();
      }
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    MixerInverter: typeof MixerInverterTool;
  }
  interface KiddoPaintToolsRegistry {
    MixerInverter: MixerInverterTool;
  }
}

KiddoPaint.Tools.Toolbox.MixerInverter = MixerInverterTool;
KiddoPaint.Tools.MixerInverter = new MixerInverterTool();
