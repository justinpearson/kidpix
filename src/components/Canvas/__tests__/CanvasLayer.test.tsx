import React from "react";
import { render } from "@testing-library/react";
import { KidPixProvider } from "../../../contexts/KidPixContext";
import { CanvasLayer } from "../CanvasLayer";

// Mock component to test context integration
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <KidPixProvider>{children}</KidPixProvider>;
};

describe("CanvasLayer", () => {
  it("renders canvas with correct attributes", () => {
    render(
      <TestWrapper>
        <CanvasLayer
          name="main"
          width={640}
          height={480}
          zIndex={3}
          className="test-canvas"
          interactive={false}
        />
      </TestWrapper>,
    );

    const canvas = document.querySelector("canvas")!;
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("width", "640");
    expect(canvas).toHaveAttribute("height", "480");
    expect(canvas).toHaveClass("test-canvas");
  });

  it("applies correct styles for non-interactive layer", () => {
    render(
      <TestWrapper>
        <CanvasLayer
          name="main"
          width={640}
          height={480}
          zIndex={3}
          className="test-canvas"
          interactive={false}
        />
      </TestWrapper>,
    );

    const canvas = document.querySelector("canvas")!;
    expect(canvas).toHaveStyle({
      position: "absolute",
      top: "0",
      left: "0",
      zIndex: "3",
      pointerEvents: "none",
      imageRendering: "pixelated",
    });
  });

  it("applies correct styles for interactive layer", () => {
    render(
      <TestWrapper>
        <CanvasLayer
          name="tmp"
          width={640}
          height={480}
          zIndex={5}
          className="interactive-canvas"
          interactive={true}
        />
      </TestWrapper>,
    );

    const canvas = document.querySelector("canvas")!;
    expect(canvas).toHaveStyle({
      position: "absolute",
      top: "0",
      left: "0",
      zIndex: "5",
      pointerEvents: "auto",
      imageRendering: "pixelated",
    });
  });

  it("sets up canvas context properties", () => {
    render(
      <TestWrapper>
        <CanvasLayer
          name="main"
          width={640}
          height={480}
          zIndex={3}
          interactive={false}
        />
      </TestWrapper>,
    );

    const canvas = document.querySelector("canvas")!;
    expect(canvas).toBeInTheDocument();

    // Test passes if canvas renders without errors
    // Context setup is mocked in test-setup.ts
  });

  it("renders without className when not provided", () => {
    render(
      <TestWrapper>
        <CanvasLayer
          name="main"
          width={640}
          height={480}
          zIndex={3}
          interactive={false}
        />
      </TestWrapper>,
    );

    const canvas = document.querySelector("canvas")!;
    expect(canvas).toBeInTheDocument();
    expect(canvas.className).toBe("");
  });

  it("has correct display name", () => {
    expect(CanvasLayer.displayName).toBe("CanvasLayer");
  });

  it("defaults to non-interactive when interactive prop not provided", () => {
    render(
      <TestWrapper>
        <CanvasLayer name="main" width={640} height={480} zIndex={3} />
      </TestWrapper>,
    );

    const canvas = document.querySelector("canvas")!;
    expect(canvas).toHaveStyle("pointer-events: none");
  });
});
