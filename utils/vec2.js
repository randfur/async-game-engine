export class Vec2 {
  static #temps = [];
  static #reservedTemps = 0;

  static withTemp(f) {
    ++this.#reservedTemps;
    if (this.#temps.length < this.#reservedTemps) {
      this.#temps.push(new Vec2());
    }
    f(this.#temps[this.#reservedTemps - 1]);
    --this.#reservedTemps;
  }

  static withTemps(n, f) {
    this.#reservedTemps += n;
    while (this.#temps.length < this.#reservedTemps) {
      this.#temps.push(new Vec2());
    }
    f(...this.#temps.slice(this.#reservedTemps - n, this.#reservedTemps));
    this.#reservedTemps -= n;
  }

  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  assign({x, y}) {
    this.x = x;
    this.y = y;
  }

  assignSum(va, vb) {
    this.x = va.x + vb.x;
    this.y = va.y + vb.y;
  }

  assignMulSum(ka, va, kb, vb) {
    this.x = ka * va.x + kb * vb.x;
    this.y = ka * va.y + kb * vb.y;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  addMul(k, v) {
    this.x += k * v.x;
    this.y += k * v.y;
  }

  rotateCW() {
    const x = this.x;
    this.x = -this.y;
    this.y = x;
  }

  rotateCCW() {
    const x = this.x;
    this.x = this.y;
    this.y = -x;
  }


}