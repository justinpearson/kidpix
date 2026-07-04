class MixerPipTool implements KiddoPaintTool {
  isDown = false;

  mousedown = () => {
    this.isDown = true;
    KiddoPaint.Sounds.mixerpip();
  };

  mousemove = () => {};

  mouseup = () => {
    if (this.isDown) {
      KiddoPaint.Sounds.mixershadowbox();
      this.isDown = false;
      const target = KiddoPaint.Display.main_context.getImageData(
        0,
        0,
        KiddoPaint.Display.canvas.width,
        KiddoPaint.Display.canvas.height,
      );
      KiddoPaint.Tools.Placer.image = KiddoPaint.Display.imageTypeToCanvas(
        window.scaleImageData(target, 1.0 / 5.0),
        false,
      );
      KiddoPaint.Tools.Placer.size = {
        width: KiddoPaint.Display.canvas.width / 5.0,
        height: KiddoPaint.Display.canvas.width / 5.0,
      };
      KiddoPaint.Current.tool = KiddoPaint.Tools.Placer;
      KiddoPaint.Tools.Placer.prevTool = KiddoPaint.Tools.MixerPip;
    }
  };
}
KiddoPaint.Tools.Toolbox.MixerPip = MixerPipTool;
KiddoPaint.Tools.MixerPip = new MixerPipTool();
