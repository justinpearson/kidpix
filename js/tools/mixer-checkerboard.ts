class MixerCheckerboardTool implements KiddoPaintTool {
  mousedown = () => {
    const ctx = KiddoPaint.Display.context;
    ctx.fillStyle = KiddoPaint.Textures.BigGrid();
    ctx.fillRect(
      0,
      0,
      KiddoPaint.Display.canvas.width,
      KiddoPaint.Display.canvas.height,
    );
    KiddoPaint.Display.saveMainGco("difference");
  };

  mousemove = () => {};

  mouseup = () => {};
}
KiddoPaint.Tools.Toolbox.MixerCheckerboard = MixerCheckerboardTool;
KiddoPaint.Tools.MixerCheckerboard = new MixerCheckerboardTool();
