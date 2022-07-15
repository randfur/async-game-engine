export class Scene {
  constructor(game) {
    this.game = game;
    this.nextTick = CreateResolveablePromise();
    this.pausedAtTime = null;
    this.initPresetParts();
    this.init(args);
    this.stopped = CreateResolveablePromise();

    (async () => {
      while (!this.stopped.resolved) {
        await this.getNextTick();
      }
    })();
  }

  initPresetParts() {}

  init(args) {}

  onActivated() {}

  stop() {
    this.stopped.resolve();
  }
}

