import {Game} from '../../engine/game.js';
import {Entity} from '../../engine/entity.js';
import {random} from '../../utils/random.js';

function main() {
  new Game({
    container: document.body,
    viewScale: 3,
    async run(job, game) {
      const picture = game.create(Picture);
      const linesFinder = game.greate(LinesFinder, {
        maxLines: 20,
      });
      await linesFinder.foundLines;
      await job.forever();
    },
  });
}

class Picture extends Entity {
  async run(args, game) {
    this.width = 100;
    this.height = 100;
    this.x = (game.width - this.width) / 2;
    this.y = (game.height - this.height) / 2;

    this.canvas = new OffscreenCanvas(this.width, this.height);
    this.context = this.canvas.getContext('2d');
    this.drawImage();
    this.imageData = this.context.getImageData(0, 0, this.width, this.height);

    await this.forever();
  }

  drawImage() {
    this.context.fillStyle = '#fa3';
    this.context.beginPath();
    this.context.moveTo(random(this.width), random(this.height));
    this.context.lineTo(random(this.width), random(this.height));
    this.context.lineTo(random(this.width), random(this.height));
    this.context.lineTo(random(this.width), random(this.height));
    this.context.fill();
  }

  onDraw(context, width, height) {
    context.drawImage(this.canvas, this.x, this.y);
  }
}

class LinesFinder extends Entity {
  async run({maxLines}, game) {
    this.foundLines = new Promise(resolve => this.resolveFoundLines = resolve);
  }
}

main();
