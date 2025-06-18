# Phase 5: Advanced Features (Weeks 17-20)

## Table of Contents

1. [Overview](#overview)
2. [Implementation Steps](#implementation-steps)
3. [Background & Context](#background--context)
4. [Practical Examples](#practical-examples)
5. [Verification & Testing](#verification--testing)
6. [Troubleshooting](#troubleshooting)
7. [Next Steps](#next-steps)

## Overview

Phase 5 focuses on migrating the most complex KidPix features: wacky brushes, texture systems, sound integration, and special effects. This phase involves advanced canvas programming, audio APIs, and performance optimization techniques.

**Learning Focus**: Advanced canvas operations, Web Audio API, complex algorithms, performance optimization, and advanced React patterns.

**Duration**: 4 weeks  
**Difficulty**: Expert  
**Prerequisites**: Completed Phases 1-4, strong understanding of canvas programming and advanced JavaScript

## Implementation Steps

### Step 5.1: Design Brush Generator System

**Goal**: Create a flexible system for generating complex brush patterns.

**Create `src/brushes/BrushGenerator.ts`**:

```typescript
export interface BrushPoint {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  angle?: number;
}

export interface BrushStroke {
  points: BrushPoint[];
  pressure: number;
  velocity: number;
  direction: number;
}

export abstract class BrushGenerator {
  protected config: BrushConfig;
  protected canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;

  constructor(config: BrushConfig) {
    this.config = config;
    this.canvas = document.createElement("canvas");
    this.canvas.width = config.size || 50;
    this.canvas.height = config.size || 50;
    this.context = this.canvas.getContext("2d")!;
  }

  abstract generateBrush(stroke: BrushStroke): HTMLCanvasElement;
  abstract getPreview(): HTMLCanvasElement;

  // Utility methods for brush generation
  protected createNoise(
    width: number,
    height: number,
    scale: number = 1,
  ): ImageData {
    const imageData = this.context.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255 * scale;
      data[i] = noise; // Red
      data[i + 1] = noise; // Green
      data[i + 2] = noise; // Blue
      data[i + 3] = 255; // Alpha
    }

    return imageData;
  }

  protected createGradient(
    type: "radial" | "linear",
    colors: string[],
    positions?: number[],
  ): CanvasGradient {
    let gradient: CanvasGradient;

    if (type === "radial") {
      gradient = this.context.createRadialGradient(
        this.canvas.width / 2,
        this.canvas.height / 2,
        0,
        this.canvas.width / 2,
        this.canvas.height / 2,
        this.canvas.width / 2,
      );
    } else {
      gradient = this.context.createLinearGradient(
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
    }

    colors.forEach((color, index) => {
      const position = positions
        ? positions[index]
        : index / (colors.length - 1);
      gradient.addColorStop(position, color);
    });

    return gradient;
  }

  protected drawParticles(
    count: number,
    sizeRange: [number, number],
    opacityRange: [number, number],
    shape: "circle" | "square" = "circle",
  ): void {
    for (let i = 0; i < count; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
      const opacity =
        opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0]);

      this.context.globalAlpha = opacity;
      this.context.fillStyle = "#000000";

      if (shape === "circle") {
        this.context.beginPath();
        this.context.arc(x, y, size / 2, 0, Math.PI * 2);
        this.context.fill();
      } else {
        this.context.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }

    this.context.globalAlpha = 1; // Reset
  }
}

export interface BrushConfig {
  name: string;
  size?: number;
  color?: string;
  opacity?: number;
  pattern?: string;
  animated?: boolean;
  parameters?: Record<string, any>;
}
```

### Step 5.2: Implement Wacky Brushes

**Goal**: Convert the famous KidPix wacky brushes to React/TypeScript.

**Create `src/brushes/BubblesBrush.ts`**:

```typescript
import { BrushGenerator, BrushStroke, BrushConfig } from "./BrushGenerator";

export class BubblesBrush extends BrushGenerator {
  private bubbles: Array<{
    x: number;
    y: number;
    size: number;
    opacity: number;
    life: number;
    vx: number;
    vy: number;
  }> = [];

  constructor(config: BrushConfig) {
    super(config);
    this.initializeBubbles();
  }

  generateBrush(stroke: BrushStroke): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d")!;

    // Update and draw bubbles
    this.updateBubbles(stroke);
    this.drawBubbles(ctx, stroke);

    return canvas;
  }

  getPreview(): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = 50;
    canvas.height = 50;
    const ctx = canvas.getContext("2d")!;

    // Draw preview bubbles
    for (let i = 0; i < 5; i++) {
      const x = 10 + Math.random() * 30;
      const y = 10 + Math.random() * 30;
      const size = 3 + Math.random() * 8;

      this.drawBubble(ctx, x, y, size, 0.7);
    }

    return canvas;
  }

  private initializeBubbles(): void {
    for (let i = 0; i < 20; i++) {
      this.bubbles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 12,
        opacity: 0.3 + Math.random() * 0.7,
        life: Math.random() * 100,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
      });
    }
  }

  private updateBubbles(stroke: BrushStroke): void {
    this.bubbles.forEach((bubble) => {
      // Update position
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;

      // Add some physics
      bubble.vy += 0.1; // Gravity
      bubble.vx *= 0.99; // Air resistance

      // Update life
      bubble.life -= 1;

      // Fade out
      bubble.opacity *= 0.995;

      // Bounce off edges
      if (bubble.x <= 0 || bubble.x >= 100) bubble.vx *= -0.8;
      if (bubble.y <= 0 || bubble.y >= 100) bubble.vy *= -0.8;

      // Reset if dead
      if (bubble.life <= 0 || bubble.opacity < 0.1) {
        bubble.x = stroke.points[0]?.x || 50;
        bubble.y = stroke.points[0]?.y || 50;
        bubble.life = 50 + Math.random() * 50;
        bubble.opacity = 0.5 + Math.random() * 0.5;
        bubble.vx = (Math.random() - 0.5) * 6;
        bubble.vy = (Math.random() - 0.5) * 6;
      }
    });
  }

  private drawBubbles(
    ctx: CanvasRenderingContext2D,
    stroke: BrushStroke,
  ): void {
    this.bubbles.forEach((bubble) => {
      this.drawBubble(ctx, bubble.x, bubble.y, bubble.size, bubble.opacity);
    });
  }

  private drawBubble(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    opacity: number,
  ): void {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
    gradient.addColorStop(0.7, `rgba(173, 216, 230, ${opacity * 0.8})`);
    gradient.addColorStop(1, `rgba(0, 100, 200, ${opacity * 0.3})`);

    ctx.globalAlpha = opacity;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Add highlight
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
    ctx.beginPath();
    ctx.arc(x - size * 0.2, y - size * 0.2, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }
}
```

**Create `src/brushes/SplatterBrush.ts`**:

```typescript
import { BrushGenerator, BrushStroke, BrushConfig } from "./BrushGenerator";

export class SplatterBrush extends BrushGenerator {
  private splats: Array<{
    x: number;
    y: number;
    size: number;
    rotation: number;
    shape: number; // 0-1 for shape variation
  }> = [];

  generateBrush(stroke: BrushStroke): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = stroke.points[0]?.size * 4 || 80;
    canvas.height = canvas.width;
    const ctx = canvas.getContext("2d")!;

    // Generate random splats around the brush center
    const splatCount = 5 + Math.random() * 15;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxDistance = canvas.width * 0.4;

    for (let i = 0; i < splatCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * maxDistance;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const size = 2 + Math.random() * 12;
      const rotation = Math.random() * Math.PI * 2;
      const shape = Math.random();

      this.drawSplat(
        ctx,
        x,
        y,
        size,
        rotation,
        shape,
        stroke.points[0]?.color || "#000000",
      );
    }

    return canvas;
  }

  getPreview(): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = 50;
    canvas.height = 50;
    const ctx = canvas.getContext("2d")!;

    // Draw preview splats
    for (let i = 0; i < 8; i++) {
      const x = 5 + Math.random() * 40;
      const y = 5 + Math.random() * 40;
      const size = 2 + Math.random() * 6;
      const rotation = Math.random() * Math.PI * 2;
      const shape = Math.random();

      this.drawSplat(ctx, x, y, size, rotation, shape, "#000000");
    }

    return canvas;
  }

  private drawSplat(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number,
    shape: number,
    color: string,
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.6 + Math.random() * 0.4;

    if (shape < 0.3) {
      // Circular splat
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape < 0.6) {
      // Star-like splat
      this.drawStar(
        ctx,
        0,
        0,
        5 + Math.floor(Math.random() * 3),
        size / 2,
        size / 4,
      );
    } else {
      // Irregular blob
      this.drawBlob(ctx, 0, 0, size / 2, 6 + Math.floor(Math.random() * 4));
    }

    ctx.restore();
  }

  private drawStar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    points: number,
    outerRadius: number,
    innerRadius: number,
  ): void {
    ctx.beginPath();

    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.closePath();
    ctx.fill();
  }

  private drawBlob(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    segments: number,
  ): void {
    ctx.beginPath();

    for (let i = 0; i <= segments; i++) {
      const angle = (i * Math.PI * 2) / segments;
      const variation = 0.7 + Math.random() * 0.6; // Random radius variation
      const px = x + Math.cos(angle) * radius * variation;
      const py = y + Math.sin(angle) * radius * variation;

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.closePath();
    ctx.fill();
  }
}
```

### Step 5.3: Implement Sound System

**Goal**: Create a modern Web Audio API-based sound system.

**Create `src/audio/SoundManager.ts`**:

```typescript
interface SoundConfig {
  src: string;
  volume?: number;
  loop?: boolean;
  preload?: boolean;
  category?: "tool" | "ui" | "ambient";
}

interface PlayingSoundInstance {
  id: string;
  source: AudioBufferSourceNode;
  gainNode: GainNode;
  startTime: number;
  duration: number;
}

export class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private audioBuffers = new Map<string, AudioBuffer>();
  private soundConfigs = new Map<string, SoundConfig>();
  private playingSounds = new Map<string, PlayingSoundInstance>();
  private masterGainNode: GainNode | null = null;
  private categoryGainNodes = new Map<string, GainNode>();
  private isInitialized = false;

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Create master gain node
      this.masterGainNode = this.audioContext.createGain();
      this.masterGainNode.connect(this.audioContext.destination);

      // Create category gain nodes
      const categories = ["tool", "ui", "ambient"];
      categories.forEach((category) => {
        const gainNode = this.audioContext!.createGain();
        gainNode.connect(this.masterGainNode!);
        this.categoryGainNodes.set(category, gainNode);
      });

      this.isInitialized = true;
      console.log("SoundManager initialized");
    } catch (error) {
      console.error("Failed to initialize SoundManager:", error);
    }
  }

  async loadSound(id: string, config: SoundConfig): Promise<void> {
    if (!this.audioContext) {
      await this.initialize();
    }

    this.soundConfigs.set(id, config);

    if (config.preload !== false) {
      try {
        const response = await fetch(config.src);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer =
          await this.audioContext!.decodeAudioData(arrayBuffer);
        this.audioBuffers.set(id, audioBuffer);
      } catch (error) {
        console.error(`Failed to load sound ${id}:`, error);
      }
    }
  }

  async playSound(
    id: string,
    options?: {
      volume?: number;
      rate?: number;
      delay?: number;
      loop?: boolean;
    },
  ): Promise<string> {
    if (!this.audioContext || !this.isInitialized) {
      console.warn("SoundManager not initialized");
      return "";
    }

    // Resume audio context if suspended (required by some browsers)
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    let audioBuffer = this.audioBuffers.get(id);

    // Load sound if not already loaded
    if (!audioBuffer) {
      const config = this.soundConfigs.get(id);
      if (!config) {
        console.error(`Sound config not found for ${id}`);
        return "";
      }

      try {
        const response = await fetch(config.src);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.audioBuffers.set(id, audioBuffer);
      } catch (error) {
        console.error(`Failed to load sound ${id}:`, error);
        return "";
      }
    }

    // Create audio nodes
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = audioBuffer;
    source.connect(gainNode);

    // Connect to appropriate category gain node
    const config = this.soundConfigs.get(id)!;
    const categoryGain = this.categoryGainNodes.get(config.category || "tool");
    if (categoryGain) {
      gainNode.connect(categoryGain);
    } else {
      gainNode.connect(this.masterGainNode!);
    }

    // Set parameters
    const volume = (options?.volume ?? config.volume ?? 1) * 0.5; // Default to 50% volume
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);

    if (options?.rate) {
      source.playbackRate.setValueAtTime(
        options.rate,
        this.audioContext.currentTime,
      );
    }

    source.loop = options?.loop ?? config.loop ?? false;

    // Generate unique instance ID
    const instanceId = `${id}_${Date.now()}_${Math.random()}`;

    // Store playing sound instance
    const instance: PlayingSoundInstance = {
      id: instanceId,
      source,
      gainNode,
      startTime: this.audioContext.currentTime + (options?.delay || 0),
      duration: audioBuffer.duration,
    };

    this.playingSounds.set(instanceId, instance);

    // Clean up when sound ends
    source.onended = () => {
      this.playingSounds.delete(instanceId);
    };

    // Start playing
    if (options?.delay) {
      source.start(this.audioContext.currentTime + options.delay);
    } else {
      source.start();
    }

    return instanceId;
  }

  stopSound(instanceId: string): void {
    const instance = this.playingSounds.get(instanceId);
    if (instance) {
      try {
        instance.source.stop();
      } catch (error) {
        // Sound might already be stopped
      }
      this.playingSounds.delete(instanceId);
    }
  }

  stopAllSounds(): void {
    this.playingSounds.forEach((instance, id) => {
      this.stopSound(id);
    });
  }

  setMasterVolume(volume: number): void {
    if (this.masterGainNode) {
      this.masterGainNode.gain.setValueAtTime(
        Math.max(0, Math.min(1, volume)),
        this.audioContext!.currentTime,
      );
    }
  }

  setCategoryVolume(category: string, volume: number): void {
    const gainNode = this.categoryGainNodes.get(category);
    if (gainNode) {
      gainNode.gain.setValueAtTime(
        Math.max(0, Math.min(1, volume)),
        this.audioContext!.currentTime,
      );
    }
  }

  // Fade in/out effects
  fadeIn(instanceId: string, duration: number): void {
    const instance = this.playingSounds.get(instanceId);
    if (instance && this.audioContext) {
      const gainNode = instance.gainNode;
      const currentTime = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(1, currentTime + duration);
    }
  }

  fadeOut(instanceId: string, duration: number): void {
    const instance = this.playingSounds.get(instanceId);
    if (instance && this.audioContext) {
      const gainNode = instance.gainNode;
      const currentTime = this.audioContext.currentTime;
      gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);

      // Stop the sound after fade out
      setTimeout(() => {
        this.stopSound(instanceId);
      }, duration * 1000);
    }
  }
}
```

**Create `src/hooks/useSound.ts`**:

```typescript
import { useEffect, useRef, useCallback } from "react";
import { SoundManager } from "../audio/SoundManager";

interface UseSoundOptions {
  volume?: number;
  preload?: boolean;
  category?: "tool" | "ui" | "ambient";
}

export function useSound(soundPath: string, options: UseSoundOptions = {}) {
  const soundManager = useRef(SoundManager.getInstance());
  const soundIdRef = useRef<string>("");
  const playingInstanceRef = useRef<string>("");

  useEffect(() => {
    const soundId = `sound_${Date.now()}_${Math.random()}`;
    soundIdRef.current = soundId;

    soundManager.current.loadSound(soundId, {
      src: soundPath,
      volume: options.volume,
      preload: options.preload,
      category: options.category,
    });

    return () => {
      // Cleanup: stop any playing instances
      if (playingInstanceRef.current) {
        soundManager.current.stopSound(playingInstanceRef.current);
      }
    };
  }, [soundPath, options.volume, options.preload, options.category]);

  const play = useCallback(
    async (playOptions?: {
      volume?: number;
      rate?: number;
      delay?: number;
      loop?: boolean;
    }) => {
      if (soundIdRef.current) {
        const instanceId = await soundManager.current.playSound(
          soundIdRef.current,
          playOptions,
        );
        playingInstanceRef.current = instanceId;
        return instanceId;
      }
      return "";
    },
    [],
  );

  const stop = useCallback(() => {
    if (playingInstanceRef.current) {
      soundManager.current.stopSound(playingInstanceRef.current);
      playingInstanceRef.current = "";
    }
  }, []);

  const fadeIn = useCallback((duration: number) => {
    if (playingInstanceRef.current) {
      soundManager.current.fadeIn(playingInstanceRef.current, duration);
    }
  }, []);

  const fadeOut = useCallback((duration: number) => {
    if (playingInstanceRef.current) {
      soundManager.current.fadeOut(playingInstanceRef.current, duration);
    }
  }, []);

  return { play, stop, fadeIn, fadeOut };
}
```

### Step 5.4: Implement Texture System

**Goal**: Create a system for generating and applying textures to drawing operations.

**Create `src/textures/TextureGenerator.ts`**:

```typescript
export interface TextureConfig {
  name: string;
  size: number;
  parameters: Record<string, any>;
  seamless?: boolean;
  animated?: boolean;
}

export abstract class TextureGenerator {
  protected config: TextureConfig;
  protected canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;

  constructor(config: TextureConfig) {
    this.config = config;
    this.canvas = document.createElement("canvas");
    this.canvas.width = config.size;
    this.canvas.height = config.size;
    this.context = this.canvas.getContext("2d")!;
  }

  abstract generateTexture(): HTMLCanvasElement;
  abstract getPreview(): HTMLCanvasElement;

  // Utility methods for texture generation
  protected createPerlinNoise(
    width: number,
    height: number,
    scale: number = 0.1,
  ): ImageData {
    const imageData = this.context.createImageData(width, height);
    const data = imageData.data;

    // Simple Perlin noise implementation
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const noise = this.noise(x * scale, y * scale) * 255;
        const index = (y * width + x) * 4;

        data[index] = noise; // Red
        data[index + 1] = noise; // Green
        data[index + 2] = noise; // Blue
        data[index + 3] = 255; // Alpha
      }
    }

    return imageData;
  }

  protected noise(x: number, y: number): number {
    // Simple pseudo-random noise function
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }

  protected makeSeamless(imageData: ImageData): ImageData {
    const { width, height, data } = imageData;
    const newImageData = new ImageData(width, height);
    const newData = newImageData.data;

    // Copy original data
    for (let i = 0; i < data.length; i++) {
      newData[i] = data[i];
    }

    // Blend edges to make seamless
    const blendDistance = Math.min(width, height) * 0.1;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;

        // Calculate distance from edges
        const distFromLeft = x;
        const distFromRight = width - x - 1;
        const distFromTop = y;
        const distFromBottom = height - y - 1;

        const minDist = Math.min(
          distFromLeft,
          distFromRight,
          distFromTop,
          distFromBottom,
        );

        if (minDist < blendDistance) {
          const blendFactor = minDist / blendDistance;

          // Blend with opposite edge
          let oppositeX = x;
          let oppositeY = y;

          if (distFromLeft < blendDistance) oppositeX = width - x - 1;
          if (distFromRight < blendDistance) oppositeX = width - x - 1;
          if (distFromTop < blendDistance) oppositeY = height - y - 1;
          if (distFromBottom < blendDistance) oppositeY = height - y - 1;

          const oppositeIndex = (oppositeY * width + oppositeX) * 4;

          for (let c = 0; c < 3; c++) {
            newData[index + c] =
              data[index + c] * blendFactor +
              data[oppositeIndex + c] * (1 - blendFactor);
          }
        }
      }
    }

    return newImageData;
  }

  protected applyColorTransform(
    imageData: ImageData,
    transform: (
      r: number,
      g: number,
      b: number,
      a: number,
    ) => [number, number, number, number],
  ): ImageData {
    const { data } = imageData;

    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b, a] = transform(
        data[i],
        data[i + 1],
        data[i + 2],
        data[i + 3],
      );
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = a;
    }

    return imageData;
  }
}
```

**Create `src/textures/NoiseTexture.ts`**:

```typescript
import { TextureGenerator, TextureConfig } from "./TextureGenerator";

export class NoiseTexture extends TextureGenerator {
  generateTexture(): HTMLCanvasElement {
    const { size, parameters } = this.config;
    const { scale = 0.1, contrast = 1, octaves = 4 } = parameters;

    // Generate multi-octave noise
    const imageData = this.context.createImageData(size, size);
    const data = imageData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let noise = 0;
        let amplitude = 1;
        let frequency = scale;
        let maxValue = 0;

        // Generate multiple octaves
        for (let i = 0; i < octaves; i++) {
          noise += this.noise(x * frequency, y * frequency) * amplitude;
          maxValue += amplitude;
          amplitude *= 0.5;
          frequency *= 2;
        }

        // Normalize and apply contrast
        noise = (noise / maxValue) * contrast;
        noise = Math.max(0, Math.min(1, noise));

        const value = Math.floor(noise * 255);
        const index = (y * size + x) * 4;

        data[index] = value; // Red
        data[index + 1] = value; // Green
        data[index + 2] = value; // Blue
        data[index + 3] = 255; // Alpha
      }
    }

    this.context.putImageData(imageData, 0, 0);

    if (this.config.seamless) {
      const seamlessData = this.makeSeamless(imageData);
      this.context.putImageData(seamlessData, 0, 0);
    }

    return this.canvas;
  }

  getPreview(): HTMLCanvasElement {
    const previewCanvas = document.createElement("canvas");
    previewCanvas.width = 50;
    previewCanvas.height = 50;
    const previewCtx = previewCanvas.getContext("2d")!;

    const fullTexture = this.generateTexture();
    previewCtx.drawImage(fullTexture, 0, 0, 50, 50);

    return previewCanvas;
  }
}
```

### Step 5.5: Create Animation System

**Goal**: Implement animated effects and tool animations.

**Create `src/animation/AnimationManager.ts`**:

```typescript
interface AnimationFrame {
  time: number;
  callback: (progress: number, deltaTime: number) => boolean; // return false to stop
}

interface AnimationInstance {
  id: string;
  startTime: number;
  duration?: number;
  frames: AnimationFrame[];
  loop: boolean;
  paused: boolean;
}

export class AnimationManager {
  private static instance: AnimationManager;
  private animations = new Map<string, AnimationInstance>();
  private rafId: number | null = null;
  private lastTime = 0;
  private isRunning = false;

  private constructor() {}

  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  startAnimation(
    id: string,
    callback: (progress: number, deltaTime: number) => boolean,
    options: {
      duration?: number;
      loop?: boolean;
      delay?: number;
    } = {},
  ): string {
    const animationId = id || `anim_${Date.now()}_${Math.random()}`;

    const animation: AnimationInstance = {
      id: animationId,
      startTime: performance.now() + (options.delay || 0),
      duration: options.duration,
      frames: [{ time: 0, callback }],
      loop: options.loop || false,
      paused: false,
    };

    this.animations.set(animationId, animation);

    if (!this.isRunning) {
      this.start();
    }

    return animationId;
  }

  stopAnimation(id: string): void {
    this.animations.delete(id);

    if (this.animations.size === 0) {
      this.stop();
    }
  }

  pauseAnimation(id: string): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.paused = true;
    }
  }

  resumeAnimation(id: string): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.paused = false;
    }
  }

  stopAllAnimations(): void {
    this.animations.clear();
    this.stop();
  }

  // Easing functions
  static easing = {
    linear: (t: number) => t,
    easeInQuad: (t: number) => t * t,
    easeOutQuad: (t: number) => t * (2 - t),
    easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t: number) => t * t * t,
    easeOutCubic: (t: number) => --t * t * t + 1,
    easeInOutCubic: (t: number) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    bounce: (t: number) => {
      if (t < 1 / 2.75) {
        return 7.5625 * t * t;
      } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
      } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
      } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      }
    },
  };

  private start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick();
  }

  private stop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRunning = false;
  }

  private tick = (): void => {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    const animationsToRemove: string[] = [];

    this.animations.forEach((animation, id) => {
      if (animation.paused) return;

      const elapsed = currentTime - animation.startTime;

      if (elapsed < 0) return; // Animation hasn't started yet

      let progress = animation.duration
        ? elapsed / animation.duration
        : elapsed / 1000;

      if (animation.duration && elapsed >= animation.duration) {
        if (animation.loop) {
          animation.startTime = currentTime;
          progress = 0;
        } else {
          progress = 1;
        }
      }

      // Run animation callback
      let shouldContinue = true;
      animation.frames.forEach((frame) => {
        try {
          shouldContinue =
            frame.callback(progress, deltaTime) && shouldContinue;
        } catch (error) {
          console.error(`Animation ${id} error:`, error);
          shouldContinue = false;
        }
      });

      // Remove animation if it should stop
      if (
        !shouldContinue ||
        (animation.duration && elapsed >= animation.duration && !animation.loop)
      ) {
        animationsToRemove.push(id);
      }
    });

    // Clean up finished animations
    animationsToRemove.forEach((id) => {
      this.animations.delete(id);
    });

    // Continue animation loop if there are still animations
    if (this.animations.size > 0) {
      this.rafId = requestAnimationFrame(this.tick);
    } else {
      this.stop();
    }
  };
}
```

**Create `src/hooks/useAnimation.ts`**:

```typescript
import { useEffect, useRef, useCallback } from "react";
import { AnimationManager } from "../animation/AnimationManager";

interface UseAnimationOptions {
  duration?: number;
  loop?: boolean;
  delay?: number;
  autoStart?: boolean;
  easing?: (t: number) => number;
}

export function useAnimation(
  callback: (progress: number, deltaTime: number) => boolean | void,
  options: UseAnimationOptions = {},
) {
  const animationManager = useRef(AnimationManager.getInstance());
  const animationIdRef = useRef<string>("");
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    if (animationIdRef.current) {
      animationManager.current.stopAnimation(animationIdRef.current);
    }

    const wrappedCallback = (progress: number, deltaTime: number): boolean => {
      let adjustedProgress = progress;

      // Apply easing if provided
      if (options.easing) {
        adjustedProgress = options.easing(Math.min(1, progress));
      }

      const result = callbackRef.current(adjustedProgress, deltaTime);
      return result !== false; // Continue unless explicitly false
    };

    animationIdRef.current = animationManager.current.startAnimation(
      `useAnimation_${Date.now()}`,
      wrappedCallback,
      {
        duration: options.duration,
        loop: options.loop,
        delay: options.delay,
      },
    );
  }, [options.duration, options.loop, options.delay, options.easing]);

  const stop = useCallback(() => {
    if (animationIdRef.current) {
      animationManager.current.stopAnimation(animationIdRef.current);
      animationIdRef.current = "";
    }
  }, []);

  const pause = useCallback(() => {
    if (animationIdRef.current) {
      animationManager.current.pauseAnimation(animationIdRef.current);
    }
  }, []);

  const resume = useCallback(() => {
    if (animationIdRef.current) {
      animationManager.current.resumeAnimation(animationIdRef.current);
    }
  }, []);

  // Auto-start if specified
  useEffect(() => {
    if (options.autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [options.autoStart, start, stop]);

  return { start, stop, pause, resume };
}
```

### Step 5.6: Integrate Advanced Features with Tools

**Goal**: Update the tool system to use brushes, textures, sounds, and animations.

**Update `src/tools/ToolBase.ts`** to include advanced features:

```typescript
import { BrushGenerator } from "../brushes/BrushGenerator";
import { TextureGenerator } from "../textures/TextureGenerator";
import { useSound } from "../hooks/useSound";
import { AnimationManager } from "../animation/AnimationManager";

export abstract class ToolBase {
  // ... existing code ...

  protected brushGenerator?: BrushGenerator;
  protected textureGenerator?: TextureGenerator;
  protected animationManager = AnimationManager.getInstance();

  // Enhanced drawing methods with brush and texture support
  protected drawWithBrush(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    stroke: BrushStroke,
  ): void {
    if (!this.brushGenerator) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const brushCanvas = this.brushGenerator.generateBrush(stroke);

    // Apply blend mode for brush
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = stroke.points[0]?.opacity || 1;

    // Draw brush at position
    ctx.drawImage(
      brushCanvas,
      x - brushCanvas.width / 2,
      y - brushCanvas.height / 2,
    );

    // Reset blend mode
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }

  protected applyTexture(
    canvas: HTMLCanvasElement,
    region: { x: number; y: number; width: number; height: number },
  ): void {
    if (!this.textureGenerator) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const textureCanvas = this.textureGenerator.generateTexture();
    const pattern = ctx.createPattern(textureCanvas, "repeat");

    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(region.x, region.y, region.width, region.height);
    }
  }

  protected startToolAnimation(
    animationCallback: (progress: number, deltaTime: number) => boolean,
    duration?: number,
  ): string {
    return this.animationManager.startAnimation(
      `tool_${this.config.name}_${Date.now()}`,
      animationCallback,
      { duration },
    );
  }

  protected stopToolAnimation(animationId: string): void {
    this.animationManager.stopAnimation(animationId);
  }
}
```

## Background & Context

### Web Audio API Deep Dive

**Audio Context**: The main interface for audio processing

```typescript
// Create audio context
const audioContext = new AudioContext();

// Audio context states
console.log(audioContext.state); // 'suspended', 'running', or 'closed'

// Resume context (required by many browsers)
if (audioContext.state === "suspended") {
  await audioContext.resume();
}
```

**Audio Nodes**: Building blocks of audio processing

```typescript
// Source node (plays audio)
const source = audioContext.createBufferSource();
source.buffer = audioBuffer;

// Gain node (volume control)
const gainNode = audioContext.createGain();
gainNode.gain.value = 0.5; // 50% volume

// Filter node (EQ)
const filterNode = audioContext.createBiquadFilter();
filterNode.type = "lowpass";
filterNode.frequency.value = 1000;

// Connect nodes: source -> gain -> filter -> destination
source.connect(gainNode);
gainNode.connect(filterNode);
filterNode.connect(audioContext.destination);
```

**Audio Parameters**: Animatable audio properties

```typescript
// Immediate change
gainNode.gain.value = 0.5;

// Scheduled change
gainNode.gain.setValueAtTime(0, audioContext.currentTime);
gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 2); // Fade in over 2 seconds

// Exponential ramp (more natural for frequency/volume)
gainNode.gain.exponentialRampToValueAtTime(1, audioContext.currentTime + 2);
```

### Canvas Advanced Techniques

**Global Composite Operations**: How new shapes are drawn onto existing canvas

```typescript
// Normal drawing
ctx.globalCompositeOperation = "source-over";

// Multiply blend (darker)
ctx.globalCompositeOperation = "multiply";

// Screen blend (lighter)
ctx.globalCompositeOperation = "screen";

// Erase mode
ctx.globalCompositeOperation = "destination-out";

// Only draw where existing content exists
ctx.globalCompositeOperation = "source-in";
```

**Image Data Manipulation**: Direct pixel access

```typescript
// Get pixel data
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data; // Uint8ClampedArray [r, g, b, a, r, g, b, a, ...]

// Modify pixels
for (let i = 0; i < data.length; i += 4) {
  data[i] = 255 - data[i]; // Invert red
  data[i + 1] = 255 - data[i + 1]; // Invert green
  data[i + 2] = 255 - data[i + 2]; // Invert blue
  // data[i + 3] is alpha (transparency)
}

// Put pixels back
ctx.putImageData(imageData, 0, 0);
```

**Path2D Objects**: Reusable paths for complex shapes

```typescript
// Create reusable path
const star = new Path2D();
star.moveTo(50, 0);
star.lineTo(60, 35);
star.lineTo(95, 35);
star.lineTo(68, 57);
star.lineTo(78, 92);
star.lineTo(50, 70);
star.lineTo(22, 92);
star.lineTo(32, 57);
star.lineTo(5, 35);
star.lineTo(40, 35);
star.closePath();

// Use path multiple times
ctx.fill(star);
ctx.translate(100, 0);
ctx.stroke(star);
```

### Animation Performance

**RequestAnimationFrame**: Optimal timing for visual updates

```typescript
// ❌ Poor performance
setInterval(() => {
  updateAnimation();
}, 16); // Might not sync with display refresh

// ✅ Optimal performance
function animate() {
  updateAnimation();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

**Time-based Animation**: Consistent speed regardless of framerate

```typescript
let lastTime = 0;

function animate(currentTime: number) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // Move based on time, not frames
  position.x += velocity.x * (deltaTime / 1000); // velocity per second

  requestAnimationFrame(animate);
}
```

**Animation Optimization**:

```typescript
// Batch DOM updates
function updateMultipleElements(elements: HTMLElement[], properties: any[]) {
  // Batch reads
  const measurements = elements.map((el) => el.getBoundingClientRect());

  // Batch writes
  elements.forEach((el, i) => {
    Object.assign(el.style, properties[i]);
  });
}

// Use CSS transforms for better performance
element.style.transform = `translate(${x}px, ${y}px)`;
// Instead of:
// element.style.left = x + 'px';
// element.style.top = y + 'px';
```

### Noise Generation Algorithms

**Perlin Noise**: Smooth, natural-looking random patterns

```typescript
class PerlinNoise {
  private permutation: number[];

  constructor(seed?: number) {
    // Initialize permutation table
    this.permutation = [];
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }

    // Shuffle using seed
    if (seed) {
      this.shuffle(seed);
    }
  }

  noise(x: number, y: number): number {
    // Find grid cell
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    // Get relative xy coordinates in cell
    x -= Math.floor(x);
    y -= Math.floor(y);

    // Smooth the coordinates
    const u = this.fade(x);
    const v = this.fade(y);

    // Hash coordinates of 4 corners
    const A = this.permutation[X] + Y;
    const B = this.permutation[X + 1] + Y;

    // Interpolate between corners
    return this.lerp(
      v,
      this.lerp(
        u,
        this.grad(this.permutation[A], x, y),
        this.grad(this.permutation[B], x - 1, y),
      ),
      this.lerp(
        u,
        this.grad(this.permutation[A + 1], x, y - 1),
        this.grad(this.permutation[B + 1], x - 1, y - 1),
      ),
    );
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
}
```

## Practical Examples

### Example 1: Advanced Wacky Brush Tool

```typescript
export class TwirlyBrush extends ToolBase {
  private particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
  }> = [];

  private animationId: string = "";

  constructor(state: KidPixState, dispatch: React.Dispatch<KidPixAction>) {
    super(
      {
        name: "Twirly",
        icon: "🌪️",
        category: "brush",
        sounds: {
          start: "kidpix-submenu-brush-twirly.wav",
          during: "kidpix-submenu-brush-xy-during.wav",
        },
      },
      state,
      dispatch,
    );
  }

  onMouseDown(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    this.saveUndo(canvas);
    const position = this.getMousePosition(event, canvas);

    // Create initial burst of particles
    this.createParticles(position.x, position.y, 15);

    // Start continuous animation
    this.animationId = this.startToolAnimation((progress, deltaTime) => {
      this.updateParticles(deltaTime);
      this.renderParticles(canvas);
      return this.state.isDrawing; // Continue while drawing
    });

    this.playSound("start");
    this.dispatch({ type: "SET_DRAWING_STATE", payload: true });
  }

  onMouseMove(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    if (!this.state.isDrawing) return;

    const position = this.getMousePosition(event, canvas);

    // Add more particles at current position
    this.createParticles(position.x, position.y, 3);
  }

  onMouseUp(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    this.dispatch({ type: "SET_DRAWING_STATE", payload: false });

    // Let particles fade out naturally
    setTimeout(() => {
      this.stopToolAnimation(this.animationId);
    }, 2000);
  }

  private createParticles(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 2 + Math.random() * 4;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 100 + Math.random() * 100,
        size: 2 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  private updateParticles(deltaTime: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];

      // Update position with swirl effect
      const centerPull = 0.02;
      const angle = Math.atan2(particle.vy, particle.vx);
      particle.vx += Math.cos(angle + Math.PI / 2) * centerPull;
      particle.vy += Math.sin(angle + Math.PI / 2) * centerPull;

      particle.x += particle.vx;
      particle.y += particle.vy;

      // Update rotation
      particle.rotation += particle.rotationSpeed;

      // Decay
      particle.life -= deltaTime * 0.1;
      particle.size *= 0.995;

      // Remove dead particles
      if (particle.life <= 0 || particle.size < 0.5) {
        this.particles.splice(i, 1);
      }
    }
  }

  private renderParticles(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    this.particles.forEach((particle) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);

      const opacity = Math.max(0, particle.life / 100);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = this.state.currentColor;

      // Draw spinning shape
      ctx.beginPath();
      ctx.moveTo(particle.size, 0);
      for (let i = 1; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        ctx.lineTo(
          Math.cos(angle) * particle.size,
          Math.sin(angle) * particle.size,
        );
      }
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });
  }
}
```

### Example 2: Texture-based Paint Tool

```typescript
export class TexturePaintTool extends ToolBase {
  private texturePattern: CanvasPattern | null = null;
  private currentTexture: string = "noise";

  constructor(state: KidPixState, dispatch: React.Dispatch<KidPixAction>) {
    super(
      {
        name: "Texture Paint",
        icon: "🎨",
        category: "effect",
        submenu: [
          { name: "Noise", icon: "▦", value: "noise", type: "pattern" },
          { name: "Fabric", icon: "▤", value: "fabric", type: "pattern" },
          { name: "Stone", icon: "▥", value: "stone", type: "pattern" },
          { name: "Wood", icon: "▧", value: "wood", type: "pattern" },
        ],
      },
      state,
      dispatch,
    );

    this.updateTexture();
  }

  onToolSelect(): void {
    this.updateTexture();
  }

  onMouseDown(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    this.saveUndo(canvas);
    const position = this.getMousePosition(event, canvas);

    this.paintTexture(canvas, position.x, position.y);
    this.dispatch({ type: "SET_DRAWING_STATE", payload: true });
  }

  onMouseMove(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    if (!this.state.isDrawing) return;

    const position = this.getMousePosition(event, canvas);
    this.paintTexture(canvas, position.x, position.y);
  }

  onMouseUp(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): void {
    this.dispatch({ type: "SET_DRAWING_STATE", payload: false });
  }

  private updateTexture(): void {
    let textureGenerator: TextureGenerator;

    switch (this.currentTexture) {
      case "noise":
        textureGenerator = new NoiseTexture({
          name: "Noise",
          size: 128,
          parameters: { scale: 0.1, octaves: 4 },
        });
        break;
      case "fabric":
        textureGenerator = new FabricTexture({
          name: "Fabric",
          size: 64,
          parameters: { weaveSize: 4, threadThickness: 2 },
        });
        break;
      // ... other texture types
      default:
        return;
    }

    const textureCanvas = textureGenerator.generateTexture();
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d")!;

    this.texturePattern = tempCtx.createPattern(textureCanvas, "repeat");
  }

  private paintTexture(canvas: HTMLCanvasElement, x: number, y: number): void {
    if (!this.texturePattern) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = this.state.brushSize * 2;

    // Create mask for brush shape
    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    // Clip to brush shape
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.clip();

    // Apply texture within clipped area
    ctx.fillStyle = this.texturePattern;
    ctx.globalAlpha = 0.8;
    ctx.fillRect(x - size / 2, y - size / 2, size, size);

    ctx.restore();
  }
}
```

## Verification & Testing

### Test Advanced Brush System

```bash
# Create brush system test
cat > src/brushes/__tests__/BubblesBrush.test.ts << 'EOF'
import { BubblesBrush } from '../BubblesBrush';
import { BrushStroke } from '../BrushGenerator';

describe('BubblesBrush', () => {
  let brush: BubblesBrush;
  let mockStroke: BrushStroke;

  beforeEach(() => {
    brush = new BubblesBrush({
      name: 'Bubbles',
      size: 100
    });

    mockStroke = {
      points: [{ x: 50, y: 50, size: 10, opacity: 1, color: '#0000ff' }],
      pressure: 1,
      velocity: 5,
      direction: 0
    };
  });

  test('generates brush canvas with correct dimensions', () => {
    const canvas = brush.generateBrush(mockStroke);
    expect(canvas.width).toBe(100);
    expect(canvas.height).toBe(100);
  });

  test('preview canvas has reasonable size', () => {
    const preview = brush.getPreview();
    expect(preview.width).toBe(50);
    expect(preview.height).toBe(50);
  });
});
EOF
```

### Test Sound System

```bash
# Create sound system test
cat > src/audio/__tests__/SoundManager.test.ts << 'EOF'
import { SoundManager } from '../SoundManager';

// Mock Web Audio API
const mockAudioContext = {
  createBufferSource: jest.fn(() => ({
    buffer: null,
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    onended: null
  })),
  createGain: jest.fn(() => ({
    gain: { setValueAtTime: jest.fn(), linearRampToValueAtTime: jest.fn() },
    connect: jest.fn()
  })),
  decodeAudioData: jest.fn(() => Promise.resolve({})),
  destination: {},
  currentTime: 0,
  state: 'running',
  resume: jest.fn(() => Promise.resolve())
};

(global as any).AudioContext = jest.fn(() => mockAudioContext);
(global as any).webkitAudioContext = jest.fn(() => mockAudioContext);

describe('SoundManager', () => {
  let soundManager: SoundManager;

  beforeEach(() => {
    soundManager = SoundManager.getInstance();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8))
      })
    ) as jest.Mock;
  });

  test('initializes audio context', async () => {
    await soundManager.initialize();
    expect(mockAudioContext.createGain).toHaveBeenCalled();
  });

  test('loads sound with config', async () => {
    await soundManager.loadSound('test', {
      src: '/test.wav',
      volume: 0.5,
      category: 'tool'
    });

    expect(fetch).toHaveBeenCalledWith('/test.wav');
  });
});
EOF
```

### Performance Testing for Advanced Features

```bash
# Create performance test for brushes
cat > src/brushes/__tests__/performance.test.ts << 'EOF'
import { BubblesBrush, SplatterBrush } from '../';
import { PerformanceMonitor } from '../../utils/performance';

describe('Brush Performance', () => {
  const monitor = PerformanceMonitor.getInstance();

  test('bubble brush generates within time limit', () => {
    const brush = new BubblesBrush({ name: 'Test', size: 100 });
    const stroke = {
      points: [{ x: 50, y: 50, size: 10, opacity: 1, color: '#ff0000' }],
      pressure: 1,
      velocity: 5,
      direction: 0
    };

    monitor.startMeasurement('bubble-brush-generation');
    brush.generateBrush(stroke);
    const time = monitor.endMeasurement('bubble-brush-generation');

    expect(time).toBeLessThan(16); // Should generate in less than 1 frame
  });

  test('splatter brush batch generation performance', () => {
    const brush = new SplatterBrush({ name: 'Test', size: 80 });
    const strokes = Array.from({ length: 50 }, (_, i) => ({
      points: [{ x: i * 2, y: i * 2, size: 8, opacity: 1, color: '#00ff00' }],
      pressure: 1,
      velocity: 3,
      direction: i * 0.1
    }));

    monitor.startMeasurement('splatter-brush-batch');
    strokes.forEach(stroke => brush.generateBrush(stroke));
    const totalTime = monitor.endMeasurement('splatter-brush-batch');

    const averageTime = totalTime / strokes.length;
    expect(averageTime).toBeLessThan(5); // Should average less than 5ms per brush
  });
});
EOF
```

### E2E Testing for Advanced Features

```bash
# Create E2E test for advanced tools
cat > tests/e2e/advanced-tools.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test('advanced brush tools work correctly', async ({ page }) => {
  await page.goto('/?react');

  // Wait for app to load
  await page.waitForSelector('canvas');

  // Select wacky brush tool
  await page.click('[data-testid="tool-wacky-brush"]');

  // Select bubbles brush from submenu
  await page.click('[data-testid="brush-bubbles"]');

  // Draw with bubbles brush
  const canvas = page.locator('canvas[style*="z-index: 5"]');
  await canvas.click({ position: { x: 200, y: 200 } });
  await canvas.dragTo(canvas, {
    sourcePosition: { x: 200, y: 200 },
    targetPosition: { x: 300, y: 250 }
  });

  // Wait for animation to settle
  await page.waitForTimeout(1000);

  // Verify drawing with bubbles effect
  await expect(page).toHaveScreenshot('bubbles-brush-drawing.png');
});

test('sound effects play during tool use', async ({ page }) => {
  // Grant audio permissions
  await page.context().grantPermissions(['microphone'], { origin: page.url() });

  await page.goto('/?react');

  // Enable sound monitoring
  await page.evaluate(() => {
    window.soundsPlayed = [];
    // Mock sound playing to track calls
    const originalPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
      window.soundsPlayed.push(this.src);
      return Promise.resolve();
    };
  });

  // Use tool that has sounds
  await page.click('[data-testid="tool-pencil"]');
  const canvas = page.locator('canvas');
  await canvas.click({ position: { x: 100, y: 100 } });

  // Check that sound was played
  const soundsPlayed = await page.evaluate(() => window.soundsPlayed);
  expect(soundsPlayed.length).toBeGreaterThan(0);
  expect(soundsPlayed[0]).toContain('pencil');
});
EOF
```

## Troubleshooting

### Audio Context Issues

**Problem**: Audio doesn't play on first interaction

```typescript
// Solution: Ensure user interaction before audio
const startAudio = async () => {
  const audioContext = new AudioContext();

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  // Now audio will work
};

// Call on first user click
document.addEventListener("click", startAudio, { once: true });
```

**Problem**: Audio cuts out or doesn't play smoothly

```typescript
// Solution: Proper buffer management and timing
class AudioBufferManager {
  private buffers = new Map<string, AudioBuffer>();

  async preloadSounds(sounds: string[]) {
    const promises = sounds.map(async (src) => {
      if (!this.buffers.has(src)) {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer =
          await this.audioContext.decodeAudioData(arrayBuffer);
        this.buffers.set(src, audioBuffer);
      }
    });

    await Promise.all(promises);
  }
}
```

### Canvas Performance Issues

**Problem**: Brush generation is too slow

```typescript
// Solution: Use OffscreenCanvas for background generation
class OptimizedBrushGenerator {
  private worker: Worker;
  private brushCache = new Map<string, HTMLCanvasElement>();

  constructor() {
    this.worker = new Worker("/brush-worker.js");
  }

  async generateBrush(config: BrushConfig): Promise<HTMLCanvasElement> {
    const cacheKey = JSON.stringify(config);

    if (this.brushCache.has(cacheKey)) {
      return this.brushCache.get(cacheKey)!;
    }

    // Generate in worker thread
    const imageData = await this.generateInWorker(config);
    const canvas = this.createCanvasFromImageData(imageData);

    this.brushCache.set(cacheKey, canvas);
    return canvas;
  }
}
```

### Memory Management

**Problem**: Memory leaks from animations and sounds

```typescript
// Solution: Proper cleanup and weak references
class ResourceManager {
  private animationCleanup = new Set<() => void>();
  private soundCleanup = new Set<() => void>();

  registerAnimation(cleanup: () => void) {
    this.animationCleanup.add(cleanup);
  }

  registerSound(cleanup: () => void) {
    this.soundCleanup.add(cleanup);
  }

  cleanup() {
    this.animationCleanup.forEach((cleanup) => cleanup());
    this.soundCleanup.forEach((cleanup) => cleanup());
    this.animationCleanup.clear();
    this.soundCleanup.clear();
  }
}

// Use in component
useEffect(() => {
  const resourceManager = new ResourceManager();

  return () => {
    resourceManager.cleanup();
  };
}, []);
```

## Next Steps

1. **Commit advanced features**:

```bash
git add src/brushes/ src/audio/ src/textures/ src/animation/
git commit -m "feat(advanced): implement brush generators, sound system, textures, and animations"
```

2. **Performance optimization**:

```bash
# Run performance tests
yarn test --testNamePattern="performance"

# Profile brush generation
yarn test src/brushes/ --coverage
```

3. **Integration testing**:

```bash
# Test all advanced features together
yarn playwright test tests/e2e/advanced-tools.spec.ts
```

**Continue to**: [Phase 6: Polish & Optimization](./phase-6-polish-optimization.md)

---

**Related Documentation**:

- [Overview](./overview.md) - Migration plan overview
- [Phase 4](./phase-4-tool-migration.md) - Basic tool migration
- [Phase 6](./phase-6-polish-optimization.md) - Final polish and optimization
