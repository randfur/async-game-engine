export function CreateResolveablePromise() {
  let resolve;
  const promise = new Promise(r => resolve = r);
  promise.resolve = resolve;
  return promise;
}