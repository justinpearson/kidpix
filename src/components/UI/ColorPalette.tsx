import React from "react";
import { useKidPix } from "../../contexts/KidPixContext";

const COLORS = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#800080",
  "#FFC0CB",
  "#A52A2A",
  "#808080",
  "#90EE90",
  "#FFB6C1",
];

export const ColorPalette: React.FC = () => {
  const { state, dispatch } = useKidPix();

  const selectColor = (color: string) => {
    dispatch({ type: "SET_COLOR", payload: color });
  };

  return (
    <div className="color-palette">
      <h3>Colors</h3>
      <div className="color-grid">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`color-button ${state.currentColor === color ? "active" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => selectColor(color)}
            title={color}
          />
        ))}
      </div>

      <div className="current-color">
        <label>Current Color:</label>
        <div
          className="current-color-display"
          style={{ backgroundColor: state.currentColor }}
        />
        <input
          type="color"
          value={state.currentColor}
          onChange={(e) => selectColor(e.target.value)}
        />
      </div>
    </div>
  );
};
