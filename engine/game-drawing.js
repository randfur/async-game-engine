import {removeItem} from '../utils/array.js';

export class GameDrawing {
  #sceneDrawHandles;
  constructor(game, {container=null, viewScale=1, clearFrames=true}) {
    this.game = game;
    this.clearFrames = clearFrames;
    this.#sceneDrawHandles = new Map();

    if (!container) {
      container = document.body;
      container.style.background = 'black';
      container.style.margin = '0';
      container.style.height = '100vh';
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

  draw() {
    if (this.canvas.width !== this.width || this.canvas.height !== this.height) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    if (this.clearFrames) {
      this.context.clearRect(0, 0, this.width, this.height);
    }

    this.game.active?.onDraw(this.context, this.width, this.height);
    this.game.background?.onDraw(this.context, this.width, this.height);
  }
}
