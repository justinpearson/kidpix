class SpritePlacerTool implements KiddoPaintTool {
  isDown = false;
  image: HTMLCanvasElement | HTMLImageElement | null = null;
  prevTool: KiddoPaintTool = {};
  size: { width?: number; height?: number } = {};
  soundBefore: () => void = () => {};
  soundDuring: () => void = () => {};

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.mousemove(ev);
    this.soundBefore();
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (!this.image) return;
    const image = this.image;
    const ctx = this.isDown
      ? KiddoPaint.Display.context
      : KiddoPaint.Display.previewContext;

    // https://stackoverflow.com/a/37388113
    function drawImageff(
      img: HTMLCanvasElement | HTMLImageElement,
      x: number,
      y: number,
      width: number | undefined,
      height: number | undefined,
      flip: boolean,
      flop: boolean,
      center: boolean,
    ) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;

      // kidpix supported 3 different sizes of stamps
      const scaledImg = window.scaleImageDataCanvasAPIPixelated(
        img,
        1 *
          KiddoPaint.Current.scaling *
          (KiddoPaint.Current.modifiedCtrl ? 3 : 1),
      );

      if (typeof width === "undefined") width = scaledImg.width;
      if (typeof height === "undefined") height = scaledImg.height;
      // Set rotation point to center of image, instead of top/left
      if (center) {
        x -= width / 2;
        y -= height / 2;
      }

      // Set the origin to the center of the image
      ctx.translate(x + width / 2, y + height / 2);

      // Flip/flop the canvas
      ctx.scale(flip ? -1 : 1, flop ? -1 : 1);

      // Draw the image
      ctx.drawImage(scaledImg, -width / 2, -height / 2);

      ctx.restore();
    }

    if (this.isDown) {
      this.soundDuring();
    }

    drawImageff(
      image,
      ev._x,
      ev._y,
      this.size.width,
      this.size.height,
      KiddoPaint.Current.modifiedAlt,
      KiddoPaint.Current.modifiedMeta,
      true,
    );
  };

  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
      KiddoPaint.Display.saveMain();
      this.size = {};
    }
  };
}
KiddoPaint.Tools.Toolbox.SpritePlacer = SpritePlacerTool;
KiddoPaint.Tools.SpritePlacer = new SpritePlacerTool();
