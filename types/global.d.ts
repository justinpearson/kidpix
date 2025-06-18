// types/global.d.ts
declare global {
  interface Window {
    KiddoPaint: typeof KiddoPaint;
  }
}

declare namespace KiddoPaint {
  // Application state
  interface CurrentState {
    tool: Tool;
    color: string;
    size: number;
    scaling: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
  }

  // Tool interface - all tools must implement these methods
  interface Tool {
    mousedown?(event: MouseEvent): void;
    mousemove?(event: MouseEvent): void;
    mouseup?(event: MouseEvent): void;
    isDown?: boolean;
    lastX?: number;
    lastY?: number;
    size?: number;
    texture?(color: string): HTMLCanvasElement | string;
  }

  // Canvas layers
  interface CanvasLayers {
    main: HTMLCanvasElement;
    tmp: HTMLCanvasElement;
    preview: HTMLCanvasElement;
    anim: HTMLCanvasElement;
    bnim: HTMLCanvasElement;
  }

  // Submenu button configuration
  interface SubmenuButton {
    name: string;
    imgSrc: string;
    handler: () => void;
    selected?: boolean;
  }

  // Event interface with custom properties
  interface KiddoEvent extends MouseEvent {
    _x: number;
    _y: number;
  }
}

// Make KiddoPaint globally available
declare const KiddoPaint: {
  Tools: {
    Toolbox: Record<string, new () => Tool>;
  };
  Brushes: Record<string, (options?: unknown) => HTMLCanvasElement>;
  Textures: Record<string, (color: string) => HTMLCanvasElement | string>;
  Builders: Record<string, (options?: unknown) => void>;
  Stamps: Record<string, (options?: unknown) => void>;
  Sounds: Record<string, () => void>;
  Current: KiddoPaint.CurrentState;
  Display: {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    layers?: KiddoPaint.CanvasLayers;
  };
  Colors: Record<string, unknown>;
  Cache: Record<string, unknown>;
  Alphabet: Record<string, unknown>;
  Sprite: Record<string, unknown>;
};

// Global canvas variables
declare let animCanvas: HTMLCanvasElement;
declare let animContext: CanvasRenderingContext2D;
declare let bnimCanvas: HTMLCanvasElement;
declare let bnimContext: CanvasRenderingContext2D;
declare let tmpCanvas: HTMLCanvasElement;
declare let tmpContext: CanvasRenderingContext2D;
declare let previewCanvas: HTMLCanvasElement;
declare let previewContext: CanvasRenderingContext2D;

// Global initialization function
declare function init_kiddo_paint(): void;

export {}; // Make this a module
