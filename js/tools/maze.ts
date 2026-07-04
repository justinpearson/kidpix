class MazeTool implements KiddoPaintTool {
  isDown = false;

  texture: () => string | CanvasGradient | CanvasPattern = () =>
    KiddoPaint.Textures.Solid(KiddoPaint.Current.color);

  mousedown = (ev: KidPixPointerEvent) => {
    this.isDown = true;
    const maze = makeMaze();
    KiddoPaint.Display.context.drawImage(maze, ev._x, ev._y);
  };

  mousemove = () => {};
  mouseup = () => {
    if (this.isDown) {
      this.isDown = false;
      KiddoPaint.Display.saveMain();
    }
  };
}
KiddoPaint.Tools.Toolbox.Maze = MazeTool;
KiddoPaint.Tools.Maze = new MazeTool();

// Every variable in here was originally assigned without declaration — a
// ReferenceError under module strict mode that left the Maze tool broken.
function makeMaze(): HTMLCanvasElement {
  // https://codepen.io/GabbeV/pen/viAec
  const canvasBrush = document.createElement("canvas");
  const contextBrush = canvasBrush.getContext("2d")!;

  const pathWidth = 20; //Width of the Maze Path
  const wall = 5; //Width of the Walls between Paths
  const outerWall = 5; //Width of the Outer most wall
  const width = 25 * KiddoPaint.Current.scaling; //Number paths fitted horisontally
  const height = 25 * KiddoPaint.Current.scaling; //Number paths fitted vertically
  let x = (width / 2) | 0; //Horisontal starting position
  let y = (height / 2) | 0; //Vertical starting position
  const seed = (Math.random() * 100000) | 0; //Seed for random numbers
  const wallColor = KiddoPaint.Current.color;
  const pathColor = KiddoPaint.Current.altColor;

  const randomGen = function (s?: number) {
    let localSeed = s === undefined ? performance.now() : s;
    return function () {
      localSeed = (localSeed * 9301 + 49297) % 233280;
      return localSeed / 233280;
    };
  };

  const offset = pathWidth / 2 + outerWall;
  const map: boolean[][] = [];
  let route: number[][] = [];
  let random: () => number = () => 0;

  const init = function () {
    const mazeWidth = outerWall * 2 + width * (pathWidth + wall) - wall;
    const mazeHeight = outerWall * 2 + height * (pathWidth + wall) - wall;
    canvasBrush.width = mazeWidth;
    canvasBrush.height = mazeHeight;
    contextBrush.globalCompositeOperation = "source-over";
    contextBrush.fillStyle = wallColor;
    contextBrush.fillRect(0, 0, mazeWidth, mazeHeight);
    random = randomGen(seed);
    contextBrush.strokeStyle = pathColor;
    contextBrush.globalCompositeOperation = "destination-out";
    contextBrush.lineCap = "square";
    contextBrush.lineWidth = pathWidth;
    contextBrush.beginPath();
    for (let i = 0; i < height * 2; i++) {
      map[i] = [];
      for (let j = 0; j < width * 2; j++) {
        map[i][j] = false;
      }
    }
    map[y * 2][x * 2] = true;
    route = [[x, y]];
    contextBrush.moveTo(
      x * (pathWidth + wall) + offset,
      y * (pathWidth + wall) + offset,
    );
  };
  init();

  const loop = function () {
    x = route[route.length - 1][0] | 0;
    y = route[route.length - 1][1] | 0;

    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const alternatives: number[][] = [];

    for (let i = 0; i < directions.length; i++) {
      if (
        map[(directions[i][1] + y) * 2] != undefined &&
        map[(directions[i][1] + y) * 2][(directions[i][0] + x) * 2] === false
      ) {
        alternatives.push(directions[i]);
      }
    }

    if (alternatives.length === 0) {
      route.pop();
      if (route.length > 0) {
        contextBrush.moveTo(
          route[route.length - 1][0] * (pathWidth + wall) + offset,
          route[route.length - 1][1] * (pathWidth + wall) + offset,
        );
        loop();
        //timer = setTimeout(loop, delay)
      }
      return;
    }
    const direction = alternatives[(random() * alternatives.length) | 0];
    route.push([direction[0] + x, direction[1] + y]);
    contextBrush.lineTo(
      (direction[0] + x) * (pathWidth + wall) + offset,
      (direction[1] + y) * (pathWidth + wall) + offset,
    );
    map[(direction[1] + y) * 2][(direction[0] + x) * 2] = true;
    map[direction[1] + y * 2][direction[0] + x * 2] = true;
    contextBrush.stroke();
    //timer = setTimeout(loop, delay)
    loop();
  };
  loop();
  contextBrush.closePath();
  return canvasBrush;
}
