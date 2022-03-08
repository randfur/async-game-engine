import {Entity} from '../../../engine/entity.js';
import {distance, indexWrapped} from '../../../utils/math.js';
import {CreateResolveablePromise} from '../../../utils/promise.js';
import {Vec2} from '../../../utils/vec2.js';

export class LinesFinder extends Entity {
  async run({maxLines, picture}, game) {
    this.foundLines = CreateResolveablePromise();
    this.picture = picture;

    this.centre = new Vec2(
      picture.x + picture.width / 2,
      picture.y + picture.height / 2,
    );
    this.maxDistance = distance(picture.width, picture.height) / 2;

    this.boundaries = await this.buildInitialBoundaries();
    await this.advanceInitialBoundaries(this.boundaries);
    // TODO: Add new boundaries at the corners and advance them.
    this.foundLines.resolve();
    await this.forever();
  }

  buildInitialBoundaries() {
    return [{
      position: new Vec2(0.5, 0.5),
      normal: new Vec2(0, 1),
    }, {
      position: new Vec2(this.picture.width - 0.5, 0.5),
      normal: new Vec2(-1, 0),
    }, {
      position: new Vec2(this.picture.width - 0.5, this.picture.height - 0.5),
      normal: new Vec2(0, -1),
    }, {
      position: new Vec2(0.5, this.picture.height - 0.5),
      normal: new Vec2(1, 0),
    }];
  }

  async advanceInitialBoundaries(initialBoundaries) {
    for (let i = 0; i < initialBoundaries.length; ++i) {
      await this.advance(
         indexWrapped(initialBoundaries, i - 1),
         indexWrapped(initialBoundaries, i),
         indexWrapped(initialBoundaries, i + 1));
    }
  }

  async advance(boundaryBefore, boundary, boundaryAfter) {
    while (await this.boundaryIsClear(boundary, boundaryAfter)) {
      await this.tick();
      boundary.position.add(boundary.normal);
      boundary.position.assignBoundariesIntersection(boundaryBefore, boundary);
    }
    boundaryAfter.position.assignBoundariesIntersection(boundary, boundaryAfter);
  }

  async boundaryIsClear(boundary, boundaryAfter) {
    const cursor = Vec2.getTemp();
    cursor.assign(boundary.position);
    const dir = Vec2.getTemp();
    dir.assign(boundary.normal);
    dir.rotateCCW();
    const endDelta = Vec2.getTemp();
    let hitOpaque = false;
    const stepX = Math.abs(dir.x) > Math.abs(dir.y);
    const slope = stepX ? dir.y / dir.x : dir.x / dir.y;
    const step = stepX ? Math.sign(dir.x) : Math.sign(dir.y);
    while (true) {
      if (this.pointIsOpaque(cursor)) {
        hitOpaque = true;
        break;
      }
      endDelta.assignSub(cursor, boundaryAfter.position);
      const dot = endDelta.dot(boundaryAfter.normal);
      if (endDelta.dot(boundaryAfter.normal) <= 0) {
        break;
      }
      if (stepX) {
        cursor.x += step;
      } else {
        cursor.y += step;
      }
    }
    Vec2.releaseTemps(3);
    return !hitOpaque;
  }

  pointIsOpaque({x, y}) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || x >= this.picture.width || y < 0 || y >= this.picture.height) {
      return false;
    }
    const imageData = this.picture.imageData;
    return imageData.data[(imageData.width * y + x) * 4 + 3] > 0;
  }

  onDraw(context, width, height) {
    context.strokeStyle = 'yellow';
    context.beginPath();
    const intersection = Vec2.getTemp();
    for (let i = 0; i < this.boundaries.length; ++i) {
      const boundary = this.boundaries[i];
      const boundaryAfter = indexWrapped(this.boundaries, i + 1);
      context.moveTo(
          this.picture.x + boundary.position.x,
          this.picture.y + boundary.position.y);
      intersection.assignBoundariesIntersection(boundary, boundaryAfter);
      context.lineTo(
          this.picture.x + intersection.x,
          this.picture.y + intersection.y);
    }
    Vec2.releaseTemps(1);
    context.stroke();
  }
}
