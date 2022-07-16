import {BasicEntity} from '../../../presets/basic-entity.js';
import {BasicGame} from '../../../presets/basic-game.js';
import {range} from '../../../utils/range.js';

async function main() {
  new Game({
    drawing: {
      container: document.body,
      viewScale: 4,
    },
    startScene: CollisionScene,
  });
}

class CollisionScene extends BasicScene {
  async run(job) {
    this.create(Thing);
  }
}

class Thing extends BasicEntity {
}

main();