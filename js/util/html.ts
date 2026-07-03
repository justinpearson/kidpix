// Prototype extension; declared ambiently in types/kiddopaint.d.ts.
HTMLElement.prototype.removeAllChildren = function () {
  while (this.lastChild) {
    this.removeChild(this.lastChild);
  }
};
