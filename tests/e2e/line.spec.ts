import { test, expect } from "@playwright/test";
import {
  initializeKidPix,
  setupConsoleErrorMonitoring,
  selectTool,
  getSubtools,
  selectSubtool,
  testCanvasClick,
  testCanvasDrag,
  assertNoConsoleErrors,
  testToolSwitchingPersistence,
} from "./shared/tool-helpers";
import { getToolDefinition } from "./shared/test-fixtures";

const TOOL_ID = "line";
const toolDef = getToolDefinition(TOOL_ID)!;

test.describe("Line Tool Tests", () => {
  test.beforeEach(async ({ page }) => {
    await initializeKidPix(page);
  });

  test.skip("basic tool selection and highlighting", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    // Verify subtools appear
    const subtoolButtons = await getSubtools(page);

    // Verify both default size (index 1) and texture (index 7) are highlighted
    await expect(subtoolButtons.nth(1)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );
    await expect(subtoolButtons.nth(7)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    assertNoConsoleErrors(consoleErrors, "tool selection");
  });

  test("multi-selection support (size + texture)", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);
    const subtoolButtons = await getSubtools(page);

    // Click a different size button (Size 1, index 0)
    await selectSubtool(page, 0);

    // Size 1 should now be highlighted, Size 5 should not
    await expect(subtoolButtons.nth(0)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );
    await expect(subtoolButtons.nth(1)).not.toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    // But texture selection should remain unchanged (solid texture, index 7)
    await expect(subtoolButtons.nth(7)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    // Click a different texture button (index 8)
    await selectSubtool(page, 8);

    // New texture should be selected, old texture should not
    await expect(subtoolButtons.nth(8)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );
    await expect(subtoolButtons.nth(7)).not.toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    // Size selection should remain unchanged
    await expect(subtoolButtons.nth(0)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    assertNoConsoleErrors(consoleErrors, "multi-selection");
  });

  test("line drawing on canvas", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    // Test straight line drawing with different positions
    await testCanvasDrag(
      page,
      { x: 100, y: 100 },
      { x: 200, y: 100 }, // horizontal line
    );

    await testCanvasDrag(
      page,
      { x: 150, y: 120 },
      { x: 150, y: 220 }, // vertical line
    );

    await testCanvasDrag(
      page,
      { x: 100, y: 250 },
      { x: 200, y: 350 }, // diagonal line
    );

    assertNoConsoleErrors(consoleErrors, "line drawing");
  });

  test("different line sizes", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);
    const subtoolButtons = await getSubtools(page);
    const subtoolCount = await subtoolButtons.count();

    // Test first few size options (typically sizes 1, 5, 10, 20)
    const sizeTests = Math.min(4, subtoolCount);
    for (let i = 0; i < sizeTests; i++) {
      await selectSubtool(page, i);

      // Draw a test line with this size
      await testCanvasDrag(
        page,
        { x: 50, y: 100 + i * 40 },
        { x: 250, y: 100 + i * 40 },
      );
    }

    assertNoConsoleErrors(consoleErrors, "different line sizes");
  });

  test.skip("tool persistence after switching", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    // Select alternate subtools (different size and texture)
    if (toolDef.alternateSubtoolIndices) {
      for (const index of toolDef.alternateSubtoolIndices) {
        await selectSubtool(page, index);
      }
    }

    // Switch away and back
    await testToolSwitchingPersistence(page, TOOL_ID, "pencil");

    // Verify alternate selections are still active
    const subtoolButtons = await getSubtools(page);
    if (toolDef.alternateSubtoolIndices) {
      for (const index of toolDef.alternateSubtoolIndices) {
        await expect(subtoolButtons.nth(index)).toHaveCSS(
          "border-color",
          "rgb(255, 0, 0)",
        );
      }
    }

    assertNoConsoleErrors(consoleErrors, "tool persistence");
  });

  test("comprehensive line workflow", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    // Test various line patterns
    const patterns = [
      // Horizontal lines with different sizes
      { start: { x: 50, y: 50 }, end: { x: 150, y: 50 }, size: 0 },
      { start: { x: 50, y: 80 }, end: { x: 150, y: 80 }, size: 1 },
      { start: { x: 50, y: 120 }, end: { x: 150, y: 120 }, size: 2 },
    ];

    for (const pattern of patterns) {
      await selectSubtool(page, pattern.size);
      await testCanvasDrag(page, pattern.start, pattern.end);
    }

    // Test different textures if available
    const subtoolButtons = await getSubtools(page);
    const subtoolCount = await subtoolButtons.count();

    if (subtoolCount > 7) {
      // Test texture at index 8 (if available)
      await selectSubtool(page, 8);
      await testCanvasDrag(page, { x: 200, y: 50 }, { x: 300, y: 150 });
    }

    assertNoConsoleErrors(consoleErrors, "comprehensive workflow");
  });
});
