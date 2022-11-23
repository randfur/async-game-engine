/*
interface SpriteHandle {
  scene: Scene;
  spritePack: SpritePack | null;
  spriteName: SpriteName | null;
  keyframeIndex: number;
  spriteStartTime: number;
  keyframeStartFrame: number;

  constructor(scene: Scene);

  async loadPack(spritePack: SpritePack, spriteName: SpriteName | null);

  switchToPack(spritePackSrc: string, spriteName: SpriteName);
  switchTo(spriteName: SpriteName);

  getKeyframe(): Keyframe | null;
  onFrame();
}
*/

export class SpriteHandle {
  constructor(scene) {
    this.scene = scene;
    this.spritePack = null;
    this.spriteName = null;
    this.keyframeIndex = null;
    this.spriteStartTime = null;
    this.keyframeStartFrame = null;
  }

  async loadPack(spritePack, spriteName) {
    await SpriteRegistry.loadPack(spritePack);
    this.switchToPack(spritePack.name, spriteName);
  }

  switchToPack(spritePackSrc, spriteName) {
    this.spritePack = loadedSpritePacks[spritePackSrc];
    this.switchTo(spriteName);
  }

  switchTo(spriteName) {
    if (this.spriteName === spriteName) {
      return;
    }
    this.hardSwitchTo(spriteName);
  }

  hardSwitchTo(spriteName) {
    this.spriteName = spriteName;
    this.keyframeIndex = 0;
    this.spriteStartTime = this.scene.time;
    this.keyframeStartFrame = 0;
  }

  getKeyframe() {
    if (!this.spritePack || !this.spriteName) {
      return null;
    }
    return this.spritePack[this.spriteName].keyframes[this.keyframeIndex];
  }

  onFrame() {
    if (!this.spritePack || !this.spriteName) {
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
