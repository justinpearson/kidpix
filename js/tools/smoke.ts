class SmokeTool implements KiddoPaintTool {
  isDown = false;
  party: KidPixSmokeMachine | null = null;

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    KiddoPaint.Display.context.save();
    const smokeColor = window.color2json(KiddoPaint.Current.color);
    const party = window.SmokeMachine(KiddoPaint.Display.context, [
      smokeColor.r,
      smokeColor.g,
      smokeColor.b,
    ]);
    this.party = party;
    party.start();
    setTimeout(function () {
      party.addSmoke(ev._x, ev._y, 64);
      party.step(10);
    }, 100);
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown && this.party) {
      this.party.addSmoke(ev._x, ev._y, 4);
    }
  };

  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
      const tool = this;
      setTimeout(function () {
        tool.party?.stop();
        KiddoPaint.Display.saveMain();
        tool.party = null;
        KiddoPaint.Display.context.restore();
      }, 100);
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    Smoke: typeof SmokeTool;
  }
  interface KiddoPaintToolsRegistry {
    Smoke: SmokeTool;
  }
}

KiddoPaint.Tools.Toolbox.Smoke = SmokeTool;
KiddoPaint.Tools.Smoke = new SmokeTool();
