export class Drawing {
  constructor(game, {container=null, viewScale=4, clearFrames=true}={}) {
    this.game = game;
    this.viewScale = viewScale;
    this.clearFrames = clearFrames;

    if (!container) {
      container = document.body;
      // Use position: fixed and height: 100% to match visual height excluding URL bar on mobile.
      // 100vh will include the URL bar height.
      // https://developer.chrome.com/blog/url-bar-resizing/
      container.style.position = 'fixed';
      container.style.background = 'black';
      container.style.margin = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.touchAction = 'pinch-zoom';
    }

    this.canvas = document.createElement('canvas');
    container.style.padding = '0px';
    container.style.overflow = 'hidden';
    container.appendChild(this.canvas);
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0px';
    this.canvas.style.left = '0px';
    this.canvas.style.transformOrigin = '0px 0px';
    this.canvas.style.imageRendering = 'pixelated';
    this.canvas.style.transform = `scale(${viewScale})`;
    this.context = this.canvas.getContext('2d');

    const resize = rect => {
      this.width = Math.floor(rect.width / viewScale);
      this.height = Math.floor(rect.height / viewScale);
    };
    new ResizeObserver(entries => {
      resize(entries.pop().contentRect);
    }).observe(container);
    resize(container.getBoundingClientRect());
  }

  flushResize() {
    if (this.canvas.width !== this.width || this.canvas.height !== this.height) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.context.imageSmoothingEnabled = false;
    }
  }

  draw() {
    this.flushResize();

    if (this.clearFrames) {
      this.context.resetTransform();
      this.context.clearRect(0, 0, this.width, this.height);
    }

    this.game.active?.onDraw(this.context, this.width, this.height);
    this.game.background?.onDraw(this.context, this.width, this.height);
  }
}
