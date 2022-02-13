export class Job {
  #cleanUpFuncs;

  constructor(game, parentJob) {
    this.game = game;
    this.parentJob = parentJob;
    this.#cleanUpFuncs = [];
  }

  do(run) {
    return this.game.do(run, this.parentJob);
  }

  create(EntityType, args) {
    return this.game.create(EntityType, args, this);
  }

  cleanUp() {
    for (let cleanUpFunc of this.#cleanUpFuncs) {
      cleanUpFunc();
    }
  }
}