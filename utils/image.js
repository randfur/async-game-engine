export function loadImage(src) {
  const image = new Image();
  image.src = src;
  image.loaded = new Promise(resolve => {
    image.addEventListener('load', resolve);
  });
  return image;
}
