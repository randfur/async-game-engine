import {Job} from './job.js';

export class Entity extends Job {
  constructor(game, parentJob, args) {
    super(game, parentJob);
    this.initPresetParts();
    this.init(args);
  }

  initPresetParts() {}

  init(args) {}

  async body(args) {
    console.warn('async body() not implemented for:', this);
  }
}
