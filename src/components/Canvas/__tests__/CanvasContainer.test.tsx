import React from "react";
import { render } from "@testing-library/react";
import { vi } from "vitest";
import { KidPixProvider } from "../../../contexts/KidPixContext";
import { CanvasContainer } from "../CanvasContainer";

// Mock the custom hooks to avoid complex setup
vi.mock("../../../hooks/useCanvasSetup", () => ({
  useCanvasSetup: vi.fn(),
}));

vi.mock("../../../hooks/useDrawingEvents", () => ({
  useDrawingEvents: vi.fn(),
}));

// Mock component to test context integration
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <KidPixProvider>{children}</KidPixProvider>;
};

describe("CanvasContainer", () => {
  it("renders all five canvas layers", () => {
    render(
      <TestWrapper>
        <CanvasContainer />
      </TestWrapper>,
    );

    // Should render 5 canvas elements (one for each layer)
    const canvases = document.querySelectorAll("canvas");
    expect(canvases).toHaveLength(5);
  });

  it("renders layers in correct z-index order", () => {
    render(
      <TestWrapper>
        <CanvasContainer />
      </TestWrapper>,
    );

    const canvases = document.querySelectorAll("canvas");

    // Check z-index values
    const zIndexes = Array.from(canvases).map((canvas) =>
      parseInt(getComputedStyle(canvas).zIndex),
    );

    // Should be in ascending order: 1, 2, 3, 4, 5
    expect(zIndexes).toEqual([1, 2, 3, 4, 5]);
  });

  it("renders layers with correct classes", () => {
    render(
      <TestWrapper>
        <CanvasContainer />
      </TestWrapper>,
    );

    // Check that specific layer classes exist
    expect(document.querySelector(".canvas-bnim")).toBeInTheDocument();
    expect(document.querySelector(".canvas-anim")).toBeInTheDocument();
    expect(document.querySelector(".canvas-main")).toBeInTheDocument();
    expect(document.querySelector(".canvas-preview")).toBeInTheDocument();
    expect(document.querySelector(".canvas-tmp")).toBeInTheDocument();
  });

  it("sets correct canvas dimensions", () => {
    render(
      <TestWrapper>
        <CanvasContainer />
      </TestWrapper>,
    );

    const canvases = document.querySelectorAll("canvas");

    // All canvases should have same dimensions
    Array.from(canvases).forEach((canvas) => {
      expect(canvas).toHaveAttribute("width", "640");
      expect(canvas).toHaveAttribute("height", "480");
    });
  });

  it("makes only tmp layer interactive", () => {
    render(
      <TestWrapper>
        <CanvasContainer />
      </TestWrapper>,
    );

    const canvases = document.querySelectorAll("canvas");

    // Check pointer events - only the last canvas (tmp) should be interactive
    Array.from(canvases).forEach((canvas, index) => {
      if (index === canvases.length - 1) {
        // Last canvas (tmp layer) should be interactive
        expect(canvas).toHaveStyle("pointer-events: auto");
      } else {
        // Other layers should not be interactive
        expect(canvas).toHaveStyle("pointer-events: none");
      }
    });
  });

  it("renders container with correct styles", () => {
    render(
      <TestWrapper>
        <CanvasContainer />
      </TestWrapper>,
    );

    const container = document.querySelector(".canvas-container");
    expect(container).toHaveClass("canvas-container");
    expect(container).toHaveStyle({
      position: "relative",
      width: "640px",
      height: "480px",
    });
  });

  it("renders without errors (hooks are mocked)", () => {
    render(
      <TestWrapper>
        <CanvasContainer />
      </TestWrapper>,
    );

    // Test passes if component renders without errors
    // Custom hooks are mocked to avoid complex setup
    expect(document.querySelector(".canvas-container")).toBeInTheDocument();
  });

  it("maintains proper layer structure", () => {
    render(
      <TestWrapper>
        <CanvasContainer />
      </TestWrapper>,
    );

    const container = document.querySelector(".canvas-container");
    expect(container).toBeInTheDocument();

    // Verify all layers are direct children of the container
    const layerClasses = [
      ".canvas-bnim",
      ".canvas-anim",
      ".canvas-main",
      ".canvas-preview",
      ".canvas-tmp",
    ];

    layerClasses.forEach((className) => {
      const layer = container?.querySelector(className);
      expect(layer).toBeInTheDocument();
      expect(layer?.parentElement).toBe(container);
    });
  });
});
