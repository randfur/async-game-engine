import {Entity} from '../engine/entity.js';
import {Vec2} from '../utils/vec2.js';

export class BasicEntity extends Entity {
  initPresetParts() {
    // TODO: Add sprite handle when it exists.
    if (this.onInput !== BasicEntity.prototype.onInput) {
      this.scene.inputRegistry.register(this, this.onInput.bind(this));
    }
    if (this.onDraw !== BasicEntity.prototype.onDraw) {
      this.drawHandle = this.scene.drawing2dRegistry.register(this, this.onDraw.bind(this));
    }
    this.collider = null;
    this.position = new Vec2(0, 0);
  }

  enableCollisions() {
    this.collider = this.scene.collision2dRegistry.register(this, this.onCollision.bind(this));
    this.collider.position = this.position;
  }

  onInput(eventName, event) {}

  onCollision(otherCollider) {}

  onDraw(context, width, height) {}
}
