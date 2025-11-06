import { test, expect } from "@playwright/test";
import {
  initializeKidPix,
  setupConsoleErrorMonitoring,
  selectTool,
  getSubtools,
  selectSubtool,
  testCanvasClick,
  assertNoConsoleErrors,
  testToolSwitchingPersistence,
} from "./shared/tool-helpers";
import { getToolDefinition } from "./shared/test-fixtures";

const TOOL_ID = "stamp";
const toolDef = getToolDefinition(TOOL_ID)!;

test.describe("Stamp Tool Tests", () => {
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

  test("stamp functionality", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);
    const subtoolButtons = await getSubtools(page);
    const subtoolCount = await subtoolButtons.count();

    // Test different stamps
    for (let i = 0; i < Math.min(8, subtoolCount); i++) {
      await selectSubtool(page, i);
      await testCanvasClick(page, {
        x: 80 + (i % 4) * 60,
        y: 80 + Math.floor(i / 4) * 60,
      });
    }
    assertNoConsoleErrors(consoleErrors, "stamp functionality");
  });

  test("tool persistence after switching", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);
    if (toolDef.alternateSubtoolIndices) {
      await selectSubtool(page, toolDef.alternateSubtoolIndices[0]);
    }
    await testToolSwitchingPersistence(page, TOOL_ID, "truck");
    const subtoolButtons = await getSubtools(page);
    if (toolDef.alternateSubtoolIndices) {
      await expect(
        subtoolButtons.nth(toolDef.alternateSubtoolIndices[0]),
      ).toHaveCSS("border-color", "rgb(255, 0, 0)");
    }
    assertNoConsoleErrors(consoleErrors, "tool persistence");
  });

  test("navigation buttons exist with correct labels", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);
    const subtoolButtons = await getSubtools(page);
    const subtoolCount = await subtoolButtons.count();

    // Navigation buttons should be at the end (last 4 buttons)
    // Order: prev row, next row, prev stamp pack, next stamp pack
    const prevRowBtn = subtoolButtons.nth(subtoolCount - 4);
    const nextRowBtn = subtoolButtons.nth(subtoolCount - 3);
    const prevPackBtn = subtoolButtons.nth(subtoolCount - 2);
    const nextPackBtn = subtoolButtons.nth(subtoolCount - 1);

    // Verify buttons exist and have correct titles
    await expect(prevRowBtn).toHaveAttribute("title", "prev row");
    await expect(nextRowBtn).toHaveAttribute("title", "next row");
    await expect(prevPackBtn).toHaveAttribute("title", "prev stamp pack");
    await expect(nextPackBtn).toHaveAttribute("title", "next stamp pack");

    assertNoConsoleErrors(consoleErrors, "navigation buttons");
  });

  test("next row navigation works", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);

    // Get initial row from KiddoPaint.Sprite.page
    const initialRow = await page.evaluate(() => window.KiddoPaint.Sprite.page);

    // Click next row button
    const subtoolButtons = await getSubtools(page);
    const subtoolCount = await subtoolButtons.count();
    const nextRowBtn = subtoolButtons.nth(subtoolCount - 3);
    await nextRowBtn.click();

    // Verify row changed
    const newRow = await page.evaluate(() => window.KiddoPaint.Sprite.page);
    expect(newRow).toBe((initialRow + 1) % 8); // 8 rows total (0-7)

    assertNoConsoleErrors(consoleErrors, "next row navigation");
  });

  test("prev row navigation works", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);

    // Get initial row from KiddoPaint.Sprite.page
    const initialRow = await page.evaluate(() => window.KiddoPaint.Sprite.page);

    // Click prev row button
    const subtoolButtons = await getSubtools(page);
    const subtoolCount = await subtoolButtons.count();
    const prevRowBtn = subtoolButtons.nth(subtoolCount - 4);
    await prevRowBtn.click();

    // Verify row changed
    const newRow = await page.evaluate(() => window.KiddoPaint.Sprite.page);
    const expectedRow = initialRow === 0 ? 7 : initialRow - 1;
    expect(newRow).toBe(expectedRow);

    assertNoConsoleErrors(consoleErrors, "prev row navigation");
  });

  test("next stamp pack navigation works", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);

    // Get initial sheet from KiddoPaint.Sprite.sheetPage
    const initialSheet = await page.evaluate(
      () => window.KiddoPaint.Sprite.sheetPage,
    );

    // Click next stamp pack button
    const subtoolButtons = await getSubtools(page);
    const subtoolCount = await subtoolButtons.count();
    const nextPackBtn = subtoolButtons.nth(subtoolCount - 1);
    await nextPackBtn.click();

    // Verify sheet changed
    const newSheet = await page.evaluate(
      () => window.KiddoPaint.Sprite.sheetPage,
    );
    const sheetsLength = await page.evaluate(
      () => window.KiddoPaint.Sprite.sheets.length,
    );
    expect(newSheet).toBe((initialSheet + 1) % sheetsLength);

    assertNoConsoleErrors(consoleErrors, "next stamp pack navigation");
  });

  test("prev stamp pack navigation works", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);

    // Get initial sheet from KiddoPaint.Sprite.sheetPage
    const initialSheet = await page.evaluate(
      () => window.KiddoPaint.Sprite.sheetPage,
    );

    // Click prev stamp pack button
    const subtoolButtons = await getSubtools(page);
    const subtoolCount = await subtoolButtons.count();
    const prevPackBtn = subtoolButtons.nth(subtoolCount - 2);
    await prevPackBtn.click();

    // Verify sheet changed
    const newSheet = await page.evaluate(
      () => window.KiddoPaint.Sprite.sheetPage,
    );
    const sheetsLength = await page.evaluate(
      () => window.KiddoPaint.Sprite.sheets.length,
    );
    const expectedSheet = initialSheet === 0 ? sheetsLength - 1 : initialSheet - 1;
    expect(newSheet).toBe(expectedSheet);

    assertNoConsoleErrors(consoleErrors, "prev stamp pack navigation");
  });

  test("stamp hover-text shows correct names", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);

    // On page load, first stamp should be 'palm tree'
    const subtoolButtons = await getSubtools(page);
    await expect(subtoolButtons.nth(0)).toHaveAttribute("title", "palm tree");

    // Last stamp in row (14th stamp, index 13) should be 'coffee cup'
    await expect(subtoolButtons.nth(13)).toHaveAttribute("title", "coffee cup");

    // Click 'next row' button
    const subtoolCount = await subtoolButtons.count();
    const nextRowBtn = subtoolButtons.nth(subtoolCount - 3);
    await nextRowBtn.click();

    // After clicking next row, first stamp should be 'traffic light'
    const subtoolButtons2 = await getSubtools(page);
    await expect(subtoolButtons2.nth(0)).toHaveAttribute("title", "traffic light");

    // Click 'next stamp pack' button
    const subtoolCount2 = await subtoolButtons2.count();
    const nextPackBtn = subtoolButtons2.nth(subtoolCount2 - 1);
    await nextPackBtn.click();

    // After clicking next stamp pack, first stamp should be 'red ant'
    const subtoolButtons3 = await getSubtools(page);
    await expect(subtoolButtons3.nth(0)).toHaveAttribute("title", "red ant");

    assertNoConsoleErrors(consoleErrors, "stamp hover-text");
  });
});
