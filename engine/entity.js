import {Job} from './job.js';

/*
interface Entity extends Job {
  initPresetParts(): void,
  init(args): void,
  async run(): void,
}
*/
export class Entity extends Job {
  constructor(scene, parentJob, args) {
    super(scene, parentJob);
    this.initPresetParts();
    this.initalised = this.init(args);
  }

  initPresetParts() {}

  async init(args) {}

  async run() {
    console.warn('async run() not implemented for:', this);
  }
}
