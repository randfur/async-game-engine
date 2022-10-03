import {Game} from '../../engine/game.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {BasicEntity} from '../../presets/basic-entity.js';
import {TAU} from '../../utils/math.js';
import {Vec2} from '../../utils/vec2.js';
import {JobSlots} from '../../utils/job-slots.js';

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
    this.transform.translate.set(this.game.width / 2, this.game.height / 2);
    while (true) {
      await this.tick();
      this.transform.translate.addScaled(this.game.input.arrowKeys, 10);
      this.hit = false;
    }
  }

  onDraw(context, width, height) {
    context.fillStyle = this.hit ? 'brown' : 'blue';
    context.fillRect(
      this.transform.translate.x,
      this.transform.translate.y,
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

const kShooting = Symbol();
class MouseControl extends BasicEntity {
  init() {
    this.jobSlots = new JobSlots(this, {
      [kShooting]: async job => {
        while (true) {
          this.scene.create(Projectile, {
            target: this.game.input.mouse.position.clone(),
          });
          await job.sleep(0.1);
        }
      },
    });
  }

  async body() {
    while (true) {
      await this.tick();
      this.transform.translate.copy(this.game.input.mouse.position);
    }
  }

  onInput(eventName, event) {
    switch (eventName) {
      case 'mousedown': {
        this.jobSlots.start(kShooting);
        break;
      }
      case 'mouseup': {
        this.jobSlots.stop(kShooting);
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
    context.translate(this.transform.translate.x, this.transform.translate.y);
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
    this.transform.translate.set((this.game.width / 2 + target.x) / 2, this.game.height);
    this.size = 0;
  }

  async body() {
    while (true) {
      await this.tick();

      const delta = Vec2.getTemp();
      delta.assignSub(this.target, this.transform.translate);
      this.transform.translate.addScaled(delta, 0.1);
      Vec2.releaseTemps(1);

      this.size = Vec2.distance(this.transform.translate, this.target) * 0.1;

      if (this.size < 1) {
        break;
      }
    }
  }

  onDraw(context, width, height) {
    context.fillStyle = 'white';
    context.fillRect(
      this.transform.translate.x - this.size / 2,
      this.transform.translate.y - this.size / 2,
      this.size,
      this.size,
    );
  }
}

main();