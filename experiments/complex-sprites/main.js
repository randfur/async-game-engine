import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {BasicEntity} from '../../presets/basic-entity.js';
import {Entity} from '../../engine/entity.js';

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
    initialScene: class extends BasicScene {
      async run() {
        this.spriteRegistry = new SpriteRegistry();
        this.create(Dog);
      }

      onFrame(gameTime) {
        super.onFrame(gameTime);
        this.spriteRegistry.onFrame();
    },
  });
}
main();

class SpriteRegistry {
  async run() {
    this.spriteHandles = [];
  }

  register(basicEntity) {
    const spriteHandle = new SpriteHandle(basicEntity);
    this.spriteHandles.push(spriteHandle);
    basicEntity.registerCleanUp(() => {
      removeItem(this.spriteHandles, spriteHandle);
    });
    return spriteHandle;
  }

  async preloadPack(src) {
    const response = await fetch(src);
    const spritePack = await response.json();
    for (const [spriteName, sprite] of Object.entries(spritePack)) {
    }
  }
}

class SpriteHandle() {
  constructor(basicEntity) {
    this.basicEntity = basicEntity;
    this.spritePack = null;
    this.spriteName = null;
    this.frameIndex = null;
    this.elapsedFrames = null;
    this.spriteStartTime = null;
  }

  loadPack
}

class Dog extends BasicEntity {
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
    this.transform.position.set(this.game.width / 2, this.game.height * 3 / 4);
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