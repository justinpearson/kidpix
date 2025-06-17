import { describe, it, expect } from "vitest";
import {
  distanceBetween,
  angleBetween,
  angleBetweenRad,
  clamp,
  lerp,
  invlerp,
  remap,
  rgbToHsl,
  hslToRgb,
  ziggurat,
  randn_bm,
  guil,
  colorsEqual,
  colorNearWhite,
  getCubicBezierXYatPercent,
  CubicN,
  getRandomFloat,
  getRandomInt,
  getRandomLetter,
  srng,
} from "./utils.js";

describe("distanceBetween()", () => {
  it("handles a classic 3-4-5 triangle", () => {
    const p1 = { _x: 0, _y: 0 };
    const p2 = { _x: 3, _y: 4 };

    expect(distanceBetween(p1, p2)).toBe(5);
  });

  it("works with arbitrary points", () => {
    const p1 = { _x: -2, _y: 7 };
    const p2 = { _x: 1, _y: 3 };

    // √((1 – -2)² + (3 – 7)²) = √(9 + 16) = 5
    expect(distanceBetween(p1, p2)).toBe(5);
  });

  it("returns 0 for the same point", () => {
    const point = { _x: 5, _y: 10 };

    expect(distanceBetween(point, point)).toBe(0);
  });

  it("handles negative coordinates", () => {
    const p1 = { _x: -3, _y: -4 };
    const p2 = { _x: 0, _y: 0 };

    expect(distanceBetween(p1, p2)).toBe(5);
  });
});

describe("angleBetween()", () => {
  it("calculates angle correctly for horizontal line", () => {
    const p1 = { _x: 0, _y: 0 };
    const p2 = { _x: 1, _y: 0 };

    expect(angleBetween(p1, p2)).toBe(0);
  });

  it("calculates angle correctly for vertical line", () => {
    const p1 = { _x: 0, _y: 0 };
    const p2 = { _x: 0, _y: 1 };

    // Function uses 0.001 instead of true zero, so less precision
    expect(angleBetween(p1, p2)).toBeCloseTo(Math.PI / 2, 2);
  });
});

describe("clamp()", () => {
  it("clamps value within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("handles edge cases", () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe("lerp()", () => {
  it("interpolates between two values", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(0, 10, 1)).toBe(10);
    expect(lerp(10, 20, 0.3)).toBeCloseTo(13, 5);
  });
});

describe("invlerp()", () => {
  it("inverse interpolates correctly", () => {
    expect(invlerp(0, 10, 5)).toBe(0.5);
    expect(invlerp(0, 10, 0)).toBe(0);
    expect(invlerp(0, 10, 10)).toBe(1);
    expect(invlerp(10, 20, 13)).toBeCloseTo(0.3, 5);
  });
});

describe("remap()", () => {
  it("remaps values from one range to another", () => {
    expect(remap(0, 10, 0, 100, 5)).toBe(50);
    expect(remap(0, 10, 20, 30, 0)).toBe(20);
    expect(remap(0, 10, 20, 30, 10)).toBe(30);
    expect(remap(0, 100, 0, 1, 50)).toBe(0.5);
  });
});

describe("angleBetweenRad()", () => {
  it("calculates angle in radians using atan2", () => {
    const p1 = { _x: 0, _y: 0 };
    const p2 = { _x: 1, _y: 1 };

    expect(angleBetweenRad(p1, p2)).toBeCloseTo(Math.PI / 4, 5);
  });
});

describe("rgbToHsl() and hslToRgb()", () => {
  it("converts RGB to HSL correctly", () => {
    const hsl = rgbToHsl(255, 0, 0); // Pure red
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(1);
    expect(hsl.l).toBe(0.5);
  });

  it("converts HSL to RGB correctly", () => {
    const rgb = hslToRgb(0, 1, 0.5); // Pure red
    expect(rgb.r).toBe(255);
    expect(rgb.g).toBe(0);
    expect(rgb.b).toBe(0);
  });

  it("handles round-trip conversion", () => {
    const original = { r: 128, g: 64, b: 192 };
    const hsl = rgbToHsl(original.r, original.g, original.b);
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);

    expect(rgb.r).toBeCloseTo(original.r, 0);
    expect(rgb.g).toBeCloseTo(original.g, 0);
    expect(rgb.b).toBeCloseTo(original.b, 0);
  });
});

describe("ziggurat()", () => {
  it("returns values in expected range", () => {
    for (let i = 0; i < 100; i++) {
      const value = ziggurat();
      expect(value).toBeGreaterThanOrEqual(-3);
      expect(value).toBeLessThanOrEqual(3);
    }
  });
});

describe("randn_bm()", () => {
  it("generates values within specified range", () => {
    for (let i = 0; i < 20; i++) {
      const value = randn_bm(0, 10, 1);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(10);
    }
  });
});

describe("guil()", () => {
  it("generates guilloché pattern coordinates", () => {
    const result = guil(10, 5, 1, 0, 2, 3, 1, 2);
    expect(result).toHaveProperty("x");
    expect(result).toHaveProperty("y");
    expect(typeof result.x).toBe("number");
    expect(typeof result.y).toBe("number");
  });
});

describe("colorsEqual()", () => {
  it("returns true for identical colors", () => {
    const color1 = { r: 255, g: 128, b: 0, a: 255 };
    const color2 = { r: 255, g: 128, b: 0, a: 255 };
    expect(colorsEqual(color1, color2)).toBe(true);
  });

  it("returns false for different colors", () => {
    const color1 = { r: 255, g: 128, b: 0, a: 255 };
    const color2 = { r: 255, g: 128, b: 1, a: 255 };
    expect(colorsEqual(color1, color2)).toBe(false);
  });
});

describe("colorNearWhite()", () => {
  it("returns true for near-white colors", () => {
    const color = { r: 240, g: 240, b: 240, a: 240 };
    expect(colorNearWhite(color)).toBe(true);
  });

  it("returns false for non-white colors", () => {
    const color = { r: 200, g: 200, b: 200, a: 240 };
    expect(colorNearWhite(color)).toBe(false);
  });
});

describe("getCubicBezierXYatPercent()", () => {
  it("calculates Bezier curve points", () => {
    const start = [0, 0];
    const control1 = [10, 10];
    const control2 = [20, 10];
    const end = [30, 0];

    const point = getCubicBezierXYatPercent(
      start,
      control1,
      control2,
      end,
      0.5,
    );
    expect(point).toHaveProperty("_x");
    expect(point).toHaveProperty("_y");
    expect(typeof point._x).toBe("number");
    expect(typeof point._y).toBe("number");
  });
});

describe("CubicN()", () => {
  it("calculates cubic Bezier component", () => {
    const result = CubicN(0.5, 0, 10, 20, 30);
    expect(typeof result).toBe("number");
  });
});

describe("getRandomFloat()", () => {
  it("generates random float within range", () => {
    for (let i = 0; i < 50; i++) {
      const value = getRandomFloat(5, 10);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThan(10);
    }
  });
});

describe("getRandomInt()", () => {
  it("generates random integer within range", () => {
    for (let i = 0; i < 50; i++) {
      const value = getRandomInt(5, 10);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThan(10);
      expect(Number.isInteger(value)).toBe(true);
    }
  });
});

describe("getRandomLetter()", () => {
  it("generates valid alphanumeric characters", () => {
    const validChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 50; i++) {
      const letter = getRandomLetter();
      expect(validChars).toContain(letter);
      expect(letter.length).toBe(1);
    }
  });
});

describe("srng()", () => {
  it("creates seeded random number generator", () => {
    const rng1 = srng(123);
    const rng2 = srng(123);

    // Same seed should produce same sequence
    expect(rng1.next()).toBe(rng2.next());
    expect(rng1.next()).toBe(rng2.next());
  });

  it("generates values between 0 and 1", () => {
    const rng = srng(456);

    for (let i = 0; i < 50; i++) {
      const value = rng.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });
});
