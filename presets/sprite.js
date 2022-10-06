import {Vec2} from '../utils/vec2.js';
import {Mat3} from '../utils/mat3.js';
import {loadImage} from '../utils/image.js';
import {Transform} from '../utils/transform.js';

export class Sprite {
  constructor(src) {
    this.image = loadImage(src);
    this.transform = new Transform();
  }

  static #collisionBoundingBoxPoints = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
  static #collisionMatrix = new Mat3();
  updateCollisionNode(collisionNode, entityTransform) {
    const [a, b, c, d] = Sprite.#collisionBoundingBoxPoints;
    a.set(0, 0);
    b.set(this.image.width, 0);
    c.set(this.image.width, this.image.height);
    d.set(0, this.image.height);
    Sprite.#collisionMatrix.setIdentity();
    this.transform.applyToMatrix(Sprite.#collisionMatrix);
    entityTransform.applyToMatrix(Sprite.#collisionMatrix);
    for (const vector of Sprite.#collisionBoundingBoxPoints) {
      Sprite.#collisionMatrix.applyToVector(vector);
    }
    collisionNode.x = Math.min(a.x, b.x, c.x, d.x);
    collisionNode.y = Math.min(a.y, b.y, c.y, d.y);
    collisionNode.width = Math.max(a.x, b.x, c.x, d.x) - collisionNode.x;
    collisionNode.height = Math.max(a.y, b.y, c.y, d.y) - collisionNode.y;
  }
}