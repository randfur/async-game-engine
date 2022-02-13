import {Game} from '../../engine/game.js';

function main() {
  new Game({
    container: document.body,
    async run(job, game) {
      console.log('main start');
      job.do(async job => {
        while (true) {
          console.log('child');
          await job.sleep(1);
        }
      });
      await job.sleep(3);
      console.log('main end');
    },
  });
}

main();