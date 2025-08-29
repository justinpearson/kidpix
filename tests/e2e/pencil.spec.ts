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

const TOOL_ID = "pencil";
const toolDef = getToolDefinition(TOOL_ID)!;

test.describe("Wacky Pencil Tool Tests", () => {
  test.beforeEach(async ({ page }) => {
    await initializeKidPix(page);
  });

  test("basic tool selection and highlighting", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    // Verify subtools appear
    const subtoolButtons = await getSubtools(page);

    // Verify default subtools are highlighted (size 3, solid texture)
    if (toolDef.defaultSubtoolIndices) {
      for (const index of toolDef.defaultSubtoolIndices) {
        await expect(subtoolButtons.nth(index)).toHaveCSS(
          "border-color",
          "rgb(255, 0, 0)",
        );
      }
    }

    assertNoConsoleErrors(consoleErrors, "tool selection");
  });

  test("multi-selection support (size + texture)", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);
    const subtoolButtons = await getSubtools(page);

    // Select different size (size 1, index 0)
    await selectSubtool(page, 0);

    // Size 1 should be highlighted, Size 3 should not
    await expect(subtoolButtons.nth(0)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );
    await expect(subtoolButtons.nth(2)).not.toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    // But texture selection should remain unchanged (solid texture, index 7)
    await expect(subtoolButtons.nth(7)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    // Select different texture (index 8)
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

  test("canvas interaction without console errors", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    // Test canvas click
    await testCanvasClick(page);
    assertNoConsoleErrors(consoleErrors, "canvas click");

    // Test canvas drag
    await testCanvasDrag(page);
    assertNoConsoleErrors(consoleErrors, "canvas drag");
  });

  test("tool persistence after switching", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    // Select alternate subtools
    if (toolDef.alternateSubtoolIndices) {
      for (const index of toolDef.alternateSubtoolIndices) {
        await selectSubtool(page, index);
      }
    }

    // Switch away and back
    await testToolSwitchingPersistence(page, TOOL_ID, "line");

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

  test("comprehensive workflow test", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Select tool
    await selectTool(page, TOOL_ID);

    // Test different size and texture combinations
    const subtoolButtons = await getSubtools(page);
    const subtoolCount = await subtoolButtons.count();

    // Test first few sizes (if available)
    const sizeTests = Math.min(4, subtoolCount);
    for (let i = 0; i < sizeTests; i++) {
      await selectSubtool(page, i);
      await testCanvasClick(page, { x: 100 + i * 50, y: 100 });
    }

    // Test different textures (typically start around index 7)
    if (subtoolCount > 7) {
      const textureStart = 7;
      const textureTests = Math.min(3, subtoolCount - textureStart);
      for (let i = 0; i < textureTests; i++) {
        await selectSubtool(page, textureStart + i);
        await testCanvasDrag(
          page,
          { x: 100 + i * 50, y: 200 },
          { x: 150 + i * 50, y: 250 },
        );
      }
    }

    assertNoConsoleErrors(consoleErrors, "comprehensive workflow");
  });
});
