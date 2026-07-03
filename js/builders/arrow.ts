KiddoPaint.Builders.Arrow = function (color1?: string, angle?: number) {
  // 'jitter' was assigned without declaration — a ReferenceError under
  // module strict mode that left this builder broken until now.
  const jitter = function () {
    const baseJitter = 10;
    return baseJitter + Math.random() * baseJitter;
  };
  color1 = color1 || "black";
  angle = angle || 0;

  const canvasBrush = document.createElement("canvas");
  canvasBrush.width = 50;
  canvasBrush.height = 50;
  const contextBrush = canvasBrush.getContext("2d")!;

  contextBrush.beginPath();
  //	contextBrush.rect(0, 0, 43, 43);

  contextBrush.translate(21, 21);
  contextBrush.rotate(angle);
  contextBrush.translate(-10.5, -15.5);

  contextBrush.strokeStyle = color1;

  //contextBrush.moveTo(10 + jitter() / 2.0, 0 + jitter() / 2.0);
  //contextBrush.lineTo(10 + jitter(), 30 + jitter());

  for (let i = 0; i < 5; i++) {
    contextBrush.moveTo(10 + jitter() / 2.0, 0 + jitter() / 2.0);
    contextBrush.lineTo(0 + jitter(), 23 + jitter());
    contextBrush.moveTo(10 + jitter(), 0 + jitter());
    contextBrush.lineTo(20 + jitter(), 20 + jitter());
  }

  contextBrush.stroke();

  return canvasBrush;
};
