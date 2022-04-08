import {Job} from './job.js';

export class Entity extends Job {
  constructor(game, parentJob, args) {
    super(game, parentJob);
    this.initPresetComponents();
    this.init(args);
  }

  initPresetComponents() {}

  init(args) {}

  async body(args) {
    console.warn('async body() not implemented for:', this);
  }
}
