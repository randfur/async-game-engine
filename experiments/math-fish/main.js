import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {BasicEntity} from '../../presets/basic-entity.js';
import {deviate, random} from '../../utils/random.js';
import {loadImage} from '../../utils/image.js';
import {recycledRange} from '../../utils/range.js';

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

        for (let i of recycledRange(10)) {
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
    this.image = loadImage('./seaweed.png');
    this.position.x = Math.floor(random(this.game.width));
    this.position.y = this.game.height - 64;
  }

  async body() {
    await this.forever();
  }

  onDraw(context, width, height) {
    context.drawImage(
      this.image,
      this.position.x,
      this.position.y,
    );
  }
}

class Bubble extends BasicEntity {
  init() {
    this.image = loadImage('./bubble.png');
    this.position.x = random(this.game.width);
    this.position.y = random(this.game.height);

    this.floatUpSpeed = random(4);
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
      this.position.x += Math.sin(this.position.y * this.wobbleSpeed) * this.wobbleAmount;
      this.position.y -= this.floatUpSpeed;

      if (this.position.x < 0 || this.position.x > this.game.width || this.position.y < 0) {
        this.position.x = random(this.game.width);
        this.position.y = this.game.height;
      }
    }
  }

  onCollision(other, otherCollider) {
    this.position.y += this.game.height;
  }

  onDraw(context, width, height) {
    context.drawImage(
      this.image,
      Math.floor(this.position.x),
      Math.floor(this.position.y),
    );
  }
}


class Fish extends BasicEntity {
  init() {
    this.position.set(
      this.game.width / 2,
      this.game.height / 2,
    );
    this.images = {
      normal: loadImage('./fish-normal.png'),
      bite: loadImage('./fish-bite.png'),
    };
    this.movementScale = 4;

    this.enableCollisions();
    this.collider.width = 32;
    this.collider.height = 32;
  }

  async body() {
    while (true) {
      await this.tick();
      this.position.addScaled(this.game.input.arrowKeys, this.movementScale);
    }
  }

  onDraw(context, width, height) {
    context.drawImage(
      this.game.input.keyDown['Space'] ? this.images.bite : this.images.normal,
      Math.floor(this.position.x),
      Math.floor(this.position.y),
    );
  }
}

main();