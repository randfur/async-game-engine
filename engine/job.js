export class Job {
  static StopSignal = Symbol('StopSignal');

  #cleanUpFuncs;

  constructor(game, parentJob) {
    this.game = game;
    this.parentJob = parentJob;
    this.#cleanUpFuncs = [];
    this.isSelfStopped = false;
  }

  do(run) {
    return this.game.do(run, this);
  }

  create(EntityType, args) {
    return this.game.create(EntityType, args, this);
  }

  async sleep(seconds) {
    const startTime = this.game.time;
    while (true) {
      await this.game.nextTick;
      if (this.isStopped()) {
        throw Job.StopSignal;
      }
      if (this.game.time - startTime >= seconds) {
        break;
      }
    }
  }

  register(cleanUpFunc) {
    this.#cleanUpFuncs.push(cleanUpFunc);
  }

  isStopped() {
    return this.isSelfStopped || this.parentJob?.isStopped();
  }

  stop() {
    this.isSelfStopped = true;
    const cleanUpFuncs = this.#cleanUpFuncs;
    this.#cleanUpFuncs = null;
    for (let cleanUpFunc of cleanUpFuncs) {
      cleanUpFunc();
    }
  }
}