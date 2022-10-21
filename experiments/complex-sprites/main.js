import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';

/*
interface SpriteInstance {
  spritePack: SpritePack;
  sprite: Sprite;
  frameIndex: u32;
  elapsedFrames: u32;
  spriteStartTime: f64;
  transform: Transform;
}

interface SpritePack {
  sprites: Map<string, Sprite>;
  graphics: Map<string, Graphic>;
}

interface Sprite {
  name: string;
  frames: Frame[];
  framesPerSecond: u32;
  switchTo: string;
}

interface Frame {
  graphicReference: string;
  frameDelay: u32;
}

interface Graphic {
  name: string;
  parts: Part[];
}

enum Part {
  Image {
    bitmap: Bitmap;
    transform: Transform;
  };
  GraphicReference {
    name: string;
    transform: Transform;
  },
}
*/

async function main() {
  new Game({
    initialScene: class extends BasicScene {
      async run() {
      }
    },
  });
}
main();
