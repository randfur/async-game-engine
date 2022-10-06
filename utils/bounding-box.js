export class BoundingBox {
  constructor() {
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;
  }

  setFromPoints(points) {
    this.minX = this.maxX = points[0].x;
    this.minY = this.maxY = points[0].y;
    for (const point of points) {
      this.minX = Math.min(this.minX, point.x);
      this.minY = Math.min(this.minY, point.y);
      this.maxX = Math.max(this.maxX, point.x);
      this.maxY = Math.max(this.maxY, point.y);
    }
  }

  setFromUnion(boundingBoxA, boundingBoxB) {
    this.minX = Math.min(boundingBoxA.minX, boundingBoxB.minX);
    this.minY = Math.min(boundingBoxA.minY, boundingBoxB.minY);
    this.maxX = Math.max(boundingBoxA.maxX, boundingBoxB.maxX);
    this.maxY = Math.max(boundingBoxA.maxY, boundingBoxB.maxY);
  }

  area() {
    return (this.maxX - this.minX) * (this.maxY - this.minY);
  }

  isCollidingWith(other) {
    return !(
      this.minX > other.maxX
      ||
      other.minX > this.maxX
      ||
      this.minY > other.maxY
      ||
      other.minY > this.maxY
    );
  }

  draw(context) {
    context.strokeRect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
  }
}