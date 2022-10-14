import {Game} from '../../engine/game.js';
import {TAU} from '../../utils/math.js';
import {Vec2} from '../../utils/vec2.js';
import {Mat3} from '../../utils/mat3.js';
import {deviate, random, randomRange} from '../../utils/random.js';
import {range} from '../../utils/range.js';
import {BasicScene} from '../../presets/basic-scene.js';
import {BasicEntity} from '../../presets/basic-entity.js';

function main() {
  new Game({
    initialScene: class extends BasicScene {
      async run() {
        while (true) {
          this.do(async job => {
            job.create(FloatingConvexShape);
            await job.sleep(10);
          });
          await this.sleep(0.5);
        }
      }
    },
  });
}

class FloatingConvexShape extends BasicEntity {
  init() {
    this.enableCollisions();

    this.transform.translate.set(
      random(this.game.width),
      random(this.game.height),
    );
    this.velocity = new Vec2();
    this.velocity.setPolar(random(TAU), random(0.1));

    this.angularVelocity = new Vec2();
    this.angularVelocity.setPolar(deviate(0.01));

    const pointCount = Math.round(randomRange(3, 5));
    this.points = range(pointCount).map(i => {
      const vector = new Vec2();
      vector.setPolar(TAU * i / pointCount, randomRange(5, 20));
      return vector;
    });
    for (const point of this.points) {
      this.transform.origin.addScaled(point, 1 / pointCount);
    }
  }

  updateBoundingBox(boundingBox) {
    if (this.points.length === 0) {
      return false;
    }

    const matrix = Mat3.pool.acquire();
    this.transform.applyToMatrix(matrix);
    boundingBox.setFromMatrixTransformedPoints(matrix, this.points);
    Mat3.pool.release();
    return true;
  }

  async body() {
    while (true) {
      await this.tick();
      this.transform.translate.add(this.velocity);
      this.transform.rotate.rotate(this.angularVelocity);
      this.transform.rotate.normalise();
    }
  }

  onDraw(context, width, height) {
    this.transform.applyToContext(context);
    // TODO: Helper function?
    context.beginPath();
    for (let i = 0; i < this.points.length; ++i) {
      const point = this.points[i];
      if (i === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    }
    context.closePath();
    if (!this.collider.colliding) {
      context.strokeStyle = 'orange';
      context.stroke();
    } else {
      context.fillStyle = 'white';
      context.fill();
    }
  }
}

main();
