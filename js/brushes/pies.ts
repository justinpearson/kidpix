KiddoPaint.Brushes.Pies = function (color1?: string) {
  color1 = color1 || "black";

  const canvasBrush = document.createElement("canvas");
  const size = 20 * KiddoPaint.Current.scaling;
  let offset: number; // Declare variable to avoid global assignment
  canvasBrush.width = size * 2;
  canvasBrush.height = size * 2;
  const contextBrush = canvasBrush.getContext("2d")!;

  contextBrush.beginPath();
  contextBrush.arc(size, size, size, 0, Math.PI * 2);
  contextBrush.fillStyle = color1;
  if (KiddoPaint.Current.modifiedMeta) {
    contextBrush.stroke();
  } else {
    contextBrush.fill();
  }
  contextBrush.closePath();

  contextBrush.globalCompositeOperation = "destination-out";
  contextBrush.beginPath();
  contextBrush.fillStyle = color1;
  offset = Math.random() * 2 * Math.PI;
  contextBrush.arc(
    size,
    size,
    size + 2,
    0 + offset,
    (0.5 + Math.random() - 0.5) * Math.PI + offset,
  );
  contextBrush.lineTo(size, size);
  contextBrush.fill();

  return {
    brush: canvasBrush,
    offset: size,
  };
};

declare global {
  interface KiddoPaintBrushesRegistry {
    Pies(color1?: string): KidPixBrushFill;
  }
}
