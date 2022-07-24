import {Scene} from '../../engine/scene.js';
import {Drawing2d} from './drawing-2d.js';

export class BasicScene extends Scene {
  initPresetParts() {
    this.drawing2d = this.create(Drawing2d);
  }
}
