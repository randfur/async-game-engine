export class Input {
  constructor(game) {
    this.game = game;

    const mouseEventNames = [
      'mousedown',
      'mousemove',
      'mouseup',
    ];
    for (const eventName of mouseEventNames) {
      this.game.drawing.canvas.addEventListener(eventName, event => this.onInput(eventName, event));
    }
    const keyEventNames = [
      'keydown',
      'keyup',
    ];
    for (const eventName of keyEventNames) {
      window.addEventListener(eventName, event => this.onInput(eventName, event));
    }
  }

  onInput(eventName, event) {
    this.game.background?.onInput(eventName, event);
    this.game.active?.onInput(eventName, event);
  }
}
