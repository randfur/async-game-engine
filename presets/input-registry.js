import {removeItem} from '../utils/array.js';

export class InputRegistry {
  constructor() {
    this.inputHandles = [];
  }

  register(job, inputFunc) {
    job.registerCleanUp(() => {
      removeItem(this.inputHandles, inputFunc);
    });
    this.inputHandles.push(inputFunc);
  }

  onInput(eventName, event) {
    for (const inputFunc of this.inputHandles) {
      inputFunc(eventName, event);
    }
  }
}