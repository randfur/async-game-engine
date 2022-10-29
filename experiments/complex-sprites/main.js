import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {BasicEntity} from '../../presets/basic-entity.js';
import {Entity} from '../../engine/entity.js';
import {random} from '../../utils/random.js';
import {removeItem} from '../../utils/array.js';

/*
interface SpriteHandle {
  spritePack: SpritePack;
  sprite: Sprite;
  frameIndex: u32;
  elapsedFrames: u32;
  spriteStartTime: f64;
  transform: Transform;
}

type SpritePack = Record<string, Sprite>;

interface Sprite {
  frames: Frame[];
  framesPerSecond: f64;
  switchTo: string;
}

interface Frame {
  src: string;
  transform: Transform;
  frameDelay: u32;
  convexCollisionPolygon: Vec2[];
}

interface Transform {
  parent: Transform? | null;
  origin: Vec2;
  scale: Vec2;
  rotate: Vec2;
  translate: Vec2;
}
*/

async function main() {
  new Game({
    preloadResources(waitFor) {
      Dog.preloadResources(waitFor);
    },
    initialScene: class extends BasicScene {
      async run() {
        this.spriteRegistry = new SpriteRegistry(this);
        this.create(Dog);
      }

      onFrame(gameTime) {
        super.onFrame(gameTime);
        this.spriteRegistry.onFrame(this.time);
      }
    },
  });
}

class SpriteRegistry {
  constructor(scene) {
    this.scene = scene;
    this.spriteHandles = [];
  }

  register(job) {
    const spriteHandle = new SpriteHandle(this);
    this.spriteHandles.push(spriteHandle);
    job.registerCleanUp(() => {
      removeItem(this.spriteHandles, spriteHandle);
    });
    return spriteHandle;
  }

  static async preloadPack(src) {
    const response = await fetch(src);
    const spritePack = await response.json();
    for (const [spriteName, sprite] of Object.entries(spritePack)) {
    }
  }

  onFrame() {
  }
}

class SpriteHandle {
  constructor(spriteRegistry) {
    this.spriteRegistry = spriteRegistry;
    this.spritePack = null;
    this.spriteName = null;
    this.frameIndex = null;
    this.elapsedFrames = null;
    this.spriteStartTime = null;
    this.lastLoad = null;
  }

  loadPack(packSrc, spriteName) {
    const startTime = this.spriteRegistry.scene.time;
    const currentLoad = this.lastLoad;
    this.lastLoad = (async () => {
      await SpriteRegistry.preloadPack(packSrc);
      await currentLoad;
      this.spriteName = spriteName;
      this.spriteStartTime = startTime;
    })();
  }
}

class Dog extends BasicEntity {
  static preloadResources(waitFor) {
    waitFor(SpriteRegistry.preloadPack('dog.spritepack'));
    waitFor(new Promise(resolve => setTimeout(resolve, random(1000))));
    waitFor(new Promise(resolve => setTimeout(resolve, random(1000))));
    waitFor(new Promise(resolve => setTimeout(resolve, random(1000))));
    waitFor(new Promise(resolve => setTimeout(resolve, random(1000))));
    waitFor(new Promise(resolve => setTimeout(resolve, random(1000))));
    waitFor(new Promise(resolve => setTimeout(resolve, random(1000))));
    waitFor(new Promise(resolve => setTimeout(resolve, random(1000))));
    waitFor(new Promise(resolve => setTimeout(resolve, random(1000))));
    waitFor(new Promise(resolve => setTimeout(resolve, random(1000))));
    waitFor(new Promise(resolve => setTimeout(resolve, random(1000))));
    waitFor(new Promise(resolve => setTimeout(resolve, random(1000))));
    waitFor(new Promise(resolve => setTimeout(resolve, random(1000))));
  }

  init() {
    // SpriteRegistry
    // - preloadPacks(srcs)
    // - Loaded packs.
    // - Active handles.
    // SpriteHandle
    // - Contains sprite instance.
    // - switchTo(spriteName)
    // - loadPack(src, spriteName)
    // - draw(context)
    // - entityTransform
    // - cameraTransform
    this.sprite = this.scene.spriteRegistry.register(this);
    this.sprite.loadPack('dog.spritepack', 'stand');
    this.transform.translate.set(this.game.width / 2, this.game.height * 3 / 4);
  }

  async run() {
    while (true) {
      await this.tick();
    }
  }

  onInput(eventName, event) {
    if (eventName === 'keydown' && event.code === 'Space') {
      this.sprite.switchTo('bark');
    }
  }

  onDraw(context, width, height) {
    if (this.sprite) {
    }
  }
}

main();
