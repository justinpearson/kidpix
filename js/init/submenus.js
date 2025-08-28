KiddoPaint.Submenu = {};

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
  for (var i = 0, len = KiddoPaint.Submenu[subtoolbar].length; i < len; i++) {
    var buttonDetail = KiddoPaint.Submenu[subtoolbar][i];
    var button = document.createElement("button");
    button.className = "tool";

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
