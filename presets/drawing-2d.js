import {Entity} from '../engine/entity.js';

export class Drawing2d extends Entity {
  init() {
    this.drawHandles = [];
  }

  async body() {
    while (true) {
      await this.tick();
      this.drawHandles.sort((a, b) => a.zIndex - b.zIndex);
      for (const {drawFunc} of this.drawHandles) {
        drawFunc(this.game.drawing.context, this.game.drawing.width, this.game.drawing.width);
      }
    }
  }

  register(job, drawFunc) {
    const drawHandle = {
      zIndex: 0,
      drawFunc,
    };
    job.registerCleanUp(() => {
      removeItem(this.drawHandles, drawHandle);
    });
    this.drawHandles.push(drawHandle);
    return drawHandle;
  }
}