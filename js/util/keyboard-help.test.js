import { describe, it, expect, beforeEach, vi, beforeAll } from "vitest";

// Set up global KiddoPaint namespace BEFORE importing the module
if (!global.window.KiddoPaint) {
  global.window.KiddoPaint = {};
}

global.window.KiddoPaint.Settings = {
  isKeyboardShortcutsEnabled: vi.fn(() => false),
};

// Import module after globals are set up
await import("./keyboard-help.js");

describe("KiddoPaint.KeyboardHelp", () => {
  beforeEach(() => {
    // Create mock DOM structure
    document.body.innerHTML = `
      <div id="keyboard-shortcuts-popup" style="display: none;">
        <div class="modal-content">
          <button class="close-btn">×</button>
          <div id="shortcuts-enabled-content"></div>
          <div id="shortcuts-disabled-content"></div>
        </div>
      </div>
    `;

    // Reset module state
    window.KiddoPaint.KeyboardHelp.isInitialized = false;
    window.KiddoPaint.KeyboardHelp.popup = null;
    window.KiddoPaint.KeyboardHelp.overlay = null;

    // Reset mock
    vi.clearAllMocks();
  });

  describe("init()", () => {
    it("initializes and stores DOM references", () => {
      window.KiddoPaint.KeyboardHelp.init();

      expect(window.KiddoPaint.KeyboardHelp.isInitialized).toBe(true);
      expect(window.KiddoPaint.KeyboardHelp.overlay).toBeTruthy();
      expect(window.KiddoPaint.KeyboardHelp.popup).toBeTruthy();
    });

    it("does not re-initialize if already initialized", () => {
      window.KiddoPaint.KeyboardHelp.init();
      const firstOverlay = window.KiddoPaint.KeyboardHelp.overlay;

      window.KiddoPaint.KeyboardHelp.init();
      const secondOverlay = window.KiddoPaint.KeyboardHelp.overlay;

      expect(firstOverlay).toBe(secondOverlay);
    });
  });

  describe("show()", () => {
    it("displays the popup", () => {
      window.KiddoPaint.KeyboardHelp.show();

      const overlay = document.getElementById("keyboard-shortcuts-popup");
      expect(overlay.style.display).toBe("flex");
    });

    it("shows disabled content when shortcuts are disabled", () => {
      window.KiddoPaint.Settings.isKeyboardShortcutsEnabled.mockReturnValue(
        false,
      );

      window.KiddoPaint.KeyboardHelp.show();

      const enabledContent = document.getElementById(
        "shortcuts-enabled-content",
      );
      const disabledContent = document.getElementById(
        "shortcuts-disabled-content",
      );

      expect(enabledContent.style.display).toBe("none");
      expect(disabledContent.style.display).toBe("block");
    });

    it("shows enabled content when shortcuts are enabled", () => {
      window.KiddoPaint.Settings.isKeyboardShortcutsEnabled.mockReturnValue(
        true,
      );

      window.KiddoPaint.KeyboardHelp.show();

      const enabledContent = document.getElementById(
        "shortcuts-enabled-content",
      );
      const disabledContent = document.getElementById(
        "shortcuts-disabled-content",
      );

      expect(enabledContent.style.display).toBe("block");
      expect(disabledContent.style.display).toBe("none");
    });
  });

  describe("hide()", () => {
    it("hides the popup", () => {
      window.KiddoPaint.KeyboardHelp.show();
      window.KiddoPaint.KeyboardHelp.hide();

      const overlay = document.getElementById("keyboard-shortcuts-popup");
      expect(overlay.style.display).toBe("none");
    });
  });

  describe("toggle()", () => {
    it("opens popup when hidden", () => {
      window.KiddoPaint.KeyboardHelp.toggle();

      const overlay = document.getElementById("keyboard-shortcuts-popup");
      expect(overlay.style.display).toBe("flex");
    });

    it("closes popup when visible", () => {
      window.KiddoPaint.KeyboardHelp.show();
      window.KiddoPaint.KeyboardHelp.toggle();

      const overlay = document.getElementById("keyboard-shortcuts-popup");
      expect(overlay.style.display).toBe("none");
    });
  });

  describe("isVisible()", () => {
    it("returns false when popup is hidden", () => {
      window.KiddoPaint.KeyboardHelp.init();
      expect(window.KiddoPaint.KeyboardHelp.isVisible()).toBe(false);
    });

    it("returns true when popup is shown", () => {
      window.KiddoPaint.KeyboardHelp.show();
      expect(window.KiddoPaint.KeyboardHelp.isVisible()).toBe(true);
    });
  });
});
