KiddoPaint.Brushes.FollowingSine = function (color1: string | undefined, step: number) {
  color1 = color1 || "black";
  const interval = 50;
  step = (step % interval) / interval;

  const canvasBrush = document.createElement("canvas");
  const size = 33 * KiddoPaint.Current.scaling;
  let x: number, y: number; // Declare variables to avoid global assignment
  canvasBrush.width = size * 2;
  canvasBrush.height = size * 2;
  const contextBrush = canvasBrush.getContext("2d")!;
  contextBrush.fillStyle = color1;

  for (let i = 0, s = step; i < 6; i++, s += 10 / interval) {
    x = size + size * Math.cos(2 * Math.PI * s);
    y = size + size * Math.sin(2 * Math.PI * s);
    contextBrush.fillRect(Math.round(x), Math.round(y), 3, 3);
  }

  return {
    brush: canvasBrush,
    offset: size,
    inplace: true,
  };
};

declare global {
  interface KiddoPaintBrushesRegistry {
    FollowingSine(color1: string | undefined, step: number): KidPixBrushFill;
  }
}
