import {Job} from './job.js';
import {removeItems} from '../utils/array.js';

export class Game {
  #activeJobs;
  #resolveNextTick;
  #resolveStopped;

  constructor({container, run, viewScale=1, maxClampedTimeDelta=1/30, collisionBranchSize=10}) {
    this.time = performance.now() / 1000;
    this.timeDelta = 0;
    this.clampedTimeDelta = 0;
    this.maxClampedTimeDelta = maxClampedTimeDelta;
    this.nextTick = new Promise(resolve => this.#resolveNextTick = resolve);

    // this.drawing = new Drawing({container, viewScale});
    // this.collision = new Collision();

    this.#activeJobs = [];
    this.stopped = new Promise(resolve => this.#resolveStopped = resolve);

    this.#startGame(run);
  }

  get width() { return this.drawing.width; }
  get height() { return this.drawing.height; }

  do(run, parentJob=null) {
    const job = new Job(this, parentJob);
    this.#startJob(job, () => run(job, this));
    return job;
  }

  create(EntityType, args, parentJob=null) {
    const entity = new EntityType(this, parentJob);
    this.#startJob(job, () => entity.run(args, this));
    return entity;
  }

  #startJob(job, run) {
    this.#activeJobs.push(job);
    (async () => {
      try {
        await run();
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
      this.timeDelta = newTime - this.time;
      this.clampedTimeDelta = Math.min(this.timeDelta, this.maxClampedTimeDelta);
      this.time = newTime;


      const resolveNextTick = this.#resolveNextTick;
      this.nextTick = new Promise(resolve => this.#resolveNextTick = resolve);
      resolveNextTick();

      removeItems(this.#activeJobs, job => job.isStopped());

      if (this.#activeJobs.length === 0) {
        break;
      }
    }
    this.#resolveStopped();
  }
}