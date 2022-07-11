import {Vec2} from '../../../utils/vec2.js';

function assert(condition) {
  if (!condition) {
    throw new Error();
  }
}

function near(a, b, epsilon=0.001) {
  return Math.abs(a) - Math.abs(b) < epsilon;
}

const tests = {
  intersectionBasic() {
    const startA = new Vec2(1, 2);
    const dirA = new Vec2(1, 0);
    const startB = new Vec2(10, 20);
    const dirB = new Vec2(0, 1);
    const intersection = new Vec2();
    intersection.assignIntersection(startA, dirA, startB, dirB);
    assert(intersection.x == 10 && intersection.y == 2);
    intersection.assignIntersection(startB, dirB, startA, dirA);
    assert(intersection.x == 10 && intersection.y == 2);
  },

  intersectionComplex() {
    const startA = new Vec2(100, 10);
    const dirA = new Vec2(0, 10);
    const startB = new Vec2(140, 100);
    const dirB = new Vec2(-40, -30);
    const intersection = new Vec2();
    intersection.assignIntersection(startA, dirA, startB, dirB);
    assert(intersection.x == 100 && intersection.y == 70);
    intersection.assignIntersection(startB, dirB, startA, dirA);
    assert(intersection.x == 100 && intersection.y == 70);
  },
}

function main() {
  for (const [name, test] of Object.entries(tests)) {
    test();
    console.log(`${name} passed`);
  }
}

main();