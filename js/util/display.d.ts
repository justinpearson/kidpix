// js/util/display.d.ts

declare namespace KiddoPaint.Display {
  /**
   * Main canvas element
   */
  let canvas: HTMLCanvasElement;

  /**
   * Main canvas context
   */
  let context: CanvasRenderingContext2D;

  /**
   * Clear the main canvas
   */
  function clear(): void;

  /**
   * Save current canvas state
   */
  function save(): void;

  /**
   * Restore saved canvas state
   */
  function restore(): void;

  /**
   * Composite all layers to main canvas
   */
  function composite(): void;

  /**
   * Clear specific layer
   */
  function clearLayer(layerName: string): void;

  /**
   * Get canvas as data URL
   */
  function toDataURL(): string;

  /**
   * Load image data to canvas
   */
  function loadFromDataURL(dataUrl: string): void;
}
