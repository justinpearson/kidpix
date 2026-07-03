// Canvas-trimming helpers adapted from:
//   https://gist.github.com/timdown/021d9c8f2aabc7092df564996f5afbbf
// (Two earlier variants, trimCanvas and trimCanvas2, were dead code —
// unreachable module-scope functions with no callers — and were removed
// during the TypeScript conversion.)

const trimCanvas3 = (function () {
  function rowBlank(imageData: ImageData, width: number, y: number): boolean {
    for (let x = 0; x < width; ++x) {
      if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) return false;
    }
    return true;
  }

  function columnBlank(
    imageData: ImageData,
    width: number,
    x: number,
    top: number,
    bottom: number,
  ): boolean {
    for (let y = top; y < bottom; ++y) {
      if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) return false;
    }
    return true;
  }

  return function (canvas: HTMLCanvasElement): HTMLCanvasElement {
    if (canvas.width == 0 || canvas.height == 0) return canvas;
    const ctx = canvas.getContext("2d")!;
    const width = canvas.width;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let top = 0,
      bottom = imageData.height,
      left = 0,
      right = imageData.width;

    while (top < bottom && rowBlank(imageData, width, top)) ++top;
    while (bottom - 1 > top && rowBlank(imageData, width, bottom - 1)) --bottom;
    while (left < right && columnBlank(imageData, width, left, top, bottom))
      ++left;
    while (
      right - 1 > left &&
      columnBlank(imageData, width, right - 1, top, bottom)
    )
      --right;

    const trimmed = ctx.getImageData(left, top, right - left, bottom - top);
    const copy = canvas.ownerDocument.createElement("canvas");
    const copyCtx = copy.getContext("2d", { willReadFrequently: true })!;
    copy.width = trimmed.width;
    copy.height = trimmed.height;
    copyCtx.putImageData(trimmed, 0, 0);

    return copy;
  };
})();

const trimAndFlattenCanvas = (function () {
  function rowBlank(imageData: ImageData, width: number, y: number): boolean {
    for (let x = 0; x < width; ++x) {
      if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) return false;
    }
    return true;
  }

  function columnBlank(
    imageData: ImageData,
    width: number,
    x: number,
    top: number,
    bottom: number,
  ): boolean {
    for (let y = top; y < bottom; ++y) {
      if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) return false;
    }
    return true;
  }

  return function (canvas: HTMLCanvasElement): HTMLCanvasElement {
    if (canvas.width == 0 || canvas.height == 0) return canvas;
    const ctx = canvas.getContext("2d")!;
    const width = canvas.width;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let top = 0,
      bottom = imageData.height,
      left = 0,
      right = imageData.width;

    while (top < bottom && rowBlank(imageData, width, top)) ++top;
    while (bottom - 1 > top && rowBlank(imageData, width, bottom - 1)) --bottom;
    while (left < right && columnBlank(imageData, width, left, top, bottom))
      ++left;
    while (
      right - 1 > left &&
      columnBlank(imageData, width, right - 1, top, bottom)
    )
      --right;

    const trimmed = ctx.getImageData(left, top, right - left, bottom - top);
    const copy = canvas.ownerDocument.createElement("canvas");
    const copyCtx = copy.getContext("2d", { willReadFrequently: true })!;
    copy.width = trimmed.width;
    copy.height = trimmed.height;

    window.flattenImage(trimmed);

    copyCtx.putImageData(trimmed, 0, 0);
    return copy;
  };
})();

// Expose functions for global access
window.trimAndFlattenCanvas = trimAndFlattenCanvas;
window.trimCanvas3 = trimCanvas3;
