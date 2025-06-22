import { useEffect, useCallback } from "react";
import { KidPixState } from "../contexts/KidPixContext";

export const useDrawingEvents = (
  canvas: HTMLCanvasElement | null,
  state: KidPixState,
) => {
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (!canvas) return;

      // Get current tool and call its mousedown method
      // This will be expanded when we implement tools
      console.log("Mouse down at", event.offsetX, event.offsetY);
    },
    [canvas, state],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!canvas || !state.isDrawing) return;

      // Handle mouse move for current tool
      console.log("Mouse move at", event.offsetX, event.offsetY);
    },
    [canvas, state],
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (!canvas) return;

      // Handle mouse up for current tool
      console.log("Mouse up at", event.offsetX, event.offsetY);
    },
    [canvas, state],
  );

  useEffect(() => {
    if (!canvas) return;

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvas, handleMouseDown, handleMouseMove, handleMouseUp]);
};
