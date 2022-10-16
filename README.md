# Async Game Engine

This is a minimal game engine built around JavaScript's async await syntax.  

[github.io page](https://randfur.github.io/async-game-engine/)

## Example

```js
import {Game} from 'https://randfur.github.io/async-game-engine/engine/game.js';
import {BasicEntity} from 'https://randfur.github.io/async-game-engine/presets/basic-entity.js';
TODO
```

## Concepts

### Jobs
Jobs are async threads of execution that can be stopped at any time and can have child jobs that stop when their parent job stops.

These are spawned via `scene.do()` or `job.do()` e.g.:
```js
const exampleJob = scene.do(async job => {
  ...
});
```

### Entities
Entities are a syntactic convenience for creating a job blueprint with its own interface and ready to be reused.

These are spawned via `scene.create()` or `job.create()` e.g.:
```js
const exampleEntity = scene.create(ExampleEntity, {run, args});
```

### Components
Components like drawing or collision detection can be registered with jobs and get auto cleaned up when the job stops.

### Game
The game engine itself, the root owner of all active jobs.
