KiddoPaint.Brushes.LeakyPen = (function () {
  let prevSize = 3;
  const baseSize = 3;
  const maxSize = Math.PI * baseSize * Math.E;

  return function (color1: string | undefined, distPrev: number | null) {
    color1 = color1 || "black";
    // null coerced to 0 in the untyped version; keep that behavior
    if ((distPrev ?? 0) < 2) {
      if (prevSize < maxSize) {
        prevSize += 0.15;
      }
    } else {
      prevSize = baseSize;
    }

    const size = prevSize * KiddoPaint.Current.scaling;

    const canvasBrush = document.createElement("canvas");
    canvasBrush.width = size * 4.5;
    canvasBrush.height = size * 4.5;
    const contextBrush = canvasBrush.getContext("2d")!;

    contextBrush.beginPath();
    contextBrush.ellipse(
      size * 1.5,
      size * 1.5,
      size,
      size,
      Math.PI / 4,
      0,
      2 * Math.PI,
    );
    contextBrush.fillStyle = color1;
    contextBrush.fill();
    contextBrush.closePath();

    return {
      brush: canvasBrush,
      offset: canvasBrush.width / 2,
    };
  };
})();

declare global {
  interface KiddoPaintBrushesRegistry {
    LeakyPen(color1: string | undefined, distPrev: number | null): KidPixBrushFill;
  }
}
