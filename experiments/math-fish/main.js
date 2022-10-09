import {loadImage} from '../utils/image.js';
import {BasicEntity} from '../../presets/basic-entity.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {deviate, random, randomRange} from '../../utils/random.js';
import {Game} from '../../engine/game.js';
import {loadImage} from '../../utils/image.js';
import {recycledRange} from '../../utils/range.js';
import {Sprite} from '../../utils/sprite.js';
import {TAU} from '../../utils/math.js';
import {Transform} from '../../utils/transform.js';

async function main() {
  new Game({
    drawing: {
      viewScale: 4,
    },
    initialScene: class extends BasicScene {
      async run() {
        this.drawing2dRegistry.register(this, (context, width, height) => {
          this.cameraTransform.applyToContext(context);
          context.fillStyle = '#49f';
          context.fillRect(0, 0, width, height);
        });

        for (let i of recycledRange(20)) {
          this.create(Bubble);
          this.create(Seaweed);
        }

        this.create(Fish);

        while (true) {
          await this.tick();
          this.centreCamera();
          this.cameraTransform.translate.x += Math.sin(this.time / 1) * 10;
          this.cameraTransform.rotate.setPolar(Math.sin(this.time / 2.1) * TAU / 100);
        }
      }
    },
  });
}

class Fish extends BasicEntity {
  init() {
    this.transform.translate.set(
      this.game.width / 2,
      this.game.height / 2,
    );

    this.sprites = {
      normal: new Sprite(loadImage('./fish-normal.png')),
      bite: new Sprite(loadImage('./fish-bite.png')),
    };
    // TODO: Make sprites its own format that stores the origin and other stuff.
    for (const sprite of Object.values(this.sprites)) {
      sprite.transform.origin.set(16, 16);
    }

    this.movementScale = 4;

    this.drawHandle.zIndex = 2;

    this.enableCollisions();
    this.collider.width = 32;
    this.collider.height = 32;

    this.angle = 0;
  }

  async body() {
    while (true) {
      await this.tick();

      const arrowKeys = this.game.input.arrowKeys;

      this.transform.translate.addScaled(arrowKeys, this.movementScale);

      const biting = this.game.input.keyDown['Space'];
      this.collider.solid = biting;
      this.sprite = biting ? this.sprites.bite : this.sprites.normal;

      if (arrowKeys.x < 0) {
        this.transform.scale.x = 1;
      } else if (arrowKeys.x > 0) {
        this.transform.scale.x = -1;
      }

      this.angle -= 0.01 * this.transform.scale.x;
      this.transform.rotate.setPolar(this.angle);
    }
  }
}

class Seaweed extends BasicEntity {
  init() {
    this.sprite = new Sprite(loadImage('./seaweed.png'));
    this.sprite.transform.origin.set(16, 64);

    this.transform.translate.x = Math.floor(random(this.game.width));
    this.transform.translate.y = this.game.height;
    const scale = randomRange(0.5, 1.5);
    this.transform.scale.scale(scale);

    this.drawHandle.zIndex = 1 + scale * 0.8;
  }

  async body() {
    this.do(async job => {
      while (true) {
        await job.sleep(random(10));
        this.transform.scale.x *= -1;
        await job.sleep(5);
      }
    });

    while (true) {
      await this.tick();
      this.transform.translate.y = this.game.height;
    }
  }
}

class Bubble extends BasicEntity {
  init() {
    this.sprite = new Sprite(loadImage('./bubble.png'));
    this.transform.translate.x = random(this.game.width);
    this.transform.translate.y = random(this.game.height);

    this.drawHandle.zIndex = randomRange(1, 3);

    this.floatUpSpeed = randomRange(0.5, 1);
    this.wobbleAmount = random(1);
    this.wobbleSpeed = random(1);

    this.enableCollisions();
    this.collider.filterTypes = [Fish];
    this.collider.width = 16;
    this.collider.height = 16;
  }

  async body() {
    while (true) {
      await this.tick();
      this.transform.translate.x += Math.sin(this.transform.translate.y * this.wobbleSpeed) * this.wobbleAmount;
      this.transform.translate.y -= this.floatUpSpeed;

      if (this.transform.translate.x < 0 || this.transform.translate.x > this.game.width || this.transform.translate.y < 0) {
        this.transform.translate.x = random(this.game.width);
        this.transform.translate.y = this.game.height;
      }
    }
  }

  onCollision(other, otherCollider) {
    this.transform.translate.y += this.game.height;
  }
}

main();