import {Job} from './job.js';

export class Game {
  #activeJobs;
  #startJob;

  constructor({container, viewScale=1, run}) {
    this.drawing = new Drawing({container, viewScale});
    this.collision = new Collision();
    this.#activeJobs = [];

    this.do(run);
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
      await run();
      job.cleanUp();
    })();
  }
}