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
import { WACKY_BRUSH_SUBTOOLS } from "./shared/test-fixtures";

const TOOL_ID = "brush";

test.describe("Brush Tool Tests", () => {
  test.beforeEach(async ({ page }) => {
    await initializeKidPix(page);
  });

  test("basic tool selection and highlighting", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    // Verify subtools appear
    const subtoolButtons = await getSubtools(page);

    // First brush should be highlighted by default
    await expect(subtoolButtons.nth(0)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    assertNoConsoleErrors(consoleErrors, "tool selection");
  });

  // Test each individual Wacky Brush subtool
  for (const subtool of WACKY_BRUSH_SUBTOOLS) {
    test(`${subtool.name} brush (index ${subtool.index}) works without console errors`, async ({
      page,
    }) => {
      const consoleErrors = setupConsoleErrorMonitoring(page);

      await selectTool(page, TOOL_ID);

      const subtoolButtons = await getSubtools(page);
      const subtoolCount = await subtoolButtons.count();

      // Skip test if subtool index doesn't exist
      if (subtool.index >= subtoolCount) {
        test.skip(
          `Subtool index ${subtool.index} (${subtool.name}) not available (only ${subtoolCount} subtools found)`,
        );
        return;
      }

      // Select the specific subtool
      await selectSubtool(page, subtool.index);

      // Test canvas interaction - single click
      await testCanvasClick(page, { x: 200 + subtool.index * 10, y: 200 });

      // Check for console errors after click
      if (!subtool.expectsErrors) {
        assertNoConsoleErrors(consoleErrors, `${subtool.name} click`);
      }

      // Test canvas interaction - short drag
      await testCanvasDrag(
        page,
        { x: 200 + subtool.index * 10, y: 200 },
        { x: 230 + subtool.index * 10, y: 230 },
      );

      // Final verification: No console errors during drag operation
      if (!subtool.expectsErrors) {
        assertNoConsoleErrors(consoleErrors, `${subtool.name} drag`);
      }
    });
  }

  test("Tree and Splatter Paint brushes - specific regression test", async ({
    page,
  }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    const subtoolButtons = await getSubtools(page);

    // Test Splatter Paint (index 4)
    await selectSubtool(page, 4);
    await testCanvasClick(page, { x: 150, y: 150 });
    await testCanvasDrag(page, { x: 150, y: 150 }, { x: 200, y: 200 });

    // Test Tree (index 5)
    await selectSubtool(page, 5);
    await testCanvasClick(page, { x: 300, y: 150 });
    await testCanvasDrag(page, { x: 300, y: 150 }, { x: 350, y: 200 });

    // Verify no console errors for either brush
    assertNoConsoleErrors(consoleErrors, "Tree/Splatter Paint regression");
  });

  test("brush subtool persistence test", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    const subtoolButtons = await getSubtools(page);

    // Select a specific subtool (Tree brush - index 5)
    await selectSubtool(page, 5);

    // Switch to a different tool and back
    await testToolSwitchingPersistence(page, TOOL_ID, "pencil");

    // Verify the same subtool is still selected
    const newSubtoolButtons = await getSubtools(page);
    await expect(newSubtoolButtons.nth(5)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    assertNoConsoleErrors(consoleErrors, "brush persistence");
  });

  test("multiple brush types workflow", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    const subtoolButtons = await getSubtools(page);
    const buttonCount = await subtoolButtons.count();

    // Test first 10 brush types (or all if fewer than 10)
    const testCount = Math.min(10, buttonCount);

    for (let i = 0; i < testCount; i++) {
      // Select brush subtool
      await selectSubtool(page, i);

      // Test canvas interaction with this brush
      await testCanvasClick(page, { x: 100 + i * 20, y: 100 });

      // Small drag test
      await testCanvasDrag(
        page,
        { x: 100 + i * 20, y: 100 },
        { x: 120 + i * 20, y: 120 },
      );
    }

    assertNoConsoleErrors(consoleErrors, "multiple brush types workflow");
  });

  test("brush drawing patterns", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    // Test some interesting brush patterns
    const brushTests = [
      { index: 0, name: "Dripping Paint", pattern: "dots" },
      { index: 2, name: "Concentric Circles", pattern: "circles" },
      { index: 4, name: "Splatter Paint", pattern: "splatter" },
      { index: 8, name: "Spray Paint", pattern: "spray" },
    ];

    for (const brushTest of brushTests) {
      await selectSubtool(page, brushTest.index);

      // Draw different patterns based on brush type
      if (brushTest.pattern === "dots") {
        // Single clicks for dot pattern
        await testCanvasClick(page, { x: 100, y: 100 + brushTest.index * 30 });
        await testCanvasClick(page, { x: 120, y: 100 + brushTest.index * 30 });
        await testCanvasClick(page, { x: 140, y: 100 + brushTest.index * 30 });
      } else {
        // Drag patterns for others
        await testCanvasDrag(
          page,
          { x: 100, y: 100 + brushTest.index * 30 },
          { x: 200, y: 100 + brushTest.index * 30 },
        );
      }
    }

    assertNoConsoleErrors(consoleErrors, "brush drawing patterns");
  });
});
