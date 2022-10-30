import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {BasicEntity} from '../../presets/basic-entity.js';
import {Entity} from '../../engine/entity.js';
import {random} from '../../utils/random.js';
import {range} from '../../utils/range.js';
import {Mat3} from '../../utils/mat3.js';
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
    this.spriteHandle = this.scene.spriteRegistry.register(this);
    this.spriteHandle.switchToPack('dog.spritepack', 'stand');
  }

  async run() {
    while (true) {
      this.transform.translate.set(
        this.game.width / 2,
        this.game.height,
      );
      await this.tick();
    }
  }

  onInput(eventName, event) {
    if (eventName === 'mousedown' || (eventName === 'keydown' && event.code === 'Space')) {
      this.spriteHandle.switchTo('bark');
    }
  }

  static #drawSpriteMatrix = new Mat3();
  onDraw(context, width, height) {
    const keyFrame = this.spriteHandle.getKeyFrame();
    if (keyFrame) {
      const matrix = Dog.#drawSpriteMatrix;
      matrix.setIdentity();
      keyFrame.transform.applyToMatrix(matrix);
      this.transform.applyToMatrix(matrix);
      this.scene.cameraTransform.applyToMatrix(matrix);
      matrix.applyToContext(context);
      context.drawImage(keyFrame.image, 0, 0);
    }
  }
}

main();
