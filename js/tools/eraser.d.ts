// js/tools/eraser.d.ts

declare namespace KiddoPaint.Tools.Toolbox {
  class Eraser implements KiddoPaint.Tool {
    isDown: boolean;
    lastX: number;
    lastY: number;
    size: number;

    constructor();

    mousedown(event: KiddoPaint.KiddoEvent): void;
    mousemove(event: KiddoPaint.KiddoEvent): void;
    mouseup(event: KiddoPaint.KiddoEvent): void;

    /**
     * Erase at specific coordinates
     */
    private eraseAt(x: number, y: number): void;
  }
}
