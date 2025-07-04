KiddoPaint.Submenu = {};

function show_generic_submenu(subtoolbar) {
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
      // disable all red outlines for subtool
      for (
        var j = 0,
          len = document
            .getElementById("genericsubmenu")
            .getElementsByTagName("button").length;
        j < len;
        j++
      ) {
        var b = document
          .getElementById("genericsubmenu")
          .getElementsByTagName("button")[j];
        console.log("j=", j, ", b=", b);
        b.style = "";
      }
      // Set clicked-subtool's outline to red:
      e.target.parentNode.style = "border-color:red; border-width: 5px";
      // TODO: mult buttons in submenu may be selected at once, eg, pencil's thickness + pattern.
      KiddoPaint.Sounds.submenuoption();
      localFRef(e);
    };
    button.onclick = wrappedHandler;
    button.oncontextmenu = wrappedHandler;

    genericsubmenu.appendChild(button);
  }
}
