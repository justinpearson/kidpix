import { test, expect } from "./shared/playwright-fixtures";
import {
  initializeKidPix,
  setupConsoleErrorMonitoring,
  selectTool,
  getSubtools,
  assertNoConsoleErrors,
} from "./shared/tool-helpers";
import { TOOL_DEFINITIONS } from "./shared/test-fixtures";

// Consolidates the identical "basic tool selection and highlighting" test
// that was previously skipped in each per-tool spec (issue #84, Category B).
test.describe("Tool selection and highlighting", () => {
  test.beforeEach(async ({ page }) => {
    await initializeKidPix(page);
  });

  for (const toolDef of TOOL_DEFINITIONS) {
    test(`${toolDef.name} (#${toolDef.id}) selects and highlights`, async ({
      page,
    }) => {
      const consoleErrors = setupConsoleErrorMonitoring(page);

      // selectTool asserts the tool button itself gets the red highlight
      await selectTool(page, toolDef.id);

      // Tools without defaultSubtoolIndices (text) render their subtools
      // outside #genericsubmenu and are only checked for selection above.
      if (toolDef.defaultSubtoolIndices) {
        const subtoolButtons = await getSubtools(page);

        for (const index of toolDef.defaultSubtoolIndices) {
          await expect(subtoolButtons.nth(index)).toHaveCSS(
            "border-color",
            "rgb(255, 0, 0)",
          );
        }

        if (toolDef.defaultSubtoolIndices.length === 0) {
          // Documents current behavior: this tool's submenu appears with no
          // default subtool highlighted (e.g. stamp).
          const highlighted = await subtoolButtons.evaluateAll(
            (btns) =>
              btns.filter(
                (b) => getComputedStyle(b).borderColor === "rgb(255, 0, 0)",
              ).length,
          );
          expect(highlighted).toBe(0);
        }
      }

      assertNoConsoleErrors(consoleErrors, `${toolDef.id} tool selection`);
    });
  }
});
