KiddoPaint.Brushes.Icy = function (color1?: string) {
  color1 = color1 || "black";

  const radius = 32 * KiddoPaint.Current.scaling * KiddoPaint.Current.multiplier;
  const density = window.clamp(
    0,
    2000,
    600 * KiddoPaint.Current.scaling * KiddoPaint.Current.multiplier,
  );

  const canvasBrush = document.createElement("canvas");
  canvasBrush.width = 32;
  canvasBrush.height = 400;
  const contextBrush = canvasBrush.getContext("2d")!;
  contextBrush.fillStyle = color1;

  function delicatespray() {
    const px = 0.4 * (KiddoPaint.Current.multiplier < 6 ? 1 : 2);
    const x = window.randn_bm(-5, 5, 1);
    const y = window.randn_bm(-radius, radius, 5);
    contextBrush.fillRect(x, radius + y, px, px);
  }

  for (let i = 0; i < density; i++) {
    contextBrush.globalAlpha = Math.random() / 2;
    delicatespray();
  }

  return {
    brush: canvasBrush,
    offset: 0,
  };
};

declare global {
  interface KiddoPaintBrushesRegistry {
    Icy(color1?: string): KidPixBrushFill;
  }
}
