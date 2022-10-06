import {Pool} from './pool.js';

export class Vec2 {
  static pool = new Pool(() => new Vec2());

  static squareDistance(va, vb) {
    return (va.x - vb.x) ** 2 + (va.y - vb.y) ** 2;
  }

  static distance(va, vb) {
    return Math.sqrt(Vec2.squareDistance(va, vb));
  }

  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  setPolar(angle, radius=1) {
    this.x = Math.cos(angle) * radius;
    this.y = Math.sin(angle) * radius;
  }

  copy(v) {
    this.x = v.x;
    this.y = v.y;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  assignSum(va, vb) {
    this.x = va.x + vb.x;
    this.y = va.y + vb.y;
  }

  assignSub(va, vb) {
    this.x = va.x - vb.x;
    this.y = va.y - vb.y;
  }

  assignScaledSum(va, ka, vb, kb) {
    this.x = va.x * ka + vb.x * kb;
    this.y = va.y * ka + vb.y * kb;
  }

  assignBoundariesIntersection(boundaryA, boundaryB) {
    const dirA = Vec2.pool.acquire();
    dirA.assign(boundaryA.normal);
    dirA.rotateCW();

    const dirB = Vec2.pool.acquire();
    dirB.assign(boundaryB.normal);
    dirB.rotateCW();

    this.assignIntersection(boundaryA.position, dirA, boundaryB.position, dirB);

    Vec2.pool.release(2);
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
      // dt2 - bht2/f = a + bg/f - be/f - c 
      // t2 = (a + bg/f - be/f - c)/(d - bh/f)
      t2 = (a + b * g / f - b * e / f - c) / (d - b * h / f);
    }
    this.x = c + d * t2;
    this.y = g + h * t2;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  addScaled(v, k) {
    this.x += k * v.x;
    this.y += k * v.y;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
  }

  scale(k) {
    this.x *= k;
    this.y *= k;
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

  normalise() {
    const length = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x /= length;
    this.y /= length;
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
}