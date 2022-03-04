export class Vec2 {
  static #temps = [];
  static #reservedTemps = 0;

  static getTemp() {
    ++this.#reservedTemps;
    if (this.#temps.length < this.#reservedTemps) {
      this.#temps.push(new Vec2());
    }
    return this.#temps[this.#reservedTemps - 1];
  }

  static releaseTemps(n) {
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

  assignNormalLinesIntersection(lineA, lineB) {
    const dirA = Vec2.getTemp();
    dirA.assign(lineA.normal);
    dirA.rotateCW();

    const dirB = Vec2.getTemp();
    dirB.assign(lineB.normal);
    dirB.rotateCW();

    this.assignIntersection(lineA.position, dirA, lineB.position, dirB);

    Vec2.releaseTemps(2);
  }

  assignIntersection(startA, dirA, startB, dirB) {
    
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