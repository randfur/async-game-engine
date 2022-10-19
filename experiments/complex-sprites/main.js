import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';

async function main() {
  new Game({
    initialScene: class extends BasicScene {
      async run() {
      }
    },
  });
}
main();

/*
struct SpriteInstance {
  spritePack: SpritePack,
  sprite: Sprite,
  frameIndex: usize,
  frameStartTime: f64,
  transform: Transform,
}

type SpritePack = Map<String, Sprite>

struct Sprite {
  name: String,
  frames: Vec<Frame>,
  switchTo: String,
}

struct Frame {
  parts: Vec<Part>,
  duration: f32,
}

struct TransformedPart {
  transform: Transform,
  part: Part,
}

enum Part {
  Image {
    bitmap: Bitmap,
  },
  Reference {
    name: String,
  },
}
*/