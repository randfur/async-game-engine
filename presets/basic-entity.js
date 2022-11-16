import {Entity} from '../engine/entity.js';
import {Mat3} from '../utils/mat3.js';
import {Transform} from '../utils/transform.js';
import {Vec2} from '../utils/vec2.js';

/*
interface BasicEntity extends Entity {
  initPresetParts();
  onInput(eventName: string, event: MouseEvent | KeyboardEvent);
  enableCollisions();
  updateBoundingBox(boundingBox: BoundingBox): boolean;
  onCollision(otherCollider: Collider);
  onDraw(context: HTMLCanvasContext2D, width: number, height: number);
  drawSpriteHandle(context: HTMLCanvasContext2D);
}
*/

export class BasicEntity extends Entity {
  initPresetParts() {
    this.spriteHandle = this.scene.spriteRegistry.register(this);
    if (this.onInput !== BasicEntity.prototype.onInput) {
      this.scene.inputRegistry.register(this, this.onInput.bind(this));
    }
    this.drawHandle = this.scene.drawing2dRegistry.register(this, (context, width, height) => {
      this.onDraw(context, width, height);
    });
    this.collider = null;
    this.transform = new Transform();
  }

  onInput(eventName, event) {}

  enableCollisions() {
    this.collider = this.scene.collision2dRegistry.register(
      this,
      collisionNode => this.updateBoundingBox(collisionNode),
      (other, otherCollider) => this.onCollision(other, otherCollider),
    );
    this.collider.transform = this.transform;
  }

  static #updateBoundingBoxPoints = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
  static #updateBoundingBoxMatrix = new Mat3();
  updateBoundingBox(boundingBox) {
    return false;
    // TODO: Update this to work with this.spriteHandle.

    // const sprite = this.spriteHandle.getSprite();

    // const image = this.sprite.image;
    // const points = BasicEntity.#updateBoundingBoxPoints;
    // points[0].set(0, 0);
    // points[1].set(image.width, 0);
    // points[2].set(image.width, image.height);
    // points[3].set(0, image.height);

    // const matrix = BasicEntity.#updateBoundingBoxMatrix;
    // matrix.setIdentity();
    // this.sprite.transform.applyToMatrix(matrix);
    // this.transform.applyToMatrix(matrix);
    // for (const point of points) {
    //   matrix.applyToVector(point);
    // }
    // boundingBox.setFromPoints(points);
    // return true;
  }

  onCollision(otherCollider) {}

  onDraw(context, width, height) {
    this.drawSpriteHandle(context);
  }

  static #drawSpriteHandleMatrix = new Mat3();
  drawSpriteHandle(context) {
    const keyframe = this.spriteHandle.getKeyframe();
    if (!keyframe) {
      return;
    }
    const matrix = BasicEntity.#drawSpriteHandleMatrix;
    matrix.setIdentity();
    keyframe.sprite.transform?.applyToMatrix(matrix);
    this.transform.applyToMatrix(matrix);
    this.scene.cameraTransform.applyToMatrix(matrix);
    matrix.applyToContext(context);
    context.drawImage(keyframe.image, 0, 0);
  }
}
