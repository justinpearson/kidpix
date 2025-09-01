import { test, expect } from "@playwright/test";
import {
  initializeKidPix,
  setupConsoleErrorMonitoring,
  selectTool,
  getSubtools,
  selectSubtool,
  assertNoConsoleErrors,
} from "./shared/tool-helpers";
import { TOOL_DEFINITIONS } from "./shared/test-fixtures";

test.describe("Tool Switching and Persistence Tests", () => {
  test.beforeEach(async ({ page }) => {
    await initializeKidPix(page);
  });

  test("basic tool switching workflow", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Test switching between all tools
    for (const toolDef of TOOL_DEFINITIONS) {
      await selectTool(page, toolDef.id);

      if (toolDef.hasSubtools) {
        const subtoolButtons = await getSubtools(page);
        const subtoolCount = await subtoolButtons.count();

        // Select first subtool if available
        if (subtoolCount > 0) {
          await selectSubtool(page, 0);
        }
      }
    }

    assertNoConsoleErrors(consoleErrors, "basic tool switching");
  });

  test("tool state persistence across switches", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Select pencil and configure subtools
    await selectTool(page, "pencil");
    await selectSubtool(page, 0); // size 1
    await selectSubtool(page, 8); // different texture

    // Switch to line tool
    await selectTool(page, "line");
    await selectSubtool(page, 2); // different size

    // Switch back to pencil - should remember our selections
    await selectTool(page, "pencil");
    const pencilSubtools = await getSubtools(page);
    await expect(pencilSubtools.nth(0)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );
    await expect(pencilSubtools.nth(8)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    // Switch back to line - should remember our selection
    await selectTool(page, "line");
    const lineSubtools = await getSubtools(page);
    await expect(lineSubtools.nth(2)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    assertNoConsoleErrors(consoleErrors, "tool state persistence");
  });

  test("brush subtool persistence", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Select Brush and choose Tree brush (index 5)
    await selectTool(page, "brush");
    await selectSubtool(page, 5);

    // Switch to several other tools
    await selectTool(page, "pencil");
    await selectTool(page, "jumble");
    await selectTool(page, "flood");

    // Switch back to Brush - Tree should still be selected
    await selectTool(page, "brush");
    const brushSubtools = await getSubtools(page);
    await expect(brushSubtools.nth(5)).toHaveCSS(
      "border-color",
      "rgb(255, 0, 0)",
    );

    assertNoConsoleErrors(consoleErrors, "wacky brush persistence");
  });

  test("multi-selection tool persistence (pencil and line)", async ({
    page,
  }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Configure pencil with specific size and texture
    await selectTool(page, "pencil");
    await selectSubtool(page, 1); // size 5
    await selectSubtool(page, 9); // different texture

    // Configure line with specific size and texture
    await selectTool(page, "line");
    await selectSubtool(page, 3); // different size
    await selectSubtool(page, 8); // different texture

    // Switch between them multiple times
    for (let i = 0; i < 3; i++) {
      // Check pencil state
      await selectTool(page, "pencil");
      const pencilSubtools = await getSubtools(page);
      await expect(pencilSubtools.nth(1)).toHaveCSS(
        "border-color",
        "rgb(255, 0, 0)",
      );
      await expect(pencilSubtools.nth(9)).toHaveCSS(
        "border-color",
        "rgb(255, 0, 0)",
      );

      // Check line state
      await selectTool(page, "line");
      const lineSubtools = await getSubtools(page);
      await expect(lineSubtools.nth(3)).toHaveCSS(
        "border-color",
        "rgb(255, 0, 0)",
      );
      await expect(lineSubtools.nth(8)).toHaveCSS(
        "border-color",
        "rgb(255, 0, 0)",
      );
    }

    assertNoConsoleErrors(consoleErrors, "multi-selection persistence");
  });

  test("all tools roundtrip test", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Configure each tool with alternate subtools
    const toolConfigurations: Array<{ id: string; subtoolIndex: number }> = [];

    for (const toolDef of TOOL_DEFINITIONS) {
      await selectTool(page, toolDef.id);

      if (toolDef.hasSubtools && toolDef.alternateSubtoolIndices) {
        const alternateIndex = toolDef.alternateSubtoolIndices[0];
        await selectSubtool(page, alternateIndex);
        toolConfigurations.push({
          id: toolDef.id,
          subtoolIndex: alternateIndex,
        });
      }
    }

    // Now verify all configurations are still intact
    for (const config of toolConfigurations) {
      await selectTool(page, config.id);
      const subtoolButtons = await getSubtools(page);
      await expect(subtoolButtons.nth(config.subtoolIndex)).toHaveCSS(
        "border-color",
        "rgb(255, 0, 0)",
      );
    }

    assertNoConsoleErrors(consoleErrors, "all tools roundtrip");
  });

  test("rapid tool switching stress test", async ({ page }) => {
    const consoleErrors = setupConsoleErrorMonitoring(page);

    // Rapidly switch between tools
    const switchSequence = [
      "pencil",
      "brush",
      "jumble",
      "line",
      "square",
      "circle",
      "flood",
    ];

    for (let round = 0; round < 3; round++) {
      for (const toolId of switchSequence) {
        await selectTool(page, toolId);

        // Quick subtool selection if available
        if (TOOL_DEFINITIONS.find((t) => t.id === toolId)?.hasSubtools) {
          const subtoolButtons = await getSubtools(page);
          const subtoolCount = await subtoolButtons.count();
          if (subtoolCount > 1) {
            await selectSubtool(page, 1);
          }
        }
      }
    }

    assertNoConsoleErrors(consoleErrors, "rapid tool switching");
  });
});
