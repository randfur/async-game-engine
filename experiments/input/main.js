import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {BasicEntity} from '../../presets/basic-entity.js';
import {TAU} from '../../utils/math.js';
import {Vec2} from '../../utils/vec2.js';

async function main() {
  new Game({
    initialScene: class extends BasicScene {
      async run() {
        this.create(ArrowControl);
        this.create(MouseControl);
      }
    },
  });
}

class ArrowControl extends BasicEntity {
  init() {
    this.enableCollisions();
    this.collider.filterTypes = [Projectile];
    this.collider.width = 100;
    this.collider.height = 100;
  }

  async body() {
    this.position.set(this.game.width / 2, this.game.height / 2);
    while (true) {
      await this.tick();
      this.position.addScaled(this.game.input.arrowKeys, 10);
      this.hit = false;
    }
  }

  onDraw(context, width, height) {
    context.fillStyle = this.hit ? 'brown' : 'blue';
    context.fillRect(
      this.position.x,
      this.position.y,
      this.collider.width,
      this.collider.height,
    );
  }

  onCollision(projectile) {
    console.assert(projectile instanceof Projectile);
    if (projectile.size <= 3) {
      this.hit = true;
    }
  }
}

class MouseControl extends BasicEntity {
  async body() {
    while (true) {
      await this.tick();
      this.position.copy(this.game.input.mouse.position);
    }
  }

  onInput(eventName, event) {
    switch (eventName) {
      case 'mousedown': {
        if (!this.shootingJob) {
          this.shootingJob = this.do(async job => {
            while (true) {
              this.scene.create(Projectile, {
                target: this.game.input.mouse.position.clone(),
              });
              await job.sleep(0.1);
            }
          });
        }
        break;
      }
      case 'mouseup': {
        this.shootingJob?.stop();
        this.shootingJob = null;
        break;
      }
    }
  }

  onDraw(context, width, height) {
    context.strokeStyle = 'red';
    const radius = 20;
    const hairSize = 15;
    context.beginPath();
    context.save();
    context.translate(this.position.x, this.position.y);
    context.arc(0, 0, radius, 0, TAU);
    context.moveTo(0, -radius - hairSize / 2);
    context.lineTo(0, -radius + hairSize / 2);
    context.moveTo(0, radius - hairSize / 2);
    context.lineTo(0, radius + hairSize / 2);
    context.moveTo(-radius - hairSize / 2, 0);
    context.lineTo(-radius + hairSize / 2, 0);
    context.moveTo(radius - hairSize / 2, 0);
    context.lineTo(radius + hairSize / 2, 0);
    context.restore();
    context.stroke();
  }
}

class Projectile extends BasicEntity {
  init({target}) {
    this.enableCollisions();
    this.collider.width = 10;
    this.collider.height = 10;
    this.target = target;
    this.position.set((this.game.width / 2 + target.x) / 2, this.game.height);
    this.size = 0;
  }

  async body() {
    while (true) {
      await this.tick();

      const delta = Vec2.getTemp();
      delta.assignSub(this.target, this.position);
      this.position.addScaled(delta, 0.1);
      Vec2.releaseTemps(1);

      this.size = Vec2.distance(this.position, this.target) * 0.1;

      if (this.size < 1) {
        break;
      }
    }
  }

  onDraw(context, width, height) {
    context.fillStyle = 'white';
    context.fillRect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size,
    );
  }
}

main();