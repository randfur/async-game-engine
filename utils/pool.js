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
    // TODO: Is this worth it? Optional param is a bit weird. Maybe garbage is simpler.
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
