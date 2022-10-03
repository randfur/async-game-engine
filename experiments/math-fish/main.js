import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {BasicEntity} from '../../presets/basic-entity.js';
import {deviate, random, randomRange} from '../../utils/random.js';
import {loadImage} from '../../utils/image.js';
import {recycledRange} from '../../utils/range.js';
import {Transform} from '../../utils/transform.js';
import {TAU} from '../../utils/math.js';

async function main() {
  new Game({
    drawing: {
      viewScale: 4,
    },
    initialScene: class extends BasicScene {
      async run() {
        this.drawing2dRegistry.register(this, (context, width, height) => {
          cameraTransform.applyToContext(context);
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
          this.cameraTransform.translate.set(
            this.game.width / 2 + Math.sin(this.time / 1) * 10,
            this.game.height / 2,
          );
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
      normal: this.loadSprite('./fish-normal.png'),
      bite: this.loadSprite('./fish-bite.png'),
    };
    // TODO: Make sprites its own format that stores the offset and other stuff.
    for (const sprite of Object.values(this.sprites)) {
      sprite.transform.offset.set(-16, -16);
    }

    this.movementScale = 4;

    this.drawHandle.zIndex = 2;

    this.enableCollisions();
    this.collider.width = 32;
    this.collider.height = 32;
  }

  async body() {
    while (true) {
      await this.tick();

      const arrowKeys = this.game.input.arrowKeys;

      this.transform.translate.addScaled(arrowKeys, this.movementScale);

      if (arrowKeys.x < 0) {
        this.imageTransform.scale.x = 1;
      } else if (arrowKeys.x > 0) {
        this.imageTransform.scale.x = -1;
      }
    }
  }

  onDraw(context, width, height) {
    const sprite = this.game.input.keyDown['Space'] ? this.sprites.bite : this.sprites.normal;
    sprite.draw(context);
  }
}

class Seaweed extends BasicEntity {
  init() {
    this.sprite = this.loadSprite('./seaweed.png');
    this.sprite.transform.offset.set(-16, -64);

    this.transform.translate.x = Math.floor(random(this.game.width));
    this.transform.translate.y = this.game.height;
    this.transform.scale.scale(randomRange(0.5, 1.5));

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

  onDraw(context, width, height) {
    this.sprite.draw(context);
  }
}

class Bubble extends BasicEntity {
  init() {
    this.image = loadImage('./bubble.png');
    this.imageTransform = new Transform(this.transform);
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

  onDraw(context, width, height) {
    this.imageTransform.applyToContext(context);
    context.drawImage(this.image, 0, 0);
  }
}

main();