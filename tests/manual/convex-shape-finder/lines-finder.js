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

    this.lines = await this.buildInitialLines();
    // while (this.lines.length < maxLines) {
    //   this.addLine(this.lines);
    // }
    await this.forever();
  }

  async buildInitialLines() {
    const initialLines = [{
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

    this.activeLine = initialLines[0];

    // for (const line of initialLines) {
    //   this.compress(line);
    // }

    return initialLines;
  }

  compress(line, boundaryA=null, boundaryB=null) {
    while (this.lineIsClear(line, boundaryB)) {
      line.position.add(line.normal);
      if (boundaryA) {
        line.position.assignNormalLinesIntersection(boundaryA, line);
      }
    }
    if (boundaryB) {
      boundaryB.assignNormalLinesIntersection(line, boundaryB);
    }
  }

  lineIsClear(line, boundaryB=null) {

  }

  onDraw(context, width, height) {
    if (this.activeLine) {
      const lineDir = Vec2.getTemp();
      lineDir.assign(this.activeLine.normal);
      lineDir.rotateCW();

      context.strokeStyle = 'yellow';
      context.beginPath();

      const lineMid = Vec2.getTemp();
      lineMid.set(this.picture.x, this.picture.y)
      lineMid.add(this.activeLine.position);

      const cursor = Vec2.getTemp();
      cursor.assignMulSum(1, lineMid, -this.maxDistance, lineDir);
      context.moveTo(cursor.x, cursor.y);
      cursor.assignMulSum(1, lineMid, this.maxDistance, lineDir);
      context.lineTo(cursor.x, cursor.y);

      context.stroke();

      Vec2.releaseTemps(3);
    }
  }
}
