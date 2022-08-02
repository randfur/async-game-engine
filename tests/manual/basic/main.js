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
          this.game.activate(BlueScene);
          await job.sleep(2);
          this.game.activate(RedScene);
          await job.sleep(2);
        }
      }
    },
  });
}

class BlueScene extends BasicScene {
  async run(job) {
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
  async run(job) {
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
    this.collider.solid = true;
    this.collider.x = x;
    this.collider.y = y;
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
      this.collider.x += dx;
      this.collider.y += dy;

      // const dampening = 0.98;
      // dx = dx * dampening + Math.sin(this.collider.y);
      // dy = dy * dampening + Math.sin(this.collider.x);

      const size = this.size;
      if (this.collider.x < -size) { this.collider.x += width + size; }
      if (this.collider.x > width) { this.collider.x -= width + size; }
      if (this.collider.y < -size) { this.collider.y += height + size; }
      if (this.collider.y > height) { this.collider.y -= height + size; }
    }
  }

  onCollision(otherCollider) {
    // console.log(this);
  }

  onDraw(context, width, height) {
    context.fillStyle = this.collider.colliding ? 'white' : this.colour;
    context.fillRect(this.collider.x, this.collider.y, this.collider.width, this.collider.height);
  }
}

main();