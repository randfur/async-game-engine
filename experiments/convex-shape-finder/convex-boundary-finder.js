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
    this.inProgressHeightMap = null;

    this.foundLines = this.findLines();
  }

  async body() {
    await this.forever();
  }

  async findLines() {
    const heightMap = await this.buildHeightMap();
    heightMap.sort((a, b) => b.height - a.height);
    this.inProgressSortedHeightMap = heightMap;
    await this.sleep(2);
    // Grow lines from peak.
  }

  async buildHeightMap() {
    const heightMap = [];
    this.inProgressHeightMap = heightMap;
    const imageData = this.picture.imageData;
    let lastHeight = 0;
    for (let x = 0; x <= imageData.width; ++x) {
      await this.tick();
      const thisHeight = x < imageData.width ? this.getHeight(x) : lastHeight;
      heightMap.push({
        x,
        height: Math.max(lastHeight, thisHeight),
      });
      lastHeight = thisHeight;
    }
    this.inProgressHeightMap = null;
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

    if (this.inProgressHeightMap) {
      context.fillStyle = '#f00a';
      for (const {x, height} of this.inProgressHeightMap) {
        context.fillRect(bottom.x + x, bottom.y - height, 1, height);
      }
    }

    if (this.inProgressSortedHeightMap) {
      for (const [i, {x, height}] of enumerate(this.inProgressSortedHeightMap)) {
        const alpha = (1 - (i / (this.inProgressSortedHeightMap.length - 1))) / 2;
        context.fillStyle = `rgba(255, 0, 0, ${alpha})`;
        context.fillRect(bottom.x + x, bottom.y - height, 1, height);
      }
    }

    Vec2.pool.release(1);
  }
}
