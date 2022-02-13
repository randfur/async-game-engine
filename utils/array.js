export function removeItems(array, predicate) {
  let length = array.length;
  for (let i = length; 0 <=-- i;) {
    if (predicate(array[i])) {
      const temp = array[i];
      array[i] = array[length - 1];
      array[length - 1] = temp;
      --length;
    }
  }
  array.length = length;
}