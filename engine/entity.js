import {Job} from './job.js';

export class Entity extends Job {
  constructor(game, parentJob) {
    super(game, parentJob);
    this.drawHandle = game.drawing.register(this, this.onDraw.bind(this));
  }

  async run(args, game) {
    console.warn('async run() not implemented for:', this);
  }

  onDraw(context, width, height) {}
}
