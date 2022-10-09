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
    let transform = this;

    while (transform) {
      // Origin
      // [1  0 -ox]   [a c e]
      // [0  1 -oy] * [b d f]
      // [0  0   1]   [0 0 1]
      matrix.e -= transform.origin.x;
      matrix.f -= transform.origin.y;

      // Scale
      // [sx  0  0]   [a c e]
      // [ 0 sy  0] * [b d f]
      // [ 0  0  1]   [0 0 1]
      const [sx, sy] = [transform.scale.x, transform.scale.y];
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
      const [cos, sin] = [transform.rotate.x, transform.rotate.y];
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
      matrix.e += transform.translate.x;
      matrix.f += transform.translate.y;

      transform = transform.parent;
    }
  }

  applyToVector(vector) {
    let transform = this;

    while (transform) {
      // Origin
      // [1  0 -ox]   [x]
      // [0  1 -oy] * [y]
      // [0  0   1]   [1]
      vector.x -= transform.origin.x;
      vector.y -= transform.origin.y;

      // Scale
      // [sx  0  0]   [x]
      // [ 0 sy  0] * [y]
      // [ 0  0  1]   [1]
      vector.x *= transform.scale.x;
      vector.y *= transform.scale.y;

      // Rotate
      // [cos -sin  0]   [x]
      // [sin  cos  0] * [y]
      // [  0    0  1]   [1]
      const [cos, sin] = [transform.rotate.x, transform.rotate.y];
      [vector.x, vector.y] = [
        /*x =*/ cos * vector.x - sin * vector.y,
        /*y =*/ sin * vector.x + cos * vector.y,
      ];

      // Translate
      // [1  0 tx]   [x]
      // [0  1 ty] * [y]
      // [0  0  1]   [1]
      vector.x += transform.translate.x;
      vector.y += transform.translate.y;

      transform = transform.parent;
    }
  }


  applyToContext(context) {
    const matrix = Mat3.pool.acquire();
    matrix.setIdentity();
    this.applyToMatrix(matrix);
    matrix.applyToContext(context);
    Mat3.pool.release(1);
  }
}