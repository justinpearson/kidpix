KiddoPaint.Brushes.RainbowDoughnut = function (_step: number) {
  // https://stackoverflow.com/questions/22223950/angle-gradient-in-canvas
  const canvas = document.createElement("canvas");
  const size = 32 * KiddoPaint.Current.scaling;
  canvas.width = size * 2;
  canvas.height = size * 2;
  const ctx = canvas.getContext("2d")!;

  function drawMultiRadiantCircle(
    xc: number,
    yc: number,
    r: number,
    radientColors: string[],
  ) {
    const partLength = (2 * Math.PI) / radientColors.length;
    let start = 0;

    for (let i = 0; i < radientColors.length; i++) {
      const startColor = radientColors[i];
      const endColor = radientColors[(i + 1) % radientColors.length];

      // x start / end of the next arc to draw
      const xStart = xc + Math.cos(start) * r;
      const xEnd = xc + Math.cos(start + partLength) * r;
      // y start / end of the next arc to draw
      const yStart = yc + Math.sin(start) * r;
      const yEnd = yc + Math.sin(start + partLength) * r;

      ctx.beginPath();

      const gradient = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd);
      gradient.addColorStop(0, startColor);
      gradient.addColorStop(1.0, endColor);

      ctx.strokeStyle = gradient;
      ctx.arc(xc, yc, r, start, start + partLength);
      ctx.lineWidth = size / 4;
      ctx.stroke();
      ctx.closePath();

      start += partLength;
    }
  }

  const someColors: string[] = [];
  someColors.push("#0F0");
  someColors.push("#0FF");
  someColors.push("#F00");
  someColors.push("#FF0");
  someColors.push("#F0F");

  drawMultiRadiantCircle(size / 2, size / 2, size / 3, someColors);

  return {
    brush: canvas,
    offset: size / 2.0,
  };
};

declare global {
  interface KiddoPaintBrushesRegistry {
    RainbowDoughnut(step: number): KidPixBrushFill;
  }
}
