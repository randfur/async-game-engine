// Represents the following matrix shape:
// [a c e]
// [b d f]
// [0 0 1]
// This matches the matrix shape of HTMLCanvasContext2D.setTransform().
export class Mat3 {
  constructor() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.e = 0;
    this.f = 0;
  }

  setIdentity() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.e = 0;
    this.f = 0;
  }
}