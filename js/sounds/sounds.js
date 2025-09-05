// hack to unlock audios for safari: https://curtisrobinson.medium.com/how-to-auto-play-audio-in-safari-with-javascript-21d50b0a2765
// hack 2: https://stackoverflow.com/a/68107904
// hack 3: https://stackoverflow.com/a/31351186
// XXX FIXME TODO: switch everything to lazy load; too many audios() throws error in chrome

KiddoPaint.Sounds.Library = {};
KiddoPaint.Sounds.Library.enabled = true;

// array to randomize
KiddoPaint.Sounds.Library.explosion = [
  new Audio("snd/eraser/eraser-tnt-explosion.mp3"),
];
KiddoPaint.Sounds.Library.oops = [
  new Audio("snd/oops/oops0.mp3"),
  new Audio("snd/oops/oops1.mp3"),
  new Audio("snd/oops/oops2.mp3"),
  new Audio("snd/oops/oops3.mp3"),
];
KiddoPaint.Sounds.Library.bubblepops = [
  new Audio("snd/misc/bubble-pop-1.mp3"),
  new Audio("snd/misc/bubble-pop-2.mp3"),
  new Audio("snd/misc/bubble-pop-3.mp3"),
  new Audio("snd/misc/bubble-pop-4.mp3"),
  new Audio("snd/misc/bubble-pop-5.mp3"),
];

// single sounds
KiddoPaint.Sounds.Library.pencil = [new Audio("snd/pencil/pencil.mp3")];
KiddoPaint.Sounds.Library.stamp = [new Audio("snd/stamp/stamp.mp3")];
KiddoPaint.Sounds.Library.paintcan = [new Audio("snd/paintcan/paintcan.mp3")];
KiddoPaint.Sounds.Library.mainmenu = [
  new Audio("snd/misc/click-main-tools.mp3"),
];
KiddoPaint.Sounds.Library.submenucolor = [
  new Audio("snd/misc/click-submenu-color.mp3"),
];
KiddoPaint.Sounds.Library.submenuoption = [
  new Audio("snd/misc/click-submenu-options.mp3"),
];
KiddoPaint.Sounds.Library.box = [new Audio("snd/misc/box-during-approx.mp3")];
KiddoPaint.Sounds.Library.circle = [
  new Audio("snd/circle/circle-during-approx.mp3"),
];

// KiddoPaint.Sounds.Library. = [new Audio('snd/')];

KiddoPaint.Sounds.Library.eraserfade = [new Audio("snd/eraser/fade-2.mp3")];
KiddoPaint.Sounds.Library.eraser = [new Audio("snd/eraser/eraser.mp3")];
KiddoPaint.Sounds.Library.doordingdong = [
  new Audio("snd/eraser/doorbell-ding-dong.mp3"),
];
KiddoPaint.Sounds.Library.doorcreak = [
  new Audio("snd/eraser/doorbell-door-creak.mp3"),
];
KiddoPaint.Sounds.Library.doorwow = [
  new Audio("snd/eraser/doorbell-wwoooowwww.mp3"),
];
KiddoPaint.Sounds.Library.brushbubbly = [new Audio("snd/brush/bubbly.mp3")];
KiddoPaint.Sounds.Library.brushleakypen = [
  new Audio("snd/brush/leaky-pen.mp3"),
];
KiddoPaint.Sounds.Library.brushzigzag = [new Audio("snd/brush/zigzag.mp3")];
KiddoPaint.Sounds.Library.brushdots = [new Audio("snd/brush/dots.mp3")];
KiddoPaint.Sounds.Library.brushpies = [new Audio("snd/brush/pies.mp3")];
KiddoPaint.Sounds.Library.brushecho = [new Audio("snd/brush/owl.mp3")];
KiddoPaint.Sounds.Library.brushnorthern = [new Audio("snd/brush/northern.mp3")];
KiddoPaint.Sounds.Library.brushfuzzer = [new Audio("snd/brush/fuzzer.mp3")];
KiddoPaint.Sounds.Library.brushzoom = [new Audio("snd/brush/zoom.mp3")];
KiddoPaint.Sounds.Library.brushpines = [new Audio("snd/brush/pines.mp3")];
KiddoPaint.Sounds.Library.brushtwirly = [new Audio("snd/brush/twirly.mp3")];
KiddoPaint.Sounds.Library.brushkaliediscope = [
  new Audio("snd/brush/kaliediscope.mp3"),
];
KiddoPaint.Sounds.Library.brushrollingdots = [
  new Audio("snd/brush/rollingdots.mp3"),
];
KiddoPaint.Sounds.Library.brushinvert = [new Audio("snd/brush/inverter.mp3")];
KiddoPaint.Sounds.Library.brushguil = [new Audio("snd/brush/guilloche.mp3")];
KiddoPaint.Sounds.Library.brushtree = [new Audio("snd/brush/tree.mp3")];
KiddoPaint.Sounds.Library.brushstars = [new Audio("snd/brush/stars.mp3")];
KiddoPaint.Sounds.Library.brushxos = [new Audio("snd/brush/xos.mp3")];
KiddoPaint.Sounds.Library.brushcards = [new Audio("snd/brush/cards.mp3")];
KiddoPaint.Sounds.Library.brushshapes = [new Audio("snd/brush/shapes.mp3")];
KiddoPaint.Sounds.Library.brushprints = [new Audio("snd/brush/prints.mp3")];
KiddoPaint.Sounds.Library.brushspraypaint = [
  new Audio("snd/brush/spraypaint.mp3"),
];

KiddoPaint.Sounds.Library.mixerwallpaper = [
  new Audio("snd/mixer/wallpaper-jitter-boingo.mp3"),
];
KiddoPaint.Sounds.Library.mixerinvert = [
  new Audio("snd/mixer/inverter-rolling-sound.mp3"),
];
KiddoPaint.Sounds.Library.mixervenetian = [new Audio("snd/mixer/venetian.mp3")];
KiddoPaint.Sounds.Library.mixershadowbox = [
  new Audio("snd/mixer/shadow-boxes.mp3"),
];
KiddoPaint.Sounds.Library.mixerpip = [
  new Audio("snd/mixer/pip-drum-crash-1.mp3"),
];
KiddoPaint.Sounds.Library.mixerframe = [
  new Audio("snd/misc/western-gun-shot-twirl.mp3"),
];

KiddoPaint.Sounds.Library.unimpl = [new Audio("snd/misc/chord.mp3")];
KiddoPaint.Sounds.Library.todo = [new Audio("snd/misc/todo.m4a")];

// multipart sounds; start, during, end
KiddoPaint.Sounds.Library.line = [
  new Audio("snd/line/line-start.mp3"),
  new Audio("snd/line/line-start.mp3"),
  new Audio("snd/line/line-end.mp3"),
];
KiddoPaint.Sounds.Library.truck = [
  new Audio("snd/truck/truck-truckin.mp3"),
  new Audio("snd/truck/truck-truckin-go.mp3"),
  new Audio("snd/truck/truck-skid.mp3"),
];
KiddoPaint.Sounds.Library.xy = [
  new Audio("snd/brush/xy-start.mp3"),
  new Audio("snd/brush/xy-during.mp3"),
  new Audio("snd/brush/xy-end.mp3"),
];

KiddoPaint.Sounds.Library.english = {
  A: "snd/text/letters/a.mp3",
  B: "snd/text/letters/b.mp3",
  C: "snd/text/letters/c.mp3",
  D: "snd/text/letters/d.mp3",
  E: "snd/text/letters/e.mp3",
  F: "snd/text/letters/f.mp3",
  G: "snd/text/letters/g.mp3",
  H: "snd/text/letters/h.mp3",
  I: "snd/text/letters/i.mp3",
  J: "snd/text/letters/j.mp3",
  K: "snd/text/letters/k.mp3",
  L: "snd/text/letters/l.mp3",
  M: "snd/text/letters/m.mp3",
  N: "snd/text/letters/n.mp3",
  O: "snd/text/letters/o.mp3",
  P: "snd/text/letters/p.mp3",
  Q: "snd/text/letters/q.mp3",
  R: "snd/text/letters/r.mp3",
  S: "snd/text/letters/s.mp3",
  T: "snd/text/letters/t.mp3",
  U: "snd/text/letters/u.mp3",
  V: "snd/text/letters/v.mp3",
  W: "snd/text/letters/w.mp3",
  X: "snd/text/letters/x.mp3",
  Y: "snd/text/letters/y.mp3",
  Z: "snd/text/letters/z.mp3",
  0: "snd/text/numbers/0.mp3",
  1: "snd/text/numbers/1.mp3",
  2: "snd/text/numbers/2.mp3",
  3: "snd/text/numbers/3.mp3",
  4: "snd/text/numbers/4.mp3",
  5: "snd/text/numbers/5.mp3",
  6: "snd/text/numbers/6.mp3",
  7: "snd/text/numbers/7.mp3",
  8: "snd/text/numbers/8.mp3",
  9: "snd/text/numbers/9.mp3",

  10: "snd/text/numbers/jcp - 10.m4a",
  11: "snd/text/numbers/jcp - 11.m4a",
  12: "snd/text/numbers/jcp - 12.m4a",
  13: "snd/text/numbers/jcp - 13.m4a",
  14: "snd/text/numbers/jcp - 14.m4a",
  15: "snd/text/numbers/jcp - 15.m4a",
  16: "snd/text/numbers/jcp - 16.m4a",
  17: "snd/text/numbers/jcp - 17.m4a",
  18: "snd/text/numbers/jcp - 18.m4a",
  19: "snd/text/numbers/jcp - 19.m4a",
  20: "snd/text/numbers/jcp - 20.m4a",
  21: "snd/text/numbers/jcp - 21.m4a",
  22: "snd/text/numbers/jcp - 22.m4a",
  23: "snd/text/numbers/jcp - 23.m4a",
  24: "snd/text/numbers/jcp - 24.m4a",
  25: "snd/text/numbers/jcp - 25.m4a",

  _: "snd/text/symbols/dp - underscore.m4a",
  "*": "snd/text/symbols/dp - star.m4a",
  "/": "snd/text/symbols/dp - slash.m4a",
  "'": "snd/text/symbols/dp - single quote.m4a",
  ";": "snd/text/symbols/dp - semicolon.m4a",
  ")": "snd/text/symbols/dp - right paren.m4a",
  "]": "snd/text/symbols/dp - right bracket.m4a",
  "}": "snd/text/symbols/dp - right brace.m4a",
  "?": "snd/text/symbols/dp - question mark.m4a",
  "#": "snd/text/symbols/dp - pound.m4a",
  "+": "snd/text/symbols/dp - plus.m4a",
  "|": "snd/text/symbols/dp - pipe.m4a",
  ".": "snd/text/symbols/dp - period.m4a",
  "%": "snd/text/symbols/dp - percent.m4a",
  "<": "snd/text/symbols/dp - less than.m4a",
  "(": "snd/text/symbols/dp - left paren.m4a",
  "[": "snd/text/symbols/dp - left bracket.m4a",
  "{": "snd/text/symbols/dp - left brace.m4a",
  "-": "snd/text/symbols/dp - hyphen.m4a",
  ">": "snd/text/symbols/dp - greater than.m4a",
  "!": "snd/text/symbols/dp - exclam pt.m4a",
  "=": "snd/text/symbols/dp - equals.m4a",
  '"': "snd/text/symbols/dp - double quote.m4a",
  $: "snd/text/symbols/dp - dollar.m4a",
  ",": "snd/text/symbols/dp - comma.m4a",
  ":": "snd/text/symbols/dp - colon.m4a",
  "^": "snd/text/symbols/dp - caret.m4a",
  "`": "snd/text/symbols/dp - backtick.m4a",
  "\\": "snd/text/symbols/dp - backslash.m4a",
  "@": "snd/text/symbols/dp - at.m4a",
  "&": "snd/text/symbols/dp - ampersand.m4a",
};

KiddoPaint.Sounds.Library.playRand = function (sound) {
  if (KiddoPaint.Sounds.Library.enabled && KiddoPaint.Sounds.Library[sound]) {
    var idx = Math.floor(
      Math.random() * KiddoPaint.Sounds.Library[sound].length,
    );
    var s = KiddoPaint.Sounds.Library[sound][idx];
    if (s) {
      s.play();
    }
  }
};

KiddoPaint.Sounds.Library.playKey = function (key) {
  if (
    KiddoPaint.Sounds.Library.enabled &&
    KiddoPaint.Sounds.Library.english[key]
  ) {
    var s = KiddoPaint.Sounds.Library.english[key];
    if (s) {
      const a = new Audio(s);
      a.play();
    }
  }
};

KiddoPaint.Sounds.Library.playIdx = function (sound, idx) {
  if (
    KiddoPaint.Sounds.Library.enabled &&
    KiddoPaint.Sounds.Library[sound] &&
    idx < KiddoPaint.Sounds.Library[sound].length
  ) {
    var s = KiddoPaint.Sounds.Library[sound][idx];
    if (s) {
      s.play();
    }
  }
};

KiddoPaint.Sounds.Library.playSingle = function (sound) {
  if (KiddoPaint.Sounds.Library.enabled && KiddoPaint.Sounds.Library[sound]) {
    var s = KiddoPaint.Sounds.Library[sound][0];
    if (s) {
      s.play();
    }
  }
};

KiddoPaint.Sounds.Library.pplaySingle = async function (sound) {
  if (KiddoPaint.Sounds.Library.enabled && KiddoPaint.Sounds.Library[sound]) {
    var s = KiddoPaint.Sounds.Library[sound][0];
    if (s) {
      await pplayAudio(s);
    }
  }
};

function pplayAudio(audio) {
  return new Promise((res) => {
    audio.play();
    audio.onended = res;
  });
}

// randomzied sounds
KiddoPaint.Sounds.explosion = function () {
  KiddoPaint.Sounds.Library.playRand("explosion");
};
KiddoPaint.Sounds.oops = function () {
  KiddoPaint.Sounds.Library.playRand("oops");
};
KiddoPaint.Sounds.bubblepops = function () {
  KiddoPaint.Sounds.Library.playRand("bubblepops");
};

// multipart sounds
KiddoPaint.Sounds.lineStart = function () {
  KiddoPaint.Sounds.Library.playIdx("line", 0);
};

KiddoPaint.Sounds.lineDuring = function () {
  KiddoPaint.Sounds.Library.playIdx("line", 1);
};

KiddoPaint.Sounds.lineEnd = function () {
  KiddoPaint.Sounds.Library.playIdx("line", 2);
};

KiddoPaint.Sounds.truckStart = function () {
  KiddoPaint.Sounds.Library.playIdx("truck", 0);
};

KiddoPaint.Sounds.truckDuring = function () {
  KiddoPaint.Sounds.Library.playIdx("truck", 1);
};

KiddoPaint.Sounds.truckEnd = function () {
  KiddoPaint.Sounds.Library.playIdx("truck", 2);
};

KiddoPaint.Sounds.xyStart = function () {
  KiddoPaint.Sounds.Library.playIdx("xy", 0);
};

KiddoPaint.Sounds.xyDuring = function () {
  KiddoPaint.Sounds.Library.playIdx("xy", 1);
};

KiddoPaint.Sounds.xyEnd = function () {
  KiddoPaint.Sounds.Library.playIdx("xy", 2);
};

// single target sounds
KiddoPaint.Sounds.pencil = function () {
  KiddoPaint.Sounds.Library.playSingle("pencil");
};
KiddoPaint.Sounds.box = function () {
  KiddoPaint.Sounds.Library.playSingle("box");
};
KiddoPaint.Sounds.circle = function () {
  KiddoPaint.Sounds.Library.playSingle("circle");
};
KiddoPaint.Sounds.stamp = function () {
  KiddoPaint.Sounds.Library.playSingle("stamp");
};
KiddoPaint.Sounds.paintcan = function () {
  KiddoPaint.Sounds.Library.playSingle("paintcan");
};
KiddoPaint.Sounds.mainmenu = function () {
  KiddoPaint.Sounds.Library.playSingle("mainmenu");
};
KiddoPaint.Sounds.submenucolor = function () {
  KiddoPaint.Sounds.Library.playSingle("submenucolor");
};
KiddoPaint.Sounds.submenuoption = function () {
  KiddoPaint.Sounds.Library.playSingle("submenuoption");
};
KiddoPaint.Sounds.unimpl = function () {
  KiddoPaint.Sounds.Library.playSingle("unimpl");
};
KiddoPaint.Sounds.todo = function () {
  KiddoPaint.Sounds.Library.playSingle("todo");
};
KiddoPaint.Sounds.brushzigzag = function () {
  KiddoPaint.Sounds.Library.playSingle("brushzigzag");
};
KiddoPaint.Sounds.brushleakypen = function () {
  KiddoPaint.Sounds.Library.playSingle("brushleakypen");
};
KiddoPaint.Sounds.brushbubbly = function () {
  KiddoPaint.Sounds.Library.playSingle("brushbubbly");
};
KiddoPaint.Sounds.brushdots = function () {
  KiddoPaint.Sounds.Library.playSingle("brushdots");
};
KiddoPaint.Sounds.brushpies = function () {
  KiddoPaint.Sounds.Library.playSingle("brushpies");
};
KiddoPaint.Sounds.brushecho = function () {
  KiddoPaint.Sounds.Library.playSingle("brushecho");
};
KiddoPaint.Sounds.brushnorthern = function () {
  KiddoPaint.Sounds.Library.playSingle("brushnorthern");
};
KiddoPaint.Sounds.brushfuzzer = function () {
  KiddoPaint.Sounds.Library.playSingle("brushfuzzer");
};
KiddoPaint.Sounds.brushzoom = function () {
  KiddoPaint.Sounds.Library.playSingle("brushzoom");
};
KiddoPaint.Sounds.brushpines = function () {
  KiddoPaint.Sounds.Library.playSingle("brushpines");
};
KiddoPaint.Sounds.brushtwirly = function () {
  KiddoPaint.Sounds.Library.playSingle("brushtwirly");
};
KiddoPaint.Sounds.brushkaliediscope = function () {
  KiddoPaint.Sounds.Library.playSingle("brushkaliediscope");
};
KiddoPaint.Sounds.brushrollingdots = function () {
  KiddoPaint.Sounds.Library.playSingle("brushrollingdots");
};
KiddoPaint.Sounds.brushinvert = function () {
  KiddoPaint.Sounds.Library.playSingle("brushinvert");
};
KiddoPaint.Sounds.brushguil = function () {
  KiddoPaint.Sounds.Library.playSingle("brushguil");
};
KiddoPaint.Sounds.brushtree = function () {
  KiddoPaint.Sounds.Library.playSingle("brushtree");
};
KiddoPaint.Sounds.brushstars = function () {
  KiddoPaint.Sounds.Library.playSingle("brushstars");
};
KiddoPaint.Sounds.brushxos = function () {
  KiddoPaint.Sounds.Library.playSingle("brushxos");
};
KiddoPaint.Sounds.brushcards = function () {
  KiddoPaint.Sounds.Library.playSingle("brushcards");
};
KiddoPaint.Sounds.brushshapes = function () {
  KiddoPaint.Sounds.Library.playSingle("brushshapes");
};
KiddoPaint.Sounds.brushprints = function () {
  KiddoPaint.Sounds.Library.playSingle("brushprints");
};
KiddoPaint.Sounds.brushspraypaint = function () {
  KiddoPaint.Sounds.Library.playSingle("brushspraypaint");
};
KiddoPaint.Sounds.mixerwallpaper = function () {
  KiddoPaint.Sounds.Library.playSingle("mixerwallpaper");
};
KiddoPaint.Sounds.mixerinvert = function () {
  KiddoPaint.Sounds.Library.playSingle("mixerinvert");
};
KiddoPaint.Sounds.mixervenetian = function () {
  KiddoPaint.Sounds.Library.playSingle("mixervenetian");
};
KiddoPaint.Sounds.mixershadowbox = function () {
  KiddoPaint.Sounds.Library.playSingle("mixershadowbox");
};
KiddoPaint.Sounds.mixerpip = function () {
  KiddoPaint.Sounds.Library.playSingle("mixerpip");
};
KiddoPaint.Sounds.mixerframe = function () {
  KiddoPaint.Sounds.Library.playSingle("mixerframe");
};
KiddoPaint.Sounds.eraserfadea = function () {
  KiddoPaint.Sounds.Library.playSingle("eraserfade");
};
KiddoPaint.Sounds.eraser = function () {
  KiddoPaint.Sounds.Library.playSingle("eraser");
};
KiddoPaint.Sounds.eraserfadeb = function () {
  KiddoPaint.Sounds.Library.playSingle("mixerpip");
};
