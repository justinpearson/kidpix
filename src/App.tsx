import React from "react";
import { KidPixProvider } from "./contexts/KidPixContext";
import { CanvasContainer } from "./components/Canvas/CanvasContainer";
import { Toolbar } from "./components/UI/Toolbar";
import { ColorPalette } from "./components/UI/ColorPalette";
import "./App.css";

const App: React.FC = () => {
  return (
    <KidPixProvider>
      <div className="kidpix-app">
        <header className="kidpix-header">
          <h1>KidPix</h1>
        </header>

        <main className="kidpix-main">
          <div className="kidpix-sidebar">
            <Toolbar />
            <ColorPalette />
          </div>

          <div className="kidpix-canvas-area">
            <CanvasContainer />
          </div>
        </main>
      </div>
    </KidPixProvider>
  );
};

export default App;
