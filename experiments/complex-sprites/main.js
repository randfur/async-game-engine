import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';

/*
struct SpriteInstance {
  spritePack: SpritePack,
  sprite: Sprite,
  frameIndex: u32,
  elapsedFrames: u32,
  spriteStartTime: f64,
  transform: Transform,
}

struct SpritePack {
  sprites: Map<String, Sprite>,
  graphics: Map<String, Graphic>,
}

struct Sprite {
  name: String,
  frames: Vec<Frame>,
  framesPerSecond: u32,
  switchTo: String,
}

struct Frame {
  graphicReference: String,
  frameDelay: u32,
}

struct Graphic {
  name: String,
  parts: Vec<Part>,
}

enum Part {
  Image {
    bitmap: Bitmap,
    transform: Transform,
  },
  GraphicReference {
    name: String,
    transform: Transform,
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
