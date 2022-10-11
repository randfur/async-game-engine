import {BasicEntity} from '../../presets/basic-entity.js';
import {distance, indexWrapped} from '../../utils/math.js';
import {random} from '../../utils/random.js';
import {enumerate} from '../../utils/array.js';
import {CreateResolveablePromise} from '../../utils/promise.js';
import {Vec2} from '../../utils/vec2.js';

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
    const heightMap = await this.buildHeightMap();

    heightMap.sort((a, b) => b.height - a.height);
    this.inProgressSortedHeightMap = heightMap;

    const points = await this.extractConvexPoints(heightMap);
  }

  async extractConvexPoints(heightMap) {
    const points = [];
    this.inProgressPoints = points;
    for (const item of heightMap) {
      await this.tick();

      if (points.length === 0) {
        points.push(item);
        continue;
      }

      if (item.x < points[0].x) {
        while (true) {
          if (points.length === 1) {
            break;
          }

          const oldDeltaX = points[1].x - points[0].x;
          const oldDeltaY = points[1].height - points[0].height;
          const newDeltaX = points[0].x - item.x;
          const newDeltaY = points[0].height - item.height;
          const oldSlope = oldDeltaY * newDeltaX;
          const newSlope = newDeltaY * oldDeltaX;
          if (newSlope <= oldSlope) {
            //   /
            // --
            points.splice(0, 1);
          } else {
            //  __
            // /
            break;
          }
        }

        points.splice(0, 0, item);
        continue;
      }

      if (item.x > points[points.length - 1].x) {
        while (true) {
          if (points.length === 1) {
            break;
          }

          const last = points[points.length - 1];
          const secondLast = points[points.length - 2];
          const oldDeltaX = last.x - secondLast.x;
          const oldDeltaY = last.height - secondLast.height;
          const newDeltaX = item.x - last.x;
          const newDeltaY = item.height - last.height;
          const oldSlope = oldDeltaY * newDeltaX;
          const newSlope = newDeltaY * oldDeltaX;
          if (newSlope >= oldSlope) {
            // \
            //  --
            points.splice(points.length - 1, 1);
          } else {
            // __
            //   \
            break;
          }
        }

        points.push(item);
        continue;
      }
    }
    return points;
  }

  async buildHeightMap() {
    const heightMap = [];
    const imageData = this.picture.imageData;
    let lastHeight = 0;
    for (let x = 0; x <= imageData.width; ++x) {
      const thisHeight = x < imageData.width ? this.getHeight(x) : lastHeight;
      const height = Math.max(lastHeight, thisHeight);
      if (height > 0) {
        heightMap.push({x, height});
      }
      lastHeight = thisHeight;
    }
    return heightMap;
  }

  getHeight(x) {
    const imageData = this.picture.imageData;
    for (let height = imageData.height; height > 0; --height) {
      const y = imageData.height - height;
      const index = y * this.picture.imageData.width * 4 + x * 4;
      if (this.picture.imageData.data[index + 3] > 0) {
        return height;
      }
    }
    return 0;
  }

  isOpaque(x, y) {
    const index = y * this.picture.imageData.width * 4 + x * 4;
    return this.picture.imageData.data[index + 3] > 0;
  }

  onDraw(context, width, height) {
    context.resetTransform();
    const bottom = Vec2.pool.acquire();
    bottom.set(0, this.picture.canvas.height);
    this.picture.sprite.transform.applyToVector(bottom);
    this.picture.transform.applyToVector(bottom);

    if (this.inProgressSortedHeightMap) {
      for (const [i, {x, height}] of enumerate(this.inProgressSortedHeightMap)) {
        const alpha = (1 - (i / (this.inProgressSortedHeightMap.length - 1))) / 2;
        context.fillStyle = `rgba(255, 0, 0, ${alpha})`;
        context.fillRect(bottom.x + x, bottom.y - height, 1, height);
      }
    }

    if (this.inProgressPoints) {
      context.strokeStyle = 'red';
      context.beginPath();
      let first = true;
      for (const {x, height} of this.inProgressPoints) {
        if (first) {
          context.moveTo(bottom.x + x, bottom.y - height);
          first = false;
        } else {
          context.lineTo(bottom.x + x, bottom.y - height);
        }
      }
      context.stroke();
      context.fillStyle = 'white';
      for (const {x, height} of this.inProgressPoints) {
        context.fillRect(bottom.x + x, bottom.y - height, 1, 1);
      }
    }

    Vec2.pool.release(1);
  }
}
