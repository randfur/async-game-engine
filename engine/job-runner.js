import {Job} from './job.js';
import {removeItems} from '../utils/array.js';
import {CreateResolveablePromise} from '../utils/promise.js';

export class Scene {
  #activeJobs;

  constructor(game, scene) {
    this.game = game;
    this.scene = scene;
    this.#activeJobs = [];
  }

  do(run, parentJob=null) {
    const job = new Job(this, parentJob);
    this.#startJob(job, () => run(job));
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

  async processJobs() {
    while (true) {


      const oldTick = this.nextTick;
      this.nextTick = CreateResolveablePromise();
      oldTick.resolve();

      removeItems(this.#activeJobs, job => job.isStopped());

      if (this.#activeJobs.length === 0) {
        break;
      }
    }
  }
}