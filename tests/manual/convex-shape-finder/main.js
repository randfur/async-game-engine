import {BasicGame} from '../../../presets/basic-game.js';
import {Picture} from './picture.js';
import {ConvexBoundaryFinder} from './convex-boundary-finder.js';

function main() {
  new BasicGame({
    drawing: {
      container: document.body,
      viewScale: 6,
    },
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
