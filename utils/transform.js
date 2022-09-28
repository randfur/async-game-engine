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
      // // Pre-translate
      // // [a c e]   [1  0 tx]
      // // [b d f] * [0  1 ty]
      // // [0 0 1]   [0  0  1]
      // e = a * transform.translate.x + c * transform.translate.y + e;
      // f = b * transform.translate.x + d * transform.translate.y + f;

      // // Pre-rotate
      // // [a c e]   [cos -sin  0]
      // // [b d f] * [sin  cos  0]
      // // [0 0 1]   [  0    0  1]
      // const [cos, sin] = [transform.rotate.x, transform.rotate.y];
      // [a, b, c, d] = [
      //   /*a =*/ a * cos + c * sin,
      //   /*b =*/ b * cos + d * sin,
      //   /*c =*/ a * -sin + c * cos,
      //   /*d =*/ b * -sin + d * cos,
      // ];

      // // Pre-scale
      // // [a c e]   [sx  0  0]
      // // [b d f] * [ 0 sy  0]
      // // [0 0 1]   [ 0  0  1]
      // a *= transform.scale.x;
      // b *= transform.scale.x;
      // c *= transform.scale.y;
      // d *= transform.scale.y;

      // // Pre-offset
      // // [a c e]   [1  0 tx]
      // // [b d f] * [0  1 ty]
      // // [0 0 1]   [0  0  1]
      // e = a * transform.offset.x + c * transform.offset.y + e;
      // f = b * transform.offset.x + d * transform.offset.y + f;

      // Post-offset
      // [1  0 tx]   [a c e]
      // [0  1 ty] * [b d f]
      // [0  0  1]   [0 0 1]
      e += transform.offset.x;
      f += transform.offset.y;

      // Post-scale
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

      // Post-rotate
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

      // Post-translate
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