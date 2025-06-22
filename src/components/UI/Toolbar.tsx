import React from "react";
import { useKidPix } from "../../contexts/KidPixContext";

const TOOLS = [
  { id: "pencil", name: "Pencil", icon: "✏️" },
  { id: "brush", name: "Brush", icon: "🖌️" },
  { id: "eraser", name: "Eraser", icon: "🧽" },
  { id: "line", name: "Line", icon: "📏" },
  { id: "circle", name: "Circle", icon: "⭕" },
  { id: "square", name: "Square", icon: "⬜" },
];

export const Toolbar: React.FC = () => {
  const { state, dispatch } = useKidPix();

  const selectTool = (toolId: string) => {
    dispatch({ type: "SET_TOOL", payload: toolId });
  };

  return (
    <div className="toolbar">
      <h3>Tools</h3>
      <div className="tool-grid">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            className={`tool-button ${state.currentTool === tool.id ? "active" : ""}`}
            onClick={() => selectTool(tool.id)}
            title={tool.name}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
