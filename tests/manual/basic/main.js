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
      async run() {
        while (true) {
          this.game.activate(BlueScene);
          await this.sleep(2);
          this.game.activate(RedScene);
          await this.sleep(2);
        }
      }
    },
  });
}

class BlueScene extends BasicScene {
  async run() {
    this.persists = true;

    for (let i = 0; i < 6; ++i) {
      this.create(TestEntity, {
        x: random(this.game.width),
        y: random(this.game.height),
        size: 100,
        colour: 'blue',
      });
    }
  }
}

class RedScene extends BasicScene {
  async run() {
    this.persists = true;

    for (let i = 0; i < 1000; ++i) {
      this.create(TestEntity, {
        x: random(this.game.width),
        y: random(this.game.height),
        size: 4,
        colour: 'red',
      });
    }
  }
}

class TestEntity extends BasicEntity {
  init({x, y, size, colour}) {
    this.enableCollisions();
    this.position.x = x;
    this.position.y = y;
    this.size = size;
    this.collider.width = this.size;
    this.collider.height = this.size;
    this.colour = colour;
  }

  async body() {
    let dx = deviate(4);
    let dy = deviate(4);

    while (true) {
      await this.tick();

      const {width, height} = this.game;
      this.position.x += dx;
      this.position.y += dy;

      const size = this.size;
      if (this.position.x < -size) { this.position.x += width + size; }
      if (this.position.x > width) { this.position.x -= width + size; }
      if (this.position.y < -size) { this.position.y += height + size; }
      if (this.position.y > height) { this.position.y -= height + size; }
    }
  }

  onDraw(context, width, height) {
    context.fillStyle = this.collider.colliding ? 'white' : this.colour;
    context.fillRect(this.position.x, this.position.y, this.collider.width, this.collider.height);
  }
}

main();