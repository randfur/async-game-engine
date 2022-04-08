import {BasicEntity} from '../../../engine/basic-entity.js';
import {random} from '../../../utils/random.js';

export class Picture extends BasicEntity {
  async body() {
    this.width = 100;
    this.height = 100;
    this.x = (this.game.width - this.width) / 2;
    this.y = (this.game.height - this.height) / 2;

    this.canvas = new OffscreenCanvas(this.width, this.height);
    this.context = this.canvas.getContext('2d');
    this.drawImage();
    this.imageData = this.context.getImageData(0, 0, this.width, this.height);

    await this.forever();
  }

  drawImage() {
    const context = this.context;
    context.beginPath();
    context.moveTo(random(this.width), random(this.height));
    context.lineTo(random(this.width), random(this.height));
    context.lineTo(random(this.width), random(this.height));
    context.lineTo(random(this.width), random(this.height));
    context.closePath();
    context.fillStyle = '#3af';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = '#04a';
    context.stroke();
  }

  onDraw(context, width, height) {
    context.drawImage(this.canvas, this.x, this.y);
  }
}

