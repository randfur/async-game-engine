export class Job {
  static StopSignal = Symbol('StopSignal');

  #cleanUpFuncs;
  #resolveStopped;

  constructor(game, parentJob) {
    this.game = game;
    this.parentJob = parentJob;
    this.#cleanUpFuncs = [];
    this.isSelfStopped = false;
    this.stopped = new Promise(resolve => this.#resolveStopped = resolve);
  }

  do(run) {
    return this.game.do(run, this);
  }

  create(EntityType, args) {
    return this.game.create(EntityType, args, this);
  }

  async tick() {
    await this.game.nextTick;
    if (this.isStopped()) {
      throw Job.StopSignal;
    }
  }

  async sleep(seconds) {
    const startTime = this.game.time;
    while (true) {
      await this.tick();
      if (this.game.time - startTime >= seconds) {
        break;
      }
    }
  }

  forever() {
    return this.sleep(Infinity);
  }

  registerCleanUp(cleanUpFunc) {
    this.#cleanUpFuncs.push(cleanUpFunc);
  }

  isStopped() {
    return this.isSelfStopped || this.parentJob?.isStopped();
  }

  stop() {
    if (this.isSelfStopped) {
      return;
    }
    this.isSelfStopped = true;
    this.#resolveStopped();
    for (let cleanUpFunc of this.#cleanUpFuncs) {
      cleanUpFunc();
    }
  }
}