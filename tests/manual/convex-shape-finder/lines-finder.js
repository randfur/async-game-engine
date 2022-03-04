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
    this.activeNextLine = initialLines[1];

    await this.compress(initialLines[3], initialLines[0], initialLines[1]);
    // for (const line of initialLines) {
    //   await this.compress(line);
    // }

    return initialLines;
  }

  async compress(lineBefore, line, lineAfter) {
    while (this.lineIsClear(line, lineAfter)) {
      await this.tick();
      line.position.add(line.normal);
      if (lineBefore) {
        line.position.assignNormalLinesIntersection(lineBefore, line);
      }
    }
    if (lineAfter) {
      lineAfter.assignNormalLinesIntersection(line, lineAfter);
    }
  }

  lineIsClear(line, lineAfter) {
    const cursor = Vec2.getTemp();
    cursor.assign(line.position);
    const dir = Vec2.getTemp();
    dir.assign(line.normal);
    dir.rotateCCW();
    // TODO
    Vec2.releaseTemps(2);
  }

  onDraw(context, width, height) {
    if (this.activeLine && this.activeNextLine) {
      context.strokeStyle = 'yellow';
      context.beginPath();
      context.moveTo(
        this.picture.x + this.activeLine.position.x,
        this.picture.y + this.activeLine.position.y,
      );
      context.lineTo(
        this.picture.x + this.activeNextLine.position.x,
        this.picture.y + this.activeNextLine.position.y,
      );
      context.stroke();
    }
  }
}
