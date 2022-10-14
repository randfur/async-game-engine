export class Pool {
  constructor({create, initialise}) {
    this.create = create;
    this.initialise = initialise;
    this.buffer = [];
    this.inUse = 0;
  }
  
  acquire(param) {
    if (this.inUse == this.buffer.length) {
      this.buffer.push(this.create());
    }
    const result = this.buffer[this.inUse++];
    this.initialise(result, param);
    return result;
  }
  
  release(n=1) {
    this.inUse -= n;
  }

  releaseAll() {
    this.inUse = 0;
  }
}
