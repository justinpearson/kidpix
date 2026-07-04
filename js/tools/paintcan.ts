class PaintCanTool implements KiddoPaintTool {
  gcop: GlobalCompositeOperation = "destination-in";
  texture: (color?: string) => string | CanvasGradient | CanvasPattern = () =>
    KiddoPaint.Textures.Solid(KiddoPaint.Current.color);

  mousedown = (ev: KidPixPointerEvent) => {
    if (KiddoPaint.Current.modifiedAlt) {
      this.canvasWideReplace(ev);
    } else {
      this.boundedFill(ev);
    }
  };

  canvasWideReplace = (ev: KidPixPointerEvent) => {
    KiddoPaint.Sounds.paintcan();
    const x = ev._x;
    const y = ev._y;

    const pixels = KiddoPaint.Display.main_context.getImageData(
      0,
      0,
      KiddoPaint.Display.canvas.width,
      KiddoPaint.Display.canvas.height,
    );
    const changedPixels = new ImageData(
      KiddoPaint.Display.canvas.width,
      KiddoPaint.Display.canvas.height,
    );

    const linear_cords = (y * KiddoPaint.Display.canvas.width + x) * 4;
    const original_color = {
      r: pixels.data[linear_cords],
      g: pixels.data[linear_cords + 1],
      b: pixels.data[linear_cords + 2],
      a: pixels.data[linear_cords + 3],
    };

    const color = window.color2json(KiddoPaint.Current.color);

    if (window.colorsEqual(color, original_color)) {
      return;
    }

    const d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      if (
        pixels.data[i] == original_color.r &&
        pixels.data[i + 1] == original_color.g &&
        pixels.data[i + 2] == original_color.b &&
        pixels.data[i + 3] == original_color.a
      ) {
        changedPixels.data[i] = color.r;
        changedPixels.data[i + 1] = color.g;
        changedPixels.data[i + 2] = color.b;
        changedPixels.data[i + 3] = color.a;
      }
    }
    KiddoPaint.Display.context.putImageData(changedPixels, 0, 0);
    KiddoPaint.Display.context.globalCompositeOperation = this.gcop;
    KiddoPaint.Display.context.fillStyle = this.texture(
      KiddoPaint.Current.color,
    );
    KiddoPaint.Display.context.fillRect(
      0,
      0,
      KiddoPaint.Display.canvas.width,
      KiddoPaint.Display.canvas.height,
    );
    KiddoPaint.Display.context.globalCompositeOperation = "source-over";
    KiddoPaint.Display.saveMain();
  };

  boundedFill = (ev: KidPixPointerEvent) => {
    KiddoPaint.Sounds.paintcan();
    let x = ev._x;
    let y = ev._y;
    const pixel_stack = [
      {
        x: x,
        y: y,
      },
    ];
    const touched: number[] = [];
    // read from main_context for underlying pixels
    const pixels = KiddoPaint.Display.main_context.getImageData(
      0,
      0,
      KiddoPaint.Display.canvas.width,
      KiddoPaint.Display.canvas.height,
    );
    const changedPixels = new ImageData(
      KiddoPaint.Display.canvas.width,
      KiddoPaint.Display.canvas.height,
    );

    let linear_cords = (y * KiddoPaint.Display.canvas.width + x) * 4;
    const original_color = {
      r: pixels.data[linear_cords],
      g: pixels.data[linear_cords + 1],
      b: pixels.data[linear_cords + 2],
      a: pixels.data[linear_cords + 3],
    };

    const color = window.color2json(KiddoPaint.Current.color);

    if (window.colorsEqual(color, original_color)) {
      return;
    }

    while (pixel_stack.length > 0) {
      const new_pixel = pixel_stack.shift()!;
      x = new_pixel.x;
      y = new_pixel.y;

      linear_cords = (y * KiddoPaint.Display.canvas.width + x) * 4;
      while (
        y-- >= 0 &&
        pixels.data[linear_cords] == original_color.r &&
        pixels.data[linear_cords + 1] == original_color.g &&
        pixels.data[linear_cords + 2] == original_color.b &&
        pixels.data[linear_cords + 3] == original_color.a
      ) {
        linear_cords -= KiddoPaint.Display.canvas.width * 4;
      }
      linear_cords += KiddoPaint.Display.canvas.width * 4;
      y++;

      let reached_left = false;
      let reached_right = false;
      while (
        y++ < KiddoPaint.Display.canvas.height &&
        pixels.data[linear_cords] == original_color.r &&
        pixels.data[linear_cords + 1] == original_color.g &&
        pixels.data[linear_cords + 2] == original_color.b &&
        pixels.data[linear_cords + 3] == original_color.a
      ) {
        pixels.data[linear_cords] = color.r;
        pixels.data[linear_cords + 1] = color.g;
        pixels.data[linear_cords + 2] = color.b;
        pixels.data[linear_cords + 3] = color.a;
        touched.push(linear_cords);

        if (x > 0) {
          if (
            pixels.data[linear_cords - 4] == original_color.r &&
            pixels.data[linear_cords - 4 + 1] == original_color.g &&
            pixels.data[linear_cords - 4 + 2] == original_color.b &&
            pixels.data[linear_cords - 4 + 3] == original_color.a
          ) {
            if (!reached_left) {
              pixel_stack.push({
                x: x - 1,
                y: y,
              });
              reached_left = true;
            }
          } else if (reached_left) {
            reached_left = false;
          }
        }

        if (x < KiddoPaint.Display.canvas.width - 1) {
          if (
            pixels.data[linear_cords + 4] == original_color.r &&
            pixels.data[linear_cords + 4 + 1] == original_color.g &&
            pixels.data[linear_cords + 4 + 2] == original_color.b &&
            pixels.data[linear_cords + 4 + 3] == original_color.a
          ) {
            if (!reached_right) {
              pixel_stack.push({
                x: x + 1,
                y: y,
              });
              reached_right = true;
            }
          } else if (reached_right) {
            reached_right = false;
          }
        }

        linear_cords += KiddoPaint.Display.canvas.width * 4;
      }
    }

    for (let z = 0; z < touched.length; z++) {
      const l = touched[z];
      changedPixels.data[l] = color.r;
      changedPixels.data[l + 1] = color.g;
      changedPixels.data[l + 2] = color.b;
      changedPixels.data[l + 3] = color.a;
    }
    KiddoPaint.Display.context.putImageData(changedPixels, 0, 0);
    KiddoPaint.Display.context.globalCompositeOperation = this.gcop;
    KiddoPaint.Display.context.fillStyle = this.texture(
      KiddoPaint.Current.color,
    );
    KiddoPaint.Display.context.fillRect(
      0,
      0,
      KiddoPaint.Display.canvas.width,
      KiddoPaint.Display.canvas.height,
    );
    KiddoPaint.Display.context.globalCompositeOperation = "source-over";
    KiddoPaint.Display.saveMain(); // corrupts alpha
  };

  mousemove = () => {};
  mouseup = () => {};
}
KiddoPaint.Tools.Toolbox.PaintCan = PaintCanTool;
KiddoPaint.Tools.PaintCan = new PaintCanTool();
