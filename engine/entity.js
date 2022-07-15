import {Job} from './job.js';

export class Entity extends Job {
  constructor(jobRunner, parentJob, game, scene, args) {
    super(jobRunner, parentJob, game, scene);
    this.initPresetParts();
    this.init(args);
  }

  initPresetParts() {}

  init(args) {}

  async body(args) {
    console.warn('async body() not implemented for:', this);
  }
}
