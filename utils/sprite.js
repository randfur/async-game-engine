import {loadImage} from '../utils/image.js';
import {Transform} from '../utils/transform.js';

export class Sprite {
  constructor(src) {
    this.image = loadImage(src);
    this.transform = new Transform();
  }
}
