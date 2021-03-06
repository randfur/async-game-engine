import {Job} from './job.js';

/*
interface Entity extends Job {
  initPresetParts(): void,
  init(args): void,
  async body(args): void,
}
*/
export class Entity extends Job {
  constructor(scene, parentJob, args) {
    super(scene, parentJob);
    this.initPresetParts();
    this.init(args);
  }

  initPresetParts() {}

  init(args) {}

  async body(args) {
    console.warn('async body() not implemented for:', this);
  }
}
