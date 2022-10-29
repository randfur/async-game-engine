import {removeItem} from './array.js';

export function CreateResolveablePromise() {
  let resolve;
  const promise = new Promise(r => resolve = r);
  promise.resolve = value => {
    promise.resolved = true;
    resolve(value);
  };
  promise.resolved = false;
  return promise;
}

export async function* yieldPromises(promises) {
  promises = promises.map(promise => {
    const newPromise = promise.then(result => ({
      result,
      promise: newPromise,
    }));
    return newPromise;
  });
  while (promises.length > 0) {
    const {result, promise} = await Promise.race(promises);
    removeItem(promises, promise);
    yield result;
  }
}