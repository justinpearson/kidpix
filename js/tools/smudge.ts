interface SmudgeLine {
  position: [number, number];
  delta: [number, number];
  deltaPerp: [number, number];
  inc: [number, number];
  accum: number;
  counter: number;
  endPnt: number;
  axis: number;
  u: number;
}

function setupLine(
  x: number,
  y: number,
  targetX: number,
  targetY: number,
): SmudgeLine {
  const deltaX = targetX - x;
  const deltaY = targetY - y;
  const deltaRow = Math.abs(deltaX);
  const deltaCol = Math.abs(deltaY);
  const counter = Math.max(deltaCol, deltaRow);
  const axis = counter == deltaCol ? 1 : 0;

  // setup a line draw.
  return {
    position: [x, y],
    delta: [deltaX, deltaY],
    deltaPerp: [deltaRow, deltaCol],
    inc: [Math.sign(deltaX), Math.sign(deltaY)],
    accum: Math.floor(counter / 2),
    counter: counter,
    endPnt: counter,
    axis: axis,
    u: 0,
  };
}

function advanceLine(line: SmudgeLine): boolean {
  --line.counter;
  line.u = 1 - line.counter / line.endPnt;
  if (line.counter <= 0) {
    return false;
  }
  const axis = line.axis;
  const perp = 1 - axis;
  line.accum += line.deltaPerp[perp];
  if (line.accum >= line.endPnt) {
    line.accum -= line.endPnt;
    line.position[perp] += line.inc[perp];
  }
  line.position[axis] += line.inc[axis];
  return true;
}

class SmudgeTool implements KiddoPaintTool {
  //	 https://stackoverflow.com/a/61970857
  isDown = false;
  size = 36;
  previousEv: KidPixPointerEvent | null = null;
  brushCtx = document.createElement("canvas").getContext("2d")!;

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    this.previousEv = ev;
    this.updateBrush(ev._x, ev._y);
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (!this.isDown || !this.previousEv) {
      return;
    }

    const line = setupLine(
      this.previousEv._x,
      this.previousEv._y,
      ev._x,
      ev._y,
    );
    KiddoPaint.Display.context.globalAlpha = 0.5;

    for (let more = true; more; ) {
      more = advanceLine(line);

      KiddoPaint.Display.context.drawImage(
        this.brushCtx.canvas,
        line.position[0] - this.brushCtx.canvas.width / 2,
        line.position[1] - this.brushCtx.canvas.height / 2,
      );
      this.updateBrush(line.position[0], line.position[1]);
    }
    this.previousEv = ev;
  };

  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
      KiddoPaint.Display.context.globalAlpha = 1;
      KiddoPaint.Display.saveMain();
    }
  };

  feather = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.fillStyle = window.createFeatherGradient(this.size, 0.1);
    ctx.globalCompositeOperation = "destination-out";
    const { width, height } = ctx.canvas;
    ctx.translate(width / 2, height / 2);
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.restore();
  };

  updateBrush = (x: number, y: number) => {
    let width = this.brushCtx.canvas.width;
    let height = this.brushCtx.canvas.height;
    let srcX = x - width / 2;
    let srcY = y - height / 2;
    // draw it in the middle of the brush
    let dstX = (this.brushCtx.canvas.width - width) / 2;
    let dstY = (this.brushCtx.canvas.height - height) / 2;

    // clear the brush canvas
    this.brushCtx.clearRect(
      0,
      0,
      this.brushCtx.canvas.width,
      this.brushCtx.canvas.height,
    );

    // clip the rectangle to be
    // inside
    if (srcX < 0) {
      width += srcX;
      dstX -= srcX;
      srcX = 0;
    }
    const overX = srcX + width - KiddoPaint.Display.main_context.canvas.width;
    if (overX > 0) {
      width -= overX;
    }

    if (srcY < 0) {
      dstY -= srcY;
      height += srcY;
      srcY = 0;
    }
    const overY =
      srcY + height - KiddoPaint.Display.main_context.canvas.height;
    if (overY > 0) {
      height -= overY;
    }

    if (width <= 0 || height <= 0) {
      return;
    }

    // kiddopaint needs to update the brush initially with the main context...
    this.brushCtx.drawImage(
      KiddoPaint.Display.main_context.canvas,
      srcX,
      srcY,
      width,
      height,
      dstX,
      dstY,
      width,
      height,
    );

    // and also with the preview context.
    this.brushCtx.drawImage(
      KiddoPaint.Display.context.canvas,
      srcX,
      srcY,
      width,
      height,
      dstX,
      dstY,
      width,
      height,
    );

    this.feather(this.brushCtx);
  };
}
declare global {
  interface KiddoPaintToolbox {
    Smudge: typeof SmudgeTool;
  }
  interface KiddoPaintToolsRegistry {
    Smudge: SmudgeTool;
  }
}

KiddoPaint.Tools.Toolbox.Smudge = SmudgeTool;
KiddoPaint.Tools.Smudge = new SmudgeTool();
