export class Scene {
  #activeJobs;
  constructor(game, getNextTick, args) {
    this.game = game;
    this.getNextTick = getNextTick;
    this.pausedAtTime = null;
    this.initPresetParts();
    this.init(args);
    this.stopped = CreateResolveablePromise();
    this.#startScene();
  }

  initPresetParts() {}

  init(args) {}

  async run() {
    while (!this.stopped.resolved) {
      await this.getNextTick();
    }
  }
}

