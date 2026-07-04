class EraserFadeAwayTool implements KiddoPaintTool {
  mousedown = () => {
    const ctx = KiddoPaint.Display.context;
    setTimeout(function () {
      KiddoPaint.Sounds.eraserfadeb();
      ctx.fillStyle = KiddoPaint.Textures.Screen1();
      ctx.fillRect(
        0,
        0,
        KiddoPaint.Display.canvas.width,
        KiddoPaint.Display.canvas.height,
      );
    }, 500);
    setTimeout(function () {
      KiddoPaint.Sounds.eraserfadea();
      ctx.fillStyle = KiddoPaint.Textures.Screen2();
      ctx.fillRect(
        0,
        0,
        KiddoPaint.Display.canvas.width,
        KiddoPaint.Display.canvas.height,
      );
      ctx.fillStyle = KiddoPaint.Textures.Screen3();
      ctx.fillRect(
        0,
        0,
        KiddoPaint.Display.canvas.width,
        KiddoPaint.Display.canvas.height,
      );
    }, 1200);
    setTimeout(function () {
      KiddoPaint.Sounds.eraserfadeb();
      ctx.fillStyle = KiddoPaint.Textures.Screen4();
      ctx.fillRect(
        0,
        0,
        KiddoPaint.Display.canvas.width,
        KiddoPaint.Display.canvas.height,
      );
    }, 1900);
    setTimeout(function () {
      KiddoPaint.Display.clearAll();
    }, 2000);
  };
  mousemove = () => {};
  mouseup = () => {};
}
declare global {
  interface KiddoPaintToolbox {
    EraserFadeAway: typeof EraserFadeAwayTool;
  }
  interface KiddoPaintToolsRegistry {
    EraserFadeAway: EraserFadeAwayTool;
  }
}

KiddoPaint.Tools.Toolbox.EraserFadeAway = EraserFadeAwayTool;
KiddoPaint.Tools.EraserFadeAway = new EraserFadeAwayTool();
