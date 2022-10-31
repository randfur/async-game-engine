import {Scene} from '../engine/scene.js';
import {Drawing2dRegistry} from './drawing-2d-registry.js';
import {InputRegistry} from './input-registry.js';
import {Collision2dRegistry} from './collision-2d-registry.js';
import {Transform} from '../utils/transform.js';

export class BasicScene extends Scene {
  initPresetParts() {
    this.inputRegistry = new InputRegistry();

    this.cameraTransform = new Transform();
    this.centreCamera();

    this.drawing2dRegistry = new Drawing2dRegistry(this.cameraTransform);

    this.collision2dRegistry = new Collision2dRegistry(this.cameraTransform);

    this.debugMode = true;//false;
  }

  onFrame(gameTime) {
    super.onFrame(gameTime);

    this.collision2dRegistry.onFrame();
  }

  centreCamera() {
    this.cameraTransform.origin.set(this.game.width / 2, this.game.height / 2);
    this.cameraTransform.translate.set(this.game.width / 2, this.game.height / 2);
  }

  onInput(eventName, event) {
    if (eventName === 'keydown' && event.shiftKey && event.code === 'F12') {
      this.debugMode ^= true;
    }

    this.inputRegistry.onInput(eventName, event);
  }

  onDraw(context, width, height) {
    this.drawing2dRegistry.onDraw(context, width, height);

    if (this.debugMode) {
      for (const job of this.jobs) {
        job.onDebugDraw?.(context, width, height);
      }
      this.collision2dRegistry.onDebugDraw(context, width, height);
    }
  }
}
