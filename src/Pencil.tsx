import React, { useRef, useEffect, useState } from 'react';

interface PencilProps {
    sounds: {
        pencil: () => void;
    };
    context: CanvasRenderingContext2D;
}

const Pencil: React.FC<PencilProps> = ({ sounds, context }) => {
    const [isDown, setIsDown] = useState(false);
    const lastX = useRef(0);
    const lastY = useRef(0);
    const size = 7;

    const handleMouseDown = (ev: MouseEvent) => {
        setIsDown(true);
        lastX.current = ev.offsetX;
        lastY.current = ev.offsetY;
    };

    const handleMouseMove = (ev: MouseEvent) => {
        if (isDown) {
            sounds.pencil();
            context.beginPath();
            context.strokeStyle = '#000'; // Assuming a default color
            context.lineWidth = size;
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.moveTo(lastX.current, lastY.current);
            context.lineTo(ev.offsetX, ev.offsetY);
            context.stroke();
            lastX.current = ev.offsetX;
            lastY.current = ev.offsetY;
        }
    };

    const handleMouseUp = (ev: MouseEvent) => {
        if (isDown) {
            handleMouseMove(ev);
            setIsDown(false);
        }
    };

    useEffect(() => {
        const canvas = context.canvas;
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };
    }, [context]);

    return null; // This component does not render anything itself
};

export default Pencil;