KiddoPaint.Tools.Toolbox.MixerShadowBoxes = function () {
  var tool = this;
  this.isDown = false;
  this.animInterval = 50;
  this.timeout = null;

  this.mousedown = function (ev) {
    tool.isDown = true;
    KiddoPaint.Display.context.save();
    KiddoPaint.Display.canvas.classList = "";
    KiddoPaint.Display.canvas.classList.add("cursor-guy-wow");
    const interval = tool.animInterval;
    tool.timeout = setTimeout(function draw() {
      tool.toolDraw();
      if (!tool.timeout) return;
      tool.timeout = setTimeout(draw, interval);
    }, interval);
    tool.toolDraw();
  };

  this.mousemove = function (ev) {};

  this.mouseup = function (ev) {
    if (tool.isDown) {
      tool.isDown = false;
      KiddoPaint.Display.context.restore();
      KiddoPaint.Display.canvas.classList = "";
      KiddoPaint.Display.canvas.classList.add("cursor-guy-smile");
      if (tool.timeout) {
        clearTimeout(tool.timeout);
        tool.timeout = null;
      }
      KiddoPaint.Display.saveMain();
    }
  };

  this.toolDraw = function () {
    if (tool.isDown) {
      KiddoPaint.Sounds.mixershadowbox();

      const minSize = 0.05 * KiddoPaint.Display.canvas.width;
      const maxSize = 0.2 * KiddoPaint.Display.canvas.width;

      // random source
      const rx = getRandomFloat(0, KiddoPaint.Display.canvas.width);
      const ry = getRandomFloat(0, KiddoPaint.Display.canvas.height);
      const rwidth = getRandomFloat(minSize, maxSize);
      const rheight = getRandomFloat(minSize, maxSize);
      // random dest
      const rdx = getRandomFloat(-25, KiddoPaint.Display.canvas.width);
      const rdy = getRandomFloat(-25, KiddoPaint.Display.canvas.height);

      var sourceImage = KiddoPaint.Display.main_context.getImageData(
        rx,
        ry,
        rwidth,
        rheight,
      );

      KiddoPaint.Display.context.shadowColor = KiddoPaint.Current.modifiedMeta
        ? KiddoPaint.Colors.randomAllColor()
        : "black";
      KiddoPaint.Display.context.shadowBlur = 4;
      KiddoPaint.Display.context.lineWidth = 4;
      KiddoPaint.Display.context.shadowOffsetX = 2;
      KiddoPaint.Display.context.shadowOffsetY = 2;

      KiddoPaint.Display.context.strokeStyle = KiddoPaint.Current.color;
      KiddoPaint.Display.context.strokeRect(rdx, rdy, rwidth, rheight);
      KiddoPaint.Display.context.putImageData(sourceImage, rdx, rdy);
    }
  };
};
KiddoPaint.Tools.MixerShadowBoxes =
  new KiddoPaint.Tools.Toolbox.MixerShadowBoxes();
