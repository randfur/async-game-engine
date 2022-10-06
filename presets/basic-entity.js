import {Entity} from '../engine/entity.js';
import {Mat3} from '../utils/mat3.js';
import {Transform} from '../utils/transform.js';
import {Vec2} from '../utils/vec2.js';

export class BasicEntity extends Entity {
  initPresetParts() {
    if (this.onInput !== BasicEntity.prototype.onInput) {
      this.scene.inputRegistry.register(this, this.onInput.bind(this));
    }
    this.drawHandle = this.scene.drawing2dRegistry.register(this, (context, width, height) => {
      this.onDraw(context, width, height);
    });
    this.collider = null;
    this.transform = new Transform();
    this.sprite = null;
  }

  onInput(eventName, event) {}

  enableCollisions() {
    this.collider = this.scene.collision2dRegistry.register(
      this,
      collisionNode => this.updateCollisionNode(collisionNode),
      otherCollider => this.onCollision(otherCollider),
    );
    this.collider.transform = this.transform;
  }

  updateCollisionNode(collisionNode) {
    if (!this.sprite) {
      return false;
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

    return true;
  }

  onCollision(otherCollider) {}

  onDraw(context, width, height) {
    this.drawActiveSprite(context);
  }

  drawActiveSprite(context) {
    if (this.sprite) {
      this.drawSprite(context, this.sprite);
    }
  }

  static #drawSpriteMatrix = new Mat3();
  drawSprite(context, sprite) {
    const matrix = BasicEntity.#drawSpriteMatrix;
    matrix.setIdentity();
    sprite.transform.applyToMatrix(matrix);
    this.transform.applyToMatrix(matrix);
    this.scene.cameraTransform.applyToMatrix(matrix);
    matrix.applyToContext(context);
    context.drawImage(sprite.image, 0, 0);
  }
}
