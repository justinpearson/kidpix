class TntTool implements KiddoPaintTool {
  isDown = false;

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.animate(ev);
  };

  mousemove = () => {};

  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
    }
  };

  animate = (ev: KidPixPointerEvent) => {
    KiddoPaint.Display.saveUndo();
    KiddoPaint.Display.pauseUndo();

    let iter = 1;
    const intervalID = setInterval(drawBomb, 175); // Will alert every second.
    KiddoPaint.Sounds.explosion();
    drawBomb();

    function drawBomb() {
      const ctx = KiddoPaint.Display.context;
      ctx.beginPath();
      ctx.fillStyle = "rgb(0, 255, 0)";
      ctx.arc(ev._x, ev._y, 50 * iter, 0, 2 * Math.PI);
      ctx.fill();
      KiddoPaint.Display.saveMainGcoSkipUndo("difference"); // exclusion difference
      iter++;
      if (iter > 15) {
        clearInterval(intervalID); // Will clear the timer.
        KiddoPaint.Display.clearAll();
        KiddoPaint.Display.resumeUndo();
      } else if (KiddoPaint.Current.modifiedMeta) {
        // hidden feature to block completion
        clearInterval(intervalID); // Will clear the timer.
        KiddoPaint.Display.resumeUndo(); // Already saved to main above in previous frames, so no need here
      }
    }
  };
}
KiddoPaint.Tools.Toolbox.Tnt = TntTool;
KiddoPaint.Tools.Tnt = new TntTool();
