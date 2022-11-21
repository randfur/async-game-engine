import {BasicEntity} from '../../presets/basic-entity.js';

export class Dog extends BasicEntity {
  async init() {
    await this.spriteHandle.loadPack('dog.spritepack');
  }

  async run() {
    while (true) {
      this.transform.translate.set(
        Math.floor(this.game.width / 2),
        this.game.height,
      );

      const bark = this.game.input.mouse.down[0] || this.game.input.keyDown['Space'];
      this.spriteHandle.switchTo(bark ? 'bark' : 'stand');

      await this.tick();
    }
  }
}
