import {BasicGame} from '../../../presets/basic-game.js';

async function main() {
  new BasicGame({
    drawing: {
      container: document.body,
      viewScale: 4,
    },
    async run(job, game) {
      console.log('hello');
    },
  });
}

main();