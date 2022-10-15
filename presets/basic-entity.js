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
      collisionNode => this.updateBoundingBox(collisionNode),
      (other, otherCollider) => this.onCollision(other, otherCollider),
    );
    this.collider.transform = this.transform;
  }

  static #updateBoundingBoxPoints = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
  static #updateBoundingBoxMatrix = new Mat3();
  updateBoundingBox(boundingBox) {
    if (!this.sprite) {
      return false;
    }

    const image = this.sprite.image;
    const points = BasicEntity.#updateBoundingBoxPoints;
    points[0].set(0, 0);
    points[1].set(image.width, 0);
    points[2].set(image.width, image.height);
    points[3].set(0, image.height);

    const matrix = BasicEntity.#updateBoundingBoxMatrix;
    matrix.setIdentity();
    this.sprite.transform.applyToMatrix(matrix);
    this.transform.applyToMatrix(matrix);
    boundingBox.setFromMatrixTransformedPoints(matrix, points);
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
