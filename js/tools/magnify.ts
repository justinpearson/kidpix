class MagnifyTool implements KiddoPaintTool {
  isDown = false;
  scale = 2;

  size = () => {
    return 36 * KiddoPaint.Current.scaling;
  };

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.mousemove(ev);
    KiddoPaint.Display.canvas.className = "";
    KiddoPaint.Display.canvas.classList.add("cursor-none");
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      KiddoPaint.Sounds.brushzoom();
      const target = KiddoPaint.Display.main_context.getImageData(
        ev._x - this.size(),
        ev._y - this.size(),
        2 * this.size(),
        2 * this.size(),
      );
      const ctx = KiddoPaint.Display.previewContext;
      const scaled = window.scaleImageData(target, this.scale);
      ctx.putImageData(
        scaled,
        ev._x - this.scale * this.size(),
        ev._y - this.scale * this.size(),
      );
      KiddoPaint.Display.clearAnim();
      KiddoPaint.Display.animContext.fillStyle = "white";
      KiddoPaint.Display.animContext.fillRect(
        ev._x - this.scale * this.size(),
        ev._y - this.scale * this.size(),
        this.scale * this.size() * 2,
        this.scale * this.size() * 2,
      );
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    if (this.isDown) {
      this.isDown = false;
      KiddoPaint.Display.clearAnim();
      KiddoPaint.Display.saveUndo();
      //KiddoPaint.Sounds.brushzoom(); XXX TODO click sound

      const target = KiddoPaint.Display.main_context.getImageData(
        ev._x - this.size(),
        ev._y - this.size(),
        2 * this.size(),
        2 * this.size(),
      );
      const ctx = KiddoPaint.Display.context;
      const scaled = window.scaleImageData(target, this.scale);
      ctx.putImageData(
        scaled,
        ev._x - this.scale * this.size(),
        ev._y - this.scale * this.size(),
      );
      KiddoPaint.Display.main_context.clearRect(
        ev._x - this.scale * this.size(),
        ev._y - this.scale * this.size(),
        this.scale * this.size() * 2,
        this.scale * this.size() * 2,
      );

      // break abstraction since we're clearing main underneath
      KiddoPaint.Display.main_context.drawImage(
        KiddoPaint.Display.canvas,
        0,
        0,
      );
      KiddoPaint.Display.clearTmp();
      KiddoPaint.Display.clearAnim(); // cut preview
      KiddoPaint.Display.saveToLocalStorage();
      KiddoPaint.Display.canvas.className = "";
      KiddoPaint.Display.canvas.classList.add("cursor-paint-brush");
    }
  };
}
KiddoPaint.Tools.Toolbox.Magnify = MagnifyTool;
KiddoPaint.Tools.Magnify = new MagnifyTool();
