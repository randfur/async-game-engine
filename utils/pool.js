export class Pool {
  constructor(createNew) {
    this.createNew = createNew;
    this.buffer = [];
    this.inUse = 0;
  }
  
  acquire() {
    if (this.inUse == this.buffer.length) {
      this.buffer.push(this.createNew());
    }
    return this.buffer[this.inUse++];
  }
  
  release(n) {
    this.inUse -= n;
  }

  releaseAll() {
    this.inUse = 0;
  }
}
