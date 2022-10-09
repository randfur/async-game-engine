import {BasicEntity} from '../../../presets/basic-entity.js';
import {distance, indexWrapped} from '../../../utils/math.js';
import {random} from '../../../utils/random.js';
import {CreateResolveablePromise} from '../../../utils/promise.js';
import {Vec2} from '../../../utils/vec2.js';

export class ConvexBoundaryFinder extends BasicEntity {
  init({maxLines, picture}) {
    this.picture = picture;
    this.maxLines = maxLines;
    this.foundLines = this.findLines();
  }

  async body() {
    await this.forever();
  }

  async findLines() {

  }

  onDraw(context, width, height) {

  }
}
