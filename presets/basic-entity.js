import {Entity} from '../engine/entity.js';

export class BasicEntity extends Entity {
  initPresetParts() {
    // TODO: Add collision handle when it exists.
    // TODO: Add sprite handle when it exists.
    this.drawHandle = this.scene.drawing2d.register(this, this.onDraw.bind(this));
    this.collider = this.scene.collision2d.register(this, this.onCollision.bind(this));
  }

  onCollision(otherCollider) {}

  onDraw(context, width, height) {}
}


