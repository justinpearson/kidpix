class MixerPatternTool implements KiddoPaintTool {
  patternImages = [
    "img/patterns/kidpix-mixer-pattern-206.png",
    "img/patterns/kidpix-mixer-pattern-207.png",
    "img/patterns/kidpix-mixer-pattern-208.png",
    "img/patterns/kidpix-mixer-pattern-209.png",
    "img/patterns/kidpix-mixer-pattern-210.png",
    "img/patterns/kidpix-mixer-pattern-211.png",
    "img/patterns/kidpix-mixer-pattern-212.png",
    "img/patterns/kidpix-mixer-pattern-213.png",
    "img/patterns/kidpix-mixer-pattern-214.png",
    "img/patterns/kidpix-mixer-pattern-215.png",
    "img/patterns/kidpix-mixer-pattern-216.png",
    "img/patterns/kidpix-mixer-pattern-217.png",
    "img/patterns/kidpix-mixer-pattern-218.png",
    "img/patterns/kidpix-mixer-pattern-219.png",
    "img/patterns/kidpix-mixer-pattern-220.png",
    "img/patterns/kidpix-mixer-pattern-221.png",
    "img/patterns/kidpix-mixer-pattern-222.png",
    "img/patterns/kidpix-mixer-pattern-223.png",
    "img/patterns/kidpix-mixer-pattern-224.png",
    "img/patterns/kidpix-mixer-pattern-225.png",
    "img/patterns/kidpix-mixer-pattern-226.png",
    "img/patterns/kidpix-mixer-pattern-227.png",
    "img/patterns/kidpix-mixer-pattern-228.png",
    "img/patterns/kidpix-mixer-pattern-229.png",
    "img/patterns/kidpix-mixer-pattern-230.png",
  ];

  mousedown = () => {
    KiddoPaint.Sounds.mixerframe();
    const image = new Image();
    image.src = this.patternImages.random();
    image.crossOrigin = "anonymous";
    image.onload = function () {
      const ctx = KiddoPaint.Display.context;
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = ctx.createPattern(
        window.scaleImageDataCanvasAPIPixelated(image, 4),
        "repeat",
      )!;
      ctx.fillRect(
        0,
        0,
        KiddoPaint.Display.canvas.width,
        KiddoPaint.Display.canvas.height,
      );
      KiddoPaint.Display.saveMain();
    };
  };
  mousemove = () => {};
  mouseup = () => {};
}
KiddoPaint.Tools.Toolbox.MixerPattern = MixerPatternTool;
KiddoPaint.Tools.MixerPattern = new MixerPatternTool();
