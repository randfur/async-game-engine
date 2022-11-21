import {BasicEntity} from '../../presets/basic-entity.js';

class Cat extends BasicEntity {
  async init() {
    await this.spriteHandle.createPack({
      name: 'cat',
      framesPerSecond: 10,
      origin: {
        x: 16,
        y: 32,
      },
      keyframes: [{
        imageSrc: 'cat0.png',
        frames: 30,
      }, {
        imageSrc: 'cat1.png',
        frames: 10,
      }, {
        imageSrc: 'cat0.png',
        frames: 40,
      }, {
        imageSrc: 'cat2.png',
        frames: 5,
      }],
    });
  }

  async run() {
    while (true) {
      this.transform.translate.set(
        Math.floor(this.game.width / 3),
        this.game.height,
      );
      await this.tick();
    }
  }
}
