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
    while (this.boundaryIsClear(boundary, boundaryAfter)) {
      await this.tick();
      boundary.position.add(boundary.normal);
      if (boundaryBefore) {
        boundary.position.assignBoundariesIntersection(boundaryBefore, boundary);
      }
    }
    if (boundaryAfter) {
      boundaryAfter.assignBoundariesIntersection(boundary, boundaryAfter);
    }
  }

  lineIsClear(line, lineAfter) {
    const cursor = Vec2.getTemp();
    cursor.assign(line.position);
    const dir = Vec2.getTemp();
    dir.assign(line.normal);
    dir.rotateCCW();
    const endDelta = Vec2.getTemp();
    let hitOpaque = false;
    if (Math.abs(dir.x) > Math.abs(dir.y)) {
      const slope = dir.y / dir.x;
      const step = Math.sign(dir.x);
      while (true) {
        if (this.pointIsOpaque(cursor)) {
          hitOpaque = true;
          break;
        }
        endDelta.assignSub(cursor, lineAfter.position);
        if (endDelta.dot(lineAfter.normal) <= 0) {

        }
      // TODO
    } else {
      const slope = dir.x / dir.y;
      const step = Math.sign(dir.y);
      // TODO
    }
    Vec2.releaseTemps(3);
    return !hitOpaque;
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
  }
}
