import { useEffect, RefObject } from "react";
import { KidPixAction } from "../contexts/KidPixContext";

export const useCanvasSetup = (
  containerRef: RefObject<HTMLDivElement | null>,
  dispatch: React.Dispatch<KidPixAction>,
) => {
  useEffect(() => {
    if (!containerRef.current) return;

    // Set up container properties
    const container = containerRef.current;
    container.style.cursor = "crosshair";

    // Add any additional setup logic here
    // For example: setting up resize observers, initial canvas state, etc.
  }, [containerRef, dispatch]);
};
