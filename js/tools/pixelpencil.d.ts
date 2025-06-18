// js/tools/pixelpencil.d.ts

declare namespace KiddoPaint.Tools.Toolbox {
  class Pencil implements KiddoPaint.Tool {
    isDown: boolean;
    lastX: number;
    lastY: number;
    size: number;

    constructor();

    /**
     * Get texture for drawing
     */
    texture(color: string): HTMLCanvasElement | string;

    /**
     * Start drawing when mouse is pressed
     */
    mousedown(event: KiddoPaint.KiddoEvent): void;

    /**
     * Continue drawing as mouse moves
     */
    mousemove(event: KiddoPaint.KiddoEvent): void;

    /**
     * Stop drawing when mouse is released
     */
    mouseup(event: KiddoPaint.KiddoEvent): void;
  }
}
