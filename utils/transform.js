import {Vec2} from './vec2.js';

export class Transform {
  constructor(parent=null) {
    this.parent = parent;
    this.offset = new Vec2(0, 0);
    this.scale = new Vec2(1, 1);
    this.rotate = new Vec2(1, 0);
    this.translate = new Vec2(0, 0);
  }

  applyToContext(context) {
    // [a c e]   [x]
    // [b d f] * [y]
    // [0 0 1]   [1]
    let a = 1;
    let b = 0;
    let c = 0;
    let d = 1;
    let e = 0;
    let f = 0;

    let transform = this;
    while (transform) {
      // Offset
      // [1  0 tx]   [a c e]
      // [0  1 ty] * [b d f]
      // [0  0  1]   [0 0 1]
      e += transform.offset.x;
      f += transform.offset.y;

      // Scale
      // [sx  0  0]   [a c e]
      // [ 0 sy  0] * [b d f]
      // [ 0  0  1]   [0 0 1]
      const [sx, sy] = [transform.scale.x, transform.scale.y];
      a *= sx;
      b *= sy;
      c *= sx;
      d *= sy;
      e *= sx;
      f *= sy;

      // Rotate
      // [cos -sin  0]   [a c e]
      // [sin  cos  0] * [b d f]
      // [  0    0  1]   [0 0 1]
      const [cos, sin] = [transform.rotate.x, transform.rotate.y];
      [a, b, c, d, e, f] = [
        /*a =*/ cos * a - sin * b,
        /*b =*/ sin * a + cos * b,
        /*c =*/ cos * c - sin * d,
        /*d =*/ sin * c + cos * d,
        /*e =*/ cos * e - sin * f,
        /*f =*/ sin * e + cos * f,
      ];

      // Translate
      // [1  0 tx]   [a c e]
      // [0  1 ty] * [b d f]
      // [0  0  1]   [0 0 1]
      e += transform.translate.x;
      f += transform.translate.y;

      transform = transform.parent;
    }

    context.setTransform(a, b, c, d, e, f);
  }
}