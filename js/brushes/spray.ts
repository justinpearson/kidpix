KiddoPaint.Brushes.Spray = function (color1?: string, color2?: string) {
  color1 = color1 || "black";
  color2 = color2 || "black";

  const radius = 10 * KiddoPaint.Current.scaling * KiddoPaint.Current.multiplier;
  const density =
    128 * KiddoPaint.Current.scaling * KiddoPaint.Current.multiplier;

  const canvasBrush = document.createElement("canvas");
  canvasBrush.width = radius * 2;
  canvasBrush.height = radius * 2;
  const contextBrush = canvasBrush.getContext("2d")!;
  contextBrush.fillStyle = color1;

  function ring() {
    const theta = Math.random() * 2 * Math.PI;
    const r1 = radius;
    const r2 = radius * 0.75;
    const rp = Math.random() + 0.33;

    const dist = Math.sqrt(
      Math.abs(window.ziggurat()) * (r1 * r1 - r2 * r2) + r2 * r2,
    );
    const xr = dist * Math.cos(theta);
    const yr = dist * Math.sin(theta);
    contextBrush.fillRect(radius + xr, radius + yr, rp, rp);
  }

  function disc() {
    // disc
    const rr = window.ziggurat() * radius * 1.1;
    const ra = Math.random() * 2 * Math.PI;
    const rp = Math.random();
    const x = Math.cos(ra) * rr;
    const y = Math.sin(ra) * rr;
    contextBrush.fillRect(radius + x, radius + y, rp, rp);
  }

  for (let i = 0; i < density; i++) {
    if (KiddoPaint.Current.modifiedToggle) {
      contextBrush.fillStyle = color1;
      if (KiddoPaint.Current.modifiedMeta) {
        contextBrush.globalAlpha = Math.random() / 4;
      } else {
        contextBrush.globalAlpha = Math.random() / 2;
      }
      ring();
      if (KiddoPaint.Current.modifiedMeta) {
        contextBrush.globalAlpha = Math.random() / 3;
        contextBrush.fillStyle = color2;
        disc();
      }
    } else {
      contextBrush.globalAlpha = Math.random() / 2;
      disc();
    }
  }
  return {
    brush: canvasBrush,
    offset: radius,
  };
};
