import { test, expect } from "./shared/playwright-fixtures";
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

const TOOL_ID = "square";
const toolDef = getToolDefinition(TOOL_ID)!;

test.describe("Rectangle Tool Tests", () => {
  test.beforeEach(async ({ page }) => {
    await initializeKidPix(page);
  });

  test("basic tool selection and highlighting", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    // Verify subtools appear
    const subtoolButtons = await getSubtools(page);

    // Default texture (None texture, index 0) should be highlighted
    await expect(subtoolButtons.nth(0)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    assertNoConsoleErrors(consoleErrors, "tool selection");
  });

  test("texture selection", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);
    const subtoolButtons = await getSubtools(page);
    const subtoolCount = await subtoolButtons.count();

    // Test different texture options
    const textureTests = Math.min(5, subtoolCount);
    for (let i = 0; i < textureTests; i++) {
      await selectSubtool(page, i);

      // Draw a rectangle with this texture
      await testCanvasDrag(
        page,
        { x: 50 + i * 60, y: 50 },
        { x: 100 + i * 60, y: 100 },
      );
    }

    assertNoConsoleErrors(consoleErrors, "texture selection");
  });

  test("rectangle drawing on canvas", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    // Test different rectangle sizes and positions
    const rectangles = [
      { start: { x: 50, y: 50 }, end: { x: 150, y: 100 } }, // wide rectangle
      { start: { x: 200, y: 50 }, end: { x: 250, y: 150 } }, // tall rectangle
      { start: { x: 100, y: 200 }, end: { x: 200, y: 300 } }, // square
      { start: { x: 250, y: 200 }, end: { x: 300, y: 220 } }, // thin rectangle
    ];

    for (const rect of rectangles) {
      await testCanvasDrag(page, rect.start, rect.end);
    }

    assertNoConsoleErrors(consoleErrors, "rectangle drawing");
  });

  test("tool persistence after switching", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    // Select alternate texture
    if (toolDef.alternateSubtoolIndices) {
      await selectSubtool(page, toolDef.alternateSubtoolIndices[0]);
    }

    // Switch away and back
    await testToolSwitchingPersistence(page, TOOL_ID, "circle");

    // Verify alternate selection is still active
    const subtoolButtons = await getSubtools(page);
    if (toolDef.alternateSubtoolIndices) {
      await expect(
        subtoolButtons.nth(toolDef.alternateSubtoolIndices[0]),
      ).toHaveCSS("border-color", "rgb(255, 0, 0)");
    }

    assertNoConsoleErrors(consoleErrors, "tool persistence");
  });

  test("comprehensive rectangle workflow", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);
    const subtoolButtons = await getSubtools(page);
    const subtoolCount = await subtoolButtons.count();

    // Test all available textures with different rectangle sizes
    for (let i = 0; i < subtoolCount; i++) {
      await selectSubtool(page, i);

      // Draw rectangles with varying sizes
      const baseX = 50 + (i % 4) * 80;
      const baseY = 50 + Math.floor(i / 4) * 80;

      await testCanvasDrag(
        page,
        { x: baseX, y: baseY },
        { x: baseX + 60, y: baseY + 40 },
      );
    }

    assertNoConsoleErrors(consoleErrors, "comprehensive rectangle workflow");
  });
});
