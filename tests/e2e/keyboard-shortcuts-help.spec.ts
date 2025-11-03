import { test, expect } from "./shared/playwright-fixtures";

test.describe("Keyboard Shortcuts Help Popup", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("opens popup when ? key is pressed", async ({ page }) => {
    // Press Shift+/ to trigger '?'
    await page.keyboard.press("Shift+Slash");

    // Verify popup is visible
    const popup = page.locator("#keyboard-shortcuts-popup");
    await expect(popup).toBeVisible();

    // Verify header is present
    const header = popup.locator("h2");
    await expect(header).toHaveText("Keyboard Shortcuts");
  });

  test("closes popup when ESC key is pressed", async ({ page }) => {
    // Open popup
    await page.keyboard.press("Shift+Slash");
    const popup = page.locator("#keyboard-shortcuts-popup");
    await expect(popup).toBeVisible();

    // Close with ESC
    await page.keyboard.press("Escape");
    await expect(popup).not.toBeVisible();
  });

  test("closes popup when clicking outside", async ({ page }) => {
    // Open popup
    await page.keyboard.press("Shift+Slash");
    const popup = page.locator("#keyboard-shortcuts-popup");
    await expect(popup).toBeVisible();

    // Click outside (on overlay)
    await popup.click({ position: { x: 5, y: 5 } });
    await expect(popup).not.toBeVisible();
  });

  test("toggles popup when ? key pressed again", async ({ page }) => {
    // Open popup
    await page.keyboard.press("Shift+Slash");
    const popup = page.locator("#keyboard-shortcuts-popup");
    await expect(popup).toBeVisible();

    // Press ? again to close
    await page.keyboard.press("Shift+Slash");
    await expect(popup).not.toBeVisible();

    // Press ? again to open
    await page.keyboard.press("Shift+Slash");
    await expect(popup).toBeVisible();
  });

  test("shows disabled message when shortcuts are disabled (default)", async ({
    page,
  }) => {
    // Open popup
    await page.keyboard.press("Shift+Slash");

    // Verify disabled content is shown
    const disabledContent = page.locator("#shortcuts-disabled-content");
    await expect(disabledContent).toBeVisible();

    // Verify enabled content is hidden
    const enabledContent = page.locator("#shortcuts-enabled-content");
    await expect(enabledContent).not.toBeVisible();

    // Check for console instructions
    const consoleInstructions = page.locator(".console-instructions");
    await expect(consoleInstructions).toBeVisible();
  });

  test("shows shortcuts list when shortcuts are enabled", async ({ page }) => {
    // Enable shortcuts via localStorage
    await page.evaluate(() => {
      localStorage.setItem(
        "kiddopaint.settings.keyboardShortcutsEnabled",
        "true",
      );
    });

    // Reload page to apply setting
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Open popup
    await page.keyboard.press("Shift+Slash");

    // Verify enabled content is shown
    const enabledContent = page.locator("#shortcuts-enabled-content");
    await expect(enabledContent).toBeVisible();

    // Verify disabled content is hidden
    const disabledContent = page.locator("#shortcuts-disabled-content");
    await expect(disabledContent).not.toBeVisible();

    // Check for shortcut keys within enabled content
    const nKey = enabledContent.locator('kbd:has-text("n")').first();
    await expect(nKey).toBeVisible();
  });
});
