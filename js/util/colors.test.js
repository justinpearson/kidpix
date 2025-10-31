import { describe, it, expect, beforeEach } from "vitest";

// Mock the KiddoPaint global namespace
global.KiddoPaint = {
  Colors: {
    Palette: {},
    Current: {},
    All: [],
  },
};

// Import the colors module (this will populate KiddoPaint.Colors)
await import("./colors.js");

describe("KiddoPaint.Colors", () => {
  describe("Palette structure", () => {
    it("all palettes in Colors.All have name and colors properties", () => {
      KiddoPaint.Colors.All.forEach((palette) => {
        expect(palette).toHaveProperty("name");
        expect(palette).toHaveProperty("colors");
        expect(typeof palette.name).toBe("string");
        expect(Array.isArray(palette.colors)).toBe(true);
        expect(palette.name.length).toBeGreaterThan(0);
      });
    });

    it("all palettes have 32 colors", () => {
      KiddoPaint.Colors.All.forEach((palette) => {
        expect(palette.colors).toHaveLength(32);
      });
    });

    it("all palette names are unique", () => {
      const names = KiddoPaint.Colors.All.map((p) => p.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });

  describe("currentPalette()", () => {
    beforeEach(() => {
      // Reset to default palette
      KiddoPaint.Colors.Current.PaletteNumber = 0;
    });

    it("returns the colors array of the current palette", () => {
      const palette = KiddoPaint.Colors.currentPalette();
      expect(Array.isArray(palette)).toBe(true);
      expect(palette).toBe(KiddoPaint.Colors.All[0].colors);
    });

    it("returns different palette when palette number changes", () => {
      const palette1 = KiddoPaint.Colors.currentPalette();
      KiddoPaint.Colors.Current.PaletteNumber = 1;
      const palette2 = KiddoPaint.Colors.currentPalette();

      expect(palette1).not.toBe(palette2);
      expect(palette2).toBe(KiddoPaint.Colors.All[1].colors);
    });
  });

  describe("currentPaletteName()", () => {
    beforeEach(() => {
      // Reset to default palette
      KiddoPaint.Colors.Current.PaletteNumber = 0;
    });

    it("returns the name of the current palette", () => {
      const name = KiddoPaint.Colors.currentPaletteName();
      expect(typeof name).toBe("string");
      expect(name).toBe(KiddoPaint.Colors.All[0].name);
    });

    it("returns correct name when palette changes", () => {
      KiddoPaint.Colors.Current.PaletteNumber = 0;
      const name1 = KiddoPaint.Colors.currentPaletteName();

      KiddoPaint.Colors.Current.PaletteNumber = 1;
      const name2 = KiddoPaint.Colors.currentPaletteName();

      expect(name1).toBe(KiddoPaint.Colors.All[0].name);
      expect(name2).toBe(KiddoPaint.Colors.All[1].name);
      expect(name1).not.toBe(name2);
    });

    it("returns Basic for the default palette", () => {
      expect(KiddoPaint.Colors.currentPaletteName()).toBe("Basic");
    });
  });

  describe("nextPalette()", () => {
    beforeEach(() => {
      KiddoPaint.Colors.Current.PaletteNumber = 0;
    });

    it("increments the palette number", () => {
      const before = KiddoPaint.Colors.Current.PaletteNumber;
      KiddoPaint.Colors.nextPalette();
      expect(KiddoPaint.Colors.Current.PaletteNumber).toBe(before + 1);
    });

    it("wraps around to 0 when reaching the end", () => {
      KiddoPaint.Colors.Current.PaletteNumber =
        KiddoPaint.Colors.All.length - 1;
      KiddoPaint.Colors.nextPalette();
      expect(KiddoPaint.Colors.Current.PaletteNumber).toBe(0);
    });
  });

  describe("prevPalette()", () => {
    beforeEach(() => {
      KiddoPaint.Colors.Current.PaletteNumber = 1;
    });

    it("decrements the palette number", () => {
      const before = KiddoPaint.Colors.Current.PaletteNumber;
      KiddoPaint.Colors.prevPalette();
      expect(KiddoPaint.Colors.Current.PaletteNumber).toBe(before - 1);
    });

    it("wraps around to last palette when going below 0", () => {
      KiddoPaint.Colors.Current.PaletteNumber = 0;
      KiddoPaint.Colors.prevPalette();
      expect(KiddoPaint.Colors.Current.PaletteNumber).toBe(
        KiddoPaint.Colors.All.length - 1,
      );
    });
  });

  describe("Known palettes", () => {
    it("includes Basic palette", () => {
      const basic = KiddoPaint.Colors.All.find((p) => p.name === "Basic");
      expect(basic).toBeDefined();
      expect(basic.colors).toHaveLength(32);
    });

    it("includes Endesga palette", () => {
      const endesga = KiddoPaint.Colors.All.find((p) => p.name === "Endesga");
      expect(endesga).toBeDefined();
      expect(endesga.colors).toHaveLength(32);
    });

    it("includes DawnBringer palette", () => {
      const dawnbringer = KiddoPaint.Colors.All.find(
        (p) => p.name === "DawnBringer",
      );
      expect(dawnbringer).toBeDefined();
      expect(dawnbringer.colors).toHaveLength(32);
    });

    it("includes Pastels palette", () => {
      const pastels = KiddoPaint.Colors.All.find((p) => p.name === "Pastels");
      expect(pastels).toBeDefined();
      expect(pastels.colors).toHaveLength(32);
    });
  });
});
