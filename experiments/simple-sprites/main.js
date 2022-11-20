import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {BasicEntity} from '../../presets/basic-entity.js';

async function main() {
  new Game({
    initialScene: class extends BasicScene {
      async run() {
        this.create(Dog);
        await this.forever();
      }

      onFrame(gameTime) {
        super.onFrame(gameTime);
        this.spriteRegistry.onFrame(this.time);
      }
    },
  });
}

class Dog extends BasicEntity {
  async init() {
    await this.spriteHandle.loadPack('dog.spritepack');
  }

  async run() {
    while (true) {
      this.transform.translate.set(
        Math.floor(this.game.width / 2),
        this.game.height,
      );

      const bark = this.game.input.mouse.down[0] || this.game.input.keyDown['Space'];
      this.spriteHandle.switchTo(bark ? 'bark' : 'stand');

      await this.tick();
    }
  }
}

main();
