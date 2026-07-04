class MixerShadowBoxesTool implements KiddoPaintTool {
  isDown = false;
  animInterval = 50;
  timeout: ReturnType<typeof setTimeout> | null = null;

  mousedown = () => {
    this.isDown = true;
    KiddoPaint.Display.context.save();
    KiddoPaint.Display.canvas.className = "";
    KiddoPaint.Display.canvas.classList.add("cursor-guy-wow");
    const tool = this;
    const interval = this.animInterval;
    this.timeout = setTimeout(function draw() {
      tool.toolDraw();
      if (!tool.timeout) return;
      tool.timeout = setTimeout(draw, interval);
    }, interval);
    this.toolDraw();
  };

  mousemove = () => {};

  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
      KiddoPaint.Display.context.restore();
      KiddoPaint.Display.canvas.className = "";
      KiddoPaint.Display.canvas.classList.add("cursor-guy-smile");
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      KiddoPaint.Display.saveMain();
    }
  };

  toolDraw = () => {
    if (this.isDown) {
      KiddoPaint.Sounds.mixershadowbox();

      const minSize = 0.05 * KiddoPaint.Display.canvas.width;
      const maxSize = 0.2 * KiddoPaint.Display.canvas.width;

      // random source
      const rx = window.getRandomFloat(0, KiddoPaint.Display.canvas.width);
      const ry = window.getRandomFloat(0, KiddoPaint.Display.canvas.height);
      const rwidth = window.getRandomFloat(minSize, maxSize);
      const rheight = window.getRandomFloat(minSize, maxSize);
      // random dest
      const rdx = window.getRandomFloat(-25, KiddoPaint.Display.canvas.width);
      const rdy = window.getRandomFloat(-25, KiddoPaint.Display.canvas.height);

      const sourceImage = KiddoPaint.Display.main_context.getImageData(
        rx,
        ry,
        rwidth,
        rheight,
      );

      KiddoPaint.Display.context.shadowColor = KiddoPaint.Current.modifiedMeta
        ? KiddoPaint.Colors.randomAllColor()
        : "black";
      KiddoPaint.Display.context.shadowBlur = 4;
      KiddoPaint.Display.context.lineWidth = 4;
      KiddoPaint.Display.context.shadowOffsetX = 2;
      KiddoPaint.Display.context.shadowOffsetY = 2;

      KiddoPaint.Display.context.strokeStyle = KiddoPaint.Current.color;
      KiddoPaint.Display.context.strokeRect(rdx, rdy, rwidth, rheight);
      KiddoPaint.Display.context.putImageData(sourceImage, rdx, rdy);
    }
  };
}
KiddoPaint.Tools.Toolbox.MixerShadowBoxes = MixerShadowBoxesTool;
KiddoPaint.Tools.MixerShadowBoxes = new MixerShadowBoxesTool();
