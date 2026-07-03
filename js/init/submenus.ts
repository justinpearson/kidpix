KiddoPaint.Submenu = {};

/**
 * Highlight matching substring in text with <mark> tags
 * @param text - The full text (e.g., stamp name)
 * @param searchTerm - The search term to highlight
 * @returns HTML string with highlighted text
 */
function highlightSearchTerm(
  text: string,
  searchTerm: string | null | undefined,
): string {
  if (!searchTerm || !text) {
    return text;
  }

  // Escape special regex characters in search term
  const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Create regex for case-insensitive search
  const regex = new RegExp("(" + escapedSearch + ")", "gi");

  // Replace matches with <mark> wrapped text
  return text.replace(regex, "<mark>$1</mark>");
}

/** Appends the stamp-name caption, highlighting the current search term. */
function appendStampName(
  button: HTMLButtonElement,
  buttonDetail: KiddoPaintSubmenuEntry,
): void {
  if (!buttonDetail.name) return;
  const nameSpan = document.createElement("span");
  nameSpan.className = "stamp-name";
  // Highlight search term if present
  const highlightedName = highlightSearchTerm(
    buttonDetail.name,
    KiddoPaint.Sprite.currentSearch,
  );
  if (KiddoPaint.Sprite.currentSearch) {
    nameSpan.innerHTML = highlightedName;
  } else {
    nameSpan.textContent = buttonDetail.name;
  }
  button.appendChild(nameSpan);
}

/**
 * Builds one submenu button (image/text/emoji/spritesheet variants) with the
 * shared "clear section highlights, highlight clicked, play sound, dispatch"
 * click behavior. show_generic_submenu and update_sprites_stamps previously
 * each had an identical inline copy of this logic.
 */
function buildSubmenuButton(
  buttonDetail: KiddoPaintSubmenuEntry,
  extraClassName: string,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = "tool" + (extraClassName ? " " + extraClassName : "");

  // title on hover
  button.title = buttonDetail.name ?? "";

  // display
  if (buttonDetail.invisible) {
    button.className += " invisible";
  } else if (buttonDetail.imgSrc) {
    const img = document.createElement("img");
    img.src = buttonDetail.imgSrc;
    img.className = "toolImg pixelated";
    img.setAttribute("draggable", "false");
    button.appendChild(img);
  } else if (buttonDetail.imgJs) {
    const img = document.createElement("img");
    img.src = buttonDetail.imgJs();
    img.className = "pixelated";
    img.setAttribute("draggable", "false");
    button.appendChild(img);
  } else if (buttonDetail.text) {
    const t = document.createTextNode(buttonDetail.text);
    button.appendChild(t);
  } else if (buttonDetail.emoji) {
    const emoji = document.createElement("emj");
    const text = document.createTextNode(buttonDetail.emoji);
    emoji.appendChild(text);
    button.appendChild(emoji);

    // Add stamp name text below the emoji (for navigation buttons)
    appendStampName(button, buttonDetail);
  } else if (buttonDetail.spriteSheet) {
    const img = document.createElement("img");
    img.src = buttonDetail.spriteSheet;
    img.className =
      "tool sprite sprite-pos-" +
      buttonDetail.spriteCol +
      "-" +
      buttonDetail.spriteRow;
    img.setAttribute("draggable", "false");
    button.appendChild(img);

    // Add stamp name text below the image
    appendStampName(button, buttonDetail);
  }

  // click handler
  const localFRef = buttonDetail.handler;
  const wrappedHandler = function (e: MouseEvent) {
    // For multi-selection tools like line, only clear selections in the same
    // category. Find the spacer to determine if we're in the size section
    // (before) or the texture section (after).
    const buttons = document
      .getElementById("genericsubmenu")!
      .getElementsByTagName("button");
    const clickedButton = (e.target as HTMLElement).parentNode as HTMLElement;
    const clickedButtonIndex = Array.prototype.indexOf.call(
      buttons,
      clickedButton,
    );
    let spacerIndex = -1;

    // Find spacer button (invisible button that separates categories)
    for (let k = 0; k < buttons.length; k++) {
      if (buttons[k].className.includes("invisible")) {
        spacerIndex = k;
        break;
      }
    }

    if (spacerIndex >= 0) {
      // Multi-selection mode: only clear buttons in the same section
      let startIndex: number, endIndex: number;
      if (clickedButtonIndex < spacerIndex) {
        // Size section (before spacer)
        startIndex = 0;
        endIndex = spacerIndex;
      } else {
        // Texture section (after spacer)
        startIndex = spacerIndex + 1;
        endIndex = buttons.length;
      }

      // Clear only buttons in the same section
      for (let j = startIndex; j < endIndex; j++) {
        buttons[j].style.cssText = "";
      }
    } else {
      // Single-selection mode: clear all (for tools that don't have categories)
      for (let j = 0; j < buttons.length; j++) {
        buttons[j].style.cssText = "";
      }
    }

    // Set clicked-subtool's outline to red:
    clickedButton.style.cssText = "border-color:red; border-width: 5px";
    KiddoPaint.Sounds.submenuoption();
    // Spacer entries carry non-function filler (handler: true); they are
    // invisible and shouldn't dispatch even if programmatically clicked.
    if (typeof localFRef === "function") {
      localFRef(e);
    }
  };
  button.onclick = wrappedHandler;
  button.oncontextmenu = wrappedHandler;

  return button;
}

/**
 * Update only the stamp buttons in the sprites submenu, preserving the search box
 */
window.update_sprites_stamps = function update_sprites_stamps() {
  const genericsubmenu = document.getElementById("genericsubmenu");
  if (!genericsubmenu) return;

  // Remove only stamp buttons, not the clear search button
  const buttons = Array.from(
    genericsubmenu.querySelectorAll("button:not(#stamp-search-clear)"),
  );
  buttons.forEach(function (button) {
    button.remove();
  });

  // Re-add stamp buttons from KiddoPaint.Submenu.sprites
  const sprites: KiddoPaintSubmenuEntry[] = KiddoPaint.Submenu.sprites;
  for (let i = 0, len = sprites.length; i < len; i++) {
    genericsubmenu.appendChild(buildSubmenuButton(sprites[i], "stamp-button"));
  }

  // Update search results counter
  const resultsCounter = document.getElementById("stamp-search-results");
  if (resultsCounter && KiddoPaint.Sprite.currentSearch) {
    const searchTerm = KiddoPaint.Sprite.currentSearch;
    const stampCount = sprites.length;
    const resultText = stampCount === 1 ? "result" : "results";
    resultsCounter.textContent =
      stampCount + " " + resultText + " for '" + searchTerm + "'";
  } else if (resultsCounter) {
    resultsCounter.textContent = "";
  }
};

window.show_generic_submenu = function show_generic_submenu(subtoolbar) {
  if (!KiddoPaint.Submenu[subtoolbar]) {
    return;
  }

  window.reset_ranges();

  const subtoolbars = document.getElementById("subtoolbars")!.children;
  let genericsubmenu: HTMLElement | null = null;
  for (let i = 0, len = subtoolbars.length; i < len; i++) {
    const div = subtoolbars[i] as HTMLElement;
    if (div.id === "genericsubmenu") {
      div.className = "subtoolbar";
      genericsubmenu = div;
    } else {
      div.className = "hidden";
    }
  }
  if (!genericsubmenu) return;

  // clear old ; todo cache constructed buttons instead
  genericsubmenu.removeAllChildren();

  // Add search input for stamps submenu
  if (subtoolbar === "sprites") {
    // Create search input container
    const searchContainer = document.createElement("div");
    searchContainer.id = "stamp-search-container";
    searchContainer.className = "stamp-search-container";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "stamp-search";
    searchInput.className = "stamp-search-input";
    searchInput.placeholder = "Search stamps...";
    searchInput.autocomplete = "off";
    searchInput.value = KiddoPaint.Sprite.currentSearch || ""; // Restore search value

    // Handle search input - trigger search and refresh display
    searchInput.addEventListener("input", function (e) {
      const value = (e.target as HTMLInputElement).value;
      console.log("Stamp search:", value); // Log search for feature 1 test
      window.init_sprites_submenu(value);
      window.update_sprites_stamps(); // Only rebuild stamps, keep search box
    });

    // Handle ESC key to clear search
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        searchInput.value = "";
        KiddoPaint.Sprite.currentSearch = ""; // Clear stored search term
        window.init_sprites_submenu();
        window.update_sprites_stamps(); // Only rebuild stamps, keep search box
        e.preventDefault();
      }
    });

    // Handle "/" key globally to focus search box
    document.addEventListener("keydown", function (e) {
      // Only focus if "/" is pressed and search input is not already focused
      if (e.key === "/" && document.activeElement !== searchInput) {
        searchInput.focus();
        e.preventDefault(); // Prevent "/" from being typed
      }
    });

    // Create clear button
    const clearButton = document.createElement("button");
    clearButton.id = "stamp-search-clear";
    clearButton.className = "stamp-search-clear";
    clearButton.textContent = "×";
    clearButton.title = "Clear search";

    // Handle clear button click
    clearButton.addEventListener("click", function () {
      searchInput.value = "";
      KiddoPaint.Sprite.currentSearch = ""; // Clear stored search term
      window.init_sprites_submenu();
      window.update_sprites_stamps(); // Only rebuild stamps, keep search box
      searchInput.focus();
    });

    // Create results counter
    const resultsCounter = document.createElement("div");
    resultsCounter.id = "stamp-search-results";
    resultsCounter.className = "stamp-search-results";
    resultsCounter.textContent = ""; // Initially empty

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(clearButton);
    searchContainer.appendChild(resultsCounter);
    genericsubmenu.appendChild(searchContainer);
  }

  const entries: KiddoPaintSubmenuEntry[] = KiddoPaint.Submenu[subtoolbar];
  for (let i = 0, len = entries.length; i < len; i++) {
    genericsubmenu.appendChild(
      buildSubmenuButton(
        entries[i],
        subtoolbar === "sprites" ? "stamp-button" : "",
      ),
    );
  }
};
