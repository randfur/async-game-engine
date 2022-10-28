import {Job} from './job.js';
import {removeItem, removeItems} from '../utils/array.js';
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
  #initialisingJobs;

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
    this.#initialisingJobs = [];
    this.jobs = [];

    this.initPresetParts();

    this.#startJob(
      /*job=*/this,
      /*jobInitialised=*/null,
      /*runJob=*/() => this.run(),
      /*stopJob=*/() => this.stop(),
    );
  }

  initPresetParts() {}

  async run() {}

  do(run, parentJob=null) {
    if (this.stopped.resolved) {
      return;
    }
    const job = new Job(this, parentJob);
    this.#startJob(
      /*job=*/job,
      /*jobInitialised=*/null,
      /*runJob=*/() => run(job, this, this.game),
      /*stopJob=*/() => job.stop(),
    );
    return job;
  }

  static #emptyArgs = Object.freeze({});
  create(EntityType, args=Scene.#emptyArgs, parentJob=null) {
    if (this.stopped.resolved) {
     return;
    }
    const entity = new EntityType(this, parentJob, args);
    this.#startJob(
      /*job=*/entity,
      /*jobInitialised=*/entity.initialised,
      /*runJob=*/async () => await entity.run(),
      /*stopJob=*/() => entity.stop(),
    );
    return entity;
  }

  async #startJob(job, jobInitialised, runJob, stopJob) {
    this.#initialisingJobs.push(job);
    await jobInitialised?.();
    removeItem(this.#initialisingJobs, job);
    if (job.stopped.resolved) {
      return;
    }
    this.jobs.push(job);
    try {
      await runJob();
    } catch (error) {
      if (error !== Job.StopSignal) {
        throw error;
      }
    }
    stopJob?.()
  }

  onFrame(gameTime) {
    if (this.pausedAtGameTime !== null) {
      this.#gameTimeAhead += gameTime - this.pausedAtGameTime;
      this.pausedAtGameTime = null;
    }
    this.time = gameTime - this.#gameTimeAhead;

    this.nextTick.resolve(this.time);
    this.nextTick = CreateResolveablePromise();

    removeItems(this.jobs, job => job.stopped.resolved);
  }

  stop() {
    if (this.stopped.resolved) {
      return;
    }
    for (const job of this.#initialisingJobs) {
      if (job !== this) {
        job.stop();
      }
    }
    for (const job of this.jobs) {
      if (job !== this) {
        job.stop();
      }
    }
    this.stopped.resolve();
  }

  onInput(eventName, event) {}

  onDraw(context, width, height) {}
}
