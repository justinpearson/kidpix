class RectangleTool implements KiddoPaintTool {
  isDown = false;
  size = 1;
  thickness = 2;
  startEv: KidPixPointerEvent | null = null;

  // Replaced by submenu handlers; some assign textures that take the
  // start/current events (e.g. gradients).
  texture: (
    startEv?: KidPixPointerEvent | null,
    ev?: KidPixPointerEvent,
  ) => string | CanvasGradient | CanvasPattern = () =>
    KiddoPaint.Textures.None();
  stroke: () => string | CanvasGradient | CanvasPattern = () =>
    KiddoPaint.Textures.Solid(KiddoPaint.Current.color);

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.startEv = ev;
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.startEv) {
      const ctx = this.isDown
        ? KiddoPaint.Display.previewContext
        : KiddoPaint.Display.context;
      let sizex = ev._x - this.startEv._x;
      let sizey = ev._y - this.startEv._y;
      if (KiddoPaint.Current.modified) {
        // kidpix feature to keep side's lengths the same
        const signx = Math.sign(sizex);
        const signy = Math.sign(sizey);
        sizex = sizey = Math.max(Math.abs(sizex), Math.abs(sizey));
        sizex *= signx;
        sizey *= signy;
      }

      if (!KiddoPaint.Current.modifiedCtrl) {
        ctx.strokeStyle = this.stroke();
        ctx.lineWidth = this.thickness;
        ctx.strokeRect(this.startEv._x, this.startEv._y, sizex, sizey);
      }
      ctx.fillStyle = this.texture(this.startEv, ev);
      ctx.fillRect(this.startEv._x, this.startEv._y, sizex, sizey);
      KiddoPaint.Sounds.box();
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.isDown = false;
      this.mousemove(ev);
      KiddoPaint.Display.saveMain();
      this.startEv = null;
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    Rectangle: typeof RectangleTool;
  }
  interface KiddoPaintToolsRegistry {
    Rectangle: RectangleTool;
  }
}

KiddoPaint.Tools.Toolbox.Rectangle = RectangleTool;
KiddoPaint.Tools.Rectangle = new RectangleTool();
