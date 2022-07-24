import {Game} from '../../../engine/game.js';
import {Scene} from '../../../engine/scene.js';
import {BasicScene} from '../../../presets/basic-scene.js';
import {BasicEntity} from '../../../presets/basic-entity.js';
import {random, deviate} from '../../../utils/random.js';

async function main() {
  new Game({
    drawing: {
      viewScale: 2,
    },
    backgroundScene: class extends Scene {
      async run(job) {
        while (true) {
          this.game.activate(RedScene);
          await job.sleep(1);
          this.game.activate(BlueScene);
          await job.sleep(1);
        }
      }
    },
  });
}

class BlueScene extends BasicScene {
  async run(job) {
    this.persists = true;
    for (let i = 0; i < 4; ++i) {
      this.create(TestEntity, {
        x: random(this.game.width),
        y: random(this.game.height),
        colour: 'blue',
      });
    }
  }
}

class RedScene extends BasicScene {
  async run(job) {
    this.persists = true;
    for (let i = 0; i < 4; ++i) {
      this.create(TestEntity, {
        x: random(this.game.width),
        y: random(this.game.height),
        colour: 'red',
      });
    }
  }
}

class TestEntity extends BasicEntity {
  init({x, y, colour}) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.size = 20;
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
    context.fillStyle = this.colour;
    context.fillRect(this.x, this.y, this.size, this.size);
  }
}

main();