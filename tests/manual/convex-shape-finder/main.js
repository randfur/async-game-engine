import {Game} from '../../../engine/game.js';
import {Picture} from './picture.js';
import {LinesFinder} from './lines-finder.js';

function main() {
  new Game({
    container: document.body,
    viewScale: 3,
    async run(job, game) {
      const picture = game.create(Picture);
      const linesFinder = game.create(LinesFinder, {
        maxLines: 20,
        picture,
      });
      await linesFinder.foundLines;
      await job.forever();
    },
  });
}

main();
