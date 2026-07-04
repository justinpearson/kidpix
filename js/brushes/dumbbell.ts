KiddoPaint.Brushes.Dumbbell = function (color1?: string, color2?: string) {
  color1 = color1 || "black";
  color2 = color2 || "black";

  const radius = 25 * KiddoPaint.Current.scaling * KiddoPaint.Current.multiplier;
  const density =
    128 * KiddoPaint.Current.scaling * KiddoPaint.Current.multiplier;

  const canvasBrush = document.createElement("canvas");
  canvasBrush.width = radius * 2;
  canvasBrush.height = radius * 2;
  const contextBrush = canvasBrush.getContext("2d")!;
  contextBrush.fillStyle = color1;

  function bar() {
    const rr = window.ziggurat() * radius;
    const ra = Math.random() * 2 * Math.PI;
    const x = Math.cos(ra) * rr;
    const y = (Math.sin(ra) * rr) / 11;
    contextBrush.fillRect(radius + x, radius + y, 0.7, 0.7);
  }

  for (let i = 0; i < density; i++) {
    contextBrush.globalAlpha = Math.random() / 2;
    bar();
  }
  return {
    brush: canvasBrush,
    offset: radius,
  };
};

declare global {
  interface KiddoPaintBrushesRegistry {
    Dumbbell(color1?: string, color2?: string): KidPixBrushFill;
  }
}
