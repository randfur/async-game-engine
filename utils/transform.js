import {Vec2} from './vec2.js';

export class Transform {
  constructor() {
    this.rotate = new Vec2(1, 0);
    this.scale = new Vec2(1, 1);
    this.translate = new Vec2(0, 0);
  }

  applyToContext(context) {
    // [a b e]   [x]
    // [c d f] * [y]
    // [0 0 1]   [1]

    // rotate
    //  [cos -sin  0]
    //  [sin  cos  0]
    //  [  0    0  1]
    const [cos, sin] = [this.rotate.x, this.rotate.y];
    let a = cos;
    let b = -sin;
    let c = sin;
    let d = cos;
    let e = 0;
    let f = 0;

    // scale
    //  [sx  0  0]   [a b e]
    //  [ 0 sy  0] * [c d f]
    //  [ 0  0  1]   [0 0 1]
    a *= this.scale.x;
    d *= this.scale.y;

    // translate
    //  [1  0 tx]   [a b e]
    //  [0  1 ty] * [c d f]
    //  [0  0  1]   [0 0 1]
    e += this.translate.x;
    f += this.translate.y;

    context.transform(a, b, c, d, e, f);
  }
}