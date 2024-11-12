import React, { useState } from 'react';

const TOOLS = [
    { id: "save", title: "Save", imsrc: "./src/assets/img/kp-m_27.png" },
    { id: "pencil", title: "Wacky Pencil", imsrc: "./src/assets/img/kp-m_28.png" },
    { id: "line", title: "Line", imsrc: "./src/assets/img/kp-m_29.png" },
    { id: "square", title: "Rectangle", imsrc: "./src/assets/img/kp-m_30.png" },
    { id: "circle", title: "Oval", imsrc: "./src/assets/img/kp-m_31.png" },
    { id: "brush", title: "Wacky Brush", imsrc: "./src/assets/img/kp-m_32.png" },
    { id: "jumble", title: "Electric Mixer", imsrc: "./src/assets/img/kp-m_33.png" },
    { id: "flood", title: "Paint Can", imsrc: "./src/assets/img/kp-m_34.png" },
    { id: "eraser", title: "Eraser", imsrc: "./src/assets/img/kp-m_35.png" },
    { id: "alphabet", title: "Text", imsrc: "./src/assets/img/kp-m_36.png" },
    { id: "stamp", title: "Rubber Stamps", imsrc: "./src/assets/img/kp-m_37.png" },
    { id: "truck", title: "Moving Van", imsrc: "./src/assets/img/kp-m_38.png" },
    { id: "undo", title: "The Undo Guy", imsrc: "./src/assets/img/kp-m_39.png" }];

interface ToolProps { onToolSelect: (tool: string) => void; }

// TODO: draw a line around cur selected tool, so you know what's selected.

// TODO: weird to have 2 states, one in this file & one in parent file. How to simplify?

const MainToolbar: React.FC<ToolProps> = ({ onToolSelect }) => {
    const [currentTool, setCurrentTool] = useState<string>('#000000'); // default tool

    const handleToolChange = (tool: string) => {
        setCurrentTool(tool);
        onToolSelect(tool);
    };

    function ToolButton(tid: string, toolName: string, imsrc: string) {
        return (
            <button className="tool" id={tid} title={toolName} onClick={() => { handleToolChange(toolName) }}>
                <img src={imsrc} className="pixelated" width="48" height="48" />
            </button>
        );
    }

    return (
        <div>
            <h1>Toolbar</h1>
            <p>Selected Tool: {currentTool}</p>
            <div id="maintoolbar">
                {TOOLS.map((tool) => ToolButton(tool.id, tool.title, tool.imsrc))}
            </div>
        </div>
    );
}



export default MainToolbar;
