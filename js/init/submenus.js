KiddoPaint.Submenu = {};

/**
 * Update only the stamp buttons in the sprites submenu, preserving the search box
 */
window.update_sprites_stamps = function update_sprites_stamps() {
  var genericsubmenu = document.getElementById("genericsubmenu");
  if (!genericsubmenu) return;

  // Find and preserve the search container
  var searchContainer = document.getElementById("stamp-search-container");

  // Remove only stamp buttons, not the clear search button
  var buttons = Array.from(genericsubmenu.querySelectorAll("button:not(#stamp-search-clear)"));
  buttons.forEach(function(button) {
    button.remove();
  });

  // Re-add stamp buttons from KiddoPaint.Submenu.sprites
  for (var i = 0, len = KiddoPaint.Submenu.sprites.length; i < len; i++) {
    var buttonDetail = KiddoPaint.Submenu.sprites[i];
    var button = document.createElement("button");
    button.className = "tool stamp-button";

    // title on hover
    button.title = buttonDetail.name;

    // display
    if (buttonDetail.invisible) {
      button.className += " invisible";
    } else if (buttonDetail.imgSrc) {
      var img = document.createElement("img");
      img.src = buttonDetail.imgSrc;
      img.className = "toolImg pixelated";
      img.setAttribute("draggable", "false");
      button.appendChild(img);
    } else if (buttonDetail.imgJs) {
      var img = document.createElement("img");
      img.src = buttonDetail.imgJs();
      img.className = "pixelated";
      img.setAttribute("draggable", "false");
      button.appendChild(img);
    } else if (buttonDetail.text) {
      var t = document.createTextNode(buttonDetail.text);
      button.appendChild(t);
    } else if (buttonDetail.emoji) {
      var emoji = document.createElement("emj");
      var text = document.createTextNode(buttonDetail.emoji);
      emoji.appendChild(text);
      button.appendChild(emoji);

      // Add stamp name text below the emoji (for navigation buttons)
      if (buttonDetail.name) {
        var nameSpan = document.createElement("span");
        nameSpan.className = "stamp-name";
        nameSpan.textContent = buttonDetail.name;
        button.appendChild(nameSpan);
      }
    } else if (buttonDetail.spriteSheet) {
      var img = document.createElement("img");
      img.src = buttonDetail.spriteSheet;
      img.className =
        "tool sprite sprite-pos-" +
        buttonDetail.spriteCol +
        "-" +
        buttonDetail.spriteRow;
      img.setAttribute("draggable", "false");
      button.appendChild(img);

      // Add stamp name text below the image
      if (buttonDetail.name) {
        var nameSpan = document.createElement("span");
        nameSpan.className = "stamp-name";
        nameSpan.textContent = buttonDetail.name;
        button.appendChild(nameSpan);
      }
    }

    // click handler
    const localFRef = buttonDetail.handler;
    const wrappedHandler = function (e) {
      // For multi-selection tools like line, only clear selections in the same category
      var buttons = document
        .getElementById("genericsubmenu")
        .getElementsByTagName("button");
      var clickedButtonIndex = Array.prototype.indexOf.call(
        buttons,
        e.target.parentNode,
      );
      var spacerIndex = -1;

      // Find spacer button (invisible button that separates categories)
      for (var k = 0; k < buttons.length; k++) {
        if (buttons[k].className.includes("invisible")) {
          spacerIndex = k;
          break;
        }
      }

      if (spacerIndex >= 0) {
        // Multi-selection mode: only clear buttons in the same section
        var startIndex, endIndex;
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
        for (var j = startIndex; j < endIndex; j++) {
          buttons[j].style = "";
        }
      } else {
        // Single-selection mode: clear all (for tools that don't have categories)
        for (var j = 0; j < buttons.length; j++) {
          buttons[j].style = "";
        }
      }

      // Set clicked-subtool's outline to red:
      e.target.parentNode.style = "border-color:red; border-width: 5px";
      KiddoPaint.Sounds.submenuoption();
      localFRef(e);
    };
    button.onclick = wrappedHandler;
    button.oncontextmenu = wrappedHandler;

    genericsubmenu.appendChild(button);
  }

  // Update search results counter
  var resultsCounter = document.getElementById("stamp-search-results");
  if (resultsCounter && KiddoPaint.Sprite.currentSearch) {
    var searchTerm = KiddoPaint.Sprite.currentSearch;
    var stampCount = KiddoPaint.Submenu.sprites.length;
    var resultText = stampCount === 1 ? "result" : "results";
    resultsCounter.textContent = stampCount + " " + resultText + " for '" + searchTerm + "'";
  } else if (resultsCounter) {
    resultsCounter.textContent = "";
  }
};

window.show_generic_submenu = function show_generic_submenu(subtoolbar) {
  if (!KiddoPaint.Submenu[subtoolbar]) {
    return;
  }

  reset_ranges();

  var subtoolbars = document.getElementById("subtoolbars").children;
  var genericsubmenu = null;
  for (var i = 0, len = subtoolbars.length; i < len; i++) {
    var div = subtoolbars[i];
    if (div.id === "genericsubmenu") {
      div.className = "subtoolbar";
      genericsubmenu = div;
    } else {
      div.className = "hidden";
    }
  }

  // clear old ; todo cache constructed buttons instead
  genericsubmenu.removeAllChildren();

  // Add search input for stamps submenu
  if (subtoolbar === "sprites") {
    // Create search input container
    var searchContainer = document.createElement("div");
    searchContainer.id = "stamp-search-container";
    searchContainer.className = "stamp-search-container";

    var searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "stamp-search";
    searchInput.className = "stamp-search-input";
    searchInput.placeholder = "Search stamps...";
    searchInput.autocomplete = "off";
    searchInput.value = KiddoPaint.Sprite.currentSearch || ""; // Restore search value

    // Handle search input - trigger search and refresh display
    searchInput.addEventListener("input", function (e) {
      console.log("Stamp search:", e.target.value); // Log search for feature 1 test
      init_sprites_submenu(e.target.value);
      update_sprites_stamps(); // Only rebuild stamps, keep search box
    });

    // Handle ESC key to clear search
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        searchInput.value = "";
        KiddoPaint.Sprite.currentSearch = ""; // Clear stored search term
        init_sprites_submenu();
        update_sprites_stamps(); // Only rebuild stamps, keep search box
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
    var clearButton = document.createElement("button");
    clearButton.id = "stamp-search-clear";
    clearButton.className = "stamp-search-clear";
    clearButton.textContent = "×";
    clearButton.title = "Clear search";

    // Handle clear button click
    clearButton.addEventListener("click", function () {
      searchInput.value = "";
      KiddoPaint.Sprite.currentSearch = ""; // Clear stored search term
      init_sprites_submenu();
      update_sprites_stamps(); // Only rebuild stamps, keep search box
      searchInput.focus();
    });

    // Create results counter
    var resultsCounter = document.createElement("div");
    resultsCounter.id = "stamp-search-results";
    resultsCounter.className = "stamp-search-results";
    resultsCounter.textContent = ""; // Initially empty

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(clearButton);
    searchContainer.appendChild(resultsCounter);
    genericsubmenu.appendChild(searchContainer);
  }

  for (var i = 0, len = KiddoPaint.Submenu[subtoolbar].length; i < len; i++) {
    var buttonDetail = KiddoPaint.Submenu[subtoolbar][i];
    var button = document.createElement("button");
    button.className = "tool";

    // Add stamp-button class for stamp/sprites submenu
    if (subtoolbar === "sprites") {
      button.className += " stamp-button";
    }

    // title on hover
    button.title = buttonDetail.name;

    // display
    if (buttonDetail.invisible) {
      button.className += " invisible";
    } else if (buttonDetail.imgSrc) {
      var img = document.createElement("img");
      img.src = buttonDetail.imgSrc;
      img.className = "toolImg pixelated";
      img.setAttribute("draggable", "false");
      button.appendChild(img);
    } else if (buttonDetail.imgJs) {
      var img = document.createElement("img");
      img.src = buttonDetail.imgJs();
      img.className = "pixelated";
      img.setAttribute("draggable", "false");
      button.appendChild(img);
    } else if (buttonDetail.text) {
      var t = document.createTextNode(buttonDetail.text);
      button.appendChild(t);
    } else if (buttonDetail.emoji) {
      var emoji = document.createElement("emj");
      var text = document.createTextNode(buttonDetail.emoji);
      emoji.appendChild(text);
      button.appendChild(emoji);

      // Add stamp name text below the emoji (for navigation buttons)
      if (buttonDetail.name) {
        var nameSpan = document.createElement("span");
        nameSpan.className = "stamp-name";
        nameSpan.textContent = buttonDetail.name;
        button.appendChild(nameSpan);
      }
    } else if (buttonDetail.spriteSheet) {
      var img = document.createElement("img");
      img.src = buttonDetail.spriteSheet;
      img.className =
        "tool sprite sprite-pos-" +
        buttonDetail.spriteCol +
        "-" +
        buttonDetail.spriteRow;
      img.setAttribute("draggable", "false");
      button.appendChild(img);

      // Add stamp name text below the image
      if (buttonDetail.name) {
        var nameSpan = document.createElement("span");
        nameSpan.className = "stamp-name";
        nameSpan.textContent = buttonDetail.name;
        button.appendChild(nameSpan);
      }
    } else {
      //		console.log(buttonDetail);
    }

    // click handler
    const localFRef = buttonDetail.handler;
    const wrappedHandler = function (e) {
      // For multi-selection tools like line, only clear selections in the same category
      // Find the spacer to determine if we're in size section (before) or texture section (after)
      var buttons = document
        .getElementById("genericsubmenu")
        .getElementsByTagName("button");
      var clickedButtonIndex = Array.prototype.indexOf.call(
        buttons,
        e.target.parentNode,
      );
      var spacerIndex = -1;

      // Find spacer button (invisible button that separates categories)
      for (var k = 0; k < buttons.length; k++) {
        if (buttons[k].className.includes("invisible")) {
          spacerIndex = k;
          break;
        }
      }

      if (spacerIndex >= 0) {
        // Multi-selection mode: only clear buttons in the same section
        var startIndex, endIndex;
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
        for (var j = startIndex; j < endIndex; j++) {
          buttons[j].style = "";
        }
      } else {
        // Single-selection mode: clear all (for tools that don't have categories)
        for (var j = 0; j < buttons.length; j++) {
          buttons[j].style = "";
        }
      }

      // Set clicked-subtool's outline to red:
      e.target.parentNode.style = "border-color:red; border-width: 5px";
      KiddoPaint.Sounds.submenuoption();
      localFRef(e);
    };
    button.onclick = wrappedHandler;
    button.oncontextmenu = wrappedHandler;

    genericsubmenu.appendChild(button);
  }
};
