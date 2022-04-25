export function random(x) {
  return Math.random() * x;
}

export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function deviate(x) {
  return (Math.random() * 2 - 1) * x;
}
