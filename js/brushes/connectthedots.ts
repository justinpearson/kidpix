KiddoPaint.Brushes.ConnectTheDots = function (color1: string | undefined, step: number) {
  color1 = color1 || "black";

  const canvasBrush = document.createElement("canvas");
  canvasBrush.width = canvasBrush.height = 150;
  const contextBrush = canvasBrush.getContext("2d", { willReadFrequently: true })!;

  contextBrush.font = "16px sans-serif";
  contextBrush.textBaseline = "middle";
  contextBrush.textAlign = "center";
  contextBrush.fillStyle = color1;
  const dotandnumber = "• " + step;
  contextBrush.fillText(dotandnumber, 16, 16, canvasBrush.width); // 3rd arg tries to constrain width

  return {
    brush: window.trimCanvas3(canvasBrush),
    offset: 0,
  };
};
