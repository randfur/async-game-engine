export function removeItem(array, item) {
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

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

export function* enumerate(array) {
  for (let i = 0; i < array.length; ++i) {
    yield [i, array[i]];
  }
}
