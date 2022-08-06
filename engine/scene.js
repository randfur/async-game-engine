import {Job} from './job.js';
import {removeItems} from '../utils/array.js';
import {CreateResolveablePromise} from '../utils/promise.js';

/*
interface Scene {
  game: Game,
  stopped: Promise<void>,
  persists: boolean,
  time: number
  pausedAtGameTime: number,
  nextTick: Promise<number>,

  initPresetParts(): void,
  async run(): void,
  do(async (job, scene, game) => void): Job,
  create(EntityType, args): Entity,
  stop(): void,
}
*/
export class Scene extends Job {
  #gameTimeAhead;
  #jobs;

  constructor(game) {
    // Unable to use `this` in super() call.
    super(null, null);
    this.scene = this;
    this.game = game;
    this.stopped = CreateResolveablePromise();
    this.persists = false;
    this.time = 0;
    this.pausedAtGameTime = null;
    this.#gameTimeAhead = 0;
    this.nextTick = CreateResolveablePromise();
    this.nextGameTick = CreateResolveablePromise();
    this.#jobs = [];

    this.initPresetParts();

    this.#startJob(this, () => this.run());

    (async () => {
      while (!this.stopped.resolved) {
        const gameTime = await this.nextGameTick;
        if (this.pausedAtGameTime !== null) {
          this.#gameTimeAhead += gameTime - this.pausedAtGameTime;
          this.pausedAtGameTime = null;
        }
        this.time = gameTime - this.#gameTimeAhead;

        this.nextTick.resolve(this.time);
        this.nextTick = CreateResolveablePromise();

        removeItems(this.#jobs, job => job.stopped.resolved);
      }
    })();
  }

  initPresetParts() {}

  async run() {}

  onDraw(context, width, height) {}

  do(run, parentJob=null) {
    const job = new Job(this, parentJob);
    this.#startJob(job, () => run(job, this, this.game));
    return job;
  }

  static #emptyArgs = Object.freeze({});
  create(EntityType, args=Scene.#emptyArgs, parentJob=null) {
    const entity = new EntityType(this, parentJob, args);
    this.#startJob(entity, () => entity.body());
    return entity;
  }

  #startJob(job, runJob) {
    this.#jobs.push(job);
    (async () => {
      try {
        await runJob();
      } catch (error) {
        if (error !== Job.StopSignal) {
          throw error;
        }
      }
      job.stop();
    })();
  }

  stop() {
    if (this.stopped.resolved) {
      return;
    }
    for (const job of this.#jobs) {
      if (job !== this) {
        job.stop();
      }
    }
    this.stopped.resolve();
  }
}

