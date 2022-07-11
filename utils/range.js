export function range(n) {
  const result = [];
  for (let i = 0; i < n; ++i) {
    result.push(i);
  }
  return result;
}

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