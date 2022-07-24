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