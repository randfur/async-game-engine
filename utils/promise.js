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
  const reorderedPromises = promises.map(CreateResolveablePromise);
  let nextReorderedPromiseIndex = 0;
  for (const promise of promises) {
    promise.then(result => reorderedPromises[nextReorderedPromiseIndex++].resolve(result));
  }
  for (const promise of reorderedPromises) {
    yield await promise;
  }
}