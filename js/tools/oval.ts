class OvalTool implements KiddoPaintTool {
  isDown = false;
  size = 1;
  thickness = 2;
  stomp = true;
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
    if (this.isDown && this.startEv) {
      const startEv = this.startEv;
      if (this.stomp) {
        KiddoPaint.Display.clearTmp();
      }
      KiddoPaint.Sounds.circle();
      KiddoPaint.Display.context.beginPath();
      KiddoPaint.Display.context.fillStyle = this.texture(startEv, ev);
      KiddoPaint.Display.context.strokeStyle = this.stroke();
      KiddoPaint.Display.context.lineWidth = this.thickness;
      if (KiddoPaint.Current.modifiedMeta) {
        KiddoPaint.Display.context.arc(
          startEv._x,
          startEv._y,
          window.distanceBetween(ev, {
            _x: startEv._x,
            _y: startEv._y,
          }),
          0,
          2 * Math.PI,
        );
      } else if (KiddoPaint.Current.modified) {
        KiddoPaint.Display.context.arc(
          (ev._x + startEv._x) / 2.0,
          (ev._y + startEv._y) / 2.0,
          0.5 *
            window.distanceBetween(ev, {
              _x: startEv._x,
              _y: startEv._y,
            }),
          0,
          2 * Math.PI,
        );
      } else {
        const sizex = Math.abs(ev._x - startEv._x);
        const sizey = Math.abs(ev._y - startEv._y);
        KiddoPaint.Display.context.ellipse(
          (ev._x + startEv._x) / 2.0,
          (ev._y + startEv._y) / 2.0,
          sizex,
          sizey,
          0,
          0,
          2 * Math.PI,
        );
      }
      KiddoPaint.Display.context.fill();
      if (!KiddoPaint.Current.modifiedCtrl) {
        KiddoPaint.Display.context.stroke();
      }
      KiddoPaint.Display.context.closePath();
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.mousemove(ev);
      this.isDown = false;
      this.startEv = null;
      KiddoPaint.Display.saveMain();
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    Oval: typeof OvalTool;
  }
  interface KiddoPaintToolsRegistry {
    Oval: OvalTool;
  }
}

KiddoPaint.Tools.Toolbox.Oval = OvalTool;
KiddoPaint.Tools.Oval = new OvalTool();
