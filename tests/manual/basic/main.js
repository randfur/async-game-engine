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
    this.transform.translate.x = x;
    this.transform.translate.y = y;
    this.size = size;
    this.collider.width = this.size;
    this.collider.height = this.size;
    this.colour = colour;
  }

  async body() {
    let dx = deviate(4);
    let dy = deviate(4);
    const translate = this.transform.translate;

    while (true) {
      await this.tick();

      const {width, height} = this.game;
      translate.x += dx;
      translate.y += dy;

      const size = this.size;
      if (translate.x < -size) { translate.x += width + size; }
      if (translate.x > width) { translate.x -= width + size; }
      if (translate.y < -size) { translate.y += height + size; }
      if (translate.y > height) { translate.y -= height + size; }
    }
  }

  onDraw(context, width, height) {
    context.fillStyle = this.collider.colliding ? 'white' : this.colour;
    context.fillRect(this.transform.translate.x, this.transform.translate.y, this.collider.width, this.collider.height);
  }
}

main();