import {Job} from './job.js';

export class Entity extends Job {
  constructor(game, parentJob, args) {
    super(game, parentJob);
    this.initPreset();
    this.init(args);
  }

  initPreset() {}

  init(args) {}

  async body(args) {
    console.warn('async run() not implemented for:', this);
  }
}
