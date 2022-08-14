import {Entity} from '../engine/entity.js';

export class BasicEntity extends Entity {
  initPresetParts() {
    // TODO: Add collision handle when it exists.
    // TODO: Add sprite handle when it exists.
    this.scene.inputRegistry.register(this, this.onInput.bind(this));
    this.drawHandle = this.scene.drawing2dRegistry.register(this, this.onDraw.bind(this));
    this.collider = this.scene.collision2dRegistry.register(this, this.onCollision.bind(this));
  }

  onInput(eventName, event) {}

  onCollision(otherCollider) {}

  onDraw(context, width, height) {}
}


