import {BasicEntity} from '../../../presets/basic-entity.js';
import {BasicScene} from '../../../presets/basic-scene.js';
import {Game} from '../../../engine/game.js';
import {range} from '../../../utils/range.js';

async function main() {
  new Game({
    drawing: {
      container: document.body,
      viewScale: 4,
    },
    initialScene: CollisionScene,
  });
}

class CollisionScene extends BasicScene {
  async run(job) {
    for (let i = 0; i <
    this.create(Thing);
  }
}

class Thing extends BasicEntity {
  init() {
    this.enableCollisions();
  }

  async body() {

  }

  onCollision(other) {

  }
}

main();