// js/util/colors.d.ts

declare namespace KiddoPaint.Colors {
  interface RGB {
    r: number;
    g: number;
    b: number;
  }

  interface RGBA extends RGB {
    a: number;
  }

  interface HSL {
    h: number;
    s: number;
    l: number;
  }

  /**
   * Convert hex color string to RGB object
   */
  function hexToRgb(hex: string): RGB | null;

  /**
   * Convert RGB object to hex string
   */
  function rgbToHex(rgb: RGB): string;

  /**
   * Blend two colors with given ratio
   */
  function blendColors(color1: RGB, color2: RGB, ratio: number): RGB;

  /**
   * Get random color
   */
  function getRandomColor(): string;

  /**
   * Palette of available colors
   */
  const palette: string[];
}
