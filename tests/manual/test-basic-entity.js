import {Game} from '../../engine/game.js';
import {BasicEntity} from '../../engine/basic-entity.js';
import {random} from '../../utils/random.js';

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
  async run({x, y}, game) {
    this.x = x;
    this.y = y;
    this.size = 10;

    while (true) {
      await this.tick();
      this.x += 4;
      this.y += this.x / 30;

      if (this.x > game.width) { this.x -= game.width + this.size; }
      if (this.y > game.height) { this.y -= game.height + this.size; }
    }
  }

  onDraw(context, width, height) {
    context.fillStyle = 'blue';
    context.fillRect(this.x, this.y, this.size, this.size);
  }
}

main();