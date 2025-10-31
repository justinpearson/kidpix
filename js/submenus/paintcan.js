KiddoPaint.Submenu.paintcan = [
  {
    name: "Solid",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Solid);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Solid(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Partial1",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Partial1);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Partial1(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Partial2",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Partial2);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Partial2(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Partial3",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Partial3);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Partial3(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "PartialArtifactAlias",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.PartialArtifactAlias);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.PartialArtifactAlias(
          KiddoPaint.Current.color,
        );
      };
    },
  },
  {
    name: "Speckles",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Speckles);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Speckles(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Speckles",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Stripes);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Stripes(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Speckles",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Thatch);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Thatch(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Speckles",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Shingles);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Shingles(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Bubbles",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Bubbles);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Bubbles(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Diamond",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Diamond);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Diamond(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Diamond",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Ribbon);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Ribbon(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Sand",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Sand);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Sand(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Brick",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Brick);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Brick(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Brick",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Chevron);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Chevron(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Brick",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Stairs);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Stairs(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Brick",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Cross);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Cross(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Brick",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.DiagBrick);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.DiagBrick(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "CornerStair",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.CornerStair);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.CornerStair(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Houndstooth",
    imgJs: function () {
      return makeIcon(KiddoPaint.Textures.Houndstooth);
    },
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "destination-in";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.Houndstooth(KiddoPaint.Current.color);
      };
    },
  },
  {
    name: "Texture ?",
    imgSrc: "img/patterns/rainbow-icon.png",
    handler: function () {
      KiddoPaint.Tools.PaintCan.gcop = "source-atop";
      KiddoPaint.Tools.PaintCan.texture = function () {
        return KiddoPaint.Textures.RainbowGrad(
          {
            _x: 0,
            _y: 0,
          },
          {
            _x: 0,
            _y: KiddoPaint.Display.main_canvas.height,
          },
        );
      };
    },
  },
];
