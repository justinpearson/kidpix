/**
 * Calculate distance between two events/points with canvas coordinates.
 */
function distanceBetween(ev1: KidPixPoint, ev2: KidPixPoint): number {
  const deltaxsq = (ev2._x - ev1._x) * (ev2._x - ev1._x);
  const deltaysq = (ev2._y - ev1._y) * (ev2._y - ev1._y);
  return Math.sqrt(deltaxsq + deltaysq);
}

/**
 * Calculate angle between two events/points, in radians.
 */
function angleBetween(ev1: KidPixPoint, ev2: KidPixPoint): number {
  const y = ev2._y - ev1._y;
  const x = ev2._x - ev1._x;
  const angle = Math.atan(y / (x == 0 ? 0.001 : x)) + (x < 0 ? Math.PI : 0);
  return angle;
}

function angleBetweenRad(ev1: KidPixPoint, ev2: KidPixPoint): number {
  return Math.atan2(ev2._x - ev1._x, ev2._y - ev1._y);
}

// http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
// http://stackoverflow.com/questions/29156849/html5-canvas-changing-image-color
function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  ((r /= 255), (g /= 255), (b /= 255));
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: h,
    s: s,
    l: l,
  };
}

function hslToRgb(
  h: number,
  s: number,
  l: number,
): { r: number; g: number; b: number } {
  let r: number, g: number, b: number;
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = function (p: number, q: number, t: number): number {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function hueShift(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  shift: number,
): void {
  if (shift === 0) return;
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const rawData = imageData.data;
  for (let i = 0; i < rawData.length; i += 4) {
    const red = rawData[i + 0];
    const green = rawData[i + 1];
    const blue = rawData[i + 2];
    const alpha = rawData[i + 3];
    if (red === 0 && green === 0 && blue === 0 && alpha === 0) continue;

    const hsl = rgbToHsl(red, green, blue);

    const shiftedRgb = hslToRgb(hsl.h + shift, hsl.s, hsl.l);
    rawData[i + 0] = shiftedRgb.r;
    rawData[i + 1] = shiftedRgb.g;
    rawData[i + 2] = shiftedRgb.b;
    rawData[i + 3] = alpha;
  }
  context.putImageData(imageData, 0, 0);
}

function ziggurat(): number {
  return (
    (Math.random() +
      Math.random() +
      Math.random() +
      Math.random() +
      Math.random() +
      Math.random() -
      3) /
    3
  );
}

function boxmuller(): [number, number] {
  const r = Math.sqrt(-2 * Math.log(Math.random()));
  const theta = 2 * Math.PI * Math.random();
  return [r * Math.cos(theta), r * Math.sin(theta)];
}

// Standard Normal variate using Box-Muller transform.
// https://stackoverflow.com/a/36481059
function randn_bm(min: number, max: number, skew: number): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) {
    num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
  } else {
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }
  return num;
}

function extractSprite(
  img: HTMLCanvasElement | HTMLImageElement,
  size: number,
  col: number,
  row: number,
  offset: number,
): HTMLCanvasElement {
  const canvasIcon = document.createElement("canvas");
  canvasIcon.width = size;
  canvasIcon.height = size;
  const contextIcon = canvasIcon.getContext("2d")!;
  contextIcon.imageSmoothingEnabled = false;

  const sourceX = offset + col * size;
  const sourceY = offset + row * size;
  contextIcon.drawImage(img, sourceX, sourceY, size, size, 0, 0, size, size);

  return canvasIcon;
}

window.distanceBetween = distanceBetween;
window.angleBetween = angleBetween;
window.angleBetweenRad = angleBetweenRad;

window.makeIcon = function makeIcon(texture) {
  const canvasIcon = document.createElement("canvas");
  canvasIcon.width = 50;
  canvasIcon.height = 50;
  const contextIcon = canvasIcon.getContext("2d")!;

  contextIcon.beginPath();
  contextIcon.lineWidth = 1;
  contextIcon.strokeRect(10, 10, 30, 30);
  contextIcon.fillStyle = texture();
  contextIcon.fillRect(10, 10, 30, 30);
  contextIcon.closePath();

  return canvasIcon.toDataURL();
};

window.makeCircleIcon = function makeCircleIcon(texture) {
  const canvasIcon = document.createElement("canvas");
  canvasIcon.width = 50;
  canvasIcon.height = 50;
  const contextIcon = canvasIcon.getContext("2d")!;

  contextIcon.beginPath();
  contextIcon.lineWidth = 1;
  contextIcon.fillStyle = texture();
  contextIcon.arc(25, 25, 15, 0, 2 * Math.PI);
  contextIcon.fill();
  contextIcon.stroke();
  contextIcon.closePath();

  return canvasIcon.toDataURL();
};

// Expose utility functions for global access (updated)
window.srng = srng;
window.color2json = color2json;
window.scaleImageDataCanvasAPIPixelated = scaleImageDataCanvasAPIPixelated;
window.extractSprite = extractSprite;
window.colorsEqual = colorsEqual;
window.makePatternFromImage = makePatternFromImage;
window.flattenImage = flattenImage;
window.remap = remap;
window.getRandomFloat = getRandomFloat;
window.scaleImageData = scaleImageData;
window.colorNearWhite = colorNearWhite;
window.bresenham = bresenham;
window.guil = guil;
window.clamp = clamp;
window.rgbToHsl = rgbToHsl;
window.hslToRgb = hslToRgb;
window.getRandomInt = getRandomInt;
window.getRandomLetter = getRandomLetter;

// These are also called from other modules (brushes, tools, stamps). Since
// the app is served as ES modules, top-level functions are module-scoped —
// cross-file calls only work via window. Missing attachments here broke the
// Spray/Dumbbell/Icy brushes, stamp hue-shifting, smudge, bezfollow, wholefx
// pixelate, and placer scaling with ReferenceErrors.
window.hueShift = hueShift;
window.ziggurat = ziggurat;
window.boxmuller = boxmuller;
window.randn_bm = randn_bm;
window.createFeatherGradient = createFeatherGradient;
window.getCubicBezierXYatPercent = getCubicBezierXYatPercent;
window.bezierLength = bezierLength;
window.pixelateCanvas = pixelateCanvas;
window.scaleImageDataCanvasAPI = scaleImageDataCanvasAPI;

function guil(
  R: number,
  r: number,
  m: number,
  theta: number,
  p: number,
  Q: number,
  _m2: number,
  n: number,
): { x: number; y: number } {
  const x =
    (R + r) * Math.cos(m * theta) +
    (r + p) * Math.cos(((R + r) / r) * m * theta) +
    Q * Math.cos(n * theta);
  const y =
    (R + r) * Math.sin(m * theta) -
    (r + p) * Math.sin(((R + r) / r) * m * theta) +
    Q * Math.sin(n * theta);
  return {
    x: x,
    y: y,
  };
}

function scaleImageData(imageData: ImageData, scale: number): ImageData {
  return scaleImageDataCanvasAPIPixelatedAlt(imageData, scale);
}

// https://stackoverflow.com/a/40772881 doesn't handle alpha well wrt to emojis etc
function scaleImageDataCanvasAPI(
  source: HTMLCanvasElement | HTMLImageElement,
  scale: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  canvas.getContext("2d")!.drawImage(source, 0, 0);

  const scaleCanvas = document.createElement("canvas");
  scaleCanvas.width = source.width * scale;
  scaleCanvas.height = source.height * scale;
  const scaleCtx = scaleCanvas.getContext("2d")!;
  scaleCtx.scale(scale, scale);
  scaleCtx.drawImage(canvas, 0, 0);
  return scaleCanvas;
}

function scaleImageDataCanvasAPIPixelatedAlt(
  imageData: ImageData,
  scale: number,
): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  canvas.getContext("2d")!.imageSmoothingEnabled = false;
  canvas.getContext("2d")!.putImageData(imageData, 0, 0);

  const scaleCanvas = document.createElement("canvas");
  scaleCanvas.width = imageData.width * scale;
  scaleCanvas.height = imageData.height * scale;
  const scaleCtx = scaleCanvas.getContext("2d")!;
  scaleCtx.imageSmoothingEnabled = false;
  scaleCtx.scale(scale, scale);
  scaleCtx.drawImage(canvas, 0, 0);
  return scaleCtx.getImageData(0, 0, scaleCanvas.width, scaleCanvas.height);
}

function scaleImageDataCanvasAPIPixelated(
  source: HTMLCanvasElement | HTMLImageElement,
  scale: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  canvas.getContext("2d")!.imageSmoothingEnabled = false;
  canvas.getContext("2d")!.drawImage(source, 0, 0);

  const scaleCanvas = document.createElement("canvas");
  scaleCanvas.width = source.width * scale;
  scaleCanvas.height = source.height * scale;
  const scaleCtx = scaleCanvas.getContext("2d")!;
  scaleCtx.imageSmoothingEnabled = false;
  scaleCtx.scale(scale, scale);
  scaleCtx.drawImage(canvas, 0, 0);
  return scaleCanvas;
}

function pixelateCanvas(
  source: HTMLCanvasElement | HTMLImageElement,
  block: number,
): HTMLCanvasElement {
  const size = block / 100;
  const w = source.width * size;
  const h = source.height * size;

  // shrink it down
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, 0, 0, w, h);

  // draw it back original size
  const canvas2 = document.createElement("canvas");
  canvas2.width = source.width;
  canvas2.height = source.height;
  const ctx2 = canvas2.getContext("2d")!;
  ctx2.imageSmoothingEnabled = false;
  ctx2.drawImage(canvas, 0, 0, w, h, 0, 0, canvas2.width, canvas2.height);
  return canvas2;
}

// http://michalbe.blogspot.com/2011/02/javascript-random-numbers-with-custom_23.html
function srng(seed?: number): { next(): number } {
  let s = seed || 7;
  const constant = Math.pow(2, 11) + 1;
  const prime = 4241;
  const maximum = 4243;
  return {
    next: function () {
      s *= constant;
      s += prime;
      return (s % maximum) / maximum;
    },
  };
}

// https://stackoverflow.com/questions/17924214/canvas-how-would-you-properly-interpolate-between-two-points-using-bresenhams
function bresenham(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  callback: (x: number, y: number) => void,
): void {
  let dx = x2 - x1;
  let sx = 1;
  let dy = y2 - y1;
  let sy = 1;
  let space = 0;
  const spacing = 3;

  if (dx < 0) {
    sx = -1;
    dx = -dx;
  }

  if (dy < 0) {
    sy = -1;
    dy = -dy;
  }

  dx = dx << 1;
  dy = dy << 1;

  if (dy < dx) {
    let fraction = dy - (dx >> 1);

    while (x1 != x2) {
      if (fraction >= 0) {
        y1 += sy;
        fraction -= dx;
      }

      fraction += dy;
      x1 += sx;

      if (space == spacing) {
        callback(x1, y1);
        space = 0;
      } else {
        space += 1;
      }
    }
  } else {
    let fraction = dx - (dy >> 1);

    while (y1 != y2) {
      if (fraction >= 0) {
        x1 += sx;
        fraction -= dy;
      }

      fraction += dx;
      y1 += sy;

      if (space == spacing) {
        callback(x1, y1);
        space = 0;
      } else {
        space += 1;
      }
    }
  }

  callback(x1, y1);
}

function color2json(color: string): KidPixRGBA {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const imageData = ctx.getImageData(0, 0, 1, 1);

  return {
    r: imageData.data[0],
    g: imageData.data[1],
    b: imageData.data[2],
    a: imageData.data[3],
  };
}

function colorsEqual(color1: KidPixRGBA, color2: KidPixRGBA): boolean {
  return (
    color1.r === color2.r &&
    color1.g === color2.g &&
    color1.b === color2.b &&
    color1.a === color2.a
  );
}

function colorNearWhite(color: KidPixRGBA): boolean {
  const basegrey = 221;
  return (
    color.r > basegrey &&
    color.g > basegrey &&
    color.b > basegrey &&
    color.a > 235
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function invlerp(a: number, b: number, v: number): number {
  return (1.0 * (v - a)) / (1.0 * (b - a));
}

function remap(
  imin: number,
  imax: number,
  omin: number,
  omax: number,
  v: number,
): number {
  return lerp(omin, omax, invlerp(imin, imax, v));
}

function createFeatherGradient(
  radius: number,
  hardness: number,
): CanvasGradient {
  const innerRadius = Math.min(radius * hardness, radius - 1);
  const gradient = KiddoPaint.Display.context.createRadialGradient(
    0,
    0,
    innerRadius,
    0,
    0,
    radius,
  );
  gradient.addColorStop(0, "rgba(255, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 255, 1)");
  return gradient;
}

// Given the 4 control points on a Bezier curve
// get x,y at interval T along the curve (0<=T<=1)
// The curve starts when T==0 and ends when T==1
// https://stackoverflow.com/questions/34681457/html5-canvas-bezier-curve-get-all-the-points
function getCubicBezierXYatPercent(
  startPt: number[],
  controlPt1: number[],
  controlPt2: number[],
  endPt: number[],
  percent: number,
): KidPixPoint {
  const x = CubicN(percent, startPt[0], controlPt1[0], controlPt2[0], endPt[0]);
  const y = CubicN(percent, startPt[1], controlPt1[1], controlPt2[1], endPt[1]);
  return {
    _x: x,
    _y: y,
  };
}

// cubic helper formula
function CubicN(
  T: number,
  a: number,
  b: number,
  c: number,
  d: number,
): number {
  const t2 = T * T;
  const t3 = t2 * T;
  return (
    a +
    (-a * 3 + T * (3 * a - a * T)) * T +
    (3 * b + T * (-6 * b + b * 3 * T)) * T +
    (c * 3 - c * 3 * T) * t2 +
    d * t3
  );
}

// https://stackoverflow.com/a/38626906
function bezierLength(
  startPt: number[],
  controlPt1: number[],
  controlPt2: number[],
  endPt: number[],
): number {
  const a = startPt;
  const b = endPt;
  const c1 = controlPt1;
  const c2 = controlPt2;

  // output the curve in SVG bezier syntax
  const svgBezier = `M${a[0]} ${a[1]} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${b[0]} ${b[1]}`;

  // create a new <path> element
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  // add the curve
  path.setAttribute("d", svgBezier);

  // get the length using browser power
  return path.getTotalLength();
}

function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function flattenImage(imageData: ImageData): ImageData {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] == 0) {
      data[i] = data[i + 1] = data[i + 2] = data[i + 3] = 255;
    }
  }
  return imageData;
}

function getRandomLetter(): string {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return possible[Math.floor(Math.random() * possible.length)];
}

function makePatternFromImage(
  image: HTMLCanvasElement | HTMLImageElement,
): CanvasPattern | null {
  const canvasPattern = document.createElement("canvas");
  canvasPattern.width = KiddoPaint.Display.canvas.width;
  canvasPattern.height = KiddoPaint.Display.canvas.height;
  const contextPattern = canvasPattern.getContext("2d")!;

  contextPattern.fillStyle = "white";
  contextPattern.fillRect(0, 0, canvasPattern.width, canvasPattern.height);

  const xOffset = KiddoPaint.Display.canvas.width / 2 - image.width;
  const yOffset = KiddoPaint.Display.canvas.height / 2 - image.height;
  contextPattern.imageSmoothingEnabled = false;
  contextPattern.drawImage(
    image,
    xOffset,
    yOffset,
    image.width * 2,
    image.height * 2,
  );

  return contextPattern.createPattern(canvasPattern, "no-repeat");
}

/* --- named exports for unit tests; browser consumers use the window
       attachments above --- */
export {
  distanceBetween,
  angleBetween,
  angleBetweenRad,
  clamp,
  lerp,
  invlerp,
  remap,
  rgbToHsl,
  hslToRgb,
  ziggurat,
  boxmuller,
  randn_bm,
  guil,
  colorsEqual,
  colorNearWhite,
  getCubicBezierXYatPercent,
  CubicN,
  getRandomFloat,
  getRandomInt,
  getRandomLetter,
  srng,
  flattenImage,
};
