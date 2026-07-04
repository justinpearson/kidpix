interface GuillocheSettings {
  outradius: number;
  inradius: number;
  r: number;
  Q: number;
  m: number;
  n: number;
}

class GuillocheTool implements KiddoPaintTool {
  isDown = false;
  minDistance = 50;
  previousEv: KidPixPointerEvent | null = null;
  randomSettings: GuillocheSettings | null = null;

  texture: () => string | CanvasGradient | CanvasPattern = () => {
    // XXX TODO FIXME add double click menu to select texture - it looks super cool
    //        return KiddoPaint.Textures.Sand(KiddoPaint.Current.color);
    return KiddoPaint.Textures.Solid(KiddoPaint.Current.color);
  };

  mousedown = (ev: KidPixPointerEvent) => {
    this.randomSettings = {
      outradius: (41 + 64 * Math.random()) * KiddoPaint.Current.scaling,
      inradius: (21 + 42 * Math.random()) * KiddoPaint.Current.scaling,
      r: -5 * Math.random(),
      Q: 7 * Math.random(),
      m: 5 * Math.random(),
      n: 10 * Math.random(),
    };

    this.isDown = true;
    this.mousemove(ev);
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (!this.isDown || !this.randomSettings) return;
    const settings = this.randomSettings;

    if (
      this.previousEv == null ||
      window.distanceBetween(this.previousEv, ev) > this.minDistance
    ) {
      KiddoPaint.Sounds.brushguil();
      KiddoPaint.Display.context.beginPath();

      KiddoPaint.Display.context.lineWidth = 0.5;
      KiddoPaint.Display.context.strokeStyle = this.texture();
      KiddoPaint.Display.context.fillStyle = this.texture();

      for (let i = 0; i < Math.PI * 4; i += 0.007) {
        const coord = window.guil(
          settings.outradius,
          settings.r,
          settings.m,
          i,
          settings.inradius,
          settings.Q,
          settings.m,
          settings.n,
        );
        if (KiddoPaint.Current.modifiedMeta) {
          KiddoPaint.Display.context.fillRect(
            Math.round(ev._x + coord.x),
            Math.round(ev._y + coord.y),
            1,
            1,
          );
        } else {
          KiddoPaint.Display.context.lineTo(
            Math.round(ev._x + coord.x),
            Math.round(ev._y + coord.y),
          );
        }
      }
      KiddoPaint.Display.context.stroke();
      KiddoPaint.Display.context.closePath();
      this.previousEv = ev;
    }
  };

  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
      this.previousEv = null;
      this.randomSettings = null;
      KiddoPaint.Display.saveMain();
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    Guilloche: typeof GuillocheTool;
  }
  interface KiddoPaintToolsRegistry {
    Guilloche: GuillocheTool;
  }
}

KiddoPaint.Tools.Toolbox.Guilloche = GuillocheTool;
KiddoPaint.Tools.Guilloche = new GuillocheTool();
