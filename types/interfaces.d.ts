// types/interfaces.d.ts

export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number; // Alpha channel (optional)
}

export interface BrushSettings {
  size: number;
  opacity: number;
  pattern?: string;
  texture?: string;
}

export interface SoundEffect {
  src: string;
  volume?: number;
  loop?: boolean;
}

export interface ToolConfig {
  name: string;
  icon: string;
  cursor?: string;
  submenu?: KiddoPaint.SubmenuButton[];
  sounds?: {
    start?: SoundEffect;
    during?: SoundEffect;
    end?: SoundEffect;
  };
}

export interface CanvasLayer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  name: string;
  visible: boolean;
  opacity: number;
}

export interface LayeredCanvas {
  layers: {
    main: CanvasLayer;
    tmp: CanvasLayer;
    preview: CanvasLayer;
    anim: CanvasLayer;
    bnim: CanvasLayer;
  };

  /**
   * Get layer by name
   */
  getLayer(name: keyof LayeredCanvas["layers"]): CanvasLayer;

  /**
   * Clear specific layer
   */
  clearLayer(name: keyof LayeredCanvas["layers"]): void;

  /**
   * Composite all layers to main canvas
   */
  composite(): void;
}
