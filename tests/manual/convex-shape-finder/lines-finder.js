import {Entity} from '../../../engine/entity.js';
import {distance} from '../../../utils/math.js';
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
    // TODO
    await this.forever();
  }

  async buildInitialBoundaries() {
    const initialBoundaries = [{
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

    this.activeBoundary = initialBoundaries[0];
    this.activeNextBoundary = initialBoundaries[1];

    await this.advance(initialBoundaries[3], initialBoundaries[0], initialBoundaries[1]);
    // for (const line of initialBoundaries) {
    //   await this.advance(line);
    // }

    return initialBoundaries;
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
    this.activeCursor = cursor;
    cursor.assign(boundary.position);
    const dir = Vec2.getTemp();
    dir.assign(boundary.normal);
    dir.rotateCCW();
    const endDelta = Vec2.getTemp();
    let hitOpaque = false;
    if (Math.abs(dir.x) > Math.abs(dir.y)) {
      const slope = dir.y / dir.x;
      const step = Math.sign(dir.x);
      while (true) {
        await this.tick();
        if (this.pointIsOpaque(cursor)) {
          hitOpaque = true;
          break;
        }
        endDelta.assignSub(cursor, boundaryAfter.position);
        const dot = endDelta.dot(boundaryAfter.normal);
        if (endDelta.dot(boundaryAfter.normal) <= 0) {
          break;
        }
        cursor.x += step;
      }
      // TODO
    } else {
      const slope = dir.x / dir.y;
      const step = Math.sign(dir.y);
      // TODO
    }
    this.activeCursor = null;
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
    if (this.activeBoundary && this.activeNextBoundary) {
      context.strokeStyle = 'yellow';
      context.beginPath();
      context.moveTo(
          this.picture.x + this.activeBoundary.position.x,
          this.picture.y + this.activeBoundary.position.y,
      );
      context.lineTo(
          this.picture.x + this.activeNextBoundary.position.x,
          this.picture.y + this.activeNextBoundary.position.y,
      );
      context.stroke();
    }
    if (this.activeCursor) {
      context.fillStyle = 'red';
      context.fillRect(
          this.picture.x + this.activeCursor.x - 0.5,
          this.picture.y + this.activeCursor.y - 0.5,
          1, 1);
    }
  }
}
