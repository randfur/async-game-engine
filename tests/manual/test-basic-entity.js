import {Game} from '../../engine/game.js';
import {BasicEntity} from '../../engine/basic-entity.js';
import {random, deviate} from '../../utils/random.js';

async function main() {
  new Game({
    container: document.body,
    viewScale: 2,
    async run(job, game) {
      for (let i = 0; i < 20; ++i) {
        game.create(TestBasicEntity, {
          x: random(game.width),
          y: random(game.height),
        });
      }
    },
  });
}

class TestBasicEntity extends BasicEntity {
  init({x, y}) {
    this.x = x;
    this.y = y;
    this.size = 10;
  }

  async body() {
    const size = this.size;

    let dx = deviate(4);
    let dy = deviate(4);

    while (true) {
      const {width, height} = this.game;
      await this.tick();
      this.x += dx;
      this.y += dy;

      dx *= 0.99;
      dy *= 0.99;

      dx += Math.sin(this.y);
      dy += Math.sin(this.x);

      if (this.x < -size) { this.x += width + size; }
      if (this.x > width) { this.x -= width + size; }
      if (this.y < -size) { this.y += height + size; }
      if (this.y > height) { this.y -= height + size; }
    }
  }

  onDraw(context, width, height) {
    context.fillStyle = 'blue';
    context.fillRect(this.x, this.y, this.size, this.size);
  }
}

main();