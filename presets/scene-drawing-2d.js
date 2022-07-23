export class SceneDrawing2d {
  constructor(scene) {
    this.scene = scene;
    this.game = scene.game;

    scene.do(async job => {
      while (true) {
        await job.nextTick();

        // if (this.canvas.width !== this.width || this.canvas.height !== this.height) {
        //   this.canvas.width = this.width;
        //   this.canvas.height = this.height;
        // }

        // if (clearFrames) {
        //   this.context.clearRect(0, 0, this.width, this.height);
        // }

        // if (!scene) {
        //   return;
        // }
        // const drawHandles = this.#sceneDrawHandles.get(scene);
        // drawHandles.sort((a, b) => a.zIndex - b.zIndex);
        // for (const {drawFunc} of drawHandles) {
        //   drawFunc(this.context, this.width, this.height);
        // }
      }
    });
  }
}