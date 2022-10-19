import {Entity} from '../engine/entity.js';
import {Pool} from '../utils/pool.js';
import {removeItem} from '../utils/array.js';
import {Vec2} from '../utils/vec2.js';
import {BoundingBox} from '../utils/bounding-box.js';

export class Collision2dRegistry extends Entity {
  init() {
    this.colliders = [];
    this.nextId = 0;
    this.collisionTree = null;
    this.maxBranching = 10;
    this.collisionNodePool = new Pool({
      create() {
        return {
          boundingBox: new BoundingBox(),
          maxId: null,
          collider: null,
          children: [],
        };
      },
      initialise() {},
    });
  }

  async run() {
    while (true) {
      await this.tick();

      this.buildCollisionTree();

      for (const collider of this.colliders) {
        this.collide(collider, this.collisionTree);
      }
    }
  }

  async buildCollisionTree() {
    this.collisionNodePool.releaseAll();
    this.collisionTree = null;
    for (const collider of this.colliders) {
      collider.colliding = false;
      collider.colliderNode = null;
      if (!collider.solid) {
        continue;
      }
      const colliderNode = this.collisionNodePool.acquire();
      if (!collider.updateBoundingBox(colliderNode.boundingBox)) {
        continue;
      }
      collider.colliderNode = colliderNode;
      colliderNode.collider = collider;
      colliderNode.children.length = 0;
      colliderNode.maxId = collider.id;
      this.collisionTree = this.insert(colliderNode, this.collisionTree);
    }
  }

  static #insertAreaTestBoundingBox = new BoundingBox();
  insert(colliderNode, collisionSubTree) {
    if (collisionSubTree === null) {
      return colliderNode;
    }

    if (collisionSubTree.collider) {
      const otherColliderNode = collisionSubTree;
      const branchNode = this.collisionNodePool.acquire();
      branchNode.collider = null;
      branchNode.boundingBox.setFromUnion(colliderNode.boundingBox, otherColliderNode.boundingBox);
      branchNode.maxId = Math.max(colliderNode.maxId, otherColliderNode.maxId);
      branchNode.children.length = 0;
      branchNode.children.push(colliderNode);
      branchNode.children.push(otherColliderNode);
      return branchNode;
    }

    const branchNode = collisionSubTree;
    branchNode.boundingBox.setFromUnion(branchNode.boundingBox, colliderNode.boundingBox);
    branchNode.maxId = Math.min(branchNode.maxId, colliderNode.maxId);
    if (branchNode.children.length < this.maxBranching) {
      branchNode.children.push(colliderNode);
    } else {
      let mergeIndex = null;
      let leastAreaAdd = Infinity;
      for (let i = 0; i < branchNode.children.length; ++i) {
        const childNode = branchNode.children[i];
        const testAreaBoundingBox = Collision2dRegistry.#insertAreaTestBoundingBox;
        testAreaBoundingBox.setFromUnion(childNode.boundingBox, colliderNode.boundingBox);
        const areaAdd = testAreaBoundingBox.area() - childNode.boundingBox.area();
        if (areaAdd < leastAreaAdd) {
          mergeIndex = i;
          leastAreaAdd = areaAdd;
        }
      }

      branchNode.children[mergeIndex] = this.insert(colliderNode, branchNode.children[mergeIndex]);
    }
    return branchNode;
  }

  collide(collider, collisionNode) {
    if (!collider.colliderNode) {
      return;
    }
    if (!collider.colliderNode.boundingBox.isCollidingWith(collisionNode.boundingBox)) {
      return;
    }
    if (collisionNode.collider) {
      const otherCollider = collisionNode.collider;
      if (collider.id >= otherCollider.id) {
        return;
      }
      maybeInvokeCollisionFunc(collider, otherCollider);
      maybeInvokeCollisionFunc(otherCollider, collider);
    } else {
      for (const child of collisionNode.children) {
        this.collide(collider, child);
      }
    }
  }

  register(job, updateBoundingBox, collisionFunc) {
    const collider = {
      id: this.nextId++,
      job,
      filterTypes: null,
      solid: true,
      updateBoundingBox,
      colliderNode: null,
      collisionFunc,
      colliding: false,
    };
    job.registerCleanUp(() => {
      removeItem(this.colliders, collider);
    });
    this.colliders.push(collider);
    return collider;
  }

  onDebugDraw(context, width, height) {
    this.scene.cameraTransform.applyToContext(context);
    this.debugDrawNode(context, this.collisionTree);
  }

  debugDrawNode(context, collisionNode) {
    if (!collisionNode) {
      return;
    }
    if (collisionNode.collider) {
      const collider = collisionNode.collider;
      if (collider.colliding) {
        context.strokeStyle = '#f00';
      } else {
        context.strokeStyle = '#800';
      }
      collisionNode.boundingBox.draw(context);
    } else {
      context.strokeStyle = '#0004';
      collisionNode.boundingBox.draw(context);
      for (const child of collisionNode.children) {
        this.debugDrawNode(context, child);
      }
    }
  }
}

function maybeInvokeCollisionFunc(collider, otherCollider) {
  if (collider.filterTypes) {
    let found = false;
    for (const type of collider.filterTypes) {
      if (otherCollider.job instanceof type) {
        found = true;
        break;
      }
    }
    if (!found) {
      return;
    }
  }
  collider.colliding = true;
  collider.collisionFunc(otherCollider.job, otherCollider);
}