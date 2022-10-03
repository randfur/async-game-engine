import {Scene} from '../engine/scene.js';
import {Drawing2dRegistry} from './drawing-2d-registry.js';
import {InputRegistry} from './input-registry.js';
import {Collision2dRegistry} from './collision-2d-registry.js';
import {Transform} from '../utils/transform.js';

export class BasicScene extends Scene {
  initPresetParts() {
    this.inputRegistry = new InputRegistry();

    this.cameraTransform = new Transform();
    this.cameraTransform.offset.set(this.game.width / 2, this.game.height / 2);
    this.cameraTransform.translate.set(this.game.width / 2, this.game.height / 2);

    this.drawing2dRegistry = new Drawing2dRegistry(this.cameraTransform);

    this.collision2dRegistry = this.create(Collision2dRegistry);
 }

  onInput(eventName, event) {
    this.inputRegistry.onInput(eventName, event);
  }

  onDraw(context, width, height) {
    this.drawing2dRegistry.onDraw(context, width, height);
  }
}
