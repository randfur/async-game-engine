import {Game} from '../../engine/game.js';
import {Drawing} from '../parts/game/drawing.js';

export class BasicGame extends Game {
  initPresetParts(args) {
    this.drawing = new Drawing(args.drawing);
  }

  get width() { return this.drawing.width; }
  get height() { return this.drawing.height; }
}