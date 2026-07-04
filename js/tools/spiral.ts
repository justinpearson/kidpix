class SpiralTool implements KiddoPaintTool {
  isDown = false;

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    drawSpiral(ev._x, ev._y);
    processMainCanvas();
  };

  mousemove = () => {};

  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
      KiddoPaint.Display.saveMain();
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    Spiral: typeof SpiralTool;
  }
  interface KiddoPaintToolsRegistry {
    Spiral: SpiralTool;
  }
}

KiddoPaint.Tools.Toolbox.Spiral = SpiralTool;
KiddoPaint.Tools.Spiral = new SpiralTool();

function drawSpiral(cx: number, cy: number) {
  const width = 5000;
  const height = 5000;

  const phi = (Math.sqrt(5) + 1) / 2 - 1;
  const golden_angle = phi * 2 * Math.PI;

  const lg_area = width * height;

  const points: { x: number; y: number }[] = [];

  const sm_area = golden_angle * 3;
  const nbr_circles = lg_area / sm_area;

  for (let i = 1; i <= nbr_circles; ++i) {
    const angle = i * golden_angle;
    const cum_area = i * sm_area;
    const spiral_rad = Math.sqrt(cum_area / Math.PI);
    const x = cx + Math.cos(angle) * spiral_rad;
    const y = cy + Math.sin(angle) * spiral_rad;
    points.push({
      x: x,
      y: y,
    });
    //KiddoPaint.Display.context.fillRect(Math.round(x), Math.round(y), 1, 1);
  }

  const distance = function (
    a: { x: number; y: number },
    b: { x: number; y: number },
  ) {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  };
  KiddoPaint.Current.kdspiral = new window.kdTree(points, distance, ["x", "y"]);
}

function processMainCanvas() {
  const w = KiddoPaint.Display.main_canvas.width;
  const h = KiddoPaint.Display.main_canvas.height;

  const pixels = KiddoPaint.Display.main_context.getImageData(0, 0, w, h);

  function isBlack(n: number) {
    return (
      pixels.data[n] == 0 &&
      pixels.data[n + 1] == 0 &&
      pixels.data[n + 2] == 0 &&
      pixels.data[n + 3] == 255
    );
  }

  function isWhite(n: number) {
    return (
      pixels.data[n] == 255 &&
      pixels.data[n + 1] == 255 &&
      pixels.data[n + 2] == 255 &&
      pixels.data[n + 3] == 255
    );
  }

  function isAlone(x: number, y: number) {
    const above = ((y - 1) * w + x) * 4;
    const abover = ((y - 1) * w + (x + 1)) * 4;
    const abovel = ((y - 1) * w + (x - 1)) * 4;

    const below = ((y + 1) * w + x) * 4;
    const belowr = ((y + 1) * w + (x + 1)) * 4;
    const belowl = ((y + 1) * w + (x - 1)) * 4;

    const left = (y * w + (x - 1)) * 4;
    const right = (y * w + (x + 1)) * 4;

    return (
      isBlack(above) &&
      isBlack(below) &&
      isBlack(right) &&
      isBlack(left) &&
      isBlack(abover) &&
      isBlack(abovel) &&
      isBlack(belowr) &&
      isBlack(belowl)
    );
  }

  const snaptospiral: { x: number; y: number }[] = [];
  // i/j were assigned without declaration — a ReferenceError under module
  // strict mode that left the Spiral tool broken.
  for (let i = 1; i < w - 1; i++) {
    for (let j = 1; j < h - 1; j++) {
      const linear_cords = 4 * (j * w + i);

      if (isWhite(linear_cords) && isAlone(i, j)) {
        // turn off
        pixels.data[linear_cords + 0] = 0;
        pixels.data[linear_cords + 1] = 0;
        pixels.data[linear_cords + 2] = 0;
        pixels.data[linear_cords + 3] = 255;

        // look for closes
        const nearest = KiddoPaint.Current.kdspiral!.nearest(
          {
            x: i,
            y: j,
          },
          1,
        );
        snaptospiral.push(nearest[0][0]);
      }
    }
  }
  KiddoPaint.Display.clearMain();
  KiddoPaint.Display.main_context.putImageData(pixels, 0, 0);
  KiddoPaint.Display.context.fillStyle = "white";
  //    console.log(snaptospiral.length);
  snaptospiral.forEach((element) =>
    KiddoPaint.Display.context.fillRect(
      Math.round(element.x),
      Math.round(element.y),
      1,
      1,
    ),
  );
}
