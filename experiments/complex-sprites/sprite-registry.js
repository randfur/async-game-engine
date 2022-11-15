import {removeItem} from '../../utils/array.js';
import {Transform} from '../../utils/transform.js';
import {Vec2} from '../../utils/vec2.js';

const loadingImages = {};
const loadingSpritePacks = {};
const loadedSpritePacks = {};

/*
interface SpriteRegistry {
  constructor(scene: Scene);
  register(job: Job): dogs;
  onFrame();
}

# .spritepack JSON format.

type SpritePackJson = Record<string, SpriteJson>;

interface SpriteJson {
  keyframes: []KeyframeJson,
  transform?: TransformJson,
  convexCollisionPolygon?: []Vec2Json,
  framesPerSecond: number,
  switchTo?: string,
}

interface KeyframeJson {
  imageSrc: string,
  frames: number,
}

interface TransformJson {
  origin: Vec2Json,
  scale: Vec2Json,
  rotate: Vec2Json,
  translate: Vec2Json,
}
*/

export function preloadSpritePack(spritePackSrc) {
  if (!loadingSpritePacks[spritePackSrc]) {
    loadingSpritePacks[spritePackSrc] = (async () => {
      const pendingImageLoads = [];
      const response = await fetch(spritePackSrc);
      const spritePackJson = await response.json();
      const spritePack = {};

      for (const [spriteName, spriteJson] of Object.entries(spritePackJson)) {
        const sprite = {
          keyframes: [],
          transform: parseTransformJson(spriteJson.transform),
          framesPerSecond: spriteJson.framesPerSecond,
          totalFrameCount: 0,
          switchTo: spriteJson.switchTo,
        };
        spritePack[spriteName] = sprite;
        for (const keyframeJson of spriteJson.keyframes) {
          const keyframe = {
            sprite,
            image: null,
            transform: parseTransformJson(keyframeJson.transform),
            frames: keyframeJson.frames,
          };
          sprite.keyframes.push(keyframe);
          sprite.totalFrameCount += keyframe.frames;

          const imageSrc = keyframeJson.imageSrc;
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
            keyframe.image = image;
          }));
        }
      }

      await Promise.all(pendingImageLoads);

      loadedSpritePacks[spritePackSrc] = spritePack;
    })();
  }
  return loadingSpritePacks[spritePackSrc];
}

function parseTransformJson(transformJson) {
  if (!transformJson) {
    return null;
  }
  const transform = new Transform();
  if (transformJson?.origin) {
    transform.origin.assign(transformJson.origin);
  }
  if (transformJson?.scale) {
    transform.scale.assign(transformJson.scale);
  }
  if (transformJson?.rotate) {
    transform.rotate.assign(transformJson.rotate);
  }
  if (transformJson?.translate) {
    transform.translate.assign(transformJson.translate);
  }
  return transform;
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
    this.keyframeIndex = null;
    this.spriteStartTime = null;
    this.keyframeStartFrame = null;
  }

  switchToPack(spritePackSrc, spriteName) {
    this.spritePack = loadedSpritePacks[spritePackSrc];
    this.switchTo(spriteName);
  }

  switchTo(spriteName) {
    this.spriteName = spriteName;
    this.keyframeIndex = 0;
    this.spriteStartTime = this.scene.time;
    this.keyframeStartFrame = 0;
  }

  getSprite() {
    if (!this.spriteName) {
      return null;
    }
    return this.spritePack[this.spriteName];
  }

  getKeyframe() {
    return this.getSprite()?.keyframes[this.keyframeIndex];
  }

  onFrame() {
    if (!this.spriteName) {
      return;
    }
    let sprite = this.spritePack[this.spriteName];
    let unwrappedTargetFrame = (this.scene.time - this.spriteStartTime) * sprite.framesPerSecond;
    let targetFrame = unwrappedTargetFrame % sprite.totalFrameCount;
    // TODO: Handle multiple rounds of switchTo.
    if (sprite.switchTo && unwrappedTargetFrame >= sprite.totalFrameCount) {
      this.spriteName = sprite.switchTo;
      sprite = this.spritePack[this.spriteName];
      this.spriteStartTime = this.scene.time;
      targetFrame = 0;
      this.keyframeIndex = 0;
      this.keyframeStartFrame = 0;
    }
    if (targetFrame < this.keyframeStartFrame) {
      this.keyframeIndex = 0;
      this.keyframeStartFrame = 0;
    }
    let keyframe = sprite.keyframes[this.keyframeIndex];
    while (targetFrame - this.keyframeStartFrame >= keyframe.frames) {
      targetFrame -= keyframe.frames;
      this.keyframeStartFrame += keyframe.frames;
      ++this.keyframeIndex
      keyframe = sprite.keyframes[this.keyframeIndex];
    }
  }
}

