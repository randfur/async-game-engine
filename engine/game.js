import {Scene} from './scene.js';
import {Input} from './input.js';
import {Drawing} from './drawing.js';
import {CreateResolveablePromise} from '../utils/promise.js';

/*
interface Game {
  stopped: Promise<void>,
  time: number,
  drawing: Drawing,
  background: Scene,
  active: Scene,

  constructor(args: interface {
    drawing: interface {
      container: DOMElement | null,
      viewScale: number,
      clearFrames: boolean,
    },
    initialScene?: SceneType,
    backgroundScene?: SceneType,
  }),

  activate(SceneType): Scene,

  stop(): void,
}
*/
export class Game {
  #inactives;

  constructor(args) {
    this.stopped = CreateResolveablePromise();
    this.time = 0;
    this.drawing = new Drawing(this, args.drawing);
    this.input = new Input(this);
    // TODO: input?
    // TODO: audio?
    // TODO: resources?
    this.#inactives = new Map();
    this.background = null;
    this.active = null;

    if (args.backgroundScene) {
      this.background = new args.backgroundScene(this);
    }
    if (args.initialScene) {
      this.activate(args.initialScene);
    }

    (async () => {
      function MaybeTickScene(scene, time) {
        if (scene) {
          scene.nextGameTick.resolve(time);
          scene.nextGameTick = CreateResolveablePromise();
        }
      }
      const realStartTime = performance.now() / 1000;
      while (!this.stopped.resolved) {
        const realTime = (await new Promise(requestAnimationFrame)) / 1000;
        this.time = realTime - realStartTime;
        MaybeTickScene(this.background, this.time);
        MaybeTickScene(this.active, this.time);
        this.drawing.draw();
      }
    })();
  }

  activate(SceneType) {
    if (this.active?.constructor === SceneType) {
      return;
    }

    if (this.active) {
      if (this.active.persists) {
        this.#inactives.set(this.active.constructor, this.active);
        this.active.pausedAtGameTime = this.time;
      } else {
        this.active.stop();
      }
      this.active = null;
    }

    if (this.#inactives.has(SceneType)) {
      this.active = this.#inactives.get(SceneType);
      this.#inactives.delete(SceneType);
    } else {
      const scene = new SceneType(this);
      scene.stopped.then(() => {
        if (this.active === scene) {
          this.active = null;
        } else if (this.#inactives.has(SceneType)) {
          this.#inactives.delete(SceneType);
        }
      });
      this.active = scene;
    }

    return this.active;
  }

  get width() { return this.drawing.width; }
  get height() { return this.drawing.height; }

  stop() {
    if (this.stopped.resolved) {
      return;
    }
    this.background?.stop();
    this.active?.stop();
    for (const scene of this.#inactives.values()) {
      scene.stop();
    }
  }
}
