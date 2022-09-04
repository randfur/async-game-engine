import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {BasicEntity} from '../../presets/basic-entity.js';

async function main() {
  new Game({
    initialScene: class extends BasicScene {
      async run() {
        this.create(Pants);
      }
    },
  });
}

class Pants extends BasicEntity {
  async body() {
    while (true) {
      await this.tick();

      this.position.x += this.game.input.arrowX * 10;
      this.position.y += this.game.input.arrowY * 10;
    }
  }

  onDraw(context, width, height) {
    context.fillStyle = 'blue';
    context.fillRect(this.position.x, this.position.y, 10, 10);
  }
}

main();