const JumbleFx = {
  PINCH: "pinch",
  SWIRL: "swirl",
  LENSBLUR: "lensblur",
  TRIBLUR: "triblur",
  ZOOM: "zoom",
  HEXAGON: "hexagon",
  INK: "ink",
  EDGE: "edge",
  PANCAKE: "pancake",
  PIXELATE: "pixelate",
  HUE: "hue",
  SAT: "sat",
  NIGHTVISION: "nightvision",
  INVERT: "invert",
  SUNSHINE: "sunshine",
  DITHER: "dither",
  THRESHOLD: "threshold",
};

// Expose JumbleFx to global scope for access from other modules
window.JumbleFx = JumbleFx;

class WholeCanvasEffectTool implements KiddoPaintTool {
  isDown = false;
  gfx: any;
  textureGfx: any = null;
  mainImageData: ImageData | null = null;
  initialClick: KidPixPointerEvent | null = null;
  effect: string = JumbleFx.PANCAKE;

  constructor() {
    try {
      this.gfx = window.fx.canvas();
    } catch {
      this.gfx = null; // graceful fallback when WebGL unavailable
    }
  }

  mousedown = (ev: KidPixPointerEvent) => {
    // Without WebGL none of the effects could run (the texture upload below
    // threw before any effect was reached); bail out instead of throwing.
    if (!this.gfx) return;
    this.isDown = true;
    this.initialClick = ev;
    this.mainImageData = KiddoPaint.Display.main_context.getImageData(
      0,
      0,
      KiddoPaint.Display.main_canvas.width,
      KiddoPaint.Display.main_canvas.height,
    );
    this.textureGfx = this.gfx.texture(KiddoPaint.Display.main_canvas);
    KiddoPaint.Display.saveUndo();
    KiddoPaint.Display.clearMain(); // this causes the bug where if the mouse move off screen, the mouseout even clears tmp context and everything is lost; but we need the main clear incase there's alpha it gets double rendered on preview...
    this.mousemove(ev);
  };

  mousemove = (ev: KidPixPointerEvent) => {
    if (this.isDown && this.initialClick && this.mainImageData) {
      const initialClick = this.initialClick;
      const mainImageData = this.mainImageData;
      KiddoPaint.Display.clearTmp();
      const drawDistance = window.distanceBetween(ev, initialClick);
      let renderedGfx: CanvasImageSource | undefined;
      switch (this.effect) {
        case JumbleFx.PINCH: {
          const strength = window.remap(0, 500, -1, 1, drawDistance);
          renderedGfx = this.gfx
            .draw(this.textureGfx)
            .bulgePinch(initialClick._x, initialClick._y, 200, strength)
            .update();
          break;
        }
        case JumbleFx.SWIRL: {
          const horizDist = Math.abs(ev._x - initialClick._x);
          const vertDist = ev._y - initialClick._y;
          const swirlAngle = window.remap(
            -300,
            300,
            -Math.PI * 2,
            Math.PI * 2,
            vertDist,
          );
          renderedGfx = this.gfx
            .draw(this.textureGfx)
            .swirl(initialClick._x, initialClick._y, horizDist, swirlAngle)
            .update();
          break;
        }
        case JumbleFx.LENSBLUR: {
          const strength = window.remap(0, 500, 0, 50, drawDistance);
          renderedGfx = this.gfx
            .draw(this.textureGfx)
            .lensBlur(strength, 0.88, 0.70841)
            .update();
          break;
        }
        case JumbleFx.TRIBLUR: {
          renderedGfx = this.gfx
            .draw(this.textureGfx)
            .triangleBlur(drawDistance / 5.0)
            .update();
          break;
        }
        case JumbleFx.ZOOM: {
          const strength = window.remap(0, 250, 0, 1, drawDistance);
          renderedGfx = this.gfx
            .draw(this.textureGfx)
            .zoomBlur(initialClick._x, initialClick._y, strength)
            .update();
          break;
        }
        case JumbleFx.HEXAGON: {
          renderedGfx = this.gfx
            .draw(this.textureGfx)
            .hexagonalPixelate(
              initialClick._x,
              initialClick._y,
              drawDistance / 10.0,
            )
            .update();
          break;
        }
        case JumbleFx.INK: {
          const strength = window.remap(0, 250, -1, 1, drawDistance);
          renderedGfx = this.gfx
            .draw(this.textureGfx)
            .ink(strength)
            .update();
          break;
        }
        case JumbleFx.HUE: {
          const strength = window.remap(0, 1000, -1, 1, drawDistance);
          //KiddoPaint.Display.previewContext.fillText(strength, ev._x, ev._y);
          renderedGfx = this.gfx
            .draw(this.textureGfx)
            .hueSaturation(strength, 0)
            .update();
          break;
        }
        case JumbleFx.SAT: {
          const strength = window.remap(0, 500, -1, 1, drawDistance);
          renderedGfx = this.gfx
            .draw(this.textureGfx)
            .hueSaturation(0, strength)
            .update();
          break;
        }
        case JumbleFx.EDGE: {
          renderedGfx = this.gfx
            .draw(this.textureGfx)
            .edgeWork(drawDistance / 10.0)
            .update();
          break;
        }
        case JumbleFx.PANCAKE: {
          const pancakeGfx = this.gfx
            .draw(this.textureGfx)
            .brightnessContrast(0, 0)
            .update();
          renderedGfx = pancakeGfx;
          const howManyPancakes = 2 + drawDistance / 64;
          const increment = KiddoPaint.Current.modifiedAlt ? 4 : 16;
          const furthestAway = howManyPancakes * increment;

          const deltax = ev._x - initialClick._x;
          const deltay = ev._y - initialClick._y;

          for (let i = 1; i < howManyPancakes; i++) {
            KiddoPaint.Display.context.globalAlpha =
              i / (howManyPancakes * 1.0);
            KiddoPaint.Display.context.drawImage(
              pancakeGfx,
              (furthestAway - i * increment) * Math.sign(deltax),
              (furthestAway - i * increment) * Math.sign(deltay),
            );
          }
          KiddoPaint.Display.context.globalAlpha = 1;
          break;
        }
        case JumbleFx.PIXELATE: {
          const pixelGfx = this.gfx
            .draw(this.textureGfx)
            .brightnessContrast(0, 0)
            .update();
          const blocks = window.remap(
            0,
            500,
            50,
            7,
            window.clamp(0, 500, drawDistance),
          );
          renderedGfx = window.pixelateCanvas(pixelGfx, blocks);
          break;
        }
        case JumbleFx.NIGHTVISION: {
          const s = window.Filters.sobel(mainImageData);
          renderedGfx = KiddoPaint.Display.imageTypeToCanvas(s, false);
          break;
        }
        case JumbleFx.INVERT: {
          const alpha = window.remap(
            0,
            500,
            1,
            0,
            window.clamp(0, 500, drawDistance),
          );
          renderedGfx = window.Filters.gcoInvert(mainImageData, alpha);
          break;
        }
        case JumbleFx.SUNSHINE: {
          const alpha = window.remap(
            0,
            500,
            1,
            0,
            window.clamp(0, 500, drawDistance),
          );
          renderedGfx = window.Filters.gcoOverlay(mainImageData, alpha);
          break;
        }
        case JumbleFx.DITHER: {
          let s: ImageData;
          if (KiddoPaint.Current.modifiedCtrl) {
            const threshold = window.remap(
              0,
              500,
              192,
              0,
              window.clamp(0, 500, drawDistance),
            );
            s = window.Dither.bayer(mainImageData, threshold);
          } else if (KiddoPaint.Current.modifiedMeta) {
            s = window.Dither.atkinson(mainImageData);
          } else {
            s = window.Dither.floydsteinberg(mainImageData);
          }
          renderedGfx = KiddoPaint.Display.imageTypeToCanvas(s, false);
          break;
        }
        case JumbleFx.THRESHOLD: {
          // var threshold = remap(0, 500, 1, 255, clamp(0, 500, drawDistance));
          const s = window.Dither.threshold(mainImageData, 100);
          renderedGfx = KiddoPaint.Display.imageTypeToCanvas(s, false);
          break;
        }
      }
      KiddoPaint.Display.context.drawImage(renderedGfx!, 0, 0);
    }
  };

  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
      this.textureGfx.destroy();
      this.textureGfx = null;
      this.mainImageData = null;
      this.initialClick = null;
      KiddoPaint.Display.saveMainSkipUndo();
    }
  };
}
declare global {
  interface KiddoPaintToolbox {
    WholeCanvasEffect: typeof WholeCanvasEffectTool;
  }
  interface KiddoPaintToolsRegistry {
    WholeCanvasEffect: WholeCanvasEffectTool;
  }
}

KiddoPaint.Tools.Toolbox.WholeCanvasEffect = WholeCanvasEffectTool;
KiddoPaint.Tools.WholeCanvasEffect = new WholeCanvasEffectTool();
