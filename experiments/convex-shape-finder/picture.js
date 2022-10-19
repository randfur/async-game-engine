import {BasicEntity} from '../../presets/basic-entity.js';
import {Sprite} from '../../utils/sprite.js';
import {random} from '../../utils/random.js';

export class Picture extends BasicEntity {
  init() {
    this.width = 100;
    this.height = 100;

    this.canvas = new OffscreenCanvas(this.width, this.height);
    this.context = this.canvas.getContext('2d');
    this.drawImage();
    this.imageData = this.context.getImageData(0, 0, this.width, this.height);

    this.sprite = new Sprite(this.canvas);
    this.sprite.transform.origin.set(
      Math.floor(this.canvas.width / 2),
      Math.floor(this.canvas.height / 2));

    this.transform.translate.set(
      Math.floor(this.game.width / 2),
      Math.floor(this.game.height / 2));
  }

  async run() {
    await this.forever();
  }

  drawImage() {
    const context = this.context;
    context.beginPath();
    context.moveTo(random(this.width), random(this.height));
    context.quadraticCurveTo(random(this.width), random(this.height), random(this.width), random(this.height));
    context.quadraticCurveTo(random(this.width), random(this.height), random(this.width), random(this.height));
    context.quadraticCurveTo(random(this.width), random(this.height), random(this.width), random(this.height));
    context.quadraticCurveTo(random(this.width), random(this.height), random(this.width), random(this.height));
    context.quadraticCurveTo(random(this.width), random(this.height), random(this.width), random(this.height));
    context.closePath();
    context.fillStyle = '#3af';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = '#04a';
    context.stroke();
  }
}

