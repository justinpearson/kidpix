KiddoPaint.Brushes.FollowingSine = function (color1, step) {
  color1 = color1 || "black";
  var interval = 50;
  step = (step % interval) / interval;

  var canvasBrush = document.createElement("canvas");
  var size = 33 * KiddoPaint.Current.scaling;
  canvasBrush.width = size * 2;
  canvasBrush.height = size * 2;
  var contextBrush = canvasBrush.getContext("2d");
  contextBrush.fillStyle = color1;

  for (var i = 0, s = step; i < 6; i++, s += 10 / interval) {
    x = size + size * Math.cos(2 * Math.PI * s);
    y = size + size * Math.sin(2 * Math.PI * s);
    contextBrush.fillRect(Math.round(x), Math.round(y), 3, 3);
  }

  return {
    brush: canvasBrush,
    offset: size,
    inplace: true,
  };
};
