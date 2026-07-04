class ThreeDBrushTool implements KiddoPaintTool {
  isDown = false;
  previousEv: KidPixPointerEvent | null = null;
  spacing = 3;
  soundduring: () => void = () => {};

  size = () => {
    return 16 * KiddoPaint.Current.scaling;
  };

  texture: () => string | CanvasGradient | CanvasPattern = () => {
    const shadecolor = window.colorNearWhite(
      window.color2json(KiddoPaint.Current.color),
    )
      ? "black"
      : "white";
    if (KiddoPaint.Current.modifiedAlt) {
      return KiddoPaint.Textures.Bubbles(shadecolor);
    } else if (KiddoPaint.Current.modifiedCtrl) {
      return KiddoPaint.Textures.Speckles(shadecolor);
    } else if (KiddoPaint.Current.modifiedMeta) {
      return KiddoPaint.Textures.Sand(shadecolor);
    } else {
      return KiddoPaint.Textures.Partial1(shadecolor);
    }
  };

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.mousemove(ev);
    this.previousEv = ev;
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      if (KiddoPaint.Current.modifiedToggle) {
        ev._x = ev._x - (ev._x % this.size());
        ev._y = ev._y - (ev._y % this.size());
      }
      if (
        this.previousEv == null ||
        window.distanceBetween(this.previousEv, ev) < this.spacing
      ) {
        KiddoPaint.Display.context.fillStyle = KiddoPaint.Current.color;
        KiddoPaint.Display.context.fillRect(
          Math.round(ev._x),
          Math.round(ev._y),
          this.size(),
          this.size(),
        );

        KiddoPaint.Display.context.fillStyle = this.texture();
        KiddoPaint.Display.context.fillRect(
          Math.round(ev._x),
          Math.round(ev._y),
          this.size() / 2,
          this.size() / 2,
        );
        this.soundduring();
      } else {
        const tool = this;
        window.bresenham(
          this.previousEv._x,
          this.previousEv._y,
          ev._x,
          ev._y,
          function (lx, ly) {
            KiddoPaint.Display.context.fillStyle = KiddoPaint.Current.color;
            KiddoPaint.Display.context.fillRect(
              lx,
              ly,
              tool.size(),
              tool.size(),
            );

            KiddoPaint.Display.context.fillStyle = tool.texture();
            KiddoPaint.Display.context.fillRect(
              lx,
              ly,
              tool.size() / 2,
              tool.size() / 2,
            );
            tool.soundduring();
          },
        );
      }
      this.previousEv = ev;
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.mousemove(ev);
      this.isDown = false;
      this.previousEv = null;
      KiddoPaint.Display.saveMain();
    }
  };
}
KiddoPaint.Tools.Toolbox.ThreeDBrush = ThreeDBrushTool;
KiddoPaint.Tools.ThreeDBrush = new ThreeDBrushTool();
