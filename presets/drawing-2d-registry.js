import {removeItem} from '../utils/array.js';

export class Drawing2dRegistry {
  constructor(cameraTransform) {
    this.drawHandles = [];
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

  onDraw(context, width, height) {
    this.drawHandles.sort((a, b) => a.zIndex - b.zIndex);
    for (const {drawFunc} of this.drawHandles) {
      drawFunc(context, width, height);
    }
  }
}
