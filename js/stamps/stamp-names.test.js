import { describe, it, expect, beforeEach } from "vitest";

// Mock the KiddoPaint global namespace
global.KiddoPaint = {
  Stamps: {},
  Sprite: {
    sheets: [
      "src/assets/img/kidpix-spritesheet-0.png",
      "src/assets/img/kidpix-spritesheet-0b.png",
      "src/assets/img/kidpix-spritesheet-1.png",
      "src/assets/img/kidpix-spritesheet-2.png",
      "src/assets/img/kidpix-spritesheet-3.png",
      "src/assets/img/kidpix-spritesheet-4.png",
      "src/assets/img/kidpix-spritesheet-5.png",
      "src/assets/img/kidpix-spritesheet-6.png",
      "src/assets/img/kidpix-spritesheet-7.png",
      "src/assets/img/kidpix-spritesheet-8.png",
    ],
  },
  Submenu: {},
};

// Import the stamp names data
await import("./stamp-names-data.js");

describe("KiddoPaint.Stamps.namesData", () => {
  describe("Data structure", () => {
    it("is an array", () => {
      expect(Array.isArray(KiddoPaint.Stamps.namesData)).toBe(true);
    });

    it("has exactly 10 spritesheets", () => {
      expect(KiddoPaint.Stamps.namesData.length).toBe(10);
    });

    it("each spritesheet has filename and stamp_data", () => {
      KiddoPaint.Stamps.namesData.forEach((sheet) => {
        expect(sheet).toHaveProperty("filename");
        expect(sheet).toHaveProperty("stamp_data");
        expect(typeof sheet.filename).toBe("string");
        expect(Array.isArray(sheet.stamp_data)).toBe(true);
      });
    });

    it("each stamp has required properties", () => {
      KiddoPaint.Stamps.namesData.forEach((sheet) => {
        sheet.stamp_data.forEach((stamp) => {
          expect(stamp).toHaveProperty("index");
          expect(stamp).toHaveProperty("row");
          expect(stamp).toHaveProperty("col");
          expect(stamp).toHaveProperty("name");
          expect(typeof stamp.index).toBe("number");
          expect(typeof stamp.row).toBe("number");
          expect(typeof stamp.col).toBe("number");
          expect(typeof stamp.name).toBe("string");
        });
      });
    });

    it("each sheet has exactly 112 stamps (14 cols x 8 rows)", () => {
      KiddoPaint.Stamps.namesData.forEach((sheet) => {
        expect(sheet.stamp_data.length).toBe(112);
      });
    });

    it("indices go from 1 to 112 for each sheet", () => {
      KiddoPaint.Stamps.namesData.forEach((sheet) => {
        const indices = sheet.stamp_data.map((s) => s.index).sort((a, b) => a - b);
        expect(indices[0]).toBe(1);
        expect(indices[indices.length - 1]).toBe(112);
        // Check all indices are present
        for (let i = 1; i <= 112; i++) {
          expect(indices).toContain(i);
        }
      });
    });

    it("rows and cols increment in row-major order", () => {
      KiddoPaint.Stamps.namesData.forEach((sheet) => {
        sheet.stamp_data.forEach((stamp) => {
          // Row-major order: index = (row - 1) * 14 + col
          // (since rows and cols are 1-indexed)
          const expectedIndex = (stamp.row - 1) * 14 + stamp.col;
          expect(stamp.index).toBe(expectedIndex);
        });
      });
    });

    it("stamp names have no leading or trailing whitespace", () => {
      KiddoPaint.Stamps.namesData.forEach((sheet) => {
        sheet.stamp_data.forEach((stamp) => {
          expect(stamp.name).toBe(stamp.name.trim());
        });
      });
    });

    it("stamp names are not empty", () => {
      KiddoPaint.Stamps.namesData.forEach((sheet) => {
        sheet.stamp_data.forEach((stamp) => {
          expect(stamp.name.length).toBeGreaterThan(0);
        });
      });
    });

    it("stamp names are ASCII-only", () => {
      KiddoPaint.Stamps.namesData.forEach((sheet) => {
        sheet.stamp_data.forEach((stamp) => {
          // ASCII characters are in range 0-127
          const isAscii = /^[\x00-\x7F]*$/.test(stamp.name);
          expect(isAscii).toBe(true);
        });
      });
    });
  });

  describe("Known stamps", () => {
    it("includes palm tree stamp", () => {
      const palmTree = KiddoPaint.Stamps.namesData[0]?.stamp_data.find(
        (s) => s.name === "palm tree",
      );
      expect(palmTree).toBeDefined();
      expect(palmTree.row).toBe(1);
      expect(palmTree.col).toBe(1);
    });

    it("includes strawberry stamp", () => {
      const strawberry = KiddoPaint.Stamps.namesData[0]?.stamp_data.find(
        (s) => s.name === "strawberry",
      );
      expect(strawberry).toBeDefined();
    });
  });
});

describe("getStampName()", () => {
  // This function will be implemented in sprites.js
  beforeEach(async () => {
    // Import sprites.js to get getStampName function
    await import("../submenus/sprites.js");
  });

  it("returns correct name for first stamp (palm tree)", () => {
    const name = KiddoPaint.Stamps.getStampName(
      "img/stamp/kidpix-spritesheet-0.png",
      0, // row 0 (1 in JSON)
      0, // col 0 (1 in JSON)
    );
    expect(name).toBe("palm tree");
  });

  it("returns correct name for strawberry stamp", () => {
    const name = KiddoPaint.Stamps.getStampName(
      "img/stamp/kidpix-spritesheet-0.png",
      0, // row 0 (1 in JSON)
      3, // col 3 (4 in JSON)
    );
    expect(name).toBe("strawberry");
  });

  it("returns row/page indicator for column 14 (15th column)", () => {
    // Column 14 (0-indexed) = column 15 (1-indexed) = row/page indicator
    const name = KiddoPaint.Stamps.getStampName(
      "img/stamp/kidpix-spritesheet-0.png",
      0, // row 0
      14, // col 14 (last column)
    );
    expect(name).toBe("Row/Page Indicator");
  });

  it("handles different spritesheets correctly", () => {
    const name = KiddoPaint.Stamps.getStampName(
      "img/stamp/kidpix-spritesheet-1.png",
      0, // row 0
      0, // col 0
    );
    // Should find a stamp name from spritesheet-1
    expect(typeof name).toBe("string");
    expect(name.length).toBeGreaterThan(0);
  });

  it("returns fallback for out-of-bounds row", () => {
    const name = KiddoPaint.Stamps.getStampName(
      "img/stamp/kidpix-spritesheet-0.png",
      999, // invalid row
      0,
    );
    expect(name).toBe("Sprite");
  });

  it("returns fallback for out-of-bounds column", () => {
    const name = KiddoPaint.Stamps.getStampName(
      "img/stamp/kidpix-spritesheet-0.png",
      0,
      999, // invalid column
    );
    expect(name).toBe("Sprite");
  });

  it("handles missing stamps gracefully", () => {
    const name = KiddoPaint.Stamps.getStampName(
      "nonexistent-sheet.png",
      0,
      0,
    );
    expect(name).toBe("Sprite");
  });

  it("handles path variations correctly", () => {
    // The JSON has filenames like "kidpix-spritesheet-0.png"
    // The code uses paths like "img/stamp/kidpix-spritesheet-0.png"
    const name1 = KiddoPaint.Stamps.getStampName(
      "img/stamp/kidpix-spritesheet-0.png",
      0,
      0,
    );
    expect(name1).toBe("palm tree");
  });
});
