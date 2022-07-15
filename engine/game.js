import {Job} from './job.js';
import {removeItems} from '../utils/array.js';
import {CreateResolveablePromise} from '../utils/promise.js';

export class Game {
  #scenes;

  constructor(args) {
    this.time = 0;
    this.stopped = CreateResolveablePromise();
    this.activeScene = null;
    this.#scenes = new Map();

    this.backgroundScene = new (class extends Scene {
      body: args.run,
    })(this);

    this.initPresetParts(args);

    (async () => {
      const realStartTime = Performance.now() / 1000;
      while (!this.stopped.resolved) {
        const realTime = (await new Promise(requestAnimationFrame)) / 1000;
        this.time = realTime - realStartTime;
        MaybeTickScene(this.backgroundScene, this.time);
        MaybeTickScene(this.activeScene, this.time);
      }
    });
  }

  initPresetParts() {}

  stop() {
    if (!this.stopped.resolved) {
      this.background.stop();
      for (const scene of this.#scenes.values()) {
        scene.stop();
      }
    }
    this.stopped.resolve();
  }

  activate(SceneType) {
    if (this.activeScene) {
      if (this.activeScene.persists) {
        this.activeScene.pausedAtTime = this.time;
      } else {
        this.activeScene.stop();
        this.#scenes.delete(this.activeScene.constructor);
      }
    }
    if (this.#scenes.has(SceneType)) {
      this.activeScene = this.#scenes.get(SceneType);
    } else {
      const scene = new SceneType(this);
      this.#scenes.set(SceneType, scene);
      this.activeScene = scene;
    }
    this.activeScene.onActivated();
    return this.activeScene;
  }
}

function MaybeTickScene(scene, time) {
  if (scene && !scene.stopped.resolved) {
    scene.nextTick.resolve(time);
    scene.nextTick = CreateResolveablePromise();
  }
}