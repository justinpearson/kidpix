KiddoPaint.Brushes.Splatters = function () {
  const size = 27 * KiddoPaint.Current.scaling;

  const canvasBrush = document.createElement("canvas");
  canvasBrush.width = size * 2;
  canvasBrush.height = size * 2;
  const contextBrush = canvasBrush.getContext("2d")!;

  for (let i = 0; i < 2 + window.getRandomInt(1, 3); i++) {
    const csize = window.getRandomFloat(1, 7);
    contextBrush.beginPath();
    contextBrush.arc(
      size + window.getRandomFloat(-size / 2.0, size / 2.0),
      size + window.getRandomFloat(-size / 2.0, size / 2.0),
      csize,
      0,
      2 * Math.PI,
    );
    contextBrush.fillStyle = KiddoPaint.Colors.randomAllColor();
    contextBrush.fill();
    //contextBrush.lineWidth = 2;
    //contextBrush.strokeStyle = color2;
    //contextBrush.stroke();
    contextBrush.closePath();
  }

  return {
    brush: canvasBrush,
    offset: size / 2.0,
  };
};

declare global {
  interface KiddoPaintBrushesRegistry {
    Splatters(): KidPixBrushFill;
  }
}
