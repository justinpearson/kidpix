KiddoPaint.Brushes.Raindrops = function (color1?: string) {
  color1 = color1 || "black";
  const size = (5 + 100 * Math.random()) * KiddoPaint.Current.scaling;

  const canvasBrush = document.createElement("canvas");
  canvasBrush.width = size * 2;
  canvasBrush.height = size * 2;
  const contextBrush = canvasBrush.getContext("2d")!;

  contextBrush.beginPath();
  contextBrush.arc(size, size, size / 2, 0, 2 * Math.PI);
  contextBrush.fillStyle = color1;
  contextBrush.fill();
  //contextBrush.lineWidth = 2;
  //contextBrush.strokeStyle = color2;
  //contextBrush.stroke();
  contextBrush.closePath();

  return {
    brush: canvasBrush,
    abspos: {
      x: window.getRandomFloat(-5, KiddoPaint.Display.canvas.width + 5),
      y: window.getRandomFloat(-5, KiddoPaint.Display.canvas.width + 5),
    },
  };
};
