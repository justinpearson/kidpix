import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("JSKIDPIX v1.0.2021");
});

test("loads main canvas", async ({ page }) => {
  await page.goto("/");

  // Check that the main canvas element exists
  const canvas = page.locator("#kiddopaint");
  await expect(canvas).toBeVisible();

  // Verify canvas has expected dimensions (1300x650 based on actual HTML)
  const canvasElement = await canvas.elementHandle();
  const width = await canvasElement?.getAttribute("width");
  const height = await canvasElement?.getAttribute("height");

  expect(width).toBe("1300");
  expect(height).toBe("650");
});

test("has drawing tools available", async ({ page }) => {
  await page.goto("/");

  // Wait for page to be fully loaded
  await page.waitForLoadState("networkidle");

  // Check for toolbar and tool elements that should be present
  const toolbar = page.locator("#toolbar");
  await expect(toolbar).toBeVisible();

  // Check that there are tool buttons available
  const toolButtons = page.locator(".tool");
  await expect(toolButtons.first()).toBeVisible();

  // Verify some specific core tools exist
  const coreTools = ["#pencil", "#brush", "#eraser", "#save"];
  for (const toolId of coreTools) {
    const tool = page.locator(toolId);
    await expect(tool).toBeVisible();
  }
});
