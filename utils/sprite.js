import {Transform} from '../utils/transform.js';

export class Sprite {
  constructor(image) {
    this.image = image;
    this.transform = new Transform();
  }
}
