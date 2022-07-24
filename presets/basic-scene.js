import {Scene} from '../../engine/scene.js';
import {Drawing2d} from './drawing-2d.js';
import {Collision2d} from './collision-2d.js';

export class BasicScene extends Scene {
  initPresetParts() {
    this.drawing2d = this.create(Drawing2d);
    this.collision = this.create(Collision2d);
  }
}
