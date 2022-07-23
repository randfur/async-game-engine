import {Scene} from '../../engine/scene.js';
import {SceneDrawing2d} from './scene-drawing-2d.js';

export class BasicScene extends Scene {
  initPresetParts() {
    this.drawing = new SceneDrawing2d(this);
  }
}
