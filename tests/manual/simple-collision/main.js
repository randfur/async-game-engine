import {BasicEntity} from '../../../presets/basic-entity.js';
import {BasicGame} from '../../../presets/basic-game.js';
import {range} from '../../../utils/range.js';

async function main() {
  new BasicGame({
    drawing: {
      container: document.body,
      viewScale: 4,
    },
    async run(job, game) {
      for (const i of range(10)) {
        job.create(Thing);
      }
      // TODO simple collision example.
    },
  });
}

main();