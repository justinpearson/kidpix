class StampTool implements KiddoPaintTool {
  isDown = false;
  stamp = "🚂";
  size = 64;
  useColor = false;
  seed = 1;

  texture = () => {
    let altSize = KiddoPaint.Cache.getStampSettings(this.stamp).altSize;
    if (KiddoPaint.Current.modifiedRange !== 0) {
      const modifiedSize = KiddoPaint.Current.modifiedRange + 112;
      KiddoPaint.Cache.setStampSetting(this.stamp, "altSize", modifiedSize);
      altSize = modifiedSize;
    }
    this.size = KiddoPaint.Current.modified ? altSize : 64;

    let hueShift = KiddoPaint.Cache.getStampSettings(this.stamp).hueShift;
    if (KiddoPaint.Current.modifiedCtrlRange !== 0) {
      const modifiedHue = KiddoPaint.Current.modifiedCtrlRange / 100;
      KiddoPaint.Cache.setStampSetting(this.stamp, "hueShift", modifiedHue);
      hueShift = modifiedHue;
    }

    return KiddoPaint.Stamps.stamp(
      this.stamp,
      KiddoPaint.Current.modifiedAlt,
      KiddoPaint.Current.modifiedMeta,
      this.size,
      hueShift,
      this.useColor ? KiddoPaint.Current.color : null,
    );
  };

  mousedown = (ev: KidPixPointerEvent) => {
    const rng = window.srng(this.seed);
    this.isDown = true;
    KiddoPaint.Sounds.stamp();

    // (assigning null to fillStyle was a silent no-op; only set when used)
    if (this.useColor) {
      KiddoPaint.Display.context.fillStyle = KiddoPaint.Current.color;
    }
    const brushFill = this.texture();
    KiddoPaint.Display.context.drawImage(
      brushFill,
      Math.round(ev._x),
      Math.round(ev._y - this.size),
    );
    if (KiddoPaint.Current.multiplier > 1) {
      for (let i = 0; i < 2 * KiddoPaint.Current.multiplier; i++) {
        const x = Math.round(ev._x + (1000 * rng.next() - 500));
        const y = Math.round(ev._y + (20 * rng.next() - 10) - this.size);
        KiddoPaint.Display.context.drawImage(brushFill, x, y);
      }
    }
  };

  mousemove = (ev: KidPixPointerEvent) => {
    const rng = window.srng(this.seed);
    if (!this.isDown) {
      if (this.useColor) {
        KiddoPaint.Display.previewContext.fillStyle = KiddoPaint.Current.color;
      }
      const brushFill = this.texture();
      KiddoPaint.Display.previewContext.drawImage(
        brushFill,
        Math.round(ev._x),
        Math.round(ev._y - this.size),
      );
      if (KiddoPaint.Current.multiplier > 1) {
        for (let i = 0; i < 2 * KiddoPaint.Current.multiplier; i++) {
          const x = Math.round(ev._x + (1000 * rng.next() - 500));
          const y = Math.round(ev._y + (20 * rng.next() - 10) - this.size);
          KiddoPaint.Display.previewContext.drawImage(brushFill, x, y);
        }
      }
    }
  };

  mouseup = () => {
    this.isDown = false;
    this.seed += 1;
    KiddoPaint.Display.saveMain();
  };
}
KiddoPaint.Tools.Toolbox.Stamp = StampTool;
KiddoPaint.Tools.Stamp = new StampTool();
