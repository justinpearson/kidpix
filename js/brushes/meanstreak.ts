KiddoPaint.Brushes.MeanStreak = function (step: number) {
  const canvasBrush = document.createElement("canvas");
  const size = 32 * KiddoPaint.Current.scaling;
  canvasBrush.width = size * 2;
  canvasBrush.height = size * 2;
  const contextBrush = canvasBrush.getContext("2d")!;

  const transforms: GlobalCompositeOperation[] = [
    "source-in",
    "source-out",
    "destination-atop",
    "screen",
    "overlay",
    "soft-light",
    "lighter",
    "exclusion",
    "luminosity",
  ];

  const c = window.makeComposite(transforms[KiddoPaint.Current.multiplier]);

  contextBrush.translate(size / 2, size / 2);
  contextBrush.rotate((step % 360) * (Math.PI / 180));
  contextBrush.translate(-size / 2, -size / 2);
  contextBrush.drawImage(c, 0, 0, c.width, c.height, 0, 0, size, size);

  return {
    brush: canvasBrush,
    offset: size / 2.0,
  };
};
