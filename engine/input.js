import {Vec2} from '../utils/vec2.js';

export class Input {
  constructor(game, viewScale) {
    this.game = game;

    this.arrowKeys = new Vec2(0, 0);
    this.mouse = {
      position: new Vec2(0, 0),
    };

    this.keyDown = {};

    const mouseEventNames = [
      'mousedown',
      'mousemove',
      'mouseup',
    ];
    for (const eventName of mouseEventNames) {
      this.game.drawing.canvas.addEventListener(eventName, event => {
        this.mouse.position.x = event.offsetX / viewScale;
        this.mouse.position.y = event.offsetY / viewScale;
        this.onInput(eventName, event);
      });
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
                this.arrowKeys.y -= 1;
                break;
              case 'ArrowDown':
                this.arrowKeys.y += 1;
                break;
              case 'ArrowLeft':
                this.arrowKeys.x -= 1;
                break;
              case 'ArrowRight':
                this.arrowKeys.x += 1;
                break;
            }
            break;
          case 'keyup':
            this.keyDown[event.code] = false;
            switch (event.code) {
              case 'ArrowUp':
                this.arrowKeys.y += 1;
                break;
              case 'ArrowDown':
                this.arrowKeys.y -= 1;
                break;
              case 'ArrowLeft':
                this.arrowKeys.x += 1;
                break;
              case 'ArrowRight':
                this.arrowKeys.x -= 1;
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
