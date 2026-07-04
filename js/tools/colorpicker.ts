class ColorPickerTool implements KiddoPaintTool {
  mousedown = (ev: KidPixPointerEvent) => {
    // Get the pixel color at the clicked position
    const x = Math.floor(ev._x);
    const y = Math.floor(ev._y);

    // Read pixel data from the main canvas
    const imageData = KiddoPaint.Display.main_context.getImageData(x, y, 1, 1);
    const pixelData = imageData.data;

    // Extract RGB values
    const r = pixelData[0];
    const g = pixelData[1];
    const b = pixelData[2];
    const a = pixelData[3];

    // Convert to RGB string format and update both current color and UI
    let pickedColor;
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
    document.getElementById("currentColor")!.style.cssText =
      "background-color:" + pickedColor;

    // Note: Tool stays selected (doesn't switch back to previous tool)
    // as per requirement 6
  };

  mousemove = () => {
    // Color picker doesn't do anything on mouse move
  };

  mouseup = () => {
    // Color picker doesn't do anything on mouse up
  };
}

// Create the tool instance
declare global {
  interface KiddoPaintToolbox {
    ColorPicker: typeof ColorPickerTool;
  }
  interface KiddoPaintToolsRegistry {
    ColorPicker: ColorPickerTool;
  }
}

KiddoPaint.Tools.Toolbox.ColorPicker = ColorPickerTool;
KiddoPaint.Tools.ColorPicker = new ColorPickerTool();
