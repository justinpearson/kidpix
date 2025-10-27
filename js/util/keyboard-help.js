/**
 * KiddoPaint.KeyboardHelp
 * Manages the keyboard shortcuts help popup
 */

KiddoPaint.KeyboardHelp = {
  popup: null,
  overlay: null,
  closeBtn: null,
  enabledContent: null,
  disabledContent: null,
  isInitialized: false,

  /**
   * Initialize the keyboard help popup
   * Attaches event listeners and stores references to DOM elements
   */
  init: function () {
    if (this.isInitialized) {
      return; // Already initialized
    }

    // Get references to DOM elements
    this.overlay = document.getElementById("keyboard-shortcuts-popup");
    if (!this.overlay) {
      console.error("Keyboard shortcuts popup element not found");
      return;
    }

    this.popup = this.overlay.querySelector(".modal-content");
    this.closeBtn = this.overlay.querySelector(".close-btn");
    this.enabledContent = document.getElementById("shortcuts-enabled-content");
    this.disabledContent = document.getElementById(
      "shortcuts-disabled-content",
    );

    // Attach event listeners
    this._attachEventListeners();

    this.isInitialized = true;
  },

  /**
   * Attach event listeners for popup interactions
   * @private
   */
  _attachEventListeners: function () {
    var self = this;

    // Close button click
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        self.hide();
      });
    }

    // Click on overlay (outside popup) to close
    this.overlay.addEventListener("click", function (e) {
      if (e.target === self.overlay) {
        self.hide();
      }
    });

    // Prevent clicks inside popup from closing it
    if (this.popup) {
      this.popup.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    // ESC key to close popup
    document.addEventListener("keydown", function (e) {
      if (e.keyCode === 27 && self.isVisible()) {
        // ESC key
        e.preventDefault();
        self.hide();
      }
    });
  },

  /**
   * Show the keyboard shortcuts help popup
   * Displays different content based on whether shortcuts are enabled
   */
  show: function () {
    if (!this.isInitialized) {
      this.init();
    }

    // Check if keyboard shortcuts are enabled
    var shortcutsEnabled = KiddoPaint.Settings.isKeyboardShortcutsEnabled();

    // Show/hide appropriate content
    if (this.enabledContent && this.disabledContent) {
      if (shortcutsEnabled) {
        this.enabledContent.style.display = "block";
        this.disabledContent.style.display = "none";
      } else {
        this.enabledContent.style.display = "none";
        this.disabledContent.style.display = "block";
      }
    }

    // Show the popup
    if (this.overlay) {
      this.overlay.style.display = "flex";
    }
  },

  /**
   * Hide the keyboard shortcuts help popup
   */
  hide: function () {
    if (this.overlay) {
      this.overlay.style.display = "none";
    }
  },

  /**
   * Toggle the keyboard shortcuts help popup (show if hidden, hide if visible)
   */
  toggle: function () {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  },

  /**
   * Check if the popup is currently visible
   * @returns {boolean} True if popup is visible, false otherwise
   */
  isVisible: function () {
    return this.overlay && this.overlay.style.display === "flex";
  },
};
