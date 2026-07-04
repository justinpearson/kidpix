class InkTool implements KiddoPaintTool {
  isDown = false;
  size = 36;
  scale = 1;
  gfx: any;
  initialClick: KidPixPointerEvent | null = null;

  constructor() {
    try {
      this.gfx = window.fx.canvas();
    } catch {
      this.gfx = null; // graceful fallback when WebGL unavailable
    }
  }

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.initialClick = ev;
    this.mousemove(ev);
  };

  mousemove = (ev: KidPixPointerEvent) => {
    // Completes the graceful WebGL fallback: previously a hover with no
    // WebGL context still threw here on every mousemove.
    if (!this.gfx) return;
    const target = KiddoPaint.Display.main_context.getImageData(
      ev._x - this.size,
      ev._y - this.size,
      2 * this.size,
      2 * this.size,
    );
    const ctx = this.isDown
      ? KiddoPaint.Display.context
      : KiddoPaint.Display.previewContext;

    const t = this.gfx.texture(target);
    // var moo = tool.gfx.draw(t).ink(0.25).update();
    const moo = this.gfx
      .draw(t)
      .edgeWork(this.size / 2)
      .update();
    ctx.drawImage(
      moo,
      ev._x - this.scale * this.size,
      ev._y - this.scale * this.size,
    );
    t.destroy();
  };

  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
      KiddoPaint.Display.saveMain();
    }
  };
}
KiddoPaint.Tools.Toolbox.Ink = InkTool;
KiddoPaint.Tools.Ink = new InkTool();
