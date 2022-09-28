import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {BasicEntity} from '../../presets/basic-entity.js';
import {deviate, random, randomRange} from '../../utils/random.js';
import {loadImage} from '../../utils/image.js';
import {recycledRange} from '../../utils/range.js';
import {Transform} from '../../utils/transform.js';

async function main() {
  new Game({
    drawing: {
      viewScale: 4,
    },
    initialScene: class extends BasicScene {
      async run() {
        this.drawing2dRegistry.register(this, (context, width, height) => {
          context.fillStyle = '#49f';
          context.fillRect(0, 0, width, height);
        });

        for (let i of recycledRange(20)) {
          this.create(Bubble);
          this.create(Seaweed);
        }

        this.create(Fish);
      }
    },
  });
}

class Seaweed extends BasicEntity {
  init() {
    this.imageTransform = new Transform();
    this.imageTransform.translate.set(-16, -64);
    this.image = loadImage('./seaweed.png');
    this.transform.translate.x = Math.floor(random(this.game.width));
    this.transform.translate.y = this.game.height;
    const scale = randomRange(0.5, 1.5);
    this.transform.scale.scale(scale);
    this.drawHandle.zIndex = 1 + scale * 0.8;
  }

  async body() {
    this.do(async job => {
      while (true) {
        await this.sleep(random(10));
        this.transform.scale.x *= -1;
        await this.sleep(5);
      }
    });

    while (true) {
      await job.tick();
      this.transform.translate.y = this.game.height;
    }
  }

  onDraw(context, width, height) {
    this.transform.applyToContext(context);
    this.imageTransform.applyToContext(context);
    context.drawImage(this.image, 0, 0);
    context.resetTransform();
  }
}

class Bubble extends BasicEntity {
  init() {
    this.image = loadImage('./bubble.png');
    this.transform.translate.x = random(this.game.width);
    this.transform.translate.y = random(this.game.height);

    this.drawHandle.zIndex = randomRange(1, 2);

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
    context.drawImage(
      this.image,
      Math.floor(this.transform.translate.x),
      Math.floor(this.transform.translate.y),
    );
  }
}


class Fish extends BasicEntity {
  init() {
    this.transform.translate.set(
      this.game.width / 2,
      this.game.height / 2,
    );
    this.imageTransform = new Transform();
    this.imageTransform.translate.set(-16, -16);
    this.images = {
      normal: loadImage('./fish-normal.png'),
      bite: loadImage('./fish-bite.png'),
    };
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
        this.transform.scale.x = 1;
      } else if (arrowKeys.x > 0) {
        this.transform.scale.x = -1;
      }
    }
  }

  onDraw(context, width, height) {
    this.transform.applyToContext(context);
    this.imageTransform.applyToContext(context);
    context.drawImage(
      this.game.input.keyDown['Space'] ? this.images.bite : this.images.normal,
      0,
      0,
    );
    context.resetTransform();
  }
}

main();