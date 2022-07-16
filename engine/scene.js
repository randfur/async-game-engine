import {removeItems} from '../utils/array.js';
import {Job} from './job.js';

export class Scene {
  #jobs;
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
    this.#jobs = [];

    this.initPresetParts();

    this.do(() => this.run());

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

        removeItems(this.#jobs, job => job.stopped.resolved);
      }
    })();
  }

  initPresetParts() {}

  async run() {}

  do(run, parentJob=null) {
    const job = new Job(this, parentJob);
    this.#startJob(job, () => run(job, this, this.game));
    return job;
  }

  static #emptyArgs = Object.freeze({});
  create(EntityType, args=#emptyArgs, parentJob=null) {
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
      job.stop();
    }
    this.stopped.resolve();
  }
}

