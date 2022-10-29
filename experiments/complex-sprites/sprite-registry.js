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
      console.log(response);
      const spritePackJson = await response.json();
      const spritePack = {};

      for (const [spriteName, spriteJson] of Object.entries(spritePackJson)) {
        const sprite = {
          frames: [],
          framesPerSecond: spriteJson.framesPerSecond,
          switchTo: spriteJson.switchTo,
        };
        spritePack[spriteName] = sprite;
        for (const frameJson of spriteJson.frames) {
          const frame = {
            image: null,
            transform: new Transform(),
            frameLength: frameJson.frameLength,
            convexCollisionPolygon: [],
          };
          sprite.frames.push(frame);

          const imageSrc = frameJson.imageSrc;
          if (!loadingImages[imageSrc]) {
            loadingImages[imageSrc] = new Promise(resolve => {
              const image = new Image();
              image.src = imageSrc;
              console.log(imageSrc);
              image.addEventListener('load', () => resolve(image));
            });
          }
          pendingImageLoads.push(loadingImages[imageSrc].then(image => {
            console.log('loaded', imageSrc);
            frame.image = image;
          }));

          const transformJson = frameJson.transform;
          if (transformJson?.origin) {
            frame.transform.origin.assign(transformJson.origin);
          }
          if (transformJson?.scale) {
            frame.transform.scale.assign(transformJson.scale);
          }
          if (transformJson?.rotate) {
            frame.transform.rotate.assign(transformJson.rotate);
          }
          if (transformJson?.translate) {
            frame.transform.translate.assign(transformJson.translate);
          }

          for (const pointJson of frameJson.convexCollisionPolygon) {
            frame.convexCollisionPolygon.push(new Vec2(pointJson.x, pointJson.y));
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
    const spriteHandle = new SpriteHandle(this);
    this.spriteHandles.push(spriteHandle);
    job.registerCleanUp(() => {
      removeItem(this.spriteHandles, spriteHandle);
    });
    return spriteHandle;
  }

  onFrame() {
  }
}

class SpriteHandle {
    // SpriteHandle
    // - Contains sprite instance.
    // - switchTo(spriteName)
    // - loadPack(src, spriteName)
    // - draw(context) or
  constructor(spriteRegistry) {
    this.spriteRegistry = spriteRegistry;
    this.spritePack = null;
    this.spriteName = null;
    this.frameIndex = null;
    this.elapsedFrames = null;
    this.spriteStartTime = null;
    this.lastLoad = null;
  }

  switchToPack(spritePackSrc, spriteName) {
    this.spritePack = loadedSpritePacks[spritePackSrc];
    this.spriteName = spriteName;
    this.frameIndex = 0;
  }
}

