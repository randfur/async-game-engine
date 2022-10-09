export function range(n) {
  const result = [];
  for (let i = 0; i < n; ++i) {
    result.push(i);
  }
  return result;
}

// This range function returns the same list objects for all calls, avoiding
// memory allocations and GC. This is significantly faster however cannot be
// used in nested loops.
const recycledResult = [];
export function recycledRange(n) {
  if (recycledResult.length > n) {
    recycledResult.length = n;
    return recycledResult;
  }
  while (recycledResult.length < n) {
    recycledResult.push(recycledResult.length);
  }
  return recycledResult;
}
