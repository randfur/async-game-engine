import {Game} from '../../../engine/game.js';
import {Picture} from './picture.js';
import {LinesFinder} from './lines-finder.js';

function main() {
  new Game({
    container: document.body,
    viewScale: 3,
    async run(job, game) {
      while (true) {
        await job.do(async job => {
          const picture = job.create(Picture);
          const linesFinder = job.create(LinesFinder, {
            maxLines: 20,
            picture,
          });
          await linesFinder.foundLines;
          await job.sleep(1);
        }).stopped;
      }
    },
  });
}

main();
