import {Job} from './job.js';
import {removeItems} from '../utils/array.js';
import {CreateResolveablePromise} from '../utils/promise.js';

export class Game {
  #activeJobs;

  constructor(args) {
    const {run, maxTimeDelta=1 / 30} = args;

    this.time = performance.now() / 1000;
    this.timeDelta = 0;
    this.clampedTimeDelta = 0;
    this.maxTimeDelta = maxTimeDelta;
    this.nextTick = CreateResolveablePromise();

    this.#activeJobs = [];
    this.stopped = CreateResolveablePromise();

    this.initPresetParts(args);

    this.#startGame(run);
  }

  initPresetParts() {}

  do(run, parentJob=null) {
    const job = new Job(this, parentJob);
    this.#startJob(job, () => run(job, this));
    return job;
  }

  static #emptyArgs = Object.freeze({});
  create(EntityType, args=Game.#emptyArgs, parentJob=null) {
    const entity = new EntityType(this, parentJob, args);
    this.#startJob(entity, () => entity.body(args));
    return entity;
  }

  #startJob(job, run) {
    this.#activeJobs.push(job);
    const runComplete = run();
    (async () => {
      try {
        await runComplete;
      } catch (error) {
        if (error !== Job.StopSignal) {
          throw error;
        }
      }
      job.stop();
    })();
  }

  async #startGame(run) {
    this.do(run);

    while (true) {
      const newTime = await new Promise(requestAnimationFrame) / 1000;
      this.timeDelta = Math.min(newTime - this.time, this.maxTimeDelta);
      this.time = newTime;


      const oldTick = this.nextTick;
      this.nextTick = CreateResolveablePromise();
      oldTick.resolve();

      removeItems(this.#activeJobs, job => job.isStopped());

      if (this.#activeJobs.length === 0) {
        break;
      }
    }

    this.stopped.resolve();
  }
}