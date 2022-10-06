import {Vec2} from './vec2.js';
import {Mat3} from './mat3.js';

export class Transform {
  constructor(parent=null) {
    this.parent = parent;
    this.origin = new Vec2(0, 0);
    this.scale = new Vec2(1, 1);
    this.rotate = new Vec2(1, 0);
    this.translate = new Vec2(0, 0);
  }

  applyToMatrix(matrix) {
    // Offset
    // [1  0 tx]   [a c e]
    // [0  1 ty] * [b d f]
    // [0  0  1]   [0 0 1]
    matrix.e -= this.origin.x;
    matrix.f -= this.origin.y;

    // Scale
    // [sx  0  0]   [a c e]
    // [ 0 sy  0] * [b d f]
    // [ 0  0  1]   [0 0 1]
    const [sx, sy] = [this.scale.x, this.scale.y];
    matrix.a *= sx;
    matrix.b *= sy;
    matrix.c *= sx;
    matrix.d *= sy;
    matrix.e *= sx;
    matrix.f *= sy;

    // Rotate
    // [cos -sin  0]   [a c e]
    // [sin  cos  0] * [b d f]
    // [  0    0  1]   [0 0 1]
    const [cos, sin] = [this.rotate.x, this.rotate.y];
    [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f] = [
      /*a =*/ cos * matrix.a - sin * matrix.b,
      /*b =*/ sin * matrix.a + cos * matrix.b,
      /*c =*/ cos * matrix.c - sin * matrix.d,
      /*d =*/ sin * matrix.c + cos * matrix.d,
      /*e =*/ cos * matrix.e - sin * matrix.f,
      /*f =*/ sin * matrix.e + cos * matrix.f,
    ];

    // Translate
    // [1  0 tx]   [a c e]
    // [0  1 ty] * [b d f]
    // [0  0  1]   [0 0 1]
    matrix.e += this.translate.x;
    matrix.f += this.translate.y;
  }

  applyToContext(context) {
    const matrix = Mat3.pool.acquire();
    matrix.setIdentity();
    this.applyToMatrix(matrix);
    matrix.applyToContext(context);
    Mat3.pool.release(1);
  }
}