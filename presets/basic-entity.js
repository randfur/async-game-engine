import {Entity} from '../engine/entity.js';
import {Sprite} from './sprite.js';
import {Vec2} from '../utils/vec2.js';
import {Mat3} from '../utils/mat3.js';
import {Transform} from '../utils/transform.js';

export class BasicEntity extends Entity {
  initPresetParts() {
    // TODO: Add sprite handle when it exists.
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

  loadSprite(src) {
    return new Sprite(src);
  }

  enableCollisions() {
    this.collider = this.scene.collision2dRegistry.register(
      this,
      collisionNode => {
        if (!this.sprite) {
          return false;
        }
        this.sprite.updateCollisionNode(collisionNode, this.transform);
        return true;
      },
      otherCollider => this.onCollision(otherCollider),
    );
    this.collider.transform = this.transform;
  }

  onInput(eventName, event) {}

  onCollision(otherCollider) {}

  onDraw(context, width, height) {
    this.drawActiveSprite(context);
  }

  drawActiveSprite(context) {
    if (this.sprite) {
      this.drawSprite(context, this.sprite);
    }
  }

  drawSprite(context, sprite) {
    const matrix = Mat3.pool.acquire();
    matrix.setIdentity();
    sprite.transform.applyToMatrix(matrix);
    this.transform.applyToMatrix(matrix);
    this.scene.cameraTransform.applyToMatrix(matrix);
    matrix.applyToContext(context);
    Mat3.pool.release(1);
    context.drawImage(sprite.image, 0, 0);
  }
}
