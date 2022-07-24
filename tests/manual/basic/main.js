import {Game} from '../../../engine/game.js';
import {BasicScene} from '../../../presets/basic-scene.js';
import {BasicEntity} from '../../../presets/basic-entity.js';
import {random, deviate} from '../../../utils/random.js';

async function main() {
  new Game({
    drawing: {
      viewScale: 2,
    },
    startScene: class extends BasicScene {
      async run(job) {
        for (let i = 0; i < 20; ++i) {
          this.create(TestEntity, {
            x: random(this.game.width),
            y: random(this.game.height),
          });
        }
      }
    },
  });
}

class TestEntity extends BasicEntity {
  init({x, y}) {
    this.x = x;
    this.y = y;
    this.size = 10;
  }

  async body() {

    let dx = deviate(4);
    let dy = deviate(4);

    while (true) {
      await this.tick();

      const {width, height} = this.game;
      this.x += dx;
      this.y += dy;

      const dampening = 0.99;
      dx = dx * dampening + Math.sin(this.y);
      dy = dy * dampening + Math.sin(this.x);

      const size = this.size;
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