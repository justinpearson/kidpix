import React, { useRef, useEffect, forwardRef } from "react";
import { useKidPix, KidPixState } from "../../contexts/KidPixContext";

interface CanvasLayerProps {
  name: keyof KidPixState["canvasLayers"];
  width: number;
  height: number;
  zIndex: number;
  className?: string;
  interactive?: boolean;
}

export const CanvasLayer = forwardRef<HTMLCanvasElement, CanvasLayerProps>(
  ({ name, width, height, zIndex, className, interactive = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { dispatch } = useKidPix();

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Register canvas with context
      dispatch({
        type: "SET_CANVAS_LAYER",
        payload: { layer: name, canvas },
      });

      // Set up canvas properties
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }, [name, dispatch]);

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={className}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex,
          pointerEvents: interactive ? "auto" : "none",
          imageRendering: "pixelated", // Maintain crisp pixels
        }}
      />
    );
  },
);

CanvasLayer.displayName = "CanvasLayer";
