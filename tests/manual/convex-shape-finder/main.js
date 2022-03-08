import {Game} from '../../../engine/game.js';
import {Picture} from './picture.js';
import {ConvexBoundaryFinder} from './convex-boundary-finder.js';

function main() {
  new Game({
    container: document.body,
    viewScale: 3,
    async run(job, game) {
      while (true) {
        await job.do(async job => {
          const picture = job.create(Picture);
          const convexBoundaryFinder = job.create(ConvexBoundaryFinder, {
            maxLines: 10,
            picture,
          });
          await convexBoundaryFinder.foundLines;
          await job.sleep(1);
        }).stopped;
      }
    },
  });
}

main();
