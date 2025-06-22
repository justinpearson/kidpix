import React, { useRef } from "react";
import { useKidPix } from "../../contexts/KidPixContext";
import { CanvasLayer } from "./CanvasLayer";
import { useCanvasSetup } from "../../hooks/useCanvasSetup";
import { useDrawingEvents } from "../../hooks/useDrawingEvents";

export const CanvasContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useKidPix();

  // Custom hooks for canvas setup and event handling
  useCanvasSetup(containerRef, dispatch);
  useDrawingEvents(state.canvasLayers.tmp, state);

  return (
    <div
      ref={containerRef}
      className="canvas-container"
      style={{ position: "relative", width: "640px", height: "480px" }}
    >
      {/* Background/Animation Layer */}
      <CanvasLayer
        name="bnim"
        width={640}
        height={480}
        zIndex={1}
        className="canvas-bnim"
      />

      {/* Animation Layer */}
      <CanvasLayer
        name="anim"
        width={640}
        height={480}
        zIndex={2}
        className="canvas-anim"
      />

      {/* Main Drawing Layer */}
      <CanvasLayer
        name="main"
        width={640}
        height={480}
        zIndex={3}
        className="canvas-main"
      />

      {/* Preview Layer */}
      <CanvasLayer
        name="preview"
        width={640}
        height={480}
        zIndex={4}
        className="canvas-preview"
      />

      {/* Temporary Drawing Layer (top-most, interactive) */}
      <CanvasLayer
        name="tmp"
        width={640}
        height={480}
        zIndex={5}
        className="canvas-tmp"
        interactive={true}
      />
    </div>
  );
};
