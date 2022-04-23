export const TAU = Math.PI * 2;

export function distance(x, y) {
  return Math.sqrt(x * x + y * y);
}

export function indexWrapped(list, index) {
  while (index < 0) {
    index += list.length;
  }
  return list[index % list.length];
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}
