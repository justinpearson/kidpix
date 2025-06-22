import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { vi } from "vitest";
import { useCanvasSetup } from "../useCanvasSetup";

describe("useCanvasSetup", () => {
  it("sets cursor to crosshair on container", () => {
    const mockDispatch = vi.fn();

    const { result } = renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(null);

      // Create a mock div element
      const mockDiv = document.createElement("div");
      containerRef.current = mockDiv;

      useCanvasSetup(containerRef, mockDispatch);

      return { containerRef, mockDiv };
    });

    const { mockDiv } = result.current;

    // Check that cursor style was set
    expect(mockDiv.style.cursor).toBe("crosshair");
  });

  it("handles null container ref gracefully", () => {
    const mockDispatch = vi.fn();

    const { result } = renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(null);
      // Keep containerRef.current as null

      useCanvasSetup(containerRef, mockDispatch);

      return { containerRef };
    });

    // Should not throw error when containerRef.current is null
    expect(result.current.containerRef.current).toBe(null);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("updates when containerRef changes", () => {
    const mockDispatch = vi.fn();

    const { result, rerender } = renderHook(
      ({ containerRef }) => {
        useCanvasSetup(containerRef, mockDispatch);
        return containerRef;
      },
      {
        initialProps: {
          containerRef: { current: null } as React.RefObject<HTMLDivElement>,
        },
      },
    );

    // Initially no effect
    expect(result.current.current).toBe(null);

    // Update with actual div
    const mockDiv = document.createElement("div");
    const newContainerRef = { current: mockDiv };

    rerender({ containerRef: newContainerRef });

    // Should set cursor style
    expect(mockDiv.style.cursor).toBe("crosshair");
  });

  it("updates when dispatch changes", () => {
    const mockDispatch1 = vi.fn();
    const mockDispatch2 = vi.fn();
    const mockDiv = document.createElement("div");
    const containerRef = { current: mockDiv };

    const { rerender } = renderHook(
      ({ dispatch }) => {
        useCanvasSetup(containerRef, dispatch);
      },
      {
        initialProps: { dispatch: mockDispatch1 },
      },
    );

    // Initial setup
    expect(mockDiv.style.cursor).toBe("crosshair");

    // Clear previous style to test re-application
    mockDiv.style.cursor = "";

    // Re-render with new dispatch
    rerender({ dispatch: mockDispatch2 });

    // Should re-apply cursor style
    expect(mockDiv.style.cursor).toBe("crosshair");
  });
});
