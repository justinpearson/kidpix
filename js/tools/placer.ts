class PlacerTool implements KiddoPaintTool {
  isDown = false;
  image: HTMLCanvasElement | HTMLImageElement | null = null;
  // {} satisfies the all-optional tool interface; matches the old
  // "reset to empty object" behavior after placing.
  prevTool: KiddoPaintTool = {};
  size: { width?: number; height?: number } = {};

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.mousemove(ev);
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
      if (typeof width === "undefined") width = img.width;
      if (typeof height === "undefined") height = img.height;
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
      ctx.drawImage(img, -width / 2, -height / 2);
      ctx.restore();
    }

    if (KiddoPaint.Current.modifiedRange != 0) {
      const scale = 1 + KiddoPaint.Current.modifiedRange / 100.0;
      const scaledImg = window.scaleImageDataCanvasAPI(image, scale);
      drawImageff(
        scaledImg,
        ev._x,
        ev._y,
        this.size.width !== undefined ? this.size.width * scale : undefined,
        this.size.height !== undefined ? this.size.height * scale : undefined,
        KiddoPaint.Current.modifiedAlt,
        KiddoPaint.Current.modifiedMeta,
        true,
      );
    } else {
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
    }
  };

  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
      this.image = null;
      KiddoPaint.Display.saveMain();
      KiddoPaint.Current.tool = this.prevTool;
      window.reset_ranges();
      this.prevTool = {};
      this.size = {};
    }
  };
}
KiddoPaint.Tools.Toolbox.Placer = PlacerTool;
KiddoPaint.Tools.Placer = new PlacerTool();
