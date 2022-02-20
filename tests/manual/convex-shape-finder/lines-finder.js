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

    const initialLines = [{
      position: new Vec2(0, 0),
      normal: new Vec2(1, 0),
    }, {
      position: new Vec2(0, 0),
      normal: new Vec2(0, 1),
    }, {
      position: new Vec2(picture.width, 0),
      normal: new Vec2(-1, 0),
    }, {
      position: new Vec2(0, picture.height),
      normal: new Vec2(0, -1),
    }];
    for (const line of initialLines) {
      await this.addLine(line);
    }
    await this.forever();
  }

  async addLine(line) {
    this.activeLine = line;
    await this.forever();
    this.activeLine = null;
  }

  onDraw(context, width, height) {
    if (this.activeLine) {
      Vec2.withTemps(3, (lineMid, lineDir, cursor) => {
        const activeLine = this.activeLine;
        lineDir.assign(this.activeLine.normal);
        lineDir.rotateCW();

        context.strokeStyle = 'yellow';
        context.beginPath();

        lineMid.set(this.picture.x, this.picture.y)
        lineMid.add(activeLine.position);
        cursor.assignMulSum(1, lineMid, -this.maxDistance, lineDir);
        context.moveTo(cursor.x, cursor.y);
        cursor.assignMulSum(1, lineMid, this.maxDistance, lineDir);
        context.lineTo(cursor.x, cursor.y);

        context.stroke();
      });
    }
  }
}
