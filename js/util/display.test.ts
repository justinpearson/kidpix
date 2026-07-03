import { describe, it, expect, beforeEach, vi } from "vitest";

// Seed the KiddoPaint global namespace (normally created by index.html).
// display.ts only needs the Display sub-object to exist at import time.
global.KiddoPaint = {
  Display: {},
} as unknown as KiddoPaintNamespace;

await import("./display");

const D = KiddoPaint.Display;

// A stand-in for the main canvas: toDataURL yields a distinct snapshot
// string on every call, like a real canvas whose pixels changed.
function fakeMainCanvas(label: string) {
  let counter = 0;
  return {
    width: 100,
    height: 50,
    toDataURL: vi.fn(() => `data:${label}-${counter++}`),
  } as unknown as HTMLCanvasElement;
}

function fakeContext() {
  return {
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    globalCompositeOperation: "source-over",
  } as unknown as CanvasRenderingContext2D;
}

beforeEach(() => {
  localStorage.clear();
  D.undoData = [];
  D.redoData = [];
  D.undoOn = true;
  D.allowClearTmp = true;
  D.main_canvas = fakeMainCanvas("main");
  D.main_context = fakeContext();
  D.canvas = fakeMainCanvas("tmp");
  D.context = fakeContext();
  D.previewContext = fakeContext();
});

describe("KiddoPaint.Display undo/redo stacks", () => {
  it("saveUndo pushes a snapshot and clears the redo stack", () => {
    D.redoData = ["data:stale-redo"];

    const result = D.saveUndo();

    expect(result).toBe(true);
    expect(D.undoData).toHaveLength(1);
    expect(D.redoData).toHaveLength(0);
  });

  it("saveUndo is a no-op returning false while undo is paused", () => {
    D.pauseUndo();
    expect(D.saveUndo()).toBe(false);
    expect(D.undoData).toHaveLength(0);

    D.resumeUndo();
    expect(D.saveUndo()).toBe(true);
    expect(D.undoData).toHaveLength(1);
  });

  it("toggleUndo flips the undoOn flag", () => {
    expect(D.undoOn).toBe(true);
    D.toggleUndo();
    expect(D.undoOn).toBe(false);
    D.toggleUndo();
    expect(D.undoOn).toBe(true);
  });

  it("caps the in-memory undo stack at 30 snapshots", () => {
    for (let i = 0; i < 35; i++) {
      D.saveUndo();
    }
    expect(D.undoData).toHaveLength(30);
    // Oldest snapshots were shifted off: the first remaining is #5.
    expect(D.undoData[0]).toBe("data:main-5");
  });

  it("undo moves the current canvas snapshot onto the redo stack and pops the undo stack", () => {
    D.undoData = ["data:a", "data:b"];

    D.undo();

    expect(D.redoData).toEqual(["data:main-0"]);
    expect(D.undoData).toEqual(["data:a"]); // "data:b" was popped and loaded
  });

  it("undo with an empty stack changes nothing", () => {
    D.undo();
    expect(D.undoData).toHaveLength(0);
    expect(D.redoData).toHaveLength(0);
  });

  it("redo moves the current canvas snapshot onto the undo stack and pops the redo stack", () => {
    D.redoData = ["data:x", "data:y"];

    D.redo();

    expect(D.undoData).toEqual(["data:main-0"]);
    expect(D.redoData).toEqual(["data:x"]); // "data:y" was popped and loaded
  });

  it("redo with an empty stack changes nothing", () => {
    D.redo();
    expect(D.undoData).toHaveLength(0);
    expect(D.redoData).toHaveLength(0);
  });
});

describe("KiddoPaint.Display localStorage persistence", () => {
  it("saveUndoRedoToLocalStorage persists only the 10 most recent states", () => {
    D.undoData = Array.from({ length: 15 }, (_, i) => `data:u${i}`);
    D.redoData = ["data:r0"];

    D.saveUndoRedoToLocalStorage();

    const savedUndo = JSON.parse(localStorage.getItem("kiddopaint_undo")!);
    const savedRedo = JSON.parse(localStorage.getItem("kiddopaint_redo")!);
    expect(savedUndo).toHaveLength(10);
    expect(savedUndo[0]).toBe("data:u5"); // last 10 of 15
    expect(savedRedo).toEqual(["data:r0"]);
  });

  it("loadUndoRedoFromLocalStorage restores at most 10 states per stack", () => {
    localStorage.setItem(
      "kiddopaint_undo",
      JSON.stringify(Array.from({ length: 12 }, (_, i) => `data:u${i}`)),
    );
    localStorage.setItem("kiddopaint_redo", JSON.stringify(["data:r0"]));

    D.loadUndoRedoFromLocalStorage();

    expect(D.undoData).toHaveLength(10);
    expect(D.undoData[0]).toBe("data:u2");
    expect(D.redoData).toEqual(["data:r0"]);
  });

  it("loadUndoRedoFromLocalStorage resets to empty stacks on corrupt JSON", () => {
    D.undoData = ["data:pre-existing"];
    localStorage.setItem("kiddopaint_undo", "{not json");

    D.loadUndoRedoFromLocalStorage();

    expect(D.undoData).toEqual([]);
    expect(D.redoData).toEqual([]);
  });

  it("saveToLocalStorage stores the main canvas dataURL under 'kiddopaint'", () => {
    D.saveToLocalStorage();
    expect(localStorage.getItem("kiddopaint")).toBe("data:main-0");
  });
});

describe("KiddoPaint.Display clearing and committing", () => {
  it("clearMain clears the full main canvas", () => {
    D.clearMain();
    expect(D.main_context.clearRect).toHaveBeenCalledWith(0, 0, 100, 50);
  });

  it("clearTmp respects the allowClearTmp flag", () => {
    D.allowClearTmp = false;
    D.clearTmp();
    expect(D.context.clearRect).not.toHaveBeenCalled();

    D.allowClearTmp = true;
    D.clearTmp();
    expect(D.context.clearRect).toHaveBeenCalledTimes(1);
  });

  it("saveMain snapshots undo, composites tmp onto main, clears tmp, persists", () => {
    D.saveMain();

    expect(D.undoData).toHaveLength(1);
    expect(D.main_context.drawImage).toHaveBeenCalledWith(D.canvas, 0, 0);
    expect(D.context.clearRect).toHaveBeenCalled();
    expect(localStorage.getItem("kiddopaint")).not.toBeNull();
  });

  it("saveMain does nothing while undo is paused", () => {
    D.pauseUndo();
    D.saveMain();
    expect(D.main_context.drawImage).not.toHaveBeenCalled();
  });

  it("saveMainSkipUndo composites without touching the undo stack", () => {
    D.pauseUndo();
    D.saveMainSkipUndo();
    expect(D.undoData).toHaveLength(0);
    expect(D.main_context.drawImage).toHaveBeenCalledWith(D.canvas, 0, 0);
  });

  it("saveMainGco composites with the given blend op, then restores it", () => {
    D.saveMainGco("multiply");
    expect(D.main_context.drawImage).toHaveBeenCalledWith(D.canvas, 0, 0);
    expect(D.main_context.globalCompositeOperation).toBe("source-over");
  });
});

describe("KiddoPaint.Display conversion helpers", () => {
  it("canvasToImageData reads the canvas's full pixel rect", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 4;
    canvas.height = 2;

    const imageData = D.canvasToImageData(canvas);

    expect(imageData.width).toBe(4);
    expect(imageData.height).toBe(2);
  });

  it("imageTypeToCanvas puts ImageData pixels on a matching-size canvas", () => {
    const imageData = new ImageData(6, 3);

    const canvas = D.imageTypeToCanvas(imageData, false);

    expect(canvas.width).toBe(6);
    expect(canvas.height).toBe(3);
    const ctx = canvas.getContext("2d")!;
    expect(ctx.putImageData).toHaveBeenCalledWith(imageData, 0, 0);
    expect(ctx.drawImage).not.toHaveBeenCalled();
  });

  it("imageTypeToCanvas draws drawable sources when doDraw is true", () => {
    const source = document.createElement("canvas");
    source.width = 8;
    source.height = 4;

    const canvas = D.imageTypeToCanvas(source, true);

    expect(canvas.width).toBe(8);
    expect(canvas.height).toBe(4);
    const ctx = canvas.getContext("2d")!;
    expect(ctx.drawImage).toHaveBeenCalledWith(source, 0, 0);
    expect(ctx.putImageData).not.toHaveBeenCalled();
  });
});
