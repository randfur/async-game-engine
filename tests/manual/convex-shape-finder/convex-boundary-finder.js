import {BasicEntity} from '../../../presets/basic-entity.js';
import {distance, indexWrapped} from '../../../utils/math.js';
import {random} from '../../../utils/random.js';
import {CreateResolveablePromise} from '../../../utils/promise.js';
import {Vec2} from '../../../utils/vec2.js';

export class ConvexBoundaryFinder extends BasicEntity {
  async body({maxLines, picture}) {
    this.foundLines = CreateResolveablePromise();
    this.picture = picture;

    this.centre = new Vec2(
      picture.x + picture.width / 2,
      picture.y + picture.height / 2,
    );
    this.maxDistance = distance(picture.width, picture.height) / 2;

    this.boundaries = await this.buildInitialBoundaries();
    await this.advanceInitialBoundaries(this.boundaries);
    // await this.addMoreBoundaries(maxLines - this.boundaries.length);

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
      const boundaryBefore = indexWrapped(initialBoundaries, i - 1);
      const boundary = indexWrapped(initialBoundaries, i);
      const boundaryAfter = indexWrapped(initialBoundaries, i + 1);
      await this.advance(boundaryBefore, boundary, boundaryAfter);
      boundaryAfter.position.assignBoundariesIntersection(boundary, boundaryAfter);
    }
  }

  async addMoreBoundaries(boundariesToAddCount) {
    let index = 0;
    while (boundariesToAddCount > 0) {
      const added = await this.maybeAddBoundaryAt(index);
      if (added) {
        --boundariesToAddCount;
        ++index;
      }
      ++index;
    }
  }

  async maybeAddBoundaryAt(index) {
    const boundary = indexWrapped(this.boundaries, index);
    const boundaryBefore = indexWrapped(this.boundaries, index - 1);
    const newBoundary = {
      position: new Vec2(),
      normal: new Vec2(),
    };
    this.addingBoundary = {
      boundary: newBoundary,
      boundaryAfter: boundary,
    };
    newBoundary.position.assign(boundary.position);
    newBoundary.normal.assignSum(boundaryBefore.normal, boundary.normal);
    newBoundary.normal.normalise();
    const steps = await this.advance(boundaryBefore, newBoundary, boundary);
    if (steps > 10) {
      this.boundaries.splice(index, 0, newBoundary);
      boundary.position.assignBoundariesIntersection(newBoundary, boundary);
      return true;
    }
    return false;
  }

  async advance(boundaryBefore, boundary, boundaryAfter) {
    let steps = 0;
    while (this.boundaryIsClear(boundary, boundaryAfter)) {
      await this.tick();
      boundary.position.add(boundary.normal);
      boundary.position.assignBoundariesIntersection(boundaryBefore, boundary);
      ++steps;
    }
    return steps;
  }

  boundaryIsClear(boundary, boundaryAfter) {
    const cursor = Vec2.pool.acquire();
    cursor.assign(boundary.position);
    const dir = Vec2.pool.acquire();
    dir.assign(boundary.normal);
    dir.rotateCCW();
    const endDelta = Vec2.pool.acquire();
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
        cursor.y = boundary.position.y + (cursor.x - boundary.position.x) * slope;
      } else {
        cursor.y += step;
        cursor.x = boundary.position.x + (cursor.y - boundary.position.y) * slope;
      }
    }
    Vec2.pool.release(3);
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
    const intersection = Vec2.pool.acquire();
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

    if (this.addingBoundary) {
      const {boundary, boundaryAfter} = this.addingBoundary;
      context.moveTo(
          this.picture.x + boundary.position.x,
          this.picture.y + boundary.position.y);
      intersection.assignBoundariesIntersection(boundary, boundaryAfter);
      context.lineTo(
          this.picture.x + intersection.x,
          this.picture.y + intersection.y);
    }

    Vec2.pool.release(1);
    context.stroke();
  }
}
