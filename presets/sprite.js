import {loadImage} from '../utils/image.js';
import {Transform} from '../utils/transform.js';

export class Sprite {
  constructor(src, entityTransform, cameraTransform) {
    this.transform = new Transform();
    this.image = loadImage(src);
  }
}