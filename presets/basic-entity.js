import {Entity} from './entity.js';

export class BasicEntity extends Entity {
  initPresetParts() {
    // TODO: Add collision handle when it exists.
    // TODO: Add sprite handle when it exists.
    this.drawHandle = this.game.drawing.register(this, this.onDraw.bind(this));
  }

  onDraw(context, width, height) {}
}


