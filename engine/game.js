import {Drawing} from './drawing.js';
import {Job} from './job.js';
import {removeItems} from '../utils/array.js';
import {CreateResolveablePromise} from '../utils/promise.js';

export class Game {
  #activeJobs;

  constructor({container, run, viewScale=1, clearFrames=true, maxClampedTimeDelta=1/30, collisionBranchSize=10}) {
    this.time = performance.now() / 1000;
    this.timeDelta = 0;
    this.clampedTimeDelta = 0;
    this.maxClampedTimeDelta = maxClampedTimeDelta;
    this.nextTick = CreateResolveablePromise();

    this.drawing = new Drawing({container, viewScale, clearFrames});
    // this.collision = new Collision();

    this.#activeJobs = [];
    this.stopped = CreateResolveablePromise();

    this.#startGame(run);
  }

  get width() { return this.drawing.width; }
  get height() { return this.drawing.height; }

  do(run, parentJob=null) {
    const job = new Job(this, parentJob);
    this.#startJob(job, () => run(job, this));
    return job;
  }

  static #emptyArgs = Object.freeze({});
  create(EntityType, args=Game.#emptyArgs, parentJob=null) {
    const entity = new EntityType(this, parentJob);
    this.#startJob(entity, () => entity.run(args, this));
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
      this.timeDelta = newTime - this.time;
      this.clampedTimeDelta = Math.min(this.timeDelta, this.maxClampedTimeDelta);
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