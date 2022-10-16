import {Vec2} from './vec2.js';

export class BoundingBox {
  constructor() {
    this.min = new Vec2();
    this.max = new Vec2();
  }

  setAsPoint(point) {
    this.min.assign(point);
    this.max.assign(point);
  }

  setFromPoints(points) {
    // TODO: point/vector naming inconsistent.
    this.setAsPoint(points[0]);
    for (let i = 1; i < points.length; ++i) {
      this.includePoint(points[i]);
    }
  }

  includePoint(point) {
    this.min.x = Math.min(this.min.x, point.x);
    this.min.y = Math.min(this.min.y, point.y);
    this.max.x = Math.max(this.max.x, point.x);
    this.max.y = Math.max(this.max.y, point.y);
  }

  setFromUnion(boundingBoxA, boundingBoxB) {
    this.min.x = Math.min(boundingBoxA.min.x, boundingBoxB.min.x);
    this.min.y = Math.min(boundingBoxA.min.y, boundingBoxB.min.y);
    this.max.x = Math.max(boundingBoxA.max.x, boundingBoxB.max.x);
    this.max.y = Math.max(boundingBoxA.max.y, boundingBoxB.max.y);
  }

  area() {
    return (this.max.x - this.min.x) * (this.max.y - this.min.y);
  }

  isCollidingWith(other) {
    return !(
      this.min.x > other.max.x
      ||
      other.min.x > this.max.x
      ||
      this.min.y > other.max.y
      ||
      other.min.y > this.max.y
    );
  }

  draw(context) {
    context.strokeRect(this.min.x, this.min.y, this.max.x - this.min.x, this.max.y - this.min.y);
  }
}