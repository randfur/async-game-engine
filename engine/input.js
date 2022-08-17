export class Input {
  constructor(game) {
    this.game = game;

    this.arrowX = 0;
    this.arrowY = 0;

    this.keyDown = {};

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
      window.addEventListener(eventName, event => {
        switch (eventName) {
          case 'keydown':
            if (this.keyDown[event.code]) {
              break;
            }
            this.keyDown[event.code] = true;
            switch (event.code) {
              case 'ArrowUp':
                this.arrowY -= 1;
                break;
              case 'ArrowDown':
                this.arrowY += 1;
                break;
              case 'ArrowLeft':
                this.arrowX -= 1;
                break;
              case 'ArrowRight':
                this.arrowX += 1;
                break;
            }
            break;
          case 'keyup':
            this.keyDown[event.code] = false;
            switch (event.code) {
              case 'ArrowUp':
                this.arrowY += 1;
                break;
              case 'ArrowDown':
                this.arrowY -= 1;
                break;
              case 'ArrowLeft':
                this.arrowX += 1;
                break;
              case 'ArrowRight':
                this.arrowX -= 1;
                break;
            }
            break;
        }
        this.onInput(eventName, event);
      });
    }
  }

  onInput(eventName, event) {
    this.game.background?.onInput(eventName, event);
    this.game.active?.onInput(eventName, event);
  }
}
