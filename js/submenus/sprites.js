KiddoPaint.Submenu.sprites = [];

KiddoPaint.Sprite.sheetPage = 0;

/**
 * Get the human-readable name for a stamp at given coordinates
 * @param {string} sheetPath - Path to spritesheet (e.g., "img/stamp/kidpix-spritesheet-0.png")
 * @param {number} row - 0-indexed row number
 * @param {number} col - 0-indexed column number
 * @returns {string} Human-readable stamp name or fallback
 */
KiddoPaint.Stamps.getStampName = function (sheetPath, row, col) {
  // Column 14 (0-indexed) = column 15 (1-indexed) = row/page indicator
  if (col === 14) {
    return "Row/Page Indicator";
  }

  // Extract filename from path (e.g., "img/stamp/kidpix-spritesheet-0.png" -> "kidpix-spritesheet-0.png")
  const filename = sheetPath.split("/").pop();

  // Find the spritesheet in our data
  const sheet = KiddoPaint.Stamps.namesData?.find(
    (s) => s.filename === filename,
  );

  if (!sheet) {
    return "Sprite"; // Fallback if sheet not found
  }

  // Convert 0-indexed to 1-indexed for JSON lookup
  const jsonRow = row + 1;
  const jsonCol = col + 1;

  // Find the stamp by row and col
  const stamp = sheet.stamp_data.find(
    (s) => s.row === jsonRow && s.col === jsonCol,
  );

  return stamp?.name || "Sprite"; // Return name or fallback
};

KiddoPaint.Sprite.sheets = [
  "img/stamp/kidpix-spritesheet-0.png",
  "img/stamp/kidpix-spritesheet-0b.png",
  "img/stamp/kidpix-spritesheet-1.png",
  "img/stamp/kidpix-spritesheet-2.png",
  "img/stamp/kidpix-spritesheet-3.png",
  "img/stamp/kidpix-spritesheet-4.png",
  "img/stamp/kidpix-spritesheet-5.png",
  "img/stamp/kidpix-spritesheet-6.png",
  "img/stamp/kidpix-spritesheet-7.png",
  "img/stamp/kidpix-spritesheet-8.png",
];

KiddoPaint.Sprite.nextSprite = function () {
  const maxrow = KiddoPaint.Sprite.sheets.length - 1;
  KiddoPaint.Sprite.sheetPage += 1;
  if (KiddoPaint.Sprite.sheetPage > maxrow) {
    KiddoPaint.Sprite.sheetPage = 0;
  }
};

KiddoPaint.Sprite.prevSprite = function () {
  const maxrow = KiddoPaint.Sprite.sheets.length - 1;
  KiddoPaint.Sprite.sheetPage -= 1;
  if (KiddoPaint.Sprite.sheetPage < 0) {
    KiddoPaint.Sprite.sheetPage = maxrow;
  }
};

KiddoPaint.Sprite.nextPage = function () {
  const maxrow = 7;
  KiddoPaint.Sprite.page += 1;
  if (KiddoPaint.Sprite.page > maxrow) {
    KiddoPaint.Sprite.page = 0;
  }
};

KiddoPaint.Sprite.prevPage = function () {
  const maxrow = 7;
  KiddoPaint.Sprite.page -= 1;
  if (KiddoPaint.Sprite.page < 0) {
    KiddoPaint.Sprite.page = maxrow;
  }
};

window.init_sprites_submenu = function init_sprites_submenu() {
  const sheet = KiddoPaint.Sprite.sheets[KiddoPaint.Sprite.sheetPage];
  const maxcols = 15;

  const row = KiddoPaint.Sprite.page;

  KiddoPaint.Submenu.sprites = [];

  for (let j = 0; j < maxcols; j++) {
    // Get the human-readable name for this stamp
    const stampName = KiddoPaint.Stamps.getStampName(sheet, row, j);

    const individualSprite = {
      name: stampName,
      spriteSheet: sheet,
      spriteRow: row,
      spriteCol: j,
      handler: function (e) {
        var img = new Image();
        img.src = sheet;
        img.crossOrigin = "anonymous";
        img.onload = function () {
          KiddoPaint.Tools.SpritePlacer.image =
            scaleImageDataCanvasAPIPixelated(
              extractSprite(img, 32, j, row, 0),
              2,
            );
          KiddoPaint.Tools.SpritePlacer.soundBefore = function () {
            KiddoPaint.Sounds.stamp();
          };
          KiddoPaint.Tools.SpritePlacer.soundDuring = function () {};
          KiddoPaint.Current.tool = KiddoPaint.Tools.SpritePlacer;
        };
      },
    };

    KiddoPaint.Submenu.sprites.push(individualSprite);
  }

  // Row navigation (within current stamp pack)
  KiddoPaint.Submenu.sprites.push({
    name: "prev row",
    emoji: "⏪",
    handler: function (e) {
      KiddoPaint.Sprite.prevPage();
      init_sprites_submenu();
      show_generic_submenu("sprites");
    },
  });

  KiddoPaint.Submenu.sprites.push({
    name: "next row",
    emoji: "⏩",
    handler: function (e) {
      KiddoPaint.Sprite.nextPage();
      init_sprites_submenu();
      show_generic_submenu("sprites");
    },
  });

  // Stamp pack navigation (between sprite sheets)
  KiddoPaint.Submenu.sprites.push({
    name: "prev stamp pack",
    emoji: "⏮️",
    handler: function (e) {
      KiddoPaint.Sprite.prevSprite();
      init_sprites_submenu();
      show_generic_submenu("sprites");
    },
  });

  KiddoPaint.Submenu.sprites.push({
    name: "next stamp pack",
    emoji: "⏭️",
    handler: function (e) {
      KiddoPaint.Sprite.nextSprite();
      init_sprites_submenu();
      show_generic_submenu("sprites");
    },
  });
};
