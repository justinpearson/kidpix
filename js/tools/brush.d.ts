// js/tools/brush.d.ts

declare namespace KiddoPaint.Tools.Toolbox {
  interface BrushOptions {
    size: number;
    opacity: number;
    pattern?: "solid" | "texture" | "gradient";
  }

  class Brush implements KiddoPaint.Tool {
    private options: BrushOptions;
    private isDrawing: boolean;
    private lastPoint: { x: number; y: number } | null;

    constructor(options?: Partial<BrushOptions>);

    mousedown(event: KiddoPaint.KiddoEvent): void;
    mousemove(event: KiddoPaint.KiddoEvent): void;
    mouseup(event: KiddoPaint.KiddoEvent): void;

    /**
     * Set brush options
     */
    setOptions(options: Partial<BrushOptions>): void;

    /**
     * Get current brush settings
     */
    getOptions(): BrushOptions;

    /**
     * Apply brush stroke at given position
     */
    private applyBrush(x: number, y: number, pressure: number): void;
  }
}
