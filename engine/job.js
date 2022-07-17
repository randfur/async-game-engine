import {CreateResolveablePromise} from '../utils/promise.js';

/*
interface Job {
  do(async (job, scene, game) => Promise<void>): Job,
  create(EntityType, args): Entity,
  async tick(): void,
  async sleep(seconds: number): void,
  async forever(): void,
  stop(): void,
}
*/
export class Job {
  static StopSignal = Symbol('StopSignal');

  #cleanUpFuncs;
  #resolveStopped;

  constructor(scene, parentJob) {
    this.scene = scene;
    this.game = scene.game;
    this.parentJob = parentJob;
    this.#cleanUpFuncs = [];
    this.stopped = CreateResolveablePromise();
  }

  do(run) {
    return this.jobRunner.do(run, this);
  }

  create(EntityType, args) {
    return this.jobRunner.create(EntityType, this, args);
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
    return this.stopped.resolved || this.parentJob?.isStopped();
  }

  stop() {
    if (this.stopped.resolved) {
      return;
    }
    this.stopped.resolve();
    for (let cleanUpFunc of this.#cleanUpFuncs) {
      cleanUpFunc();
    }
  }
}