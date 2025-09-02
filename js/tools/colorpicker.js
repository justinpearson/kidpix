KiddoPaint.Tools.Toolbox.ColorPicker = function () {
  var tool = this;

  this.mousedown = function (ev) {
    // Get the pixel color at the clicked position
    var x = Math.floor(ev._x);
    var y = Math.floor(ev._y);

    // Read pixel data from the main canvas
    var imageData = KiddoPaint.Display.main_context.getImageData(x, y, 1, 1);
    var pixelData = imageData.data;

    // Extract RGB values
    var r = pixelData[0];
    var g = pixelData[1];
    var b = pixelData[2];
    var a = pixelData[3];

    // Convert to RGB string format and update both current color and UI
    var pickedColor;
    if (a === 0) {
      // Transparent pixel - set to white
      pickedColor = "rgb(255, 255, 255)";
    } else {
      // Set the current color to the picked color
      pickedColor = "rgb(" + r + ", " + g + ", " + b + ")";
    }

    // Update the current color
    KiddoPaint.Current.color = pickedColor;

    // Update the UI color indicator (like the color palette does)
    document.getElementById("currentColor").style =
      "background-color:" + pickedColor;

    // Note: Tool stays selected (doesn't switch back to previous tool)
    // as per requirement 6
  };

  this.mousemove = function (ev) {
    // Color picker doesn't do anything on mouse move
  };

  this.mouseup = function (ev) {
    // Color picker doesn't do anything on mouse up
  };
};

// Create the tool instance
KiddoPaint.Tools.ColorPicker = new KiddoPaint.Tools.Toolbox.ColorPicker();
