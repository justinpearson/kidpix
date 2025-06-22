import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useDrawingEvents } from "../useDrawingEvents";
import { KidPixState } from "../../contexts/KidPixContext";

// Mock console.log to verify event logging
const mockConsoleLog = vi.spyOn(console, "log").mockImplementation();

describe("useDrawingEvents", () => {
  const mockState: KidPixState = {
    currentTool: "pencil",
    currentColor: "#000000",
    brushSize: 5,
    isDrawing: false,
    canvasLayers: {
      main: null,
      tmp: null,
      preview: null,
      anim: null,
      bnim: null,
    },
    undoStack: [],
    redoStack: [],
  };

  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it("handles null canvas gracefully", () => {
    const { result } = renderHook(() => {
      useDrawingEvents(null, mockState);
    });

    // Should not throw error with null canvas
    expect(result.current).toBeUndefined();
  });

  it("adds event listeners to canvas", () => {
    const mockCanvas = document.createElement("canvas");
    const addEventListenerSpy = vi.spyOn(mockCanvas, "addEventListener");

    renderHook(() => {
      useDrawingEvents(mockCanvas, mockState);
    });

    // Should add all three event listeners
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function),
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function),
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mouseup",
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
  });

  it("removes event listeners on cleanup", () => {
    const mockCanvas = document.createElement("canvas");
    const removeEventListenerSpy = vi.spyOn(mockCanvas, "removeEventListener");

    const { unmount } = renderHook(() => {
      useDrawingEvents(mockCanvas, mockState);
    });

    // Unmount to trigger cleanup
    unmount();

    // Should remove all three event listeners
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mouseup",
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });

  it("logs mouse down events", () => {
    const mockCanvas = document.createElement("canvas");

    renderHook(() => {
      useDrawingEvents(mockCanvas, mockState);
    });

    // Create and dispatch mousedown event
    const event = new MouseEvent("mousedown", {
      clientX: 100,
      clientY: 50,
    });

    // Mock offsetX and offsetY
    Object.defineProperty(event, "offsetX", { value: 100 });
    Object.defineProperty(event, "offsetY", { value: 50 });

    mockCanvas.dispatchEvent(event);

    expect(mockConsoleLog).toHaveBeenCalledWith("Mouse down at", 100, 50);
  });

  it("logs mouse up events", () => {
    const mockCanvas = document.createElement("canvas");

    renderHook(() => {
      useDrawingEvents(mockCanvas, mockState);
    });

    // Create and dispatch mouseup event
    const event = new MouseEvent("mouseup", {
      clientX: 150,
      clientY: 75,
    });

    // Mock offsetX and offsetY
    Object.defineProperty(event, "offsetX", { value: 150 });
    Object.defineProperty(event, "offsetY", { value: 75 });

    mockCanvas.dispatchEvent(event);

    expect(mockConsoleLog).toHaveBeenCalledWith("Mouse up at", 150, 75);
  });

  it("logs mouse move events only when drawing", () => {
    const mockCanvas = document.createElement("canvas");
    const drawingState = { ...mockState, isDrawing: true };

    renderHook(() => {
      useDrawingEvents(mockCanvas, drawingState);
    });

    // Create and dispatch mousemove event
    const event = new MouseEvent("mousemove", {
      clientX: 125,
      clientY: 60,
    });

    // Mock offsetX and offsetY
    Object.defineProperty(event, "offsetX", { value: 125 });
    Object.defineProperty(event, "offsetY", { value: 60 });

    mockCanvas.dispatchEvent(event);

    expect(mockConsoleLog).toHaveBeenCalledWith("Mouse move at", 125, 60);
  });

  it("does not log mouse move events when not drawing", () => {
    const mockCanvas = document.createElement("canvas");
    const notDrawingState = { ...mockState, isDrawing: false };

    renderHook(() => {
      useDrawingEvents(mockCanvas, notDrawingState);
    });

    // Create and dispatch mousemove event
    const event = new MouseEvent("mousemove", {
      clientX: 125,
      clientY: 60,
    });

    mockCanvas.dispatchEvent(event);

    // Should not log mouse move when not drawing
    expect(mockConsoleLog).not.toHaveBeenCalledWith(
      "Mouse move at",
      expect.any(Number),
      expect.any(Number),
    );
  });

  it("updates event handlers when dependencies change", () => {
    const mockCanvas = document.createElement("canvas");

    // Start with not drawing
    const { rerender } = renderHook(
      ({ state }) => {
        useDrawingEvents(mockCanvas, state);
      },
      {
        initialProps: { state: mockState },
      },
    );

    // Create mousemove event
    const event = new MouseEvent("mousemove");
    Object.defineProperty(event, "offsetX", { value: 100 });
    Object.defineProperty(event, "offsetY", { value: 100 });

    // Dispatch event - should not log
    mockCanvas.dispatchEvent(event);
    expect(mockConsoleLog).not.toHaveBeenCalledWith(
      "Mouse move at",
      expect.any(Number),
      expect.any(Number),
    );

    // Update state to drawing
    const drawingState = { ...mockState, isDrawing: true };
    rerender({ state: drawingState });

    // Dispatch event again - should log now
    mockCanvas.dispatchEvent(event);
    expect(mockConsoleLog).toHaveBeenCalledWith("Mouse move at", 100, 100);
  });
});
