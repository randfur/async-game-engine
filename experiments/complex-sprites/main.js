import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {Dog} from './dog.js';
import {Cat} from './cat.js';

async function main() {
  new Game({
    initialScene: class extends BasicScene {
      async run() {
        this.create(Dog);
        this.create(Cat);
        await this.forever();
      }
    },
  });
}


main();
