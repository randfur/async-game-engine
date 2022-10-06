import {Entity} from '../engine/entity.js';
import {Sprite} from './sprite.js';
import {Vec2} from '../utils/vec2.js';
import {Transform} from '../utils/transform.js';

export class BasicEntity extends Entity {
  initPresetParts() {
    // TODO: Add sprite handle when it exists.
    if (this.onInput !== BasicEntity.prototype.onInput) {
      this.scene.inputRegistry.register(this, this.onInput.bind(this));
    }
    if (this.onDraw !== BasicEntity.prototype.onDraw) {
      this.drawHandle = this.scene.drawing2dRegistry.register(this, (context, width, height) => {
        this.onDraw(context, width, height);
      });
    }
    this.collider = null;
    this.transform = new Transform();
  }

  loadSprite(src) {
    return new Sprite(
      src,
      /*parentTransform=*/this.transform,
      this.scene.cameraTransform,
    );
  }

  enableCollisions() {
    const collisionBoundingBoxPoints = [
      new Vec2(),
      new Vec2(),
      new Vec2(),
      new Vec2(),
    ];
    this.collider = this.scene.collision2dRegistry.register(
      this,
      collisionNode => {
        const [a, b, c, d] = collisionBoundingBoxPoints;
        a.set(0, 0);
        b.set(this.sprite.image.width, 0);
        c.set(this.sprite.image.width, this.sprite.image.height);
        d.set(0, this.sprite.image.height);

      },
      otherCollider => this.onCollision(otherCollider),
    );
    this.collider.transform = this.transform;
  }

  onInput(eventName, event) {}

  onCollision(otherCollider) {}

  onDraw(context, width, height) {}
}
