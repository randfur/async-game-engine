import {Game} from '../../../engine/game.js';
import {BasicScene} from '../../../presets/basic-scene.js';
import {BasicEntity} from '../../../presets/basic-entity.js';

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
  init() {
    this.dx = 0;
    this.dy = 0;
  }
  async body() {
    while (true) {
      await this.tick();

      this.collider.x += this.dx;
      this.collider.y += this.dy;
    }
  }

  onInput(eventName, event) {
    switch (eventName) {
      case 'keydown':
        switch (event.code) {
          case 'ArrowLeft':
            this.dx -= 10;
            break;
          case 'ArrowRight':
            this.dx += 10;
            break;
          case 'ArrowUp':
            this.dy -= 10;
            break;
          case 'ArrowDown':
            this.dy += 10;
            break;
        }
        break;
      case 'keyup':
        switch (event.code) {
          case 'ArrowLeft':
            this.dx += 10;
            break;
          case 'ArrowRight':
            this.dx -= 10;
            break;
          case 'ArrowUp':
            this.dy += 10;
            break;
          case 'ArrowDown':
            this.dy -= 10;
            break;
        }
        break;
    }
  }

  onDraw(context, width, height) {
    context.fillStyle = 'blue';
    context.fillRect(this.collider.x, this.collider.y, 10, 10);
  }
}

main();