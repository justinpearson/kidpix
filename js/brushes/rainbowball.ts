KiddoPaint.Brushes.RainbowBall = function (_step: number) {
  // https://stackoverflow.com/questions/22223950/angle-gradient-in-canvas
  const canvas = document.createElement("canvas");
  const size = 100 * KiddoPaint.Current.scaling;
  canvas.width = size * 2;
  canvas.height = size * 2;
  const ctx = canvas.getContext("2d")!;

  const g1 = ctx.createRadialGradient(45, 45, 10, 52, 50, 30);
  g1.addColorStop(0, "#A7D30C");
  g1.addColorStop(0.9, "#019F62");
  g1.addColorStop(1, "rgba(1,159,98,0)");
  // draw shapes (an alternate pink radial gradient "g2" was defined but
  // never used; removed during the TypeScript conversion)
  ctx.fillStyle = g1;

  ctx.fillRect(0, 0, size, size);

  return {
    brush: canvas,
    offset: size / 2.0,
  };
};
