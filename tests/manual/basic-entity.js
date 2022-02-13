import {Game} from '../../engine/game.js';

async function main() {
  await new Game({
    container: document.body,
    async run(job, game) {
    },
  }).stopped;
  console.log('game over');
}

main();