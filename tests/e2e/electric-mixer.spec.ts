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

const TOOL_ID = "jumble";

test.describe("Mixer Tool Tests", () => {
  test.beforeEach(async ({ page }) => {
    await initializeKidPix(page);
  });

  test("basic tool selection and highlighting", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    // Verify subtools appear
    const subtoolButtons = await getSubtools(page);

    // First effect should be highlighted by default
    await expect(subtoolButtons.nth(0)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    assertNoConsoleErrors(consoleErrors, "tool selection");
  });

  test("multiple mixer effects without console errors", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    const subtoolButtons = await getSubtools(page);
    const buttonCount = await subtoolButtons.count();

    // Test first 5 mixer effects (or all if fewer than 5)
    const testCount = Math.min(5, buttonCount);

    for (let i = 0; i < testCount; i++) {
      // Select mixer subtool
      await selectSubtool(page, i);

      // Test canvas interaction with this effect
      await testCanvasClick(page, { x: 150 + i * 30, y: 150 });
    }

    assertNoConsoleErrors(consoleErrors, "multiple mixer effects");
  });

  test("Venetian Blinds effect regression test", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    const subtoolButtons = await getSubtools(page);

    // Find and select Venetian Blinds effect (commonly at index 2)
    const venetianBlindsIndex = 2;
    await selectSubtool(page, venetianBlindsIndex);

    // Test canvas interaction that should trigger the fisherYatesArrayShuffle function
    await testCanvasClick(page, { x: 250, y: 250 });

    // This should not produce fisherYatesArrayShuffle errors
    const venetianBlindsErrors = consoleErrors.filter(
      (error) =>
        error.includes("fisherYatesArrayShuffle") &&
        error.includes("venetian-blinds"),
    );

    expect(
      venetianBlindsErrors,
      `Expected no fisherYatesArrayShuffle errors, but found: ${venetianBlindsErrors.join("; ")}`,
    ).toHaveLength(0);

    assertNoConsoleErrors(consoleErrors, "Venetian Blinds effect");
  });

  test("fisherYatesArrayShuffle function exists globally", async ({ page }) => {
    await selectTool(page, TOOL_ID);

    // This test checks that our fix actually exposes the function globally
    const functionExists = await page.evaluate(() => {
      return typeof window.fisherYatesArrayShuffle === "function";
    });

    expect(
      functionExists,
      "fisherYatesArrayShuffle should be available globally",
    ).toBe(true);
  });

  test("mixer effects canvas interaction", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);
    const subtoolButtons = await getSubtools(page);
    const buttonCount = await subtoolButtons.count();

    // Test different types of canvas interactions for mixer effects
    const testPositions = [
      { x: 100, y: 100 },
      { x: 200, y: 150 },
      { x: 300, y: 200 },
      { x: 150, y: 250 },
      { x: 250, y: 100 },
    ];

    const testCount = Math.min(testPositions.length, buttonCount);

    for (let i = 0; i < testCount; i++) {
      await selectSubtool(page, i);

      // Click test
      await testCanvasClick(page, testPositions[i]);

      // Some mixer effects might work better with drags
      await testCanvasDrag(page, testPositions[i], {
        x: testPositions[i].x + 50,
        y: testPositions[i].y + 50,
      });
    }

    assertNoConsoleErrors(consoleErrors, "mixer effects canvas interaction");
  });

  test("mixer tool persistence after switching", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);

    // Select a specific effect (index 2)
    await selectSubtool(page, 2);

    // Switch away and back
    await testToolSwitchingPersistence(page, TOOL_ID, "pencil");

    // Verify the same effect is still selected
    const subtoolButtons = await getSubtools(page);
    await expect(subtoolButtons.nth(2)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    assertNoConsoleErrors(consoleErrors, "mixer tool persistence");
  });

  test("comprehensive mixer workflow", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    await selectTool(page, TOOL_ID);
    const subtoolButtons = await getSubtools(page);
    const buttonCount = await subtoolButtons.count();

    // Test all available effects with different interaction patterns
    for (let i = 0; i < buttonCount; i++) {
      await selectSubtool(page, i);

      // Vary interaction types based on effect index
      if (i % 3 === 0) {
        // Single click
        await testCanvasClick(page, { x: 100 + i * 20, y: 100 });
      } else if (i % 3 === 1) {
        // Short drag
        await testCanvasDrag(
          page,
          { x: 100 + i * 20, y: 150 },
          { x: 120 + i * 20, y: 170 },
        );
      } else {
        // Longer drag
        await testCanvasDrag(
          page,
          { x: 100 + i * 20, y: 200 },
          { x: 150 + i * 20, y: 250 },
        );
      }
    }

    assertNoConsoleErrors(consoleErrors, "comprehensive mixer workflow");
  });
});
