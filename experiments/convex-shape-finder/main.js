import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {Picture} from './picture.js';
import {ConvexBoundaryFinder} from './convex-boundary-finder.js';

function main() {
  new Game({
    drawing: {
      container: document.body,
      viewScale: 4,
    },
    initialScene: class extends BasicScene {
      async run() {
        while (true) {
          await this.do(async job => {
            const picture = job.create(Picture);
            const convexBoundaryFinder = job.create(ConvexBoundaryFinder, {
              maxLines: 10,
              picture,
            });
            await convexBoundaryFinder.foundLines;
            await job.sleep(1);
          }).stopped;
        }
      }
    },
  });
}

main();
