import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
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
}));

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
