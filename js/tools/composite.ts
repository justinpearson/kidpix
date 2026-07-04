class CompositeTool implements KiddoPaintTool {
  composed: KiddoPaintTool[] = [];

  compose = (t: KiddoPaintTool) => {
    this.composed.push(t);
  };

  clearComposed = () => {
    this.composed.length = 0;
  };

  mousedown = (ev: KidPixPointerEvent) => {
    // composites will be doing many saveMains, so pause state here
    KiddoPaint.Display.pauseUndo();
    for (const ctool of this.composed) {
      ctool.mousedown?.(ev);
    }
  };

  mousemove = (ev: KidPixPointerEvent) => {
    for (const ctool of this.composed) {
      ctool.mousemove?.(ev);
    }
  };

  mouseup = (ev: KidPixPointerEvent) => {
    for (const ctool of this.composed) {
      ctool.mouseup?.(ev);
    }
    // ... everything in between should have done saveMains, so all the composite's
    // intermediate preview, tmp contexts, etc are still pending turn it back on now and save main
    KiddoPaint.Display.resumeUndo();
    KiddoPaint.Display.saveMain();
  };
}
declare global {
  interface KiddoPaintToolbox {
    Composite: typeof CompositeTool;
  }
  interface KiddoPaintToolsRegistry {
    Composite: CompositeTool;
  }
}

KiddoPaint.Tools.Toolbox.Composite = CompositeTool;
KiddoPaint.Tools.Composite = new CompositeTool();
