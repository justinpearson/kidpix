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

const TOOL_ID = "truck";
const toolDef = getToolDefinition(TOOL_ID)!;

test.describe("Moving Van Tool Tests", () => {
  test.beforeEach(async ({ page }) => {
    await initializeKidPix(page);
  });

  test("basic tool selection and highlighting", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);
    const subtoolButtons = await getSubtools(page);
    await expect(subtoolButtons.nth(0)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );
    assertNoConsoleErrors(consoleErrors, "tool selection");
  });

  test("moving van functionality", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);
    const subtoolButtons = await getSubtools(page);
    const subtoolCount = await subtoolButtons.count();

    // Test different van types with both clicks and drags
    for (let i = 0; i < Math.min(4, subtoolCount); i++) {
      await selectSubtool(page, i);
      await testCanvasClick(page, { x: 100 + i * 80, y: 100 });
      await testCanvasDrag(
        page,
        { x: 100 + i * 80, y: 150 },
        { x: 150 + i * 80, y: 200 },
      );
    }
    assertNoConsoleErrors(consoleErrors, "moving van functionality");
  });

  test("tool persistence after switching", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);
    if (toolDef.alternateSubtoolIndices) {
      await selectSubtool(page, toolDef.alternateSubtoolIndices[0]);
    }
    await testToolSwitchingPersistence(page, TOOL_ID, "pencil");
    const subtoolButtons = await getSubtools(page);
    if (toolDef.alternateSubtoolIndices) {
      await expect(
        subtoolButtons.nth(toolDef.alternateSubtoolIndices[0]),
      ).toHaveCSS("border-color", "rgb(255, 0, 0)");
    }
    assertNoConsoleErrors(consoleErrors, "tool persistence");
  });
});
