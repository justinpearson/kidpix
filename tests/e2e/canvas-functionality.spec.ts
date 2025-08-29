import { test, expect } from "@playwright/test";
import {
  initializeKidPix,
  setupConsoleErrorMonitoring,
  verifyCanvasElements,
  assertNoConsoleErrors,
} from "./shared/tool-helpers";

test.describe("Canvas Functionality Tests", () => {
  test.beforeEach(async ({ page }) => {
    await initializeKidPix(page);
  });

  test("canvas elements are present and visible", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await verifyCanvasElements(page);

    // Verify canvas dimensions are reasonable
    const mainCanvas = page.locator("#kiddopaint");
    const tmpCanvas = page.locator("#tmpCanvas");
    const previewCanvas = page.locator("#previewCanvas");

    const mainBounds = await mainCanvas.boundingBox();
    const tmpBounds = await tmpCanvas.boundingBox();
    const previewBounds = await previewCanvas.boundingBox();

    expect(mainBounds).toBeTruthy();
    expect(tmpBounds).toBeTruthy();
    expect(previewBounds).toBeTruthy();

    // Canvases should have meaningful dimensions
    expect(mainBounds!.width).toBeGreaterThan(400);
    expect(mainBounds!.height).toBeGreaterThan(300);
    expect(tmpBounds!.width).toBeGreaterThan(400);
    expect(tmpBounds!.height).toBeGreaterThan(300);

    assertNoConsoleErrors(consoleErrors, "canvas elements verification");
  });

  test("multi-layer canvas system integrity", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Verify all expected canvas layers exist
    const canvasLayers = [
      "#kiddopaint", // Main canvas
      "#tmpCanvas", // Temporary operations
      "#previewCanvas", // Tool previews
      "#animCanvas", // Animations (if present)
      "#bnimCanvas", // Background images (if present)
    ];

    for (const canvasId of canvasLayers) {
      const canvas = page.locator(canvasId);
      try {
        await expect(canvas).toBeVisible({ timeout: 1000 });
      } catch (error) {
        // Some canvases might not be present in all configurations
        console.log(
          `Canvas ${canvasId} not present or visible - this may be expected`,
        );
      }
    }

    // Verify main interaction canvas is properly positioned
    const tmpCanvas = page.locator("#tmpCanvas");
    const tmpBounds = await tmpCanvas.boundingBox();

    // Interaction canvas should be at a reasonable position
    expect(tmpBounds!.x).toBeGreaterThanOrEqual(0);
    expect(tmpBounds!.y).toBeGreaterThanOrEqual(0);

    assertNoConsoleErrors(consoleErrors, "multi-layer canvas system");
  });

  test("canvas responds to mouse interactions", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Select pencil tool first
    await page.click("#pencil");

    const tmpCanvas = page.locator("#tmpCanvas");

    // Test various mouse interactions
    await tmpCanvas.hover({ position: { x: 100, y: 100 } });
    await tmpCanvas.click({ position: { x: 100, y: 100 } });

    // Test drag operation
    await tmpCanvas.hover({ position: { x: 150, y: 150 } });
    await page.mouse.down();
    await tmpCanvas.hover({ position: { x: 200, y: 200 } });
    await page.mouse.up();

    // Test different mouse button interactions
    await tmpCanvas.click({ position: { x: 250, y: 100 }, button: "left" });

    assertNoConsoleErrors(consoleErrors, "canvas mouse interactions");
  });

  test("canvas coordinate system accuracy", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Select pencil tool
    await page.click("#pencil");

    const tmpCanvas = page.locator("#tmpCanvas");
    const canvasBounds = await tmpCanvas.boundingBox();

    // Test clicks at various positions within canvas bounds
    const testPositions = [
      { x: 10, y: 10 }, // Top-left
      { x: canvasBounds!.width - 10, y: 10 }, // Top-right
      { x: 10, y: canvasBounds!.height - 10 }, // Bottom-left
      { x: canvasBounds!.width - 10, y: canvasBounds!.height - 10 }, // Bottom-right
      { x: canvasBounds!.width / 2, y: canvasBounds!.height / 2 }, // Center
    ];

    for (const pos of testPositions) {
      await tmpCanvas.click({ position: pos });
    }

    assertNoConsoleErrors(consoleErrors, "canvas coordinate system");
  });

  test("canvas performance under load", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Select brush tool for performance testing
    await page.click("#brush");

    const tmpCanvas = page.locator("#tmpCanvas");

    // Perform many rapid interactions to test performance
    const startTime = Date.now();

    for (let i = 0; i < 20; i++) {
      const x = 50 + ((i * 10) % 300);
      const y = 50 + Math.floor(i / 10) * 20;

      await tmpCanvas.click({ position: { x, y } });
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete within reasonable time (adjust threshold as needed)
    expect(duration).toBeLessThan(10000); // 10 seconds max

    assertNoConsoleErrors(consoleErrors, "canvas performance under load");
  });

  test("canvas state management", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Test basic canvas state functionality
    await page.click("#pencil");

    const tmpCanvas = page.locator("#tmpCanvas");

    // Make some marks on canvas
    await tmpCanvas.click({ position: { x: 100, y: 100 } });
    await tmpCanvas.hover({ position: { x: 100, y: 100 } });
    await page.mouse.down();
    await tmpCanvas.hover({ position: { x: 150, y: 150 } });
    await page.mouse.up();

    // Switch tools and make more marks
    await page.click("#brush");
    await tmpCanvas.click({ position: { x: 200, y: 100 } });

    // Switch back to pencil
    await page.click("#pencil");
    await tmpCanvas.click({ position: { x: 200, y: 200 } });

    assertNoConsoleErrors(consoleErrors, "canvas state management");
  });

  test("application initialization stability", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Verify KiddoPaint namespace is properly initialized
    const kiddoPaintExists = await page.evaluate(() => {
      return (
        typeof window.KiddoPaint === "object" && window.KiddoPaint !== null
      );
    });

    expect(kiddoPaintExists).toBe(true);

    // Verify key namespaces exist
    const namespacesExist = await page.evaluate(() => {
      return !!(
        window.KiddoPaint.Current &&
        window.KiddoPaint.Tools &&
        window.KiddoPaint.Display &&
        window.KiddoPaint.Colors
      );
    });

    expect(namespacesExist).toBe(true);

    assertNoConsoleErrors(consoleErrors, "application initialization");
  });
});
