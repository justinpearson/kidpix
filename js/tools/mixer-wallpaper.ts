class MixerWallpaperTool implements KiddoPaintTool {
  isDown = false;
  animInterval = 50;
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
    if (this.isDown && this.currentEv) {
      KiddoPaint.Sounds.mixerwallpaper();
      // alpha hide hack
      KiddoPaint.Display.animContext.fillStyle = "white";
      KiddoPaint.Display.animContext.fillRect(
        0,
        0,
        KiddoPaint.Display.main_canvas.width,
        KiddoPaint.Display.main_canvas.height,
      );

      // random source
      const rx = this.currentEv._x;
      const ry = this.currentEv._y;

      const rwidth = KiddoPaint.Display.canvas.width / 3.0;
      const rheight = KiddoPaint.Display.canvas.height / 3.0;

      const sourceImage = KiddoPaint.Display.main_context.getImageData(
        rx,
        ry,
        rwidth,
        rheight,
      );

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // kidpix has this jitter which decays the edges....
          KiddoPaint.Display.context.putImageData(
            sourceImage,
            rwidth * i + window.getRandomInt(1, 4),
            rheight * j + window.getRandomInt(1, 4),
          );
        }
      }
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    MixerWallpaper: typeof MixerWallpaperTool;
  }
  interface KiddoPaintToolsRegistry {
    MixerWallpaper: MixerWallpaperTool;
  }
}

KiddoPaint.Tools.Toolbox.MixerWallpaper = MixerWallpaperTool;
KiddoPaint.Tools.MixerWallpaper = new MixerWallpaperTool();
