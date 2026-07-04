KiddoPaint.Brushes.Twirly = function (color1: string | undefined, step: number) {
  color1 = color1 || "black";
  step = (step % 24) / 24;

  const canvasBrush = document.createElement("canvas");
  const size = 25 * KiddoPaint.Current.scaling;
  let x: number, y: number; // Declare variables to avoid global assignment
  canvasBrush.width = size * 2;
  canvasBrush.height = size * 2;
  const contextBrush = canvasBrush.getContext("2d")!;

  contextBrush.beginPath();
  contextBrush.moveTo(size, size);
  x = size + size * Math.cos(2 * Math.PI * step);
  y = size + size * Math.sin(2 * Math.PI * step);
  contextBrush.lineTo(x, y);
  contextBrush.strokeStyle = color1;
  contextBrush.lineWidth = 1;
  contextBrush.stroke();
  contextBrush.closePath();

  return {
    brush: canvasBrush,
    offset: size,
    inplace: true,
  };
};

declare global {
  interface KiddoPaintBrushesRegistry {
    Twirly(color1: string | undefined, step: number): KidPixBrushFill;
  }
}
