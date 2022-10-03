import {image} from '../utils/image.js';
import {Transform} from '../utils/transform.js';

export class Sprite {
  constructor(src, parentTransform, cameraTransform) {
    this.transform = new Transform(parentTransform);
    this.cameraTransform = cameraTransform;
    this.image = loadImage(src);
  }

  draw(context) {
    this.transform.applyToContext(
      context,
      /*outerTransform=*/this.cameraTransform,
    );
  }
}