KiddoPaint.Brushes.Rose = function (color1: string | undefined, step: number) {
  color1 = color1 || "black";
  const interval = 257;
  const fraction = interval / 7;
  const k = 5;
  step = (step % interval) / interval;

  const canvasBrush = document.createElement("canvas");
  const size = 50 * KiddoPaint.Current.scaling;
  canvasBrush.width = size * 2;
  canvasBrush.height = size * 2;
  const contextBrush = canvasBrush.getContext("2d")!;
  // x/y were assigned without declaration — a ReferenceError under module
  // strict mode that left this brush broken until now.
  let x: number, y: number;
  contextBrush.fillStyle = color1;
  contextBrush.strokeStyle = color1;

  for (let i = 0, s = step; i < 6; i++, s += fraction / interval) {
    x = size + size * Math.cos(k * 2 * Math.PI * s) * Math.cos(2 * Math.PI * s);
    y = size + size * Math.cos(k * 2 * Math.PI * s) * Math.sin(2 * Math.PI * s);
    //		contextBrush.fillRect(Math.round(x), Math.round(y), 3, 3);
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
    Rose(color1: string | undefined, step: number): KidPixBrushFill;
  }
}
