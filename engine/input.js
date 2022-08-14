export class Input {
  constructor(game) {
    this.game = game;

    const eventNames = [
      'mousedown',
      'mousemove',
      'mouseup',
      'keydown',
      'keyup',
    ];
    for (const eventName of eventNames) {
      this.game.drawing.canvas.addEventListener(eventName, event => this.onInput(eventName, event));
    }
  }

  onInput(eventName, event) {
    this.game.background?.onInput(eventName, event);
    this.game.active?.onInput(eventName, event);
  }
}
