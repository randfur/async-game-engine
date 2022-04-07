import {Entity} from './entity.js';

export class BasicEntity extends Entity {
  init() {
    // TODO: Add collision handle when it exists.
    // TODO: Add sprite handle when it exists.
    this.drawHandle = this.game.drawing.register(this, this.onDraw.bind(this));
  }

  async run(args, game) {
    console.warn('async run() not implemented for:', this);
  }

  onDraw(context, width, height) {}
}


