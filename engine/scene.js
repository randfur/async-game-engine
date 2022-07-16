import {removeItems} from '../utils/array.js';

export class Scene {
  #activeJobs;
  #gameTimeAhead;
  constructor(game) {
    this.game = game;
    this.stopped = CreateResolveablePromise();
    this.persists = false;
    this.pausedAtGameTime = null;
    this.nextGameTick = CreateResolveablePromise();
    this.nextTick = CreateResolveablePromise();
    this.time = 0;
    this.#gameTimeAhead = 0;
    this.#activeJobs = [];

    this.initPresetParts();
    this.init(args);

    (async () => {
      while (!this.stopped.resolved) {
        const gameTime = await this.getNextGameTick();
        if (this.pausedAtGameTime !== null) {
          this.#gameTimeAhead += gameTime - this.pausedAtGameTime;
          this.pausedAtGameTime = null;
        }
        this.time = gameTime - this.#gameTimeAhead;

        this.nextTick.resolve(this.time);
        this.nextTick = CreateResolveablePromise();

        removeItems(this.#activeJobs, job => job.stopped.resolved);
      }
    })();
  }

  initPresetParts() {}

  init(args) {}

  stop() {
    this.stopped.resolve();
  }
}

