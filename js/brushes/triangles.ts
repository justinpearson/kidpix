KiddoPaint.Brushes.Triangles = function () {
  const size = 35 * KiddoPaint.Current.scaling;

  const canvasBrush = document.createElement("canvas");
  canvasBrush.width = size * 2;
  canvasBrush.height = size * 2;
  const contextBrush = canvasBrush.getContext("2d")!;

  for (let i = 0; i < 1 + window.getRandomInt(1, 3); i++) {
    contextBrush.beginPath();
    contextBrush.moveTo(window.getRandomFloat(0, size), window.getRandomFloat(0, size));
    contextBrush.lineTo(window.getRandomFloat(0, size), window.getRandomFloat(0, size));
    contextBrush.lineTo(window.getRandomFloat(0, size), window.getRandomFloat(0, size));
    contextBrush.closePath();
    contextBrush.fillStyle = KiddoPaint.Colors.randomAllColor();
    contextBrush.fill();
  }

  return {
    brush: canvasBrush,
    offset: size / 2.0,
  };
};
