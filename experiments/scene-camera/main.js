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
}

main();