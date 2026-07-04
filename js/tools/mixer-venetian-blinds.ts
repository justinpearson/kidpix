class MixerVenetianBlindsTool implements KiddoPaintTool {
  isDown = false;
  animInterval = 100;
  timeout: ReturnType<typeof setTimeout> | null = null;
  currentEv: KidPixPointerEvent | null = null;

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.currentEv = ev;
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

  mousemove = (ev: KidPixPointerEvent) => {
    this.currentEv = ev;
  };

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
      KiddoPaint.Display.clearAnim();
      KiddoPaint.Display.clearBeforeSaveMain();
    }
  };

  toolDraw = () => {
    if (this.isDown) {
      KiddoPaint.Sounds.mixervenetian();
      // alpha hide hack
      KiddoPaint.Display.animContext.fillStyle = "white";
      KiddoPaint.Display.animContext.fillRect(
        0,
        0,
        KiddoPaint.Display.main_canvas.width,
        KiddoPaint.Display.main_canvas.height,
      );

      const rwidth = KiddoPaint.Display.canvas.width;
      const rheight = KiddoPaint.Display.canvas.height / 10;

      const blinds: ImageData[] = [];
      for (let i = 0; i < 10; i++) {
        const sourceImage = KiddoPaint.Display.main_context.getImageData(
          0,
          rheight * i,
          rwidth,
          rheight,
        );
        blinds[i] = sourceImage;
      }

      window.fisherYatesArrayShuffle(blinds);

      for (let i = 0; i < 10; i++) {
        KiddoPaint.Display.context.putImageData(blinds[i], 0, rheight * i);
      }
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    MixerVenetianBlinds: typeof MixerVenetianBlindsTool;
  }
  interface KiddoPaintToolsRegistry {
    MixerVenetianBlinds: MixerVenetianBlindsTool;
  }
}

KiddoPaint.Tools.Toolbox.MixerVenetianBlinds = MixerVenetianBlindsTool;
KiddoPaint.Tools.MixerVenetianBlinds = new MixerVenetianBlindsTool();
