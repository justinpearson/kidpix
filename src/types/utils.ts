/**
 * Utility type definitions for helper functions and common patterns.
 */

// ============================================================================
// Color Utility Types
// ============================================================================

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface RGBAColor extends RGBColor {
  a: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface HSVColor {
  h: number;
  s: number;
  v: number;
}

export type ColorString = string; // e.g., "rgb(255, 0, 0)" or "#ff0000"
export type ColorTuple = [number, number, number] | [number, number, number, number];

// ============================================================================
// Math Utility Types
// ============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rectangle extends Point, Size {}

export interface Circle extends Point {
  radius: number;
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// ============================================================================
// Canvas Utility Types
// ============================================================================

export interface CanvasImageData {
  data: string; // Base64 encoded image data
  width: number;
  height: number;
  timestamp?: number;
}

export interface DrawingContext {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
}

export interface CanvasState {
  imageData: ImageData;
  timestamp: number;
}

// ============================================================================
// Filter Utility Types
// ============================================================================

export type FilterFunction = (
  imageData: ImageData,
  ...args: any[]
) => ImageData;

export interface FilterOptions {
  intensity?: number;
  threshold?: number;
  [key: string]: any;
}

// ============================================================================
// Event Utility Types
// ============================================================================

export interface MousePosition {
  x: number;
  y: number;
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
}

export interface ModifierKeys {
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  meta: boolean;
}

// ============================================================================
// Storage Utility Types
// ============================================================================

export interface StorageQuota {
  usage: number;
  quota: number;
  available: number;
}

export interface LocalStorageItem<T = any> {
  key: string;
  value: T;
  timestamp?: number;
  expiresAt?: number;
}

// ============================================================================
// Generic Utility Types
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// ============================================================================
// Function Utility Types
// ============================================================================

export type Callback = () => void;
export type EventCallback<T = any> = (event: T) => void;
export type AsyncCallback = () => Promise<void>;

export type Predicate<T> = (value: T) => boolean;
export type Mapper<T, U> = (value: T) => U;
export type Reducer<T, U> = (accumulator: U, current: T) => U;

// ============================================================================
// Array Utility Types
// ============================================================================

export type NonEmptyArray<T> = [T, ...T[]];
export type ReadonlyNonEmptyArray<T> = readonly [T, ...T[]];

export type ArrayElement<T extends readonly any[]> = T extends readonly (infer E)[] ? E : never;

// ============================================================================
// Object Utility Types
// ============================================================================

export type ValueOf<T> = T[keyof T];
export type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];

export type PickByType<T, U> = {
  [K in KeysOfType<T, U>]: T[K];
};

// ============================================================================
// Error Handling Types
// ============================================================================

export interface ErrorResult {
  success: false;
  error: Error;
  message: string;
}

export interface SuccessResult<T> {
  success: true;
  data: T;
}

export type Result<T> = SuccessResult<T> | ErrorResult;

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
