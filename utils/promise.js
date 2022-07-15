export function CreateResolveablePromise() {
  let resolve;
  const promise = new Promise(r => resolve = r);
  promise.resolve = () => {
    promise.resolved = true;
    resolve();
  };
  promise.resolved = false;
  return promise;
}