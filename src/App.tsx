import './App.css'

import React, { useState } from 'react';
import ColorPalette from './ColorPalette';
import MainToolbar from './MainToolbar';

const App: React.FC = () => {
  const [penColor, setPenColor] = useState<string>('#000000'); // default pen color: black
  const handleColorChange = (color: string) => { setPenColor(color); };

  const [selectedTool, setSelectedTool] = useState<string>('Wacky Pencil'); // default tool: pencil
  const handleToolChange = (tool: string) => { setSelectedTool(tool); };

  return (
    <div>
      <h1>Drawing Program</h1>
      <p>Selected Pen Color: {penColor}</p>
      <p>Selected Tool: {selectedTool}</p>
      <ColorPalette onColorSelect={handleColorChange} />
      <MainToolbar onToolSelect={handleToolChange} />
    </div>
  );
}

export default App
