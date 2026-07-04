KiddoPaint.Brushes.RotatingPentagon = function (color1: string | undefined, step: number) {
  color1 = color1 || "black";
  const interval = 50;
  step = (step % interval) / interval;

  const canvasBrush = document.createElement("canvas");
  const size = 33 * KiddoPaint.Current.scaling;
  canvasBrush.width = size * 2;
  canvasBrush.height = size * 2;
  const contextBrush = canvasBrush.getContext("2d")!;
  // x/y were assigned without declaration — a ReferenceError under module
  // strict mode that left this brush broken until now.
  let x: number, y: number;
  contextBrush.fillStyle = color1;
  contextBrush.strokeStyle = color1;
  contextBrush.lineWidth = 1;

  for (let i = 0, s = step; i < 6; i++, s += 10 / interval) {
    x = size + size * Math.cos(2 * Math.PI * s);
    y = size + size * Math.sin(2 * Math.PI * s);
    contextBrush.lineTo(x, y);
  }

  contextBrush.stroke();
  return {
    brush: canvasBrush,
    offset: size,
    inplace: true,
  };
};

declare global {
  interface KiddoPaintBrushesRegistry {
    RotatingPentagon(color1: string | undefined, step: number): KidPixBrushFill;
  }
}
