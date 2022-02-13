import {Job} from './job.js';

export class Entity extends Job {
  constructor(game, parentJob) {
    super(game, parentJob);
  }

  async run(args, game) {
    console.warn('async run() not implemented for:', this);
  }
}
