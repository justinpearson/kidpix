class EraserLettersTool implements KiddoPaintTool {
  isDown = false;
  animInterval = 10;
  timeout: ReturnType<typeof setTimeout> | null = null;

  mousedown = () => {
    this.isDown = true;
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
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      KiddoPaint.Display.clearAnim();
      KiddoPaint.Display.clearAll();
    }
  };

  toolDraw = () => {
    if (this.isDown) {
      KiddoPaint.Sounds.mixershadowbox();
      const rx = window.getRandomFloat(-10, KiddoPaint.Display.canvas.width);
      const ry = window.getRandomFloat(-10, KiddoPaint.Display.canvas.height);
      const rs = window.getRandomInt(24, 500);
      const rl = window.getRandomLetter();

      KiddoPaint.Display.animContext.fillStyle = "white";
      KiddoPaint.Display.animContext.fillRect(rx, ry, rs / 2, rs / 2);

      KiddoPaint.Display.animContext.font = rs + "px serif";
      KiddoPaint.Display.animContext.textBaseline = "top";
      KiddoPaint.Display.animContext.textAlign = "center";

      KiddoPaint.Display.animContext.fillStyle =
        KiddoPaint.Colors.randomAllColor();
      KiddoPaint.Display.animContext.strokeStyle =
        KiddoPaint.Colors.randomAllColor();
      if (Math.random() > 0.25) {
        KiddoPaint.Display.animContext.fillText(" " + rl, rx, ry);
      } else {
        KiddoPaint.Display.animContext.strokeText(" " + rl, rx, ry);
      }
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    EraserLetters: typeof EraserLettersTool;
  }
  interface KiddoPaintToolsRegistry {
    EraserLetters: EraserLettersTool;
  }
}

KiddoPaint.Tools.Toolbox.EraserLetters = EraserLettersTool;
KiddoPaint.Tools.EraserLetters = new EraserLettersTool();
