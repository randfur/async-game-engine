# Async Game Engine API Reference

Last updated: 2022-06-24

## Game

```js
import {Game} from 'https://randfur.github.io/async-game-engine/engine/game.js';

new Game({
  container: <HTMLElement>, /*
    The HTML element to deploy the game canvas into.
    The game canvas will fill the container including after any resizing.
    If you want to fill the entire page then pass in the body element and set
    the body style to:
      body {
        padding: 0px;
        margin: 0px;
        width: 100vw;
        height: 100vh;
      }
  */

  async run(job: Job, game: Game): void, /*
    Top level game logic.
  */
});
```

