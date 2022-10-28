import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {BasicEntity} from '../../presets/basic-entity.js';
import {Entity} from '../../engine/entity.js';

/*
interface SpriteInstance {
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
        this.spriteRegistry = this.create(SpriteRegistry);
        this.create(Dog);
      }
    },
  });
}
main();

class SpriteRegistry extends Entity {
  async run() {

  }

  async preloadPack(src) {
    const response = await fetch(src);
    const spritePack = await response.json();
    for (const [spriteName, sprite] of Object.entries(spritePack)) {
    }
  }
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
    this.sprite.loadPack('dog.spritepack', 'stand');
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
}