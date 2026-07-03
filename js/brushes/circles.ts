KiddoPaint.Brushes.Circles = (function () {
  let flip = 0;

  return function (color1?: string, color2?: string, alwaysFill?: boolean) {
    color1 = color1 || "black";
    color2 = color2 || color1;
    alwaysFill = alwaysFill || false;
    const size = 20 * KiddoPaint.Current.scaling;

    const canvasBrush = document.createElement("canvas");
    canvasBrush.width = size * 2;
    canvasBrush.height = size * 2;
    const contextBrush = canvasBrush.getContext("2d")!;

    contextBrush.beginPath();
    contextBrush.arc(size, size, size / 2, 0, 2 * Math.PI);
    if (alwaysFill || flip % 2 == 0) {
      contextBrush.fillStyle = color1;
      contextBrush.fill();
    }
    contextBrush.lineWidth = 2;
    contextBrush.strokeStyle = color2;
    contextBrush.stroke();
    contextBrush.closePath();
    flip++;

    return {
      brush: canvasBrush,
      offset: size,
    };
  };
})();

KiddoPaint.Brushes.RCircles = function () {
  const color1 = KiddoPaint.Colors.randomColor();
  const color2 = KiddoPaint.Colors.randomColor();
  return KiddoPaint.Brushes.Circles(color1, color2, true);
};
