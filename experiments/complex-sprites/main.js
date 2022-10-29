import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {BasicEntity} from '../../presets/basic-entity.js';
import {Entity} from '../../engine/entity.js';
import {random} from '../../utils/random.js';
import {range} from '../../utils/range.js';
import {preloadSpritePack, SpriteRegistry} from './sprite-registry.js';

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
        await this.forever();
      }

      onFrame(gameTime) {
        super.onFrame(gameTime);
        this.spriteRegistry.onFrame(this.time);
      }
    },
  });
}

class Dog extends BasicEntity {
  static preloadResources(waitFor) {
    waitFor(preloadSpritePack('dog.spritepack'));
  }

  init() {
    this.sprite = this.scene.spriteRegistry.register(this);
    this.sprite.switchToPack('dog.spritepack', 'stand');
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
    if (this.sprite.spriteName) {
      context.drawImage(this.sprite.spritePack[this.sprite.spriteName].frames[this.sprite.frameIndex].image, 0, 0);
    }
  }
}

main();
