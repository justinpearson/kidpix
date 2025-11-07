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

  test("stamp names are displayed as text beneath stamps", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);

    // Verify first stamp has visible text "palm tree" inside the button
    const subtoolButtons = await getSubtools(page);
    const firstStampText = subtoolButtons.nth(0).locator(".stamp-name");
    await expect(firstStampText).toHaveText("palm tree");

    // Verify third stamp has visible text "brown dog"
    const thirdStampText = subtoolButtons.nth(2).locator(".stamp-name");
    await expect(thirdStampText).toHaveText("brown dog");

    // Navigation buttons SHOULD now have stamp-name elements
    const subtoolCount = await subtoolButtons.count();
    const prevRowBtn = subtoolButtons.nth(subtoolCount - 4);
    const nextRowBtn = subtoolButtons.nth(subtoolCount - 3);
    const prevPackBtn = subtoolButtons.nth(subtoolCount - 2);
    const nextPackBtn = subtoolButtons.nth(subtoolCount - 1);

    await expect(prevRowBtn.locator(".stamp-name")).toHaveText("prev row");
    await expect(nextRowBtn.locator(".stamp-name")).toHaveText("next row");
    await expect(prevPackBtn.locator(".stamp-name")).toHaveText(
      "prev stamp pack",
    );
    await expect(nextPackBtn.locator(".stamp-name")).toHaveText(
      "next stamp pack",
    );

    assertNoConsoleErrors(consoleErrors, "stamp names display");
  });

  test("stamp buttons have custom size", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);

    const subtoolButtons = await getSubtools(page);
    const subtoolCount = await subtoolButtons.count();

    // All stamp buttons (stamps + navigation) should have stamp-button class
    for (let i = 0; i < subtoolCount; i++) {
      const button = subtoolButtons.nth(i);
      await expect(button).toHaveClass(/stamp-button/);
    }

    // Verify first stamp button has correct dimensions (60px × 80px)
    const firstButton = subtoolButtons.nth(0);
    const box = await firstButton.boundingBox();
    expect(box?.width).toBe(60);
    expect(box?.height).toBe(80);

    // Verify navigation button also has correct dimensions
    const navButton = subtoolButtons.nth(subtoolCount - 1);
    const navBox = await navButton.boundingBox();
    expect(navBox?.width).toBe(60);
    expect(navBox?.height).toBe(80);

    assertNoConsoleErrors(consoleErrors, "stamp button size");
  });

  test("search box is present with correct styling", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);

    // Verify search input exists
    const searchInput = page.locator("#stamp-search");
    await expect(searchInput).toBeVisible();

    // Verify placeholder text
    await expect(searchInput).toHaveAttribute("placeholder", "Search stamps...");

    // Verify autocomplete is off
    await expect(searchInput).toHaveAttribute("autocomplete", "off");

    // Verify it's a text input
    await expect(searchInput).toHaveAttribute("type", "text");

    // Verify CSS styling
    await expect(searchInput).toHaveCSS("border-width", "2px");
    await expect(searchInput).toHaveCSS("font-size", "14px");

    assertNoConsoleErrors(consoleErrors, "search box styling");
  });

  test("typing in search box logs to console", async ({ page }) => {
    await selectTool(page, TOOL_ID);

    // Capture console.log messages
    const consoleMessages: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "log") {
        consoleMessages.push(msg.text());
      }
    });

    // Type in search box
    const searchInput = page.locator("#stamp-search");
    await searchInput.fill("tree");

    // Wait a moment for console messages
    await page.waitForTimeout(100);

    // Verify console.log was called with search terms
    expect(consoleMessages.some((msg) => msg.includes("tree"))).toBe(true);
  });

  test("clear search button clears the search box", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);

    // Verify clear button exists
    const clearButton = page.locator("#stamp-search-clear");
    await expect(clearButton).toBeVisible();

    // Type in search box
    const searchInput = page.locator("#stamp-search");
    await searchInput.fill("tree");

    // Verify search box has text
    await expect(searchInput).toHaveValue("tree");

    // Click clear button
    await clearButton.click();

    // Verify search box is now empty
    await expect(searchInput).toHaveValue("");

    assertNoConsoleErrors(consoleErrors, "clear search button");
  });

  test("ESC key clears search when focused", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);

    const searchInput = page.locator("#stamp-search");

    // Type in search box
    await searchInput.fill("tree");
    await expect(searchInput).toHaveValue("tree");

    // Press ESC key
    await searchInput.press("Escape");

    // Verify search box is cleared
    await expect(searchInput).toHaveValue("");

    assertNoConsoleErrors(consoleErrors, "ESC key clears search");
  });

  test("slash key focuses search box", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);
    await selectTool(page, TOOL_ID);

    const searchInput = page.locator("#stamp-search");

    // Verify search box is not focused initially
    await expect(searchInput).not.toBeFocused();

    // Press "/" key on the page
    await page.keyboard.press("/");

    // Verify search box is now focused
    await expect(searchInput).toBeFocused();

    // Verify the "/" character was NOT typed into the search box
    await expect(searchInput).toHaveValue("");

    assertNoConsoleErrors(consoleErrors, "slash key focuses search");
  });
});
