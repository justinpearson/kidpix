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

    // tweak color slightly
    const colorOffset = depth <= 2 ? 128 : 64;
    const randColor = (((Math.random() * 64) + colorOffset) >> 0);
    const red = randColor;
    const green = 0;
    const blue = 0;
    KiddoPaint.Display.context.strokeStyle = `rgb(${red},${green},${blue})`;

    // old:
    // if (depth <= 2) {
    //     // KiddoPaint.Display.context.strokeStyle = 'rgb(' + '0,0,' + (((Math.random() * 64) + 128) >> 0) + ')'; // blue
    //     KiddoPaint.Display.context.strokeStyle = 'rgb(' + (((Math.random() * 64) + 128) >> 0) + ',0,0)'; // red
    //     // KiddoPaint.Display.context.strokeStyle = 'rgb(0,' + (((Math.random() * 64) + 128) >> 0) + ',0)'; // green
    // } else {
    //     // KiddoPaint.Display.context.strokeStyle = 'rgb(' + '0,20,' + (((Math.random() * 64) + 64) >> 0) + ')'; // blue
    //     KiddoPaint.Display.context.strokeStyle = 'rgb(' + (((Math.random() * 64) + 64) >> 0) + ',0,20)'; // red
    //     // KiddoPaint.Display.context.strokeStyle = 'rgb(0,' + (((Math.random() * 64) + 64) >> 0) + ',20)'; // greeen
    // }

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