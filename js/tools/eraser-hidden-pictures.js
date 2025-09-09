KiddoPaint.Tools.Toolbox.EraserHiddenPicture = function () {
  var tool = this;
  this.hiddenPictures = [
    "img/hidden-pictures/kp-h-bear.png",
    "img/hidden-pictures/kp-h-bison.png",
    "img/hidden-pictures/kp-h-corn.png",
    "img/hidden-pictures/kp-h-eye.png",
    "img/hidden-pictures/kp-h-fox.png",
    "img/hidden-pictures/kp-h-horse.png",
    "img/hidden-pictures/kp-h-hummingbird.png",
    "img/hidden-pictures/kp-h-ladybug.png",
    "img/hidden-pictures/kp-h-lion.png",
    "img/hidden-pictures/kp-h-magnet.png",
    "img/hidden-pictures/kp-h-moth.png",
    "img/hidden-pictures/kp-h-octopus.png",
  ];
  this.isDown = false;
  this.size = 32;
  this.hiddenPattern = null;

  this.reset = function () {
    const image = new Image();
    image.src = tool.hiddenPictures.random();
    image.crossOrigin = "anonymous";
    image.onload = function () {
      tool.hiddenPattern = makePatternFromImage(image);
    };
  };

  this.mousedown = function (ev) {
    tool.isDown = true;
  };

  this.mousemove = function (ev) {
    const currentSize = tool.size * KiddoPaint.Current.scaling;
    if (tool.isDown) {
      KiddoPaint.Sounds.eraser();
      var ctx = KiddoPaint.Display.context;
      ctx.fillStyle = tool.hiddenPattern;
      ctx.fillRect(
        Math.round(ev._x) - currentSize / 2.0,
        Math.round(ev._y) - currentSize / 2.0,
        currentSize,
        currentSize,
      );
    } else {
      var ctx = KiddoPaint.Display.previewContext;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.strokeRect(
        Math.round(ev._x) - currentSize / 2.0,
        Math.round(ev._y) - currentSize / 2.0,
        currentSize,
        currentSize,
      );
      ctx.fillRect(
        Math.round(ev._x) - currentSize / 2.0,
        Math.round(ev._y) - currentSize / 2.0,
        currentSize,
        currentSize,
      );
    }
  };

  this.mouseup = function (ev) {
    if (tool.isDown) {
      tool.isDown = false;
      KiddoPaint.Display.saveMain();
    }
  };
};
KiddoPaint.Tools.EraserHiddenPicture =
  new KiddoPaint.Tools.Toolbox.EraserHiddenPicture();
