class ScribbleTool implements KiddoPaintTool {
  isDown = false;
  previousEv: KidPixPointerEvent | null = null;
  spacing = 5;
  size = 1;

  texture: () => string | CanvasGradient | CanvasPattern = () =>
    KiddoPaint.Textures.Solid(KiddoPaint.Current.color);

  jitter = () => {
    const baseJitter = KiddoPaint.Current.modifiedMeta ? 25 : 10;
    return baseJitter + Math.random() * baseJitter;
  };

  mousedown = (ev: KidPixPointerEvent) => {
    KiddoPaint.Sounds.brushzigzag();
    this.isDown = true;
    KiddoPaint.Display.context.beginPath();
    KiddoPaint.Display.context.moveTo(ev._x, ev._y);
    this.previousEv = ev;
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      if (
        this.previousEv == null ||
        window.distanceBetween(this.previousEv, ev) > this.spacing
      ) {
        KiddoPaint.Sounds.brushzigzag();
        const jitterx = this.jitter();
        const jittery = this.jitter();
        KiddoPaint.Display.context.lineTo(
          ev._x + (Math.random() * jitterx - jitterx / 2),
          ev._y + (Math.random() * jittery - jittery / 2),
        );
        KiddoPaint.Display.context.strokeStyle = this.texture();
        KiddoPaint.Display.context.lineWidth = this.size;
        KiddoPaint.Display.context.stroke();
        this.previousEv = ev;
      }
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.mousemove(ev);
      this.isDown = false;
      this.previousEv = null;
      KiddoPaint.Display.context.closePath();
      KiddoPaint.Display.saveMain();
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    Scribble: typeof ScribbleTool;
  }
  interface KiddoPaintToolsRegistry {
    Scribble: ScribbleTool;
  }
}

KiddoPaint.Tools.Toolbox.Scribble = ScribbleTool;
KiddoPaint.Tools.Scribble = new ScribbleTool();
