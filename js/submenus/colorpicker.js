KiddoPaint.Submenu.colorpicker = [
  {
    name: "Color Picker",
    imgSrc: "img/color-picker/eyedropper-icon.png",
    handler: function () {
      // Set cursor to crosshair for color picker tool
      KiddoPaint.Display.canvas.classList = "";
      KiddoPaint.Display.canvas.classList.add("cursor-crosshair");
    },
  },
];
