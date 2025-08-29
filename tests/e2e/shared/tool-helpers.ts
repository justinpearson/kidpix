import { Page, expect } from "@playwright/test";

/**
 * Shared helper functions for KidPix tool testing
 */

// Type declarations for KidPix global objects
declare global {
  interface Window {
    KiddoPaint: {
      Current: any;
      Tools: any;
      Display: any;
      Colors: any;
    };
    fisherYatesArrayShuffle: Function;
  }
}

export interface ToolDefinition {
  id: string;
  name: string;
  hasSubtools: boolean;
  hasMultipleSubtoolSets?: boolean;
  defaultSubtoolIndices?: number[];
  alternateSubtoolIndices?: number[];
}

export interface WackyBrushSubtool {
  index: number;
  name: string;
  expectsErrors: boolean;
}

/**
 * Initialize KidPix application and wait for it to be ready
 */
export async function initializeKidPix(page: Page): Promise<void> {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(
    () => window.KiddoPaint && window.KiddoPaint.Current,
  );
}

/**
 * Set up console error monitoring
 */
export function setupConsoleErrorMonitoring(page: Page): string[] {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });
  return consoleErrors;
}

/**
 * Select a tool and verify it's highlighted
 */
export async function selectTool(page: Page, toolId: string): Promise<void> {
  await page.click(`#${toolId}`);
  const toolElement = page.locator(`#${toolId}`);
  await expect(toolElement).toHaveCSS("border-color", "rgb(255, 0, 0)");
}

/**
 * Verify subtools are visible and get subtool buttons
 */
export async function getSubtools(page: Page) {
  const genericSubmenu = page.locator("#genericsubmenu");
  await expect(genericSubmenu).toBeVisible();
  return page.locator("#genericsubmenu button");
}

/**
 * Select a subtool and verify it's highlighted
 */
export async function selectSubtool(page: Page, index: number): Promise<void> {
  const subtoolButtons = await getSubtools(page);
  await subtoolButtons.nth(index).click();
  await expect(subtoolButtons.nth(index)).toHaveCSS(
    "border-color",
    "rgb(255, 0, 0)",
  );
}

/**
 * Test canvas click interaction
 */
export async function testCanvasClick(
  page: Page,
  position: { x: number; y: number } = { x: 250, y: 250 },
): Promise<void> {
  const canvas = page.locator("#tmpCanvas");
  await canvas.click({ position });
}

/**
 * Test canvas drag interaction
 */
export async function testCanvasDrag(
  page: Page,
  start: { x: number; y: number } = { x: 250, y: 250 },
  end: { x: number; y: number } = { x: 300, y: 300 },
): Promise<void> {
  const canvas = page.locator("#tmpCanvas");
  await canvas.hover({ position: start });
  await page.mouse.down();
  await canvas.hover({ position: end });
  await page.mouse.up();
}

/**
 * Verify no console errors occurred
 */
export function assertNoConsoleErrors(
  consoleErrors: string[],
  context: string,
): void {
  expect(
    consoleErrors,
    `Console errors in ${context}: ${consoleErrors.join("; ")}`,
  ).toHaveLength(0);
}

/**
 * Test tool switching and persistence
 */
export async function testToolSwitchingPersistence(
  page: Page,
  originalToolId: string,
  alternateToolId: string = "pencil",
): Promise<void> {
  // Switch to different tool
  await selectTool(page, alternateToolId);

  // Switch back to original tool
  await selectTool(page, originalToolId);
}

/**
 * Verify canvas elements are present and functional
 */
export async function verifyCanvasElements(page: Page): Promise<void> {
  const mainCanvas = page.locator("#kiddopaint");
  const tmpCanvas = page.locator("#tmpCanvas");
  const previewCanvas = page.locator("#previewCanvas");

  await expect(mainCanvas).toBeVisible();
  await expect(tmpCanvas).toBeVisible();
  await expect(previewCanvas).toBeVisible();
}
