// this & maze can be refactored to a generic tool that takes a lambda
KiddoPaint.Tools.Toolbox.Tree = function() {
    var tool = this;
    this.isDown = false;

    this.mousedown = function(ev) {
        tool.isDown = true;
        KiddoPaint.Sounds.brushtree();
        drawTree(ev._x, ev._y, 32 * KiddoPaint.Current.scaling, -Math.PI / 2, 12, 15)
    };

    this.mousemove = function(ev) {};

    this.mouseup = function(ev) {
        if (tool.isDown) {
            tool.isDown = false;
            KiddoPaint.Display.saveMain();
        }
    };
};
KiddoPaint.Tools.Tree = new KiddoPaint.Tools.Toolbox.Tree();

function hexToRgb(hex) {
    // Parse a string like "#22FFFF" into red, green, blue components, each from 0 to 255.
    // Remove the leading '#' if it exists
    hex = hex.replace(/^#/, '');
    // Parse the red, green, and blue components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return {r,g,b};
}

/*
drawTree(320, 600, 60, -Math.PI / 2, 12, 15);
drawTree(500, 600, 60, -Math.PI / 2, 12, 7);
drawTree(680, 600, 60, -Math.PI / 2, 12, 15);
drawTree(750, 600, 60, -Math.PI / 2, 12, 15);
*/

// https://github.com/PavlyukVadim/amadev/tree/master/RecursiveTree
function drawTree(startX, startY, length, angle, depth, branchWidth) {
    var newLength, newAngle, newDepth, maxBranch = 3,
        endX, endY, maxAngle = 2 * Math.PI / 6,
        subBranches;

    KiddoPaint.Display.context.beginPath();
    KiddoPaint.Display.context.moveTo(startX, startY);
    endX = startX + length * Math.cos(angle);
    endY = startY + length * Math.sin(angle);
    KiddoPaint.Display.context.lineCap = 'round';
    KiddoPaint.Display.context.lineWidth = branchWidth;
    KiddoPaint.Display.context.lineTo(endX, endY);

    // original:
    // tweak color slightly based on trunk vs branches of tree.
    // [red,0,0] where:
    // red = 64 + [0,64] for trunk
    // red = 128 + [0,64] for branches
    // const colorOffset = depth <= 2 ? 128 : 64; // leaves (depth<=2) are brighter (higher offset) than trunk
    // const randColor = ((Math.random() * 64) + colorOffset) >> 0; // Math.random() in (0,1), so round to int with >>0
    // const red = randColor;
    // const green = 0;
    // const blue = 0;
    // KiddoPaint.Display.context.strokeStyle = `rgb(${red},${green},${blue})`;

    // Idea 1: Make tree cur color (no shading)
    // KiddoPaint.Display.context.strokeStyle = KiddoPaint.Current.color;

    // Idea 2: random branch colors:
    // const red = Math.random() * 256 >> 0;
    // const green = Math.random() * 256 >> 0;
    // const blue = Math.random() * 256 >> 0;
    // KiddoPaint.Display.context.strokeStyle = `rgb(${red},${green},${blue})`;

    // Idea 3: trunk is randomly darker than selected color, branches are randomly lighter.
    //
    const rgbStr = KiddoPaint.Current.color; // eg "rgb(254, 231, 97)"
    // console.log(`Cur color: ${rgbStr}`)
    let newColor = rgbStr;

    const rgb = (() => {
        const matches = rgbStr.match(/rgb\((\d+), ?(\d+), ?(\d+)\)/);
        if (matches) {
            return {
                r: parseInt(matches[1]),
                g: parseInt(matches[2]),
                b: parseInt(matches[3])
            };
        }

        if (rgbStr.startsWith('#')) {
            return hexToRgb(rgbStr);
        }

        // console.log(`Unexpected color format (expected string "rgb(123,234,111)"): ${rgbStr}`);
        // debugger;
        return undefined;
    })();

    if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        // brighten (inc lightness) of leaves (depth<=2)
        // darken (dec lightness) of trunk (depth>2)
        const newLightness = clamp(hsl.l + (depth <= 2 ? 1 : -1) * Math.random() * 0.25, 0, 1);
        const hsl2 = {
            h: hsl.h,
            s: hsl.s,
            l: newLightness
        };
        const rgb2 = hslToRgb(hsl2.h, hsl2.s, hsl2.l);
        newColor = `rgb(${rgb2.r},${rgb2.g},${rgb2.b})`;
        // console.log('potato', newColor);
    }
    KiddoPaint.Display.context.strokeStyle = newColor;


    KiddoPaint.Display.context.stroke();
    newDepth = depth - 1;

    if (!newDepth) {
        return;
    }
    subBranches = (Math.random() * (maxBranch - 1)) + 1;
    branchWidth *= 0.7;

    for (var i = 0; i < subBranches; i++) {
        newAngle = angle + Math.random() * maxAngle - maxAngle * 0.5;
        newLength = length * (0.7 + Math.random() * 0.3);
        drawTree(endX, endY, newLength, newAngle, newDepth, branchWidth);
    }

}