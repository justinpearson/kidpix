# Phase 6: Polish & Optimization (Weeks 21-24)

## Table of Contents

1. [Overview](#overview)
2. [Implementation Steps](#implementation-steps)
3. [Background & Context](#background--context)
4. [Practical Examples](#practical-examples)
5. [Verification & Testing](#verification--testing)
6. [Troubleshooting](#troubleshooting)
7. [Deployment & Monitoring](#deployment--monitoring)

## Overview

Phase 6 is the final phase focused on optimizing performance, adding modern web features, ensuring accessibility, and preparing the application for production deployment. This phase transforms the KidPix application into a modern, performant, and accessible web application.

**Learning Focus**: Performance optimization, PWA development, accessibility (a11y), monitoring, deployment strategies, and production best practices.

**Duration**: 4 weeks  
**Difficulty**: Expert  
**Prerequisites**: Completed Phases 1-5, understanding of web performance and accessibility principles

## Implementation Steps

### Step 6.1: Performance Optimization

**Goal**: Optimize the application for 60fps drawing and fast load times.

**Create `src/performance/PerformanceOptimizer.ts`**:

```typescript
interface PerformanceMetrics {
  frameTime: number[];
  drawCalls: number;
  memoryUsage: number;
  bundleSize: number;
  loadTime: number;
}

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private metrics: PerformanceMetrics = {
    frameTime: [],
    drawCalls: 0,
    memoryUsage: 0,
    bundleSize: 0,
    loadTime: 0,
  };

  private frameStartTime = 0;
  private observer?: PerformanceObserver;

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  initialize(): void {
    this.setupPerformanceObserver();
    this.measureLoadTime();
    this.startFrameMonitoring();
  }

  // Canvas optimization
  optimizeCanvas(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Optimize canvas context
    ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering

    // Use appropriate image smoothing quality when needed
    if ("imageSmoothingQuality" in ctx) {
      (ctx as any).imageSmoothingQuality = "low"; // Faster rendering
    }

    // Set up efficient composite operations
    ctx.globalCompositeOperation = "source-over";
  }

  // Drawing optimization with dirty rectangles
  optimizeDrawing(
    canvas: HTMLCanvasElement,
    drawFunction: (ctx: CanvasRenderingContext2D, dirtyRect?: DOMRect) => void,
    dirtyRect?: DOMRect,
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    this.startFrame();

    if (dirtyRect) {
      // Only clear and redraw the dirty area
      ctx.save();
      ctx.beginPath();
      ctx.rect(dirtyRect.x, dirtyRect.y, dirtyRect.width, dirtyRect.height);
      ctx.clip();
      ctx.clearRect(
        dirtyRect.x,
        dirtyRect.y,
        dirtyRect.width,
        dirtyRect.height,
      );

      drawFunction(ctx, dirtyRect);

      ctx.restore();
    } else {
      // Full canvas redraw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawFunction(ctx);
    }

    this.endFrame();
    this.metrics.drawCalls++;
  }

  // Batch canvas operations
  batchCanvasOperations(
    canvas: HTMLCanvasElement,
    operations: Array<(ctx: CanvasRenderingContext2D) => void>,
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    this.startFrame();

    // Batch all operations in a single frame
    ctx.save();
    operations.forEach((operation) => operation(ctx));
    ctx.restore();

    this.endFrame();
    this.metrics.drawCalls += operations.length;
  }

  // Memory optimization
  optimizeMemory(): void {
    // Clean up unused canvases
    this.cleanupUnusedCanvases();

    // Force garbage collection if available
    if ("gc" in window) {
      (window as any).gc();
    }

    // Measure memory usage
    if ("memory" in performance) {
      this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }
  }

  // Bundle size optimization
  lazy<T>(factory: () => Promise<T>): () => Promise<T> {
    let cached: T | null = null;
    return async () => {
      if (cached === null) {
        cached = await factory();
      }
      return cached;
    };
  }

  // Performance monitoring
  private setupPerformanceObserver(): void {
    if ("PerformanceObserver" in window) {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === "measure") {
            console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
          }
        });
      });

      this.observer.observe({ entryTypes: ["measure", "navigation"] });
    }
  }

  private measureLoadTime(): void {
    if ("performance" in window && "timing" in performance) {
      const timing = performance.timing;
      this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
    }
  }

  private startFrameMonitoring(): void {
    const measureFrame = () => {
      this.startFrame();
      requestAnimationFrame(() => {
        this.endFrame();
        measureFrame();
      });
    };
    measureFrame();
  }

  private startFrame(): void {
    this.frameStartTime = performance.now();
  }

  private endFrame(): void {
    const frameTime = performance.now() - this.frameStartTime;
    this.metrics.frameTime.push(frameTime);

    // Keep only last 100 frames
    if (this.metrics.frameTime.length > 100) {
      this.metrics.frameTime.shift();
    }
  }

  private cleanupUnusedCanvases(): void {
    // Find and remove orphaned canvas elements
    const canvases = document.querySelectorAll("canvas");
    canvases.forEach((canvas) => {
      if (!canvas.parentNode) {
        canvas.remove();
      }
    });
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getAverageFrameTime(): number {
    if (this.metrics.frameTime.length === 0) return 0;
    const sum = this.metrics.frameTime.reduce((a, b) => a + b, 0);
    return sum / this.metrics.frameTime.length;
  }

  getFPS(): number {
    const avgFrameTime = this.getAverageFrameTime();
    return avgFrameTime > 0 ? 1000 / avgFrameTime : 0;
  }
}
```

**Create `src/hooks/usePerformance.ts`**:

```typescript
import { useEffect, useRef, useState } from "react";
import { PerformanceOptimizer } from "../performance/PerformanceOptimizer";

export function usePerformance() {
  const optimizer = useRef(PerformanceOptimizer.getInstance());
  const [metrics, setMetrics] = useState(optimizer.current.getMetrics());

  useEffect(() => {
    optimizer.current.initialize();

    const interval = setInterval(() => {
      setMetrics(optimizer.current.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const optimizeCanvas = (canvas: HTMLCanvasElement) => {
    optimizer.current.optimizeCanvas(canvas);
  };

  const optimizeDrawing = (
    canvas: HTMLCanvasElement,
    drawFunction: (ctx: CanvasRenderingContext2D) => void,
    dirtyRect?: DOMRect,
  ) => {
    optimizer.current.optimizeDrawing(canvas, drawFunction, dirtyRect);
  };

  return {
    metrics,
    fps: optimizer.current.getFPS(),
    averageFrameTime: optimizer.current.getAverageFrameTime(),
    optimizeCanvas,
    optimizeDrawing,
  };
}
```

### Step 6.2: Progressive Web App (PWA) Implementation

**Goal**: Transform KidPix into a PWA with offline capabilities and native app features.

**Create `public/manifest.json`**:

```json
{
  "name": "KidPix - Creative Drawing for Kids",
  "short_name": "KidPix",
  "description": "A fun and creative drawing application for children with wacky brushes, sounds, and effects",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ff6b6b",
  "orientation": "any",
  "categories": ["education", "entertainment", "graphics"],
  "lang": "en-US",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/desktop-1.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "KidPix main drawing interface"
    },
    {
      "src": "/screenshots/mobile-1.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "KidPix mobile interface"
    }
  ],
  "shortcuts": [
    {
      "name": "New Drawing",
      "short_name": "New",
      "description": "Start a new drawing",
      "url": "/?action=new",
      "icons": [{ "src": "/icons/new-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Gallery",
      "short_name": "Gallery",
      "description": "View saved drawings",
      "url": "/?action=gallery",
      "icons": [{ "src": "/icons/gallery-96x96.png", "sizes": "96x96" }]
    }
  ]
}
```

**Create `public/sw.js` (Service Worker)**:

```javascript
const CACHE_NAME = "kidpix-v1.0.0";
const STATIC_CACHE = "kidpix-static-v1";
const DYNAMIC_CACHE = "kidpix-dynamic-v1";

// Files to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/static/js/bundle.js",
  "/static/css/main.css",
  // Core images and sounds
  "/assets/img/kidpix.png",
  "/assets/snd/kidpix-tool-pencil.wav",
  // Essential tool icons
  "/assets/img/tool-menu-wacky-brush-70.png",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Static assets cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Error caching static assets:", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker activated");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests
  if (request.destination === "document") {
    // HTML pages - cache first, fallback to network
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (
    request.destination === "image" ||
    request.destination === "audio"
  ) {
    // Assets - cache first with dynamic caching
    event.respondWith(cacheFirstWithDynamicCaching(request));
  } else {
    // Other resources - network first, fallback to cache
    event.respondWith(networkFirst(request));
  }
});

// Cache strategies
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
      console.log("Serving from cache:", request.url);
      return cached;
    }

    console.log("Cache miss, fetching:", request.url);
    const response = await fetch(request);

    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error("Cache first strategy failed:", error);
    return new Response("Offline - content not available", { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    console.log("Network first for:", request.url);
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log("Network failed, trying cache:", request.url);
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    return new Response("Offline - content not available", { status: 503 });
  }
}

async function cacheFirstWithDynamicCaching(request) {
  try {
    // Try static cache first
    const staticCache = await caches.open(STATIC_CACHE);
    const staticCached = await staticCache.match(request);

    if (staticCached) {
      return staticCached;
    }

    // Try dynamic cache
    const dynamicCache = await caches.open(DYNAMIC_CACHE);
    const dynamicCached = await dynamicCache.match(request);

    if (dynamicCached) {
      return dynamicCached;
    }

    // Fetch and cache
    const response = await fetch(request);

    if (response.ok) {
      dynamicCache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error("Cache first with dynamic caching failed:", error);
    return new Response("Asset not available offline", { status: 503 });
  }
}

// Background sync for saving drawings
self.addEventListener("sync", (event) => {
  if (event.tag === "save-drawing") {
    event.waitUntil(syncDrawings());
  }
});

async function syncDrawings() {
  try {
    // Get pending drawings from IndexedDB
    const pendingDrawings = await getPendingDrawings();

    for (const drawing of pendingDrawings) {
      try {
        await uploadDrawing(drawing);
        await removePendingDrawing(drawing.id);
      } catch (error) {
        console.error("Failed to sync drawing:", error);
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

// Push notifications for updates
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New features available!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    tag: "kidpix-update",
    requireInteraction: false,
    actions: [
      {
        action: "open",
        title: "Open KidPix",
        icon: "/icons/open-24x24.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icons/dismiss-24x24.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("KidPix Update", options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "open") {
    event.waitUntil(clients.openWindow("/"));
  }
});
```

**Create `src/hooks/usePWA.ts`**:

```typescript
import { useEffect, useState } from "react";

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: navigator.onLine,
    updateAvailable: false,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if running as PWA
    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setState((prev) => ({ ...prev, isInstalled }));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setState((prev) => ({ ...prev, isInstallable: true }));
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setState((prev) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
      }));
    };

    // Listen for online/offline
    const handleOnline = () =>
      setState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setState((prev) => ({ ...prev, isOnline: false }));

    // Listen for service worker updates
    const handleControllerChange = () => {
      setState((prev) => ({ ...prev, updateAvailable: true }));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        handleControllerChange,
      );
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener(
          "controllerchange",
          handleControllerChange,
        );
      }
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setState((prev) => ({ ...prev, isInstallable: false }));
      return true;
    }

    return false;
  };

  const reloadApp = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
      });
    }
    window.location.reload();
  };

  return {
    ...state,
    installApp,
    reloadApp,
  };
}
```

### Step 6.3: Accessibility Implementation

**Goal**: Ensure KidPix is accessible to users with disabilities.

**Create `src/accessibility/AccessibilityManager.ts`**:

```typescript
interface AccessibilityOptions {
  highContrast: boolean;
  reduceMotion: boolean;
  fontSize: "small" | "medium" | "large";
  keyboardNavigation: boolean;
  screenReader: boolean;
  colorBlindFriendly: boolean;
}

export class AccessibilityManager {
  private static instance: AccessibilityManager;
  private options: AccessibilityOptions;
  private announcer: HTMLElement;

  private constructor() {
    this.options = this.loadOptions();
    this.announcer = this.createAnnouncer();
    this.detectPreferences();
    this.applyOptions();
  }

  static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager();
    }
    return AccessibilityManager.instance;
  }

  // Screen reader announcements
  announce(message: string, priority: "polite" | "assertive" = "polite"): void {
    this.announcer.setAttribute("aria-live", priority);
    this.announcer.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      this.announcer.textContent = "";
    }, 1000);
  }

  // Keyboard navigation support
  setupKeyboardNavigation(): void {
    document.addEventListener("keydown", this.handleKeyboard.bind(this));

    // Add visible focus indicators
    const style = document.createElement("style");
    style.textContent = `
      .keyboard-navigation *:focus {
        outline: 3px solid #4A90E2 !important;
        outline-offset: 2px !important;
      }
      
      .keyboard-navigation .tool-button:focus {
        background-color: #E3F2FD !important;
        border: 2px solid #2196F3 !important;
      }
    `;
    document.head.appendChild(style);
  }

  // High contrast mode
  setHighContrast(enabled: boolean): void {
    this.options.highContrast = enabled;

    if (enabled) {
      document.body.classList.add("high-contrast");
      this.injectHighContrastStyles();
    } else {
      document.body.classList.remove("high-contrast");
    }

    this.saveOptions();
    this.announce(`High contrast ${enabled ? "enabled" : "disabled"}`);
  }

  // Reduce motion
  setReduceMotion(enabled: boolean): void {
    this.options.reduceMotion = enabled;

    if (enabled) {
      document.body.classList.add("reduce-motion");
      this.injectReduceMotionStyles();
    } else {
      document.body.classList.remove("reduce-motion");
    }

    this.saveOptions();
    this.announce(`Animations ${enabled ? "reduced" : "restored"}`);
  }

  // Font size adjustment
  setFontSize(size: "small" | "medium" | "large"): void {
    this.options.fontSize = size;

    document.body.classList.remove("font-small", "font-medium", "font-large");
    document.body.classList.add(`font-${size}`);

    this.injectFontSizeStyles();
    this.saveOptions();
    this.announce(`Font size set to ${size}`);
  }

  // Color blind friendly colors
  setColorBlindFriendly(enabled: boolean): void {
    this.options.colorBlindFriendly = enabled;

    if (enabled) {
      document.body.classList.add("color-blind-friendly");
      this.injectColorBlindStyles();
    } else {
      document.body.classList.remove("color-blind-friendly");
    }

    this.saveOptions();
    this.announce(
      `Color blind friendly mode ${enabled ? "enabled" : "disabled"}`,
    );
  }

  // Canvas accessibility
  makeCanvasAccessible(canvas: HTMLCanvasElement, description: string): void {
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", description);
    canvas.setAttribute("tabindex", "0");

    // Add keyboard interaction
    canvas.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Simulate click at center
        const clickEvent = new MouseEvent("click", {
          clientX: rect.left + centerX,
          clientY: rect.top + centerY,
          bubbles: true,
        });
        canvas.dispatchEvent(clickEvent);

        this.announce("Canvas activated");
      }
    });
  }

  // Tool accessibility
  makeToolAccessible(
    element: HTMLElement,
    toolName: string,
    description: string,
  ): void {
    element.setAttribute("role", "button");
    element.setAttribute("aria-label", `${toolName}: ${description}`);
    element.setAttribute("tabindex", "0");

    // Add keyboard activation
    element.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        element.click();
        this.announce(`${toolName} selected`);
      }
    });
  }

  // Detect user preferences
  private detectPreferences(): void {
    // Check for prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.options.reduceMotion = true;
    }

    // Check for prefers-contrast
    if (window.matchMedia("(prefers-contrast: high)").matches) {
      this.options.highContrast = true;
    }

    // Check for screen reader
    this.options.screenReader = this.detectScreenReader();
  }

  private detectScreenReader(): boolean {
    // Simple screen reader detection
    return !!(
      navigator.userAgent.match(/NVDA|JAWS|VoiceOver|ChromeVox/i) ||
      window.speechSynthesis ||
      document.querySelector("[aria-live]")
    );
  }

  private handleKeyboard(e: KeyboardEvent): void {
    // Global keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "z":
          e.preventDefault();
          this.triggerUndo();
          break;
        case "y":
          e.preventDefault();
          this.triggerRedo();
          break;
        case "s":
          e.preventDefault();
          this.triggerSave();
          break;
        case "n":
          e.preventDefault();
          this.triggerNew();
          break;
      }
    }

    // Tool navigation
    if (e.key >= "1" && e.key <= "9") {
      const toolIndex = parseInt(e.key) - 1;
      this.selectToolByIndex(toolIndex);
    }
  }

  private triggerUndo(): void {
    const event = new CustomEvent("kidpix:undo");
    document.dispatchEvent(event);
    this.announce("Undo");
  }

  private triggerRedo(): void {
    const event = new CustomEvent("kidpix:redo");
    document.dispatchEvent(event);
    this.announce("Redo");
  }

  private triggerSave(): void {
    const event = new CustomEvent("kidpix:save");
    document.dispatchEvent(event);
    this.announce("Saving drawing");
  }

  private triggerNew(): void {
    const event = new CustomEvent("kidpix:new");
    document.dispatchEvent(event);
    this.announce("New drawing started");
  }

  private selectToolByIndex(index: number): void {
    const tools = document.querySelectorAll(".tool-button");
    if (tools[index]) {
      (tools[index] as HTMLElement).click();
    }
  }

  private createAnnouncer(): HTMLElement {
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    announcer.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;
    document.body.appendChild(announcer);
    return announcer;
  }

  private injectHighContrastStyles(): void {
    const style = document.createElement("style");
    style.id = "high-contrast-styles";
    style.textContent = `
      .high-contrast {
        filter: contrast(150%) brightness(110%);
      }
      
      .high-contrast .tool-button {
        border: 2px solid #000 !important;
        background-color: #fff !important;
        color: #000 !important;
      }
      
      .high-contrast .tool-button.active {
        background-color: #000 !important;
        color: #fff !important;
      }
      
      .high-contrast canvas {
        border: 3px solid #000 !important;
      }
    `;
    document.head.appendChild(style);
  }

  private injectReduceMotionStyles(): void {
    const style = document.createElement("style");
    style.id = "reduce-motion-styles";
    style.textContent = `
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }

  private injectFontSizeStyles(): void {
    const sizes = {
      small: "14px",
      medium: "16px",
      large: "20px",
    };

    const style = document.createElement("style");
    style.id = "font-size-styles";
    style.textContent = `
      .font-${this.options.fontSize} {
        font-size: ${sizes[this.options.fontSize]} !important;
      }
      
      .font-${this.options.fontSize} .tool-button {
        font-size: ${sizes[this.options.fontSize]} !important;
        padding: ${this.options.fontSize === "large" ? "12px" : "8px"} !important;
      }
    `;
    document.head.appendChild(style);
  }

  private injectColorBlindStyles(): void {
    const style = document.createElement("style");
    style.id = "color-blind-styles";
    style.textContent = `
      .color-blind-friendly .color-red { background-color: #d73027 !important; }
      .color-blind-friendly .color-green { background-color: #1a9850 !important; }
      .color-blind-friendly .color-blue { background-color: #313695 !important; }
      .color-blind-friendly .color-yellow { background-color: #f46d43 !important; }
      .color-blind-friendly .color-orange { background-color: #a50026 !important; }
      .color-blind-friendly .color-purple { background-color: #762a83 !important; }
    `;
    document.head.appendChild(style);
  }

  private applyOptions(): void {
    if (this.options.highContrast) this.setHighContrast(true);
    if (this.options.reduceMotion) this.setReduceMotion(true);
    if (this.options.keyboardNavigation) this.setupKeyboardNavigation();
    if (this.options.colorBlindFriendly) this.setColorBlindFriendly(true);
    this.setFontSize(this.options.fontSize);
  }

  private loadOptions(): AccessibilityOptions {
    const saved = localStorage.getItem("kidpix-accessibility");
    if (saved) {
      return { ...this.getDefaultOptions(), ...JSON.parse(saved) };
    }
    return this.getDefaultOptions();
  }

  private saveOptions(): void {
    localStorage.setItem("kidpix-accessibility", JSON.stringify(this.options));
  }

  private getDefaultOptions(): AccessibilityOptions {
    return {
      highContrast: false,
      reduceMotion: false,
      fontSize: "medium",
      keyboardNavigation: true,
      screenReader: false,
      colorBlindFriendly: false,
    };
  }

  getOptions(): AccessibilityOptions {
    return { ...this.options };
  }
}
```

### Step 6.4: Bundle Optimization and Code Splitting

**Goal**: Optimize bundle size and implement code splitting for faster load times.

**Update `vite.config.ts`** for optimization:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/bundle-analysis.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    target: "es2015",
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          "vendor-react": ["react", "react-dom"],

          // Audio libraries
          "vendor-audio": ["tone", "web-audio-api"],

          // Canvas utilities
          "vendor-canvas": ["konva", "fabric"],

          // Tool groups
          "tools-basic": [
            "./src/tools/PencilTool",
            "./src/tools/EraserTool",
            "./src/tools/LineTool",
          ],

          "tools-shapes": [
            "./src/tools/CircleTool",
            "./src/tools/SquareTool",
            "./src/tools/PolygonTool",
          ],

          "tools-brushes": [
            "./src/tools/BrushTool",
            "./src/brushes/BubblesBrush",
            "./src/brushes/SplatterBrush",
          ],

          "tools-effects": [
            "./src/tools/EffectsTool",
            "./src/tools/FilterTool",
            "./src/textures/NoiseTexture",
          ],
        },
      },
    },

    // Compression and optimization
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    // Asset optimization
    assetsInlineLimit: 4096, // 4kb
    cssCodeSplit: true,

    // Performance hints
    chunkSizeWarningLimit: 1000, // 1MB
  },

  // Development optimizations
  server: {
    host: true,
    port: 5173,
    open: true,
  },

  // Performance monitoring
  esbuild: {
    target: "es2015",
    drop: ["console", "debugger"], // Remove in production
  },
});
```

**Create `src/utils/LazyLoad.tsx`**:

```typescript
import React, { Suspense, lazy } from 'react';

// Lazy loading wrapper with error boundary
interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy load error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback = <div>Loading...</div>,
  errorFallback = <div>Error loading component</div>
}) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Preloading utility
export const preloadComponent = (importFunc: () => Promise<any>) => {
  const componentImport = importFunc();

  // Optionally, you can preload on mouse enter or other events
  return componentImport;
};

// Lazy load with preloading
export const lazyWithPreload = (importFunc: () => Promise<any>) => {
  const LazyComponent = lazy(importFunc);

  // Add preload method to component
  (LazyComponent as any).preload = () => preloadComponent(importFunc);

  return LazyComponent;
};

// Usage examples:
// Basic lazy loading
export const LazyToolsPanel = lazy(() => import('../components/ToolsPanel'));

// Lazy loading with preload capability
export const LazyBrushSelector = lazyWithPreload(() => import('../components/BrushSelector'));

// Preload on hover
export const PreloadOnHover: React.FC<{ children: React.ReactNode; preload: () => void }> = ({
  children,
  preload
}) => {
  return (
    <div onMouseEnter={preload}>
      {children}
    </div>
  );
};
```

### Step 6.5: Monitoring and Analytics

**Goal**: Implement performance monitoring and user analytics.

**Create `src/monitoring/MonitoringManager.ts`**:

```typescript
interface PerformanceEntry {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface UserInteraction {
  type: "tool_select" | "draw" | "save" | "load" | "error";
  tool?: string;
  duration?: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  line?: number;
  column?: number;
  timestamp: number;
  userAgent: string;
  metadata?: Record<string, any>;
}

export class MonitoringManager {
  private static instance: MonitoringManager;
  private performanceEntries: PerformanceEntry[] = [];
  private userInteractions: UserInteraction[] = [];
  private errorReports: ErrorReport[] = [];
  private sessionId: string;
  private userId?: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.setupErrorHandling();
    this.setupPerformanceObserver();
    this.startSessionTracking();
  }

  static getInstance(): MonitoringManager {
    if (!MonitoringManager.instance) {
      MonitoringManager.instance = new MonitoringManager();
    }
    return MonitoringManager.instance;
  }

  // Performance tracking
  trackPerformance(
    name: string,
    duration: number,
    metadata?: Record<string, any>,
  ): void {
    const entry: PerformanceEntry = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    this.performanceEntries.push(entry);

    // Send to analytics if critical performance issue
    if (duration > 100) {
      // Slow operation
      this.sendToAnalytics("performance_slow", entry);
    }
  }

  // User interaction tracking
  trackInteraction(interaction: Omit<UserInteraction, "timestamp">): void {
    const fullInteraction: UserInteraction = {
      ...interaction,
      timestamp: Date.now(),
    };

    this.userInteractions.push(fullInteraction);
    this.sendToAnalytics("user_interaction", fullInteraction);
  }

  // Error tracking
  trackError(error: Error, metadata?: Record<string, any>): void {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      metadata,
    };

    this.errorReports.push(errorReport);
    this.sendToAnalytics("error", errorReport);
  }

  // Custom event tracking
  trackEvent(eventName: string, properties?: Record<string, any>): void {
    this.sendToAnalytics(eventName, {
      ...properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    });
  }

  // Feature usage tracking
  trackFeatureUsage(
    feature: string,
    action: string,
    metadata?: Record<string, any>,
  ): void {
    this.trackEvent("feature_usage", {
      feature,
      action,
      ...metadata,
    });
  }

  // Performance metrics
  getPerformanceMetrics(): {
    averageFrameTime: number;
    slowOperations: PerformanceEntry[];
    memoryUsage?: number;
    bundleSize?: number;
  } {
    const frameTimes = this.performanceEntries
      .filter((entry) => entry.name === "frame_time")
      .map((entry) => entry.duration);

    const averageFrameTime =
      frameTimes.length > 0
        ? frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
        : 0;

    const slowOperations = this.performanceEntries
      .filter((entry) => entry.duration > 50)
      .sort((a, b) => b.duration - a.duration);

    const metrics = {
      averageFrameTime,
      slowOperations,
    } as any;

    // Add memory usage if available
    if ("memory" in performance) {
      metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }

    return metrics;
  }

  // Session management
  setUserId(userId: string): void {
    this.userId = userId;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // Data export for debugging
  exportData(): {
    sessionId: string;
    userId?: string;
    performance: PerformanceEntry[];
    interactions: UserInteraction[];
    errors: ErrorReport[];
    metrics: any;
  } {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      performance: this.performanceEntries,
      interactions: this.userInteractions,
      errors: this.errorReports,
      metrics: this.getPerformanceMetrics(),
    };
  }

  private setupErrorHandling(): void {
    // Global error handler
    window.addEventListener("error", (event) => {
      this.trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.trackError(
        new Error(`Unhandled promise rejection: ${event.reason}`),
        {
          type: "unhandled_promise_rejection",
        },
      );
    });

    // React error boundary integration
    window.addEventListener("react-error", (event: any) => {
      this.trackError(event.detail.error, {
        componentStack: event.detail.componentStack,
        type: "react_error",
      });
    });
  }

  private setupPerformanceObserver(): void {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry) => {
          this.trackPerformance(entry.name, entry.duration, {
            entryType: entry.entryType,
            startTime: entry.startTime,
          });
        });
      });

      observer.observe({
        entryTypes: ["measure", "navigation", "resource", "paint"],
      });
    }
  }

  private startSessionTracking(): void {
    // Track session start
    this.trackEvent("session_start", {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });

    // Track session end
    window.addEventListener("beforeunload", () => {
      this.trackEvent("session_end", {
        duration: Date.now() - parseInt(this.sessionId),
        interactions: this.userInteractions.length,
        errors: this.errorReports.length,
      });
    });

    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      this.trackEvent(document.hidden ? "page_hidden" : "page_visible", {
        timestamp: Date.now(),
      });
    });
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendToAnalytics(eventType: string, data: any): Promise<void> {
    // Only send analytics in production or when explicitly enabled
    if (
      process.env.NODE_ENV !== "production" &&
      !window.localStorage.getItem("kidpix-analytics-debug")
    ) {
      console.log("Analytics (debug):", eventType, data);
      return;
    }

    try {
      // Send to your analytics service
      await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType,
          data,
          sessionId: this.sessionId,
          userId: this.userId,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.error("Failed to send analytics:", error);
    }
  }
}
```

### Step 6.6: Testing and Quality Assurance

**Goal**: Comprehensive testing strategy for production readiness.

**Create `src/testing/TestUtils.tsx`**:

```typescript
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { KidPixProvider } from '../contexts/KidPixContext';
import { AccessibilityManager } from '../accessibility/AccessibilityManager';

// Mock canvas context for testing
export const mockCanvasContext = () => {
  const mockCtx = {
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => ({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1
    })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => ({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1
    })),
    drawImage: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    arc: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    scale: jest.fn(),
    setTransform: jest.fn(),
    createPattern: jest.fn(() => ({})),
    createLinearGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    })),
    createRadialGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    }))
  };

  HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCtx);
  return mockCtx;
};

// Mock Web Audio API
export const mockWebAudio = () => {
  const mockAudioContext = {
    createBufferSource: jest.fn(() => ({
      buffer: null,
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      onended: null
    })),
    createGain: jest.fn(() => ({
      gain: {
        setValueAtTime: jest.fn(),
        linearRampToValueAtTime: jest.fn(),
        value: 1
      },
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

  return mockAudioContext;
};

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });

  (global as any).IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};

// Test wrapper with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: any;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialState, ...renderOptions } = options;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <KidPixProvider>
        {children}
      </KidPixProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Performance testing utilities
export const measurePerformance = async (
  fn: () => Promise<void> | void,
  iterations = 100
): Promise<{
  average: number;
  min: number;
  max: number;
  total: number;
}> => {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }

  const total = times.reduce((sum, time) => sum + time, 0);
  const average = total / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  return { average, min, max, total };
};

// Accessibility testing helpers
export const checkAccessibility = async (container: HTMLElement): Promise<{
  violations: any[];
  passes: any[];
}> => {
  // Mock axe-core for testing
  const axe = await import('axe-core');
  const results = await axe.run(container);

  return {
    violations: results.violations,
    passes: results.passes
  };
};

// Visual regression testing helpers
export const captureScreenshot = async (element: HTMLElement): Promise<string> => {
  // Mock implementation - in real scenario you'd use a proper screenshot library
  return Promise.resolve('mock-screenshot-data');
};

export const compareScreenshots = (
  baseline: string,
  current: string,
  threshold = 0.1
): { match: boolean; difference: number } => {
  // Mock implementation
  return { match: true, difference: 0 };
};

// Test data generators
export const generateMockDrawingData = (pointCount = 10) => {
  const points = [];
  for (let i = 0; i < pointCount; i++) {
    points.push({
      x: Math.random() * 640,
      y: Math.random() * 480,
      pressure: Math.random(),
      timestamp: Date.now() + i
    });
  }
  return points;
};

export const generateMockToolConfig = (overrides = {}) => ({
  name: 'Test Tool',
  icon: '🧪',
  category: 'basic' as const,
  cursor: 'crosshair',
  sounds: {
    start: 'test-sound.wav'
  },
  ...overrides
});

// Setup and teardown helpers
export const setupTestEnvironment = () => {
  // Mock all necessary APIs
  mockCanvasContext();
  mockWebAudio();
  mockIntersectionObserver();

  // Initialize accessibility manager
  AccessibilityManager.getInstance();

  // Suppress console warnings in tests
  const originalWarn = console.warn;
  console.warn = jest.fn();

  return () => {
    console.warn = originalWarn;
    jest.clearAllMocks();
  };
};
```

## Background & Context

### Progressive Web Apps (PWAs)

**What is a PWA?**: A web application that provides native app-like experiences using modern web capabilities.

**Key PWA Features**:

- **Service Workers**: Background scripts for offline functionality
- **Web App Manifest**: Metadata for installation and app behavior
- **HTTPS**: Required for security and PWA features
- **Responsive Design**: Works on all devices and screen sizes

**Service Worker Strategies**:

```javascript
// Cache First (good for static assets)
async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached || fetch(request);
}

// Network First (good for API calls)
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    // Cache successful responses
    return response;
  } catch (error) {
    return caches.match(request);
  }
}

// Stale While Revalidate (best of both worlds)
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then((response) => {
    cache.put(request, response.clone());
    return response;
  });

  return cached || fetchPromise;
}
```

**Web App Manifest Benefits**:

- App-like installation experience
- Splash screen customization
- Orientation control
- Display mode options (fullscreen, standalone, minimal-ui)

### Web Accessibility (A11Y)

**WCAG 2.1 Guidelines**:

- **Perceivable**: Information must be presentable in ways users can perceive
- **Operable**: Interface components must be operable
- **Understandable**: Information and UI operation must be understandable
- **Robust**: Content must be robust enough for various assistive technologies

**Key Accessibility Features**:

```html
<!-- Semantic HTML -->
<button aria-label="Save drawing" aria-describedby="save-help">💾 Save</button>
<div id="save-help">Saves your current drawing to local storage</div>

<!-- Keyboard navigation -->
<div role="toolbar" aria-label="Drawing tools">
  <button role="button" tabindex="0" aria-pressed="false">Pencil</button>
  <button role="button" tabindex="-1" aria-pressed="false">Brush</button>
</div>

<!-- Live regions for screen readers -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  <!-- Dynamic announcements -->
</div>

<!-- Canvas accessibility -->
<canvas role="img" aria-label="Drawing canvas" tabindex="0">
  <!-- Fallback content -->
  <p>Interactive drawing canvas. Use keyboard shortcuts to draw.</p>
</canvas>
```

**Screen Reader Support**:

```typescript
// Announce tool changes
const announcer = document.querySelector("[aria-live]");
announcer.textContent = `Selected ${toolName}`;

// Describe canvas content
canvas.setAttribute(
  "aria-label",
  `Drawing with ${brushCount} brush strokes using ${toolName}`,
);

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target === canvas) {
    // Activate drawing at canvas center
    simulateClick(canvas.width / 2, canvas.height / 2);
  }
});
```

### Performance Optimization

**Bundle Analysis and Optimization**:

```typescript
// Code splitting by route
const LazyHome = lazy(() => import("./components/Home"));
const LazyGallery = lazy(() => import("./components/Gallery"));

// Code splitting by feature
const LazyAdvancedTools = lazy(() =>
  import("./components/AdvancedTools").then((module) => ({
    default: module.AdvancedTools,
  })),
);

// Dynamic imports for conditional features
const loadImageEditor = async () => {
  if (userHasPremium) {
    const { ImageEditor } = await import("./components/ImageEditor");
    return ImageEditor;
  }
  return null;
};
```

**Canvas Performance**:

```typescript
// Dirty rectangle optimization
const dirtyRects: DOMRect[] = [];

function markDirty(x: number, y: number, width: number, height: number) {
  dirtyRects.push(new DOMRect(x, y, width, height));
}

function redraw(ctx: CanvasRenderingContext2D) {
  dirtyRects.forEach((rect) => {
    ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    // Redraw only affected area
    drawInRegion(ctx, rect);
  });
  dirtyRects.length = 0;
}

// OffscreenCanvas for background processing
const offscreen = new OffscreenCanvas(800, 600);
const offscreenCtx = offscreen.getContext("2d");

// Process expensive operations off main thread
const worker = new Worker("canvas-worker.js");
worker.postMessage({ canvas: offscreen }, [offscreen]);
```

**Memory Management**:

```typescript
// Canvas cleanup
function cleanupCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  ctx?.clearRect(0, 0, canvas.width, canvas.height);

  // Reset canvas size to free memory
  canvas.width = 1;
  canvas.height = 1;
  canvas.width = originalWidth;
  canvas.height = originalHeight;
}

// Audio cleanup
function cleanupAudio(audioBuffer: AudioBuffer) {
  // AudioBuffers can't be explicitly freed, but remove references
  audioBuffer = null;

  // Force garbage collection if available
  if ("gc" in window) {
    (window as any).gc();
  }
}

// Event listener cleanup
class ComponentManager {
  private cleanupFunctions: (() => void)[] = [];

  addCleanup(cleanup: () => void) {
    this.cleanupFunctions.push(cleanup);
  }

  cleanup() {
    this.cleanupFunctions.forEach((fn) => fn());
    this.cleanupFunctions = [];
  }
}
```

### Monitoring and Analytics

**Performance Metrics**:

```typescript
// Core Web Vitals
function measureWebVitals() {
  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log("LCP:", lastEntry.startTime);
  }).observe({ type: "largest-contentful-paint", buffered: true });

  // First Input Delay
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      console.log("FID:", entry.processingStart - entry.startTime);
    });
  }).observe({ type: "first-input", buffered: true });

  // Cumulative Layout Shift
  new PerformanceObserver((list) => {
    let clsValue = 0;
    list.getEntries().forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    console.log("CLS:", clsValue);
  }).observe({ type: "layout-shift", buffered: true });
}
```

**User Behavior Analytics**:

```typescript
// Tool usage analytics
function trackToolUsage(toolName: string, duration: number) {
  analytics.track("tool_used", {
    tool: toolName,
    duration,
    timestamp: Date.now(),
    sessionId: getSessionId(),
  });
}

// Canvas interaction heatmap
function trackCanvasInteraction(x: number, y: number) {
  // Normalize coordinates to percentage
  const normalizedX = (x / canvas.width) * 100;
  const normalizedY = (y / canvas.height) * 100;

  analytics.track("canvas_interaction", {
    x: normalizedX,
    y: normalizedY,
    tool: currentTool,
    timestamp: Date.now(),
  });
}

// Error tracking with context
function trackErrorWithContext(error: Error) {
  analytics.track("error", {
    message: error.message,
    stack: error.stack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
    context: {
      currentTool,
      canvasSize: { width: canvas.width, height: canvas.height },
      memoryUsage: getMemoryUsage(),
    },
  });
}
```

## Practical Examples

### Example 1: Complete PWA Integration

```typescript
// PWA App Component
const PWAApp: React.FC = () => {
  const { isInstallable, isOnline, updateAvailable, installApp, reloadApp } = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    if (isInstallable && !localStorage.getItem('install-prompt-dismissed')) {
      setShowInstallPrompt(true);
    }
  }, [isInstallable]);

  useEffect(() => {
    if (updateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [updateAvailable]);

  const handleInstall = async () => {
    const installed = await installApp();
    if (installed) {
      setShowInstallPrompt(false);
      localStorage.setItem('install-prompt-dismissed', 'true');
    }
  };

  const handleUpdate = () => {
    reloadApp();
  };

  return (
    <div className="pwa-app">
      {/* Offline indicator */}
      {!isOnline && (
        <div className="offline-banner">
          ⚠️ You're offline. Some features may not be available.
        </div>
      )}

      {/* Install prompt */}
      {showInstallPrompt && (
        <div className="install-prompt">
          <p>Install KidPix for a better experience!</p>
          <button onClick={handleInstall}>Install</button>
          <button onClick={() => setShowInstallPrompt(false)}>Dismiss</button>
        </div>
      )}

      {/* Update prompt */}
      {showUpdatePrompt && (
        <div className="update-prompt">
          <p>A new version of KidPix is available!</p>
          <button onClick={handleUpdate}>Update Now</button>
          <button onClick={() => setShowUpdatePrompt(false)}>Later</button>
        </div>
      )}

      <KidPixApp />
    </div>
  );
};
```

### Example 2: Accessibility-First Component

```typescript
// Accessible Tool Button
const AccessibleToolButton: React.FC<{
  tool: ToolConfig;
  isActive: boolean;
  onSelect: () => void;
  index: number;
}> = ({ tool, isActive, onSelect, index }) => {
  const accessibilityManager = AccessibilityManager.getInstance();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      accessibilityManager.makeToolAccessible(
        buttonRef.current,
        tool.name,
        `${tool.name} drawing tool. Press Enter or Space to select.`
      );
    }
  }, [tool, accessibilityManager]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Number key shortcuts
    if (e.key === (index + 1).toString()) {
      onSelect();
      accessibilityManager.announce(`${tool.name} selected`);
    }

    // Arrow key navigation
    const toolButtons = document.querySelectorAll('.tool-button');
    const currentIndex = Array.from(toolButtons).indexOf(e.currentTarget);

    let nextIndex = currentIndex;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % toolButtons.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + toolButtons.length) % toolButtons.length;
    }

    if (nextIndex !== currentIndex) {
      e.preventDefault();
      (toolButtons[nextIndex] as HTMLElement).focus();
    }
  };

  return (
    <button
      ref={buttonRef}
      className={`tool-button ${isActive ? 'active' : ''}`}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-pressed={isActive}
      aria-describedby={`tool-${tool.name.toLowerCase()}-desc`}
      data-testid={`tool-${tool.name.toLowerCase()}`}
    >
      <span className="tool-icon" aria-hidden="true">{tool.icon}</span>
      <span className="tool-name">{tool.name}</span>
      <span className="keyboard-shortcut" aria-hidden="true">
        {index + 1}
      </span>

      <div
        id={`tool-${tool.name.toLowerCase()}-desc`}
        className="sr-only"
      >
        Press {index + 1} to select {tool.name}.
        {tool.sounds?.start && 'Includes sound effects.'}
      </div>
    </button>
  );
};
```

### Example 3: Performance-Optimized Drawing

```typescript
// High-performance drawing component
const OptimizedCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { optimizeCanvas, optimizeDrawing } = usePerformance();
  const animationFrameRef = useRef<number>();
  const dirtyRegions = useRef<DOMRect[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      optimizeCanvas(canvas);
      startRenderLoop();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const markRegionDirty = useCallback((x: number, y: number, width: number, height: number) => {
    dirtyRegions.current.push(new DOMRect(x, y, width, height));
  }, []);

  const optimizedDraw = useCallback((ctx: CanvasRenderingContext2D) => {
    // Only redraw dirty regions
    dirtyRegions.current.forEach(region => {
      optimizeDrawing(canvasRef.current!, (ctx, dirtyRect) => {
        if (dirtyRect) {
          // Draw only in dirty region
          drawInRegion(ctx, dirtyRect);
        }
      }, region);
    });

    // Clear dirty regions
    dirtyRegions.current = [];
  }, [optimizeDrawing]);

  const startRenderLoop = useCallback(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (ctx && dirtyRegions.current.length > 0) {
        optimizedDraw(ctx);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
  }, [optimizedDraw]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Mark brush area as dirty
    const brushSize = 20; // Get from tool state
    markRegionDirty(
      x - brushSize / 2,
      y - brushSize / 2,
      brushSize,
      brushSize
    );
  }, [markRegionDirty]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onMouseMove={handleMouseMove}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

function drawInRegion(ctx: CanvasRenderingContext2D, region: DOMRect) {
  // Efficient drawing within specified region
  ctx.save();
  ctx.beginPath();
  ctx.rect(region.x, region.y, region.width, region.height);
  ctx.clip();

  // Draw your content here
  // Only pixels within the clipped region will be affected

  ctx.restore();
}
```

## Verification & Testing

### Comprehensive Test Suite

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run E2E tests
yarn test:e2e

# Run accessibility tests
yarn test:a11y

# Run performance tests
yarn test:performance

# Visual regression tests
yarn test:visual
```

### PWA Testing

```bash
# Test PWA features with Lighthouse
npx lighthouse http://localhost:5173 --chrome-flags="--headless" --output=html --output-path=./lighthouse-report.html

# Test offline functionality
npx playwright test --grep "offline"

# Test installation flow
npx playwright test --grep "install"
```

### Accessibility Testing

```bash
# Create accessibility test
cat > src/__tests__/accessibility.test.tsx << 'EOF'
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { KidPixApp } from '../App';

expect.extend(toHaveNoViolations);

test('app has no accessibility violations', async () => {
  const { container } = render(<KidPixApp />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('keyboard navigation works', async () => {
  const { getByTestId } = render(<KidPixApp />);

  const pencilTool = getByTestId('tool-pencil');
  pencilTool.focus();

  fireEvent.keyDown(pencilTool, { key: 'ArrowRight' });

  const brushTool = getByTestId('tool-brush');
  expect(brushTool).toHaveFocus();
});
EOF
```

### Performance Testing

```bash
# Create performance test
cat > src/__tests__/performance.test.ts << 'EOF'
import { measurePerformance } from '../testing/TestUtils';
import { PencilTool } from '../tools/PencilTool';

test('pencil tool performs within limits', async () => {
  const tool = new PencilTool(mockState, mockDispatch);
  const canvas = document.createElement('canvas');

  const results = await measurePerformance(async () => {
    tool.onMouseDown(mockEvent, canvas);
    tool.onMouseMove(mockEvent, canvas);
    tool.onMouseUp(mockEvent, canvas);
  }, 100);

  expect(results.average).toBeLessThan(16); // 60fps
  expect(results.max).toBeLessThan(33); // 30fps worst case
});
EOF
```

## Troubleshooting

### PWA Issues

**Problem**: Service worker not updating

```javascript
// Force service worker update
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.update();
    });
  });
}
```

**Problem**: Manifest not being recognized

```json
// Ensure proper manifest structure
{
  "name": "KidPix",
  "short_name": "KidPix",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### Performance Issues

**Problem**: Canvas drawing is slow

```typescript
// Use multiple canvas layers
const backgroundCanvas = document.createElement("canvas");
const drawingCanvas = document.createElement("canvas");

// Only redraw what changed
function optimizedRedraw() {
  if (backgroundChanged) {
    redrawBackground(backgroundCanvas);
    backgroundChanged = false;
  }

  if (drawingChanged) {
    redrawDrawing(drawingCanvas);
    drawingChanged = false;
  }
}
```

**Problem**: Memory leaks

```typescript
// Proper cleanup
useEffect(() => {
  const cleanup = [];

  // Add event listeners
  const handleResize = () => resizeCanvas();
  window.addEventListener("resize", handleResize);
  cleanup.push(() => window.removeEventListener("resize", handleResize));

  return () => cleanup.forEach((fn) => fn());
}, []);
```

### Accessibility Issues

**Problem**: Screen reader not announcing changes

```typescript
// Ensure proper ARIA live regions
const announcer = document.querySelector('[aria-live="polite"]');
if (announcer) {
  announcer.textContent = "Tool changed to pencil";

  // Clear after announcement
  setTimeout(() => {
    announcer.textContent = "";
  }, 1000);
}
```

**Problem**: Keyboard navigation not working

```typescript
// Ensure proper focus management
const focusableElements = container.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
);

const firstElement = focusableElements[0] as HTMLElement;
const lastElement = focusableElements[
  focusableElements.length - 1
] as HTMLElement;

// Trap focus within container
container.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
});
```

## Deployment & Monitoring

### Production Deployment

```bash
# Build for production
yarn build

# Analyze bundle
yarn build:analyze

# Deploy to CDN
aws s3 sync dist/ s3://kidpix-app --delete
aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
```

### Monitoring Setup

```bash
# Create monitoring dashboard
cat > monitoring-dashboard.json << 'EOF'
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["KidPix", "PageLoadTime"],
          ["KidPix", "FrameRate"],
          ["KidPix", "ErrorRate"]
        ],
        "period": 300,
        "stat": "Average",
        "region": "us-east-1",
        "title": "Performance Metrics"
      }
    }
  ]
}
EOF
```

### Success Metrics

After completing Phase 6, your KidPix application should achieve:

- **Performance**: 60+ FPS drawing, <3s load time
- **Accessibility**: WCAG 2.1 AA compliance
- **PWA Score**: 90+ Lighthouse PWA score
- **Bundle Size**: <2MB initial load
- **Test Coverage**: >90% code coverage
- **Error Rate**: <0.1% user sessions

**Final Steps**:

1. **Production deployment**:

   ```bash
   git add .
   git commit -m "feat(production): complete PWA implementation with accessibility and monitoring"
   git push origin main
   ```

2. **Launch monitoring**:

   ```bash
   # Set up error tracking
   # Configure performance monitoring
   # Enable user analytics
   ```

3. **Celebrate!** 🎉 You've successfully migrated KidPix to a modern React + TypeScript PWA!

---

**Related Documentation**:

- [Overview](./overview.md) - Complete migration plan
- [Phase 5](./phase-5-advanced-features.md) - Advanced features
- **You're done!** KidPix is now a modern, accessible, performant web application!
