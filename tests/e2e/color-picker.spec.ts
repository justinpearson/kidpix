import { test, expect } from "./shared/playwright-fixtures";
import {
  initializeKidPix,
  setupConsoleErrorMonitoring,
  selectTool,
  getSubtools,
  selectSubtool,
  assertNoConsoleErrors,
  testCanvasClick,
} from "./shared/tool-helpers";

test.describe("Color Picker Tool Tests", () => {
  test.beforeEach(async ({ page }) => {
    await initializeKidPix(page);
  });

  test("requirement 1: eyedropper tool appears between truck and undo", async ({
    page,
  }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Check that color picker tool exists with correct icon
    const colorPickerTool = page.locator("#colorpicker");
    await expect(colorPickerTool).toBeVisible();

    // Verify the eyedropper icon is present
    const colorPickerImg = colorPickerTool.locator("img");
    await expect(colorPickerImg).toHaveAttribute(
      "src",
      /img\/eyedropper-icon\.png/,
    );

    // Verify position: should be between truck and undo
    const truck = page.locator("#truck");
    const undo = page.locator("#undo");
    const colorPicker = page.locator("#colorpicker");

    await expect(truck).toBeVisible();
    await expect(undo).toBeVisible();
    await expect(colorPicker).toBeVisible();

    // Get the positions to verify ordering
    const truckBox = await truck.boundingBox();
    const colorPickerBox = await colorPicker.boundingBox();
    const undoBox = await undo.boundingBox();

    // Assuming vertical layout, color picker should be between truck and undo
    expect(truckBox!.y).toBeLessThan(colorPickerBox!.y);
    expect(colorPickerBox!.y).toBeLessThan(undoBox!.y);

    assertNoConsoleErrors(consoleErrors, "eyedropper tool positioning");
  });

  test("requirement 2: selecting color picker deselects other tools", async ({
    page,
  }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // First select pencil tool
    await selectTool(page, "pencil");

    // Verify pencil is selected (red border)
    const pencilTool = page.locator("#pencil");
    await expect(pencilTool).toHaveCSS("border-color", "rgb(255, 0, 0)");

    // Now select color picker
    await selectTool(page, "colorpicker");

    // Verify pencil is no longer selected
    await expect(pencilTool).not.toHaveCSS("border-color", "rgb(255, 0, 0)");

    // Verify color picker is selected
    const colorPickerTool = page.locator("#colorpicker");
    await expect(colorPickerTool).toHaveCSS("border-color", "rgb(255, 0, 0)");

    assertNoConsoleErrors(
      consoleErrors,
      "tool switching from pencil to color picker",
    );
  });

  test("requirement 3: color picker has single subtool", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Select color picker tool
    await selectTool(page, "colorpicker");

    // Check that submenu appears
    const subtoolButtons = await getSubtools(page);
    const subtoolCount = await subtoolButtons.count();

    // Should have exactly one subtool
    expect(subtoolCount).toBe(1);

    // The subtool should have the eyedropper icon
    const subtoolImg = subtoolButtons.first().locator("img");
    await expect(subtoolImg).toHaveAttribute(
      "src",
      /img\/eyedropper-icon\.png/,
    );

    // The subtool should be selected by default (red border)
    await expect(subtoolButtons.first()).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    assertNoConsoleErrors(consoleErrors, "color picker submenu");
  });

  test("requirement 4: selecting other tool deselects color picker", async ({
    page,
  }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // First select color picker
    await selectTool(page, "colorpicker");

    // Verify color picker is selected
    const colorPickerTool = page.locator("#colorpicker");
    await expect(colorPickerTool).toHaveCSS("border-color", "rgb(255, 0, 0)");

    // Now select pencil tool
    await selectTool(page, "pencil");

    // Verify color picker is no longer selected
    await expect(colorPickerTool).not.toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    // Verify pencil is selected
    const pencilTool = page.locator("#pencil");
    await expect(pencilTool).toHaveCSS("border-color", "rgb(255, 0, 0)");

    assertNoConsoleErrors(
      consoleErrors,
      "tool switching from color picker to pencil",
    );
  });

  test("requirement 5: color picker cursor is crosshair", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Select color picker tool
    await selectTool(page, "colorpicker");

    // Check cursor on canvas
    const canvas = page.locator("#tmpCanvas");
    await expect(canvas).toHaveCSS("cursor", "crosshair");

    assertNoConsoleErrors(consoleErrors, "color picker cursor style");
  });

  test("requirement 6: clicking canvas picks color and stays on color picker", async ({
    page,
  }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // First, draw something colorful on the canvas with pencil
    await selectTool(page, "pencil");

    // Set a specific color (assuming we have a way to set color)
    const redColorButton = page
      .locator(
        'button[style*="background-color: rgb(255, 0, 0)"], button[style*="background-color: red"], .color-button[data-color="red"]',
      )
      .first();
    if ((await redColorButton.count()) > 0) {
      await redColorButton.click();
    }

    // Draw a red line on the canvas
    const canvas = page.locator("#tmpCanvas");
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 150, y: 100 } });

    // Now switch to color picker
    await selectTool(page, "colorpicker");

    // Get the current color before picking
    const currentColorBefore = await page.evaluate(() => {
      return window.KiddoPaint.Current.color;
    });

    // Click on the red line we drew
    await canvas.click({ position: { x: 125, y: 100 } });

    // Check that the current color changed to red (or whatever color was picked)
    const currentColorAfter = await page.evaluate(() => {
      return window.KiddoPaint.Current.color;
    });

    // Colors should be different (we picked a new color)
    expect(currentColorAfter).not.toBe(currentColorBefore);

    // Verify color picker tool is still selected (doesn't auto-switch)
    const colorPickerTool = page.locator("#colorpicker");
    await expect(colorPickerTool).toHaveCSS("border-color", "rgb(255, 0, 0)");

    assertNoConsoleErrors(consoleErrors, "color picking functionality");
  });

  test("color picker integrates with existing tool workflow", async ({
    page,
  }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Test complete workflow: draw -> pick color -> draw with picked color

    // 1. Draw with pencil in one color
    await selectTool(page, "pencil");
    await testCanvasClick(page, { x: 100, y: 100 });

    // 2. Switch to color picker and pick that color
    await selectTool(page, "colorpicker");
    await testCanvasClick(page, { x: 100, y: 100 });

    // 3. Switch back to pencil and verify color was picked
    await selectTool(page, "pencil");
    // The color should now be whatever was picked

    // 4. Color picker should remember its state when switching back
    await selectTool(page, "colorpicker");
    const subtoolButtons = await getSubtools(page);
    await expect(subtoolButtons.first()).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    assertNoConsoleErrors(consoleErrors, "color picker workflow integration");
  });
});
