import {CreateResolveablePromise} from '../utils/promise.js';
import {Scene} from './scene.js';

export class Game {
  #inactiveScenes;

  constructor(args) {
    this.time = 0;
    this.stopped = CreateResolveablePromise();
    this.activeScene = null;
    this.#inactiveScenes = new Map();

    this.backgroundScene = new (class extends Scene {
      run: args.run,
    })(this);

    // TODO: drawing
    // TODO: input?
    // TODO: audio?
    // TODO: resources?

    (async () => {
      function MaybeTickScene(scene, time) {
        if (scene) {
          scene.nextGameTick.resolve(time);
          scene.nextGameTick = CreateResolveablePromise();
        }
      }
      const realStartTime = Performance.now() / 1000;
      while (!this.stopped.resolved) {
        const realTime = (await new Promise(requestAnimationFrame)) / 1000;
        this.time = realTime - realStartTime;
        MaybeTickScene(this.backgroundScene, this.time);
        MaybeTickScene(this.activeScene, this.time);
      }
    });
  }

  activate(SceneType) {
    if (this.activeScene.constructor === SceneType) {
      return;
    }

    if (this.activeScene) {
      if (this.activeScene.persist) {
        this.#inactiveScenes.set(this.activeScene.constructor, this.activeScene);
        this.activeScene.pausedAtGameTime = this.time;
      } else {
        this.activeScene.stop();
      }
      this.activeScene = null;
    }

    if (this.#inactiveScenes.has(SceneType)) {
      this.activeScene = this.#inactiveScenes.get(SceneType);
      this.#inactiveScenes.delete(SceneType);
    } else {
      const scene = new SceneType(this);
      scene.stopped.then(() => {
        if (this.activeScene === scene) {
          this.activeScene = null;
        } else if (this.#inactiveScenes.has(SceneType)) {
          this.#inactiveScenes.delete(SceneType);
        }
      });
      this.activeScene = scene;
    }

    return this.activeScene;
  }

  stop() {
    if (this.stopped.resolved) {
      return;
    }
    this.background.stop();
    this.activeScene?.stop();
    for (const scene of this.#inactiveScenes.values()) {
      scene.stop();
    }
  }
}
