import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {BasicEntity} from '../../presets/basic-entity.js';
import {deviate, random} from '../../utils/random.js';

async function main() {
  new Game({
    drawing: {
      viewScale: 2,
    },
    initialScene: class extends BasicScene {
      async run() {
        for (let i = 0; i < 100; ++i) {
          this.create(Dot);
        }
      }
    },
  });
}

class Dot extends BasicEntity {
  init() {
    this.position.set(this.game.width / 2, this.game.height / 2);
    this.colour = `hsl(80deg, 100%, ${25 + random(50)}%)`;
  }

  async body() {
    while (true) {
      await this.tick();
      this.position.x += deviate(2);
      this.position.y += deviate(2);
    }
  }

  onDraw(context, width, height) {
    context.fillStyle = this.colour;
    context.fillRect(this.position.x, this.position.y, 2, 2);
  }
}

main();