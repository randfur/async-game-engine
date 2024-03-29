import {CreateResolveablePromise} from '../utils/promise.js';

/*
interface Job {
  scene: Scene,
  game: Game,
  stopped: Promise<void>,

  do(async (job, scene, game) => Promise<void>): Job,
  create(EntityType, args): Entity,
  async tick(): void,
  async sleep(seconds: number): void,
  async forever(): void,
  registerCleanUp(() => {}): void,
  stop(): void,
}
*/
export class Job {
  static StopSignal = Symbol('StopSignal');

  #cleanUpFuncs;
  #resolveStopped;

  constructor(scene, parentJob) {
    this.scene = scene;
    this.game = scene?.game;
    this.parentJob = parentJob;
    this.#cleanUpFuncs = [];
    this.stopped = CreateResolveablePromise();
  }

  do(run) {
    return this.scene.do(run, this);
  }

  create(EntityType, args) {
    return this.scene.create(EntityType, args, this);
  }

  async tick() {
    await this.scene.nextTick;
    if (this.isStopped()) {
      throw Job.StopSignal;
    }
    return this.scene.time;
  }

  async sleep(seconds) {
    const startTime = this.scene.time;
    while (true) {
      await this.tick();
      if (this.scene.time - startTime >= seconds) {
        break;
      }
    }
    return this.scene.time;
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