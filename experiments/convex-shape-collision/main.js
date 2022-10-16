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
        // this.create(FloatingConvexShape);
        // this.create(FloatingConvexShape);
        // this.create(FloatingConvexShape);
        // this.create(FloatingConvexShape);
        // await this.forever();
        while (true) {
          this.do(async job => {
            job.create(FloatingConvexShape);
            await job.sleep(30);
          });
          await this.sleep(0.5);
        }
      }
    },
  });
}

// Points running in a positive radians direction create a shape.
// Points running in a negative radians direction create a cavity.
class ConvexShape {
  constructor(originalPoints) {
    this.originalPoints = originalPoints;
    this.points = this.originalPoints.map(point => point.clone());
  }

  applyMatrix(matrix) {
    for (let i = 0; i < this.points.length; ++i) {
      const point = this.points[i];
      point.assign(this.originalPoints[i]);
      matrix.applyToVector(point);
    }
  }

  static #isCollidingWithNormal = new Vec2();
  static #isCollidingWithDelta = new Vec2();
  isCollidingWith(otherConvexShape) {
    const normal = ConvexShape.#isCollidingWithNormal;
    const delta = ConvexShape.#isCollidingWithDelta;
    for (let i = 0; i < this.points.length; ++i) {
      const point = this.points[i];
      const nextPoint = this.points[(i + 1) % this.points.length];
      normal.assignSub(nextPoint, point);
      normal.rotateCCW();
      let allOutside = true;
      for (const otherPoint of otherConvexShape.points) {
        delta.assignSub(otherPoint, point);
        if (delta.dot(normal) < 0) {
          allOutside = false;
          break;
        }
      }
      if (allOutside) {
        return false;
      }
    }
    return true;
  }
}

class FloatingConvexShape extends BasicEntity {
  init() {
    this.enableCollisions();
    this.collider.filterTypes = [FloatingConvexShape];

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
    this.convexShape = new ConvexShape(this.points);
  }

  updateBoundingBox(boundingBox) {
    if (this.points.length === 0) {
      return false;
    }
    const matrix = Mat3.pool.acquire();
    this.transform.applyToMatrix(matrix);
    this.convexShape.applyMatrix(matrix);
    boundingBox.setFromPoints(this.convexShape.points);
    Mat3.pool.release();
    return true;
  }

  async body() {
    while (true) {
      await this.tick();
      this.transform.translate.add(this.velocity);
      this.transform.rotate.rotate(this.angularVelocity);
      this.transform.rotate.normalise();
      if (this.glow > 0) {
        this.glow -= 1;
      }
    }
  }

  onCollision(other, otherCollider) {
    if (this.collider.id > otherCollider.id) {
      return;
    }
    if (this.convexShape.isCollidingWith(other.convexShape)) {
      this.glow = 100;
      other.glow = 100;
    }
  }

  onDraw(context, width, height) {
    this.transform.applyToContext(context);
    // TODO: Could be helper function?
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
    if (this.glow > 0) {
      context.fillStyle = `rgba(255, 200, 0, ${this.glow}%)`;
      context.fill();
    }
    context.strokeStyle = 'orange';
    context.stroke();
  }
}

main();
