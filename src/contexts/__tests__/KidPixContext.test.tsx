import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { KidPixProvider, useKidPix } from "../KidPixContext";

// Test component that uses the context
const TestComponent: React.FC = () => {
  const { state, dispatch } = useKidPix();

  return (
    <div>
      <div data-testid="current-tool">{state.currentTool}</div>
      <div data-testid="current-color">{state.currentColor}</div>
      <div data-testid="brush-size">{state.brushSize}</div>
      <div data-testid="is-drawing">{state.isDrawing.toString()}</div>
      <div data-testid="undo-stack-length">{state.undoStack.length}</div>
      <div data-testid="redo-stack-length">{state.redoStack.length}</div>

      <button
        data-testid="set-tool-btn"
        onClick={() => dispatch({ type: "SET_TOOL", payload: "brush" })}
      >
        Set Brush Tool
      </button>
      <button
        data-testid="set-color-btn"
        onClick={() => dispatch({ type: "SET_COLOR", payload: "#ff0000" })}
      >
        Set Red Color
      </button>
      <button
        data-testid="set-brush-size-btn"
        onClick={() => dispatch({ type: "SET_BRUSH_SIZE", payload: 10 })}
      >
        Set Brush Size
      </button>
      <button
        data-testid="set-drawing-btn"
        onClick={() => dispatch({ type: "SET_DRAWING_STATE", payload: true })}
      >
        Start Drawing
      </button>
      <button
        data-testid="push-undo-btn"
        onClick={() => {
          const mockImageData = new ImageData(1, 1);
          dispatch({ type: "PUSH_UNDO", payload: mockImageData });
        }}
      >
        Push Undo
      </button>
      <button data-testid="undo-btn" onClick={() => dispatch({ type: "UNDO" })}>
        Undo
      </button>
      <button data-testid="redo-btn" onClick={() => dispatch({ type: "REDO" })}>
        Redo
      </button>
    </div>
  );
};

// Test component without provider to test error handling
const TestComponentWithoutProvider: React.FC = () => {
  const { state } = useKidPix();
  return <div>{state.currentTool}</div>;
};

describe("KidPixContext", () => {
  describe("Provider and initial state", () => {
    it("provides initial state correctly", () => {
      render(
        <KidPixProvider>
          <TestComponent />
        </KidPixProvider>,
      );

      expect(screen.getByTestId("current-tool")).toHaveTextContent("pencil");
      expect(screen.getByTestId("current-color")).toHaveTextContent("#000000");
      expect(screen.getByTestId("brush-size")).toHaveTextContent("5");
      expect(screen.getByTestId("is-drawing")).toHaveTextContent("false");
      expect(screen.getByTestId("undo-stack-length")).toHaveTextContent("0");
      expect(screen.getByTestId("redo-stack-length")).toHaveTextContent("0");
    });

    it("throws error when useKidPix is used outside provider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, "error").mockImplementation();

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow("useKidPix must be used within a KidPixProvider");

      consoleSpy.mockRestore();
    });
  });

  describe("State updates", () => {
    it("updates current tool", async () => {
      const user = userEvent.setup();

      render(
        <KidPixProvider>
          <TestComponent />
        </KidPixProvider>,
      );

      await user.click(screen.getByTestId("set-tool-btn"));
      expect(screen.getByTestId("current-tool")).toHaveTextContent("brush");
    });

    it("updates current color", async () => {
      const user = userEvent.setup();

      render(
        <KidPixProvider>
          <TestComponent />
        </KidPixProvider>,
      );

      await user.click(screen.getByTestId("set-color-btn"));
      expect(screen.getByTestId("current-color")).toHaveTextContent("#ff0000");
    });

    it("updates brush size", async () => {
      const user = userEvent.setup();

      render(
        <KidPixProvider>
          <TestComponent />
        </KidPixProvider>,
      );

      await user.click(screen.getByTestId("set-brush-size-btn"));
      expect(screen.getByTestId("brush-size")).toHaveTextContent("10");
    });

    it("updates drawing state", async () => {
      const user = userEvent.setup();

      render(
        <KidPixProvider>
          <TestComponent />
        </KidPixProvider>,
      );

      await user.click(screen.getByTestId("set-drawing-btn"));
      expect(screen.getByTestId("is-drawing")).toHaveTextContent("true");
    });
  });

  describe("Undo/Redo functionality", () => {
    it("pushes to undo stack", async () => {
      const user = userEvent.setup();

      render(
        <KidPixProvider>
          <TestComponent />
        </KidPixProvider>,
      );

      await user.click(screen.getByTestId("push-undo-btn"));
      expect(screen.getByTestId("undo-stack-length")).toHaveTextContent("1");
      expect(screen.getByTestId("redo-stack-length")).toHaveTextContent("0");
    });

    it("clears redo stack when new action is performed", async () => {
      const user = userEvent.setup();

      render(
        <KidPixProvider>
          <TestComponent />
        </KidPixProvider>,
      );

      // Push two actions to undo stack
      await user.click(screen.getByTestId("push-undo-btn"));
      await user.click(screen.getByTestId("push-undo-btn"));

      // Undo one action (moves to redo stack)
      await user.click(screen.getByTestId("undo-btn"));
      expect(screen.getByTestId("undo-stack-length")).toHaveTextContent("1");
      expect(screen.getByTestId("redo-stack-length")).toHaveTextContent("1");

      // Push new action (should clear redo stack)
      await user.click(screen.getByTestId("push-undo-btn"));
      expect(screen.getByTestId("undo-stack-length")).toHaveTextContent("2");
      expect(screen.getByTestId("redo-stack-length")).toHaveTextContent("0");
    });

    it("handles undo when stack is empty", async () => {
      const user = userEvent.setup();

      render(
        <KidPixProvider>
          <TestComponent />
        </KidPixProvider>,
      );

      // Try to undo when stack is empty
      await user.click(screen.getByTestId("undo-btn"));
      expect(screen.getByTestId("undo-stack-length")).toHaveTextContent("0");
      expect(screen.getByTestId("redo-stack-length")).toHaveTextContent("0");
    });

    it("handles redo when stack is empty", async () => {
      const user = userEvent.setup();

      render(
        <KidPixProvider>
          <TestComponent />
        </KidPixProvider>,
      );

      // Try to redo when stack is empty
      await user.click(screen.getByTestId("redo-btn"));
      expect(screen.getByTestId("undo-stack-length")).toHaveTextContent("0");
      expect(screen.getByTestId("redo-stack-length")).toHaveTextContent("0");
    });

    it("limits undo stack to 20 items", async () => {
      const user = userEvent.setup();

      render(
        <KidPixProvider>
          <TestComponent />
        </KidPixProvider>,
      );

      // Push 25 items to undo stack
      for (let i = 0; i < 25; i++) {
        await user.click(screen.getByTestId("push-undo-btn"));
      }

      // Should be limited to 20
      expect(screen.getByTestId("undo-stack-length")).toHaveTextContent("20");
    });
  });

  describe("Canvas layer management", () => {
    it("sets canvas layer", () => {
      const TestCanvasComponent: React.FC = () => {
        const { state, dispatch } = useKidPix();

        React.useEffect(() => {
          const mockCanvas = document.createElement("canvas");
          dispatch({
            type: "SET_CANVAS_LAYER",
            payload: { layer: "main", canvas: mockCanvas },
          });
        }, [dispatch]);

        return (
          <div data-testid="has-main-canvas">
            {state.canvasLayers.main ? "true" : "false"}
          </div>
        );
      };

      render(
        <KidPixProvider>
          <TestCanvasComponent />
        </KidPixProvider>,
      );

      expect(screen.getByTestId("has-main-canvas")).toHaveTextContent("true");
    });
  });
});
