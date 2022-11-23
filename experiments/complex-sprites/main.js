import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {Dog} from './dog.js';
import {Cat} from './cat.js';
import {Rat} from './rat.js';

async function main() {
  new Game({
    initialScene: class extends BasicScene {
      async run() {
        // this.create(Dog);
        // this.create(Cat);
        this.create(Rat);
        await this.forever();
      }
    },
  });
}


main();
