export class JobSlots {
  constructor(job, slotFuncs={}) {
    this.job = job;
    this.slotFuncs = slotFuncs;
    this.slots = {};
  }

  set(name, job) {
    this.stop(name);
    this.slots[name] = job;
  }

  start(name) {
    this.set(name, this.job.do(this.slotFuncs[name]));
  }

  stop(name) {
    this.slots[name]?.stop();
  }
}
