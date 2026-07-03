// Prototype extension used pervasively (40+ call sites): [].random().
// Declared ambiently in types/kiddopaint.d.ts.
Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

// https://stackoverflow.com/a/25984542
function fisherYatesArrayShuffle<T>(array: T[]): void {
  let count = array.length;
  let randomnumber: number;
  let temp: T;
  while (count) {
    randomnumber = (Math.random() * count--) | 0;
    temp = array[count];
    array[count] = array[randomnumber];
    array[randomnumber] = temp;
  }
}

// Expose for global access
window.fisherYatesArrayShuffle = fisherYatesArrayShuffle;
