KiddoPaint.Submenu.jumble = [
  {
    name: "Invert",
    imgSrc: "img/mixer/tool-submenu-wacky-mixer-164.png",
    handler: function () {
      KiddoPaint.Display.canvas.classList = "";
      KiddoPaint.Display.canvas.classList.add("cursor-guy-smile");
      KiddoPaint.Current.tool = KiddoPaint.Tools.MixerInverter;
    },
  },
  {
    name: "Raindrops",
    imgSrc: "img/mixer/tool-submenu-wacky-mixer-165.png",
    handler: function () {
      KiddoPaint.Display.canvas.classList = "";
      KiddoPaint.Display.canvas.classList.add("cursor-guy-smile");
      KiddoPaint.Current.tool = KiddoPaint.Tools.AnimBrush;
      KiddoPaint.Tools.AnimBrush.reset();
      KiddoPaint.Tools.AnimBrush.animInterval = 50;
      KiddoPaint.Tools.AnimBrush.postprocess = function () {
        KiddoPaint.Display.canvas.classList = "";
        KiddoPaint.Display.canvas.classList.add("cursor-guy-smile");
      };
      KiddoPaint.Tools.AnimBrush.texture = function (step, distancePrev) {
        KiddoPaint.Display.canvas.classList = "";
        KiddoPaint.Display.canvas.classList.add("cursor-guy-wow");
        KiddoPaint.Sounds.bubblepops();
        const color = KiddoPaint.Colors.randomAllColor();
        return KiddoPaint.Brushes.Raindrops(color);
      };
    },
  },
  {
    name: "Checkerboard",
    imgSrc: "img/mixer/tool-submenu-wacky-mixer-166.png",
    handler: function () {
      KiddoPaint.Display.canvas.classList = "";
      KiddoPaint.Display.canvas.classList.add("cursor-guy-smile");
      KiddoPaint.Current.tool = KiddoPaint.Tools.MixerCheckerboard;
    },
  },
  {
    name: "Wallpaper",
    imgSrc: "img/mixer/tool-submenu-wacky-mixer-167.png",
    handler: function () {
      KiddoPaint.Display.canvas.classList = "";
      KiddoPaint.Display.canvas.classList.add("cursor-guy-smile");
      KiddoPaint.Current.tool = KiddoPaint.Tools.MixerWallpaper;
    },
  },
  {
    name: "Venetian Blinds",
    imgSrc: "img/mixer/tool-submenu-wacky-mixer-168.png",
    handler: function () {
      KiddoPaint.Display.canvas.classList = "";
      KiddoPaint.Display.canvas.classList.add("cursor-guy-smile");
      KiddoPaint.Current.tool = KiddoPaint.Tools.MixerVenetianBlinds;
    },
  },
  {
    name: "The Outliner",
    imgSrc: "img/mixer/tool-submenu-wacky-mixer-169.png",
    handler: function () {
      KiddoPaint.Sounds.unimpl();
    },
  },
  {
    name: "Shadow Boxes",
    imgSrc: "img/mixer/tool-submenu-wacky-mixer-170.png",
    handler: function () {
      KiddoPaint.Display.canvas.classList = "";
      KiddoPaint.Display.canvas.classList.add("cursor-guy-smile");
      KiddoPaint.Current.tool = KiddoPaint.Tools.MixerShadowBoxes;
    },
  },
  {
    name: "Zoom In",
    imgSrc: "img/mixer/tool-submenu-wacky-mixer-171.png",
    handler: function () {
      KiddoPaint.Sounds.unimpl();
    },
  },
  {
    name: "Broken Glass",
    imgSrc: "img/mixer/tool-submenu-wacky-mixer-172.png",
    handler: function () {
      KiddoPaint.Sounds.unimpl();
    },
  },
  {
    name: "Picture In A Picture",
    imgSrc: "img/mixer/tool-submenu-wacky-mixer-173.png",
    handler: function () {
      KiddoPaint.Display.canvas.classList = "";
      KiddoPaint.Display.canvas.classList.add("cursor-guy-smile");
      KiddoPaint.Current.tool = KiddoPaint.Tools.MixerPip;
    },
  },
  {
    name: "The Highlighter",
    imgSrc: "img/mixer/tool-submenu-wacky-mixer-174.png",
    handler: function () {
      KiddoPaint.Sounds.unimpl();
    },
  },
  {
    name: "Pattern Maker",
    imgSrc: "img/mixer/tool-submenu-wacky-mixer-175.png",
    handler: function () {
      KiddoPaint.Display.canvas.classList = "";
      KiddoPaint.Display.canvas.classList.add("cursor-guy-smile");
      KiddoPaint.Current.tool = KiddoPaint.Tools.MixerPattern;
    },
  },
  {
    name: "Wrap Around",
    imgSrc: "img/mixer/tool-submenu-wacky-mixer-176.png",
    handler: function () {
      KiddoPaint.Sounds.unimpl();
    },
  },
  /*
{
    name: 'Snow Flakes And Rain Drops',
    imgSrc: 'img/mixer/tool-submenu-wacky-mixer-177.png',
    handler: function() {}
},
*/
  {
    name: "Swirl",
    emoji: "🍭",
    handler: function () {
      KiddoPaint.Display.canvas.classList = "";
      KiddoPaint.Display.canvas.classList.add("cursor-lollipop");
      KiddoPaint.Tools.WholeCanvasEffect.effect = JumbleFx.SWIRL;
      KiddoPaint.Current.tool = KiddoPaint.Tools.WholeCanvasEffect;
    },
  },
  {
    name: "Pancake Stack",
    emoji: "🥞",
    handler: function () {
      KiddoPaint.Display.canvas.classList = "";
      KiddoPaint.Display.canvas.classList.add("cursor-pancakes");
      KiddoPaint.Tools.WholeCanvasEffect.effect = JumbleFx.PANCAKE;
      KiddoPaint.Current.tool = KiddoPaint.Tools.WholeCanvasEffect;
    },
  },
];
