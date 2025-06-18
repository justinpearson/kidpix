// js/util/utils.d.ts

/**
 * Calculate distance between two events with custom coordinates
 */
declare function distanceBetween(
  ev1: KiddoPaint.KiddoEvent,
  ev2: KiddoPaint.KiddoEvent,
): number;

/**
 * Calculate angle between two events
 */
declare function angleBetween(
  ev1: KiddoPaint.KiddoEvent,
  ev2: KiddoPaint.KiddoEvent,
): number;

/**
 * Calculate angle between two events in radians
 */
declare function angleBetweenRad(
  ev1: KiddoPaint.KiddoEvent,
  ev2: KiddoPaint.KiddoEvent,
): number;

/**
 * Convert RGB to HSL color space
 */
declare function rgbToHsl(
  r: number,
  g: number,
  b: number,
): [number, number, number];

/**
 * Convert HSL to RGB color space
 */
declare function hslToRgb(
  h: number,
  s: number,
  l: number,
): [number, number, number];

/**
 * Get random integer between min and max (inclusive)
 */
declare function getRandomInt(min: number, max: number): number;

/**
 * Clamp value between min and max
 */
declare function clamp(value: number, min: number, max: number): number;
