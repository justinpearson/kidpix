import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock HTMLCanvasElement.getContext. Real canvases return the SAME context
// object on every call, so the mock memoizes per canvas — tests can grab the
// context and assert on its mock methods.
const canvasContexts = new WeakMap<HTMLCanvasElement, object>();
HTMLCanvasElement.prototype.getContext = vi.fn(function (
  this: HTMLCanvasElement,
) {
  if (!canvasContexts.has(this)) {
    canvasContexts.set(this, {
      imageSmoothingEnabled: true,
      lineCap: "butt",
      lineJoin: "miter",
      fillStyle: "#000000",
      strokeStyle: "#000000",
      lineWidth: 1,
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      drawImage: vi.fn(),
      putImageData: vi.fn(),
      getImageData: vi.fn(
        (_x: number, _y: number, w: number, h: number) => new ImageData(w, h),
      ),
    });
  }
  return canvasContexts.get(this);
}) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// Mock ImageData constructor
global.ImageData = class ImageData {
  width: number;
  height: number;
  data: Uint8ClampedArray;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }
} as unknown as typeof ImageData;
