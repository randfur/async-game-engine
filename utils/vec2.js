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

  assignBoundariesIntersection(boundaryA, boundaryB) {
    const dirA = Vec2.getTemp();
    dirA.assign(boundaryA.normal);
    dirA.rotateCW();

    const dirB = Vec2.getTemp();
    dirB.assign(boundaryB.normal);
    dirB.rotateCW();

    this.assignIntersection(boundaryA.position, dirA, boundaryB.position, dirB);

    Vec2.releaseTemps(2);
  }

  assignIntersection(startA, dirA, startB, dirB) {
    const a = startA.x;
    const b = dirA.x;
    const c = startB.x;
    const d = dirB.x;
    const e = startA.y;
    const f = dirA.y;
    const g = startB.y;
    const h = dirB.y;
    // a + bt1 = c + dt2
    // e + ft1 = g + ht2
    let t2;
    if (Math.abs(b) > Math.abs(f)) {
      // t1 = (c + dt2 - a)/b
      // e + f/b*(c + dt2 - a) = g + ht2
      // ht2 - fdt2/b = e + fc/b - fa/b - g
      // t2 = (e + fc/b - fa/b - g)/(h - fd/b)
      t2 = (e + f * c / b - f * a / b - g) / (h - f * d / b);
    } else {
      // t1 = (g + ht2 - e)/f
      // a + b/f(g + ht2 - e) = c + dt2
      // dt2 - bht2/f = a + dg/f - be/f - c 
      // t2 = (a + dg/f - be/f - c)/(d - bh/f)
      t2 = (a + d * g / f - b * e / f - c) / (d - b * h / f);
    }
    this.x = c + d * t2;
    this.y = g + h * t2;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  addMul(k, v) {
    this.x += k * v.x;
    this.y += k * v.y;
  }

  // Rotates 90 degrees clockwise in a right handed co-ordinate system.
  rotateCW() {
    const x = this.x;
    this.x = -this.y;
    this.y = x;
  }

  // Rotates 90 degrees counter clockwise in a right handed co-ordinate system.
  rotateCCW() {
    const x = this.x;
    this.x = this.y;
    this.y = -x;
  }


}