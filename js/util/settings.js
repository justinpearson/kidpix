/**
 * KiddoPaint.Settings
 * Manages user settings stored in localStorage
 */

KiddoPaint.Settings = {
  /**
   * Check if keyboard shortcuts are enabled
   * @returns {boolean} True if keyboard shortcuts are enabled, false otherwise
   */
  isKeyboardShortcutsEnabled: function () {
    // Default to false (disabled) to maintain child-friendly behavior
    var value = localStorage.getItem(
      "kiddopaint.settings.keyboardShortcutsEnabled",
    );
    return value === "true";
  },

  /**
   * Set keyboard shortcuts enabled/disabled state
   * @param {boolean} enabled - True to enable shortcuts, false to disable
   */
  setKeyboardShortcutsEnabled: function (enabled) {
    localStorage.setItem(
      "kiddopaint.settings.keyboardShortcutsEnabled",
      enabled ? "true" : "false",
    );
  },
};
