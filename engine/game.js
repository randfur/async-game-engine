import {Job} from './job.js';
import {removeItems} from '../utils/array.js';
import {CreateResolveablePromise} from '../utils/promise.js';

export class Game {
  #activeScene;

  constructor(args) {
    // this.time = performance.now() / 1000;
    // this.timeDelta = 0;
    // this.clampedTimeDelta = 0;
    // this.maxTimeDelta = maxTimeDelta;
    // this.nextTick = CreateResolveablePromise();

    // this.stopped = CreateResolveablePromise();

    this.initPresetParts(args);

    this.#activeScene = null;
    this.background = new (class extends Scene {
      body: args.run,
    })(this);

    this.#runGame();
  }

  initPresetParts() {}

  async #runGame() {
    let done = false;

    (async () => {
    });
    while (true) {
      await new Promise(requestAnimationFrame);
      this.background.
    }
  }
}