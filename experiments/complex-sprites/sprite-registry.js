import {removeItem} from '../../utils/array.js';
import {Transform} from '../../utils/transform.js';
import {Vec2} from '../../utils/vec2.js';

const loadingImages = {};
const loadingSpritePacks = {};
const loadedSpritePacks = {};

export function preloadSpritePack(spritePackSrc) {
  if (!loadingSpritePacks[spritePackSrc]) {
    loadingSpritePacks[spritePackSrc] = (async () => {
      const pendingImageLoads = [];
      const response = await fetch(spritePackSrc);
      const spritePackJson = await response.json();
      const spritePack = {};

      for (const [spriteName, spriteJson] of Object.entries(spritePackJson)) {
        const sprite = {
          keyFrames: [],
          framesPerSecond: spriteJson.framesPerSecond,
          totalFrameDuration: 0,
          switchTo: spriteJson.switchTo,
        };
        spritePack[spriteName] = sprite;
        for (const keyFrameJson of spriteJson.keyFrames) {
          const keyFrame = {
            image: null,
            transform: new Transform(),
            frameDuration: keyFrameJson.frameDuration,
            convexCollisionPolygon: [],
          };
          sprite.keyFrames.push(keyFrame);
          sprite.totalFrameDuration += keyFrame.frameDuration;

          const imageSrc = keyFrameJson.imageSrc;
          if (!loadingImages[imageSrc]) {
            loadingImages[imageSrc] = new Promise(resolve => {
              const image = new Image();
              image.src = imageSrc;
              image.addEventListener('load', () => {
                resolve(image);
              });
            });
          }
          pendingImageLoads.push(loadingImages[imageSrc].then(image => {
            keyFrame.image = image;
          }));

          const transformJson = keyFrameJson.transform;
          if (transformJson?.origin) {
            keyFrame.transform.origin.assign(transformJson.origin);
          }
          if (transformJson?.scale) {
            keyFrame.transform.scale.assign(transformJson.scale);
          }
          if (transformJson?.rotate) {
            keyFrame.transform.rotate.assign(transformJson.rotate);
          }
          if (transformJson?.translate) {
            keyFrame.transform.translate.assign(transformJson.translate);
          }

          for (const pointJson of keyFrameJson.convexCollisionPolygon) {
            keyFrame.convexCollisionPolygon.push(new Vec2(pointJson.x, pointJson.y));
          }
        }
      }

      await Promise.all(pendingImageLoads);

      loadedSpritePacks[spritePackSrc] = spritePack;
    })();
  }
  return loadingSpritePacks[spritePackSrc];
}

export class SpriteRegistry {
  constructor(scene) {
    this.scene = scene;
    this.spriteHandles = [];
  }

  register(job) {
    const spriteHandle = new SpriteHandle(this.scene);
    this.spriteHandles.push(spriteHandle);
    job.registerCleanUp(() => {
      removeItem(this.spriteHandles, spriteHandle);
    });
    return spriteHandle;
  }

  onFrame() {
    for (const spriteHandle of this.spriteHandles) {
      spriteHandle.onFrame();
    }
  }
}

class SpriteHandle {
    // SpriteHandle
    // - Contains sprite instance.
    // - switchTo(spriteName)
    // - loadPack(src, spriteName)
    // - draw(context) or
  constructor(scene) {
    this.scene = scene;
    this.spritePack = null;
    this.spriteName = null;
    this.keyFrameIndex = null;
    this.spriteStartTime = null;
    this.keyFrameStartFrame = null;
  }

  switchToPack(spritePackSrc, spriteName) {
    this.spritePack = loadedSpritePacks[spritePackSrc];
    this.switchTo(spriteName);
  }

  switchTo(spriteName) {
    this.spriteName = spriteName;
    this.keyFrameIndex = 0;
    this.spriteStartTime = this.scene.time;
    this.keyFrameStartFrame = 0;
  }

  getKeyFrame() {
    if (!this.spriteName) {
      return null;
    }
    return this.spritePack[this.spriteName].keyFrames[this.keyFrameIndex];
  }

  onFrame() {
    if (!this.spriteName) {
      return;
    }
    let sprite = this.spritePack[this.spriteName];
    let unwrappedTargetFrame = (this.scene.time - this.spriteStartTime) * sprite.framesPerSecond;
    let targetFrame = unwrappedTargetFrame % sprite.totalFrameDuration;
    if (sprite.switchTo && unwrappedTargetFrame >= sprite.totalFrameDuration) {
      this.spriteName = sprite.switchTo;
      sprite = this.spritePack[this.spriteName];
      this.spriteStartTime = this.scene.time;
      targetFrame = 0;
      this.keyFrameIndex = 0;
      this.keyFrameStartFrame = 0;
    }
    if (targetFrame < this.keyFrameStartFrame) {
      this.keyFrameIndex = 0;
      this.keyFrameStartFrame = 0;
    }
    let keyFrame = sprite.keyFrames[this.keyFrameIndex];
    while (targetFrame - this.keyFrameStartFrame >= keyFrame.frameDuration) {
      targetFrame -= keyFrame.frameDuration;
      this.keyFrameStartFrame += keyFrame.frameDuration;
      ++this.keyFrameIndex
      keyFrame = sprite.keyFrames[this.keyFrameIndex];
    }
  }
}

